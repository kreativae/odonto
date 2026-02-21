const errorHandler = (err, req, res, next) => {
  // Determinar status code
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Erro interno do servidor';
  let code = 'INTERNAL_ERROR';

  // ============================================================
  // CATEGORIZAR ERROS CONHECIDOS
  // ============================================================

  // MongoDB — Chave duplicada (ex: email já existe)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'campo';
    message = `O valor informado para '${field}' já está cadastrado.`;
    code = 'DUPLICATE_KEY';
  }

  // MongoDB — Erro de validação (campo obrigatório, enum inválido)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(e => e.message);
    message = errors.join(', ');
    code = 'VALIDATION_ERROR';
  }

  // MongoDB — ID inválido (ObjectId malformado)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'ID inválido fornecido.';
    code = 'INVALID_ID';
  }

  // JWT — Token expirado
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado. Faça login novamente.';
    code = 'TOKEN_EXPIRED';
  }

  // JWT — Token inválido
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido.';
    code = 'INVALID_TOKEN';
  }

  // CORS error
  if (err.message && err.message.includes('CORS')) {
    statusCode = 403;
    code = 'CORS_BLOCKED';
  }

  // Payload too large
  if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Payload muito grande. Limite de 10KB.';
    code = 'PAYLOAD_TOO_LARGE';
  }

  // ============================================================
  // RESPOSTA
  // ============================================================
  const response = {
    success: false,
    message,
    code,
  };

  // Em desenvolvimento, incluir stack trace e detalhes
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
    response.details = {
      name: err.name,
      originalCode: err.code,
    };
  }

  // Log no servidor
  if (statusCode >= 500) {
    console.error(`💥 [${statusCode}] ${req.method} ${req.originalUrl} — ${message}`);
    if (process.env.NODE_ENV !== 'production') {
      console.error(err.stack);
    }
  } else if (statusCode >= 400) {
    console.warn(`⚠️ [${statusCode}] ${req.method} ${req.originalUrl} — ${message}`);
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
