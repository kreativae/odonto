const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const User = require('../../bancodedados/models/User');
const AuditLog = require('../../bancodedados/models/AuditLog');
const { z } = require('zod');

// ============================================================
// 🛡️ TOKEN BLACKLIST (Invalidação real de sessão no logout)
// Em produção, usar Redis para performance e persistência
// ============================================================
const tokenBlacklist = new Set();

const isTokenBlacklisted = (token) => tokenBlacklist.has(token);

// Limpar tokens expirados a cada 1 hora (evita memory leak)
setInterval(() => {
  const now = Math.floor(Date.now() / 1000);
  for (const token of tokenBlacklist) {
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.exp < now) {
        tokenBlacklist.delete(token);
      }
    } catch {
      tokenBlacklist.delete(token);
    }
  }
}, 60 * 60 * 1000);

// ============================================================
// 🔒 BLOQUEIO DE CONTA (Anti Brute Force)
// ============================================================
const loginAttempts = new Map(); // { email: { count, lockUntil } }

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 30 * 60 * 1000; // 30 minutos

const checkLoginAttempts = (email) => {
  const record = loginAttempts.get(email);
  if (!record) return { locked: false, attemptsLeft: MAX_LOGIN_ATTEMPTS };

  if (record.lockUntil && record.lockUntil > Date.now()) {
    const minutesLeft = Math.ceil((record.lockUntil - Date.now()) / 60000);
    return { locked: true, minutesLeft, attemptsLeft: 0 };
  }

  // Lock expirou, resetar
  if (record.lockUntil && record.lockUntil <= Date.now()) {
    loginAttempts.delete(email);
    return { locked: false, attemptsLeft: MAX_LOGIN_ATTEMPTS };
  }

  return { locked: false, attemptsLeft: MAX_LOGIN_ATTEMPTS - record.count };
};

const recordFailedAttempt = (email) => {
  const record = loginAttempts.get(email) || { count: 0, lockUntil: null };
  record.count++;

  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    record.lockUntil = Date.now() + LOCK_TIME_MS;
    console.warn(`🔒 Conta bloqueada por brute force: ${email}`);
  }

  loginAttempts.set(email, record);
  return MAX_LOGIN_ATTEMPTS - record.count;
};

const resetLoginAttempts = (email) => {
  loginAttempts.delete(email);
};

// ============================================================
// 📋 SCHEMAS DE VALIDAÇÃO (Zod)
// ============================================================
const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  email: z.string().email('Email inválido').max(255),
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/\d/, 'Senha deve conter pelo menos um número'),
  phone: z.string().optional(),
  role: z.enum(['admin', 'dentist', 'secretary', 'financial', 'manager', 'viewer']).default('admin'),
  clinicName: z.string().min(2, 'Nome da clínica é obrigatório').max(200).optional(),
  clinicCNPJ: z.string().optional(),
  clinicAddress: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

// ============================================================
// 🔑 GERAÇÃO DE TOKENS
// ============================================================
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId, type: 'access' }, process.env.JWT_SECRET, {
    expiresIn: '15m', // Access token curto — segurança
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId, type: 'refresh' }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh', {
    expiresIn: '7d', // Refresh token mais longo
  });
};

