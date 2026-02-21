const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');

const securityMiddleware = (app) => {
  // ============================================================
  // 1. HELMET — Headers HTTP de Segurança
  // ============================================================
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "http://localhost:*", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }));

  // ============================================================
  // 2. COOKIE PARSER — Para ler cookies HttpOnly (refresh token)
  // ============================================================
  app.use(cookieParser());

  // ============================================================
  // 3. ANTI-INJECTION — NoSQL Injection & XSS
  // ============================================================
  // Remove caracteres perigosos como $, . de queries MongoDB
  app.use(mongoSanitize({
    replaceWith: '_', // Substitui caracteres perigosos por _
    onSanitize: ({ req, key }) => {
      console.warn(`⚠️ Tentativa de NoSQL injection detectada [${key}] de IP: ${req.ip}`);
    },
  }));

  // Limpa scripts maliciosos de inputs
  app.use(xss());

  // ============================================================
  // 4. RATE LIMITING — Proteção contra DDoS e Brute Force
  // ============================================================

  // 4a. Limite GERAL para API (100 req / 10 min por IP)
  const generalLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: {
      message: 'Muitas requisições deste IP. Tente novamente em 10 minutos.',
      code: 'RATE_LIMIT_EXCEEDED',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api', generalLimiter);

  // 4b. Limite ESTRITO para LOGIN (5 tentativas / 15 min)
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
      message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
      code: 'LOGIN_RATE_LIMIT',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Não conta requisições bem-sucedidas
  });
  app.use('/api/auth/login', loginLimiter);

  // 4c. Limite para REGISTRO (3 contas / hora por IP)
  const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: {
      message: 'Limite de criação de contas atingido. Tente novamente em 1 hora.',
      code: 'REGISTER_RATE_LIMIT',
    },
  });
  app.use('/api/auth/register', registerLimiter);

  // 4d. Limite para REFRESH TOKEN (30 / hora)
  const refreshLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 30,
    message: {
      message: 'Muitas renovações de token. Faça login novamente.',
      code: 'REFRESH_RATE_LIMIT',
    },
  });
  app.use('/api/auth/refresh', refreshLimiter);

  // ============================================================
  // 5. CORS — Cross-Origin Resource Sharing
  // ============================================================
  const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000')
    .split(',')
    .map(s => s.trim());

  const corsOptions = {
    origin: function (origin, callback) {
      // Permitir requests sem origin (mobile apps, Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️ CORS bloqueou requisição de: ${origin}`);
        callback(new Error(`Origem ${origin} não permitida por CORS`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true, // Necessário para cookies HttpOnly
    maxAge: 86400, // Cache preflight por 24h
  };
  app.use(cors(corsOptions));

  // ============================================================
  // 6. BODY PARSING — Com limite de tamanho (Anti DoS)
  // ============================================================
  app.use(express.json({ limit: '10kb' })); // JSON body max 10KB
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // ============================================================
  // 7. HEADERS EXTRAS DE SEGURANÇA
  // ============================================================
  app.use((req, res, next) => {
    // Impedir que o navegador faça cache de respostas autenticadas
    if (req.headers.authorization) {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.set('Pragma', 'no-cache');
    }

    // Impedir que a página seja embeddada em iframe (clickjacking)
    res.set('X-Frame-Options', 'DENY');

    // Forçar Content-Type (anti MIME sniffing)
    res.set('X-Content-Type-Options', 'nosniff');

    // Referrer policy
    res.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions Policy (desabilitar features não usadas)
    res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

    next();
  });

  // ============================================================
  // 8. TRUST PROXY (para rate limiting funcionar atrás de load balancer)
  // ============================================================
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  console.log('🛡️ Security middleware initialized:');
  console.log('   ✅ Helmet (HTTP Security Headers)');
  console.log('   ✅ Cookie Parser (HttpOnly cookies)');
  console.log('   ✅ Mongo Sanitize (Anti NoSQL Injection)');
  console.log('   ✅ XSS Clean (Anti Cross-Site Scripting)');
  console.log('   ✅ Rate Limiting (General + Login + Register + Refresh)');
  console.log('   ✅ CORS (Allowed origins: ' + allowedOrigins.join(', ') + ')');
  console.log('   ✅ Body Size Limit (10KB)');
  console.log('   ✅ Extra Security Headers');
};

module.exports = securityMiddleware;
