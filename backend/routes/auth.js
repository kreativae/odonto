const express = require('express');
const router = express.Router();
const User = require('../../bancodedados/models/User');
const Clinic = require('../../bancodedados/models/Clinic');
const { generateTokens, authenticate, JWT_REFRESH_SECRET } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, clinicName, cnpj, role, plan } = req.body;
    const existingClinic = cnpj ? await Clinic.findOne({ cnpj }) : null;
    if (existingClinic) return res.status(409).json({ error: 'CNPJ já cadastrado' });

    const clinic = await Clinic.create({
      name: clinicName || `Clínica de ${name}`,
      cnpj, plan: plan || 'starter',
      settings: {
        workingHours: { start: '08:00', end: '18:00' }, slotDuration: 30,
        rooms: [{ name: 'Sala 1', active: true }, { name: 'Sala 2', active: true }]
      }
    });

    const user = await User.create({
      clinicId: clinic._id, name, email, password, phone,
      role: role || 'admin', active: true
    });

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      user: user.toJSON(),
      clinic,
      ...tokens
    });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: 'Email já cadastrado' });
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
    if (!user.active) return res.status(403).json({ error: 'Usuário inativo' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Credenciais inválidas' });

    const clinic = await Clinic.findById(user.clinicId);
    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.json({ user: user.toJSON(), clinic, ...tokens });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token requerido' });

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: 'Refresh token inválido' });
    }

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json(tokens);
  } catch (error) {
    res.status(401).json({ error: 'Refresh token expirado' });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticate, async (req, res) => {
  try {
    req.user.refreshToken = null;
    await req.user.save();
    res.json({ message: 'Logout realizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.user.clinicId);
    res.json({ user: req.user, clinic });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/auth/password
router.put('/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ error: 'Senha atual incorreta' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Senha atualizada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