// ============================================================
// 📝 REGISTRO
// @route   POST /api/auth/register
// @access  Public
// ============================================================
const registerUser = asyncHandler(async (req, res) => {
  // 1. Validação rigorosa
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400);
    throw new Error(validation.error.issues.map(i => i.message).join(', '));
  }

  const { name, email, password, phone, role, clinicName } = validation.data;

  // 2. Verificar duplicidade
  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(409);
    throw new Error('Este email já está cadastrado');
  }

  // 3. Criar clínica (se for admin)
  let clinicId;
  try {
    const Clinic = require('../../bancodedados/models/Clinic');
    const clinic = await Clinic.create({
      name: clinicName || `Clínica de ${name}`,
      owner: null, // será atualizado abaixo
    });
    clinicId = clinic._id;
  } catch {
    // Se o model Clinic não existir, usar um ObjectId temporário
    const mongoose = require('mongoose');
    clinicId = new mongoose.Types.ObjectId();
  }

  // 4. Criar usuário
  // ⚠️ NÃO fazer bcrypt.hash aqui — o User model já tem pre('save') que faz o hash
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password, // Será hashado pelo pre('save') do mongoose
    phone,
    role,
    clinicId,
  });

  if (!user) {
    res.status(500);
    throw new Error('Erro ao criar usuário');
  }

  // 5. Gerar tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // 6. Salvar refresh token no banco (para invalidação)
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // 7. Registrar no Audit Log
  try {
    await AuditLog.create({
      user: user._id,
      action: 'CREATE',
      entity: 'User',
      entityId: user._id.toString(),
      details: { name, email, role },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'SUCCESS',
    });
  } catch (e) {
    console.warn('Audit log failed:', e.message);
  }

  // 8. Enviar refresh token como HttpOnly cookie (mais seguro que localStorage)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,       // JavaScript NÃO consegue acessar
    secure: process.env.NODE_ENV === 'production', // HTTPS only em prod
    sameSite: 'strict',   // Anti CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    path: '/api/auth',    // Só enviado em rotas de auth
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    clinicId: user.clinicId,
    token: accessToken,
  });
});

// ============================================================
// 🔓 LOGIN
// @route   POST /api/auth/login
// @access  Public
// ============================================================
const loginUser = asyncHandler(async (req, res) => {
  // 1. Validação
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400);
    throw new Error(validation.error.issues.map(i => i.message).join(', '));
  }

  const { email, password } = validation.data;
  const normalizedEmail = email.toLowerCase();

  // 2. Verificar bloqueio de conta
  const attemptCheck = checkLoginAttempts(normalizedEmail);
  if (attemptCheck.locked) {
    // Audit log — tentativa bloqueada
    try {
      await AuditLog.create({
        user: null,
        action: 'LOGIN',
        entity: 'User',
        details: { email: normalizedEmail, reason: 'Account locked' },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        status: 'FAILURE',
      });
    } catch (e) { /* silent */ }

    res.status(429);
    throw new Error(`Conta bloqueada por excesso de tentativas. Tente novamente em ${attemptCheck.minutesLeft} minutos.`);
  }

  // 3. Buscar usuário (incluindo password para comparação)
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user) {
    const attemptsLeft = recordFailedAttempt(normalizedEmail);
    res.status(401);
    throw new Error(`Credenciais inválidas. ${attemptsLeft > 0 ? `${attemptsLeft} tentativas restantes.` : 'Conta bloqueada por 30 minutos.'}`);
  }

  // 4. Verificar se conta está ativa
  if (!user.active) {
    res.status(403);
    throw new Error('Conta desativada. Entre em contato com o administrador.');
  }

  // 5. Comparar senha
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    const attemptsLeft = recordFailedAttempt(normalizedEmail);

    // Audit log — senha errada
    try {
      await AuditLog.create({
        user: user._id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user._id.toString(),
        details: { reason: 'Invalid password', attemptsLeft },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        status: 'FAILURE',
      });
    } catch (e) { /* silent */ }

    res.status(401);
    throw new Error(`Credenciais inválidas. ${attemptsLeft > 0 ? `${attemptsLeft} tentativas restantes.` : 'Conta bloqueada por 30 minutos.'}`);
  }

  // 6. Login bem-sucedido — resetar tentativas
  resetLoginAttempts(normalizedEmail);

  // 7. Gerar tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // 8. Atualizar último login e refresh token
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // 9. Audit log — sucesso
  try {
    await AuditLog.create({
      user: user._id,
      action: 'LOGIN',
      entity: 'User',
      entityId: user._id.toString(),
      details: { method: 'email_password' },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'SUCCESS',
    });
  } catch (e) { /* silent */ }

  // 10. Enviar refresh token como cookie HttpOnly
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    clinicId: user.clinicId,
    token: accessToken,
  });
});

