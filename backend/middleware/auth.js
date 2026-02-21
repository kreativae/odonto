const jwt = require('jsonwebtoken');
const User = require('../../bancodedados/models/User');
const AuditLog = require('../../bancodedados/models/AuditLog');

// ============================================================
// 🛡️ MIDDLEWARE DE PROTEÇÃO (Verifica JWT)
// ============================================================
const protect = async (req, res, next) => {
  let token;

  // 1. Extrair token do header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      message: 'Acesso não autorizado. Token não fornecido.',
      code: 'NO_TOKEN',
    });
  }

  try {
    // 2. Verificar se token está na blacklist (logout real)
    let isBlacklisted = false;
    try {
      const { isTokenBlacklisted } = require('../controllers/authController');
      isBlacklisted = isTokenBlacklisted(token);
    } catch (e) { /* silent — caso circular dependency */ }

    if (isBlacklisted) {
      return res.status(401).json({
        message: 'Token revogado. Faça login novamente.',
        code: 'TOKEN_REVOKED',
      });
    }

    // 3. Verificar e decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Verificar tipo do token (deve ser access, não refresh)
    if (decoded.type && decoded.type !== 'access') {
      return res.status(401).json({
        message: 'Tipo de token inválido.',
        code: 'INVALID_TOKEN_TYPE',
      });
    }

    // 5. Verificar se o usuário ainda existe e está ativo
    const user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!user) {
      return res.status(401).json({
        message: 'Usuário associado a este token não existe mais.',
        code: 'USER_NOT_FOUND',
      });
    }

    if (!user.active) {
      return res.status(403).json({
        message: 'Conta desativada. Entre em contato com o administrador.',
        code: 'ACCOUNT_DISABLED',
      });
    }

    // 6. Anexar usuário ao request
    req.user = user;
    req.token = token;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expirado. Use o refresh token para obter um novo.',
        code: 'TOKEN_EXPIRED',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Token inválido ou corrompido.',
        code: 'INVALID_TOKEN',
      });
    }

    return res.status(401).json({
      message: 'Erro na autenticação.',
      code: 'AUTH_ERROR',
    });
  }
};

// ============================================================
// 🔐 MIDDLEWARE DE AUTORIZAÇÃO (RBAC)
// Verifica se o role do usuário tem permissão
// Uso: authorize('admin', 'manager')
// ============================================================
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Autenticação necessária antes da autorização.',
        code: 'NOT_AUTHENTICATED',
      });
    }

    if (!roles.includes(req.user.role)) {
      // Audit log — acesso negado
      try {
        AuditLog.create({
          user: req.user._id,
          action: 'READ',
          entity: 'Authorization',
          details: {
            requiredRoles: roles,
            userRole: req.user.role,
            attemptedUrl: req.originalUrl,
            method: req.method,
          },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          status: 'FAILURE',
        }).catch(() => {});
      } catch (e) { /* silent */ }

      return res.status(403).json({
        message: `Permissão negada. Função '${req.user.role}' não pode acessar este recurso.`,
        code: 'FORBIDDEN',
        requiredRoles: roles,
      });
    }

    next();
  };
};

// ============================================================
// 🏢 MIDDLEWARE MULTI-TENANT
// Garante que o usuário só acessa dados da sua clínica
// ============================================================
const tenantIsolation = (req, res, next) => {
  if (!req.user || !req.user.clinicId) {
    return res.status(403).json({
      message: 'Usuário não associado a nenhuma clínica.',
      code: 'NO_CLINIC',
    });
  }

  // Injetar clinicId em todas as queries automaticamente
  req.clinicId = req.user.clinicId;

  // Se o body tem clinicId, deve ser o mesmo do usuário
  if (req.body && req.body.clinicId && req.body.clinicId.toString() !== req.user.clinicId.toString()) {
    return res.status(403).json({
      message: 'Acesso negado. Você não pode acessar dados de outra clínica.',
      code: 'TENANT_VIOLATION',
    });
  }

  // Forçar clinicId no body para criação
  if (req.method === 'POST' || req.method === 'PUT') {
    req.body.clinicId = req.user.clinicId;
  }

  next();
};

// ============================================================
// 📝 MIDDLEWARE DE AUDITORIA AUTOMÁTICA
// Registra todas as ações em rotas sensíveis
// ============================================================
const auditAction = (action, entity) => {
  return async (req, res, next) => {
    // Guardar o método original do res.json para interceptar
    const originalJson = res.json.bind(res);

    res.json = (data) => {
      // Só registrar se a operação foi bem-sucedida
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          AuditLog.create({
            user: req.user?._id,
            action,
            entity,
            entityId: req.params?.id || data?._id?.toString(),
            details: {
              method: req.method,
              url: req.originalUrl,
              body: action === 'CREATE' || action === 'UPDATE'
                ? sanitizeForLog(req.body)
                : undefined,
            },
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            status: 'SUCCESS',
          }).catch(() => {});
        } catch (e) { /* silent */ }
      }

      return originalJson(data);
    };

    next();
  };
};

// Remover campos sensíveis antes de salvar no log
const sanitizeForLog = (body) => {
  if (!body) return {};
  const sanitized = { ...body };
  const sensitiveFields = ['password', 'cpf', 'refreshToken', 'token', 'creditCard'];
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });
  return sanitized;
};

module.exports = { protect, authorize, tenantIsolation, auditAction };