// ============================================================
// 🔄 REFRESH TOKEN
// @route   POST /api/auth/refresh
// @access  Public (com cookie)
// ============================================================
const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.status(401);
    throw new Error('Refresh token não fornecido');
  }

  // Verificar se está na blacklist
  if (isTokenBlacklisted(refreshToken)) {
    res.status(401);
    throw new Error('Token inválido (revogado)');
  }

  try {
    // Verificar validade do refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh');

    // Buscar usuário e verificar se o refresh token bate
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      res.status(401);
      throw new Error('Token inválido');
    }

    // ROTAÇÃO DE TOKEN — gerar novos tokens (o antigo é invalidado)
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Blacklist o refresh token antigo
    tokenBlacklist.add(refreshToken);

    // Salvar novo refresh token
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    // Enviar novo refresh token como cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth',
    });

    res.json({
      token: newAccessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401);
    throw new Error('Refresh token expirado ou inválido. Faça login novamente.');
  }
});

// ============================================================
// 🚪 LOGOUT (Invalidação real)
// @route   POST /api/auth/logout
// @access  Private
// ============================================================
const logoutUser = asyncHandler(async (req, res) => {
  // 1. Blacklist o access token atual
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    const accessToken = authHeader.split(' ')[1];
    tokenBlacklist.add(accessToken);
  }

  // 2. Blacklist o refresh token
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    tokenBlacklist.add(refreshToken);
  }

  // 3. Remover refresh token do banco
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

    // Audit log
    try {
      await AuditLog.create({
        user: req.user._id,
        action: 'LOGOUT',
        entity: 'User',
        entityId: req.user._id.toString(),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        status: 'SUCCESS',
      });
    } catch (e) { /* silent */ }
  }

  // 4. Limpar cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth',
  });

  res.json({ message: 'Logout realizado com sucesso' });
});

// ============================================================
// 👤 GET CURRENT USER
// @route   GET /api/auth/me
// @access  Private
// ============================================================
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -refreshToken');
  if (!user) {
    res.status(404);
    throw new Error('Usuário não encontrado');
  }
  res.json(user);
});

// ============================================================
// 🔑 ALTERAR SENHA
// @route   PUT /api/auth/change-password
// @access  Private
// ============================================================
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validar nova senha
  const passwordSchema = z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/[a-z]/, 'Deve conter letra minúscula')
    .regex(/[A-Z]/, 'Deve conter letra maiúscula')
    .regex(/\d/, 'Deve conter número');

  const validation = passwordSchema.safeParse(newPassword);
  if (!validation.success) {
    res.status(400);
    throw new Error(validation.error.issues.map(i => i.message).join(', '));
  }

  // Buscar usuário com senha
  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    res.status(404);
    throw new Error('Usuário não encontrado');
  }

  // Verificar senha atual
  const isValid = await user.comparePassword(currentPassword);
  if (!isValid) {
    res.status(401);
    throw new Error('Senha atual incorreta');
  }

  // Verificar se nova senha é diferente da atual
  const isSame = await bcrypt.compare(newPassword, user.password);
  if (isSame) {
    res.status(400);
    throw new Error('Nova senha deve ser diferente da atual');
  }

  // Atualizar senha (pre('save') fará o hash)
  user.password = newPassword;
  user.refreshToken = null; // Invalidar todas as sessões
  await user.save();

  // Blacklist tokens antigos
  const authHeader = req.headers.authorization;
  if (authHeader) {
    tokenBlacklist.add(authHeader.split(' ')[1]);
  }

  // Audit log
  try {
    await AuditLog.create({
      user: user._id,
      action: 'UPDATE',
      entity: 'User',
      entityId: user._id.toString(),
      details: { field: 'password', reason: 'User changed password' },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'SUCCESS',
    });
  } catch (e) { /* silent */ }

  res.json({ message: 'Senha alterada com sucesso. Faça login novamente.' });
});

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getMe,
  changePassword,
  isTokenBlacklisted,
};
