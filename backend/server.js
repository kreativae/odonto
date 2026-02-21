const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../bancodedados/config.js');
const security = require('./middleware/security.js');
const { protect, tenantIsolation, auditAction } = require('./middleware/auth.js');
const errorHandler = require('./middleware/errorHandler.js');

// ============================================================
// 1. CONFIGURAÇÕES INICIAIS
// ============================================================
dotenv.config({ path: path.join(__dirname, '.env') });

// Fallback para .env na raiz
if (!process.env.JWT_SECRET) {
  dotenv.config({ path: path.join(__dirname, '..', '.env') });
}

// Validar variáveis obrigatórias
const requiredEnvVars = ['JWT_SECRET'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0 && process.env.NODE_ENV === 'production') {
  console.error(`❌ Variáveis de ambiente obrigatórias faltando: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Defaults para desenvolvimento
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_odontopro_2025_change_in_production';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh';

// ============================================================
// 2. CONEXÃO AO BANCO DE DADOS
// ============================================================
connectDB();

const app = express();

// ============================================================
// 3. SEGURANÇA & MIDDLEWARES GLOBAIS
// ============================================================
security(app);

// ============================================================
// 4. LOGGING (Morgan — apenas em desenvolvimento)
// ============================================================
if (process.env.NODE_ENV === 'development') {
  try {
    const morgan = require('morgan');
    app.use(morgan('dev'));
  } catch (e) {
    console.log('Morgan não disponível, continuando sem logging HTTP.');
  }
}

// ============================================================
// 5. ROTAS DA API
// ============================================================

// --- Auth (Público + Privado) ---
app.use('/api/auth', require('./routes/authRoutes.js'));

// --- Rotas Protegidas (JWT obrigatório) ---
app.use('/api/patients', protect, require('./routes/patientRoutes.js'));
app.use('/api/appointments', protect, require('./routes/appointmentRoutes.js'));
app.use('/api/financial', protect, require('./routes/financialRoutes.js'));
app.use('/api/treatments', protect, require('./routes/treatmentRoutes.js'));

// ============================================================
// 6. HEALTH CHECK (Monitoramento)
// ============================================================
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB',
    },
  });
});

// ============================================================
// 7. SERVIR FRONTEND (SPA) EM PRODUÇÃO
// ============================================================
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

// ============================================================
// 8. ROTA 404
// ============================================================
app.use('/api/*', (req, res) => {
  res.status(404).json({
    message: `Rota ${req.method} ${req.originalUrl} não encontrada`,
    code: 'NOT_FOUND',
  });
});

// ============================================================
// 9. ERROR HANDLER (Centralizado)
// ============================================================
app.use(errorHandler);

// ============================================================
// 10. INICIAR SERVIDOR
// ============================================================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('  🦷 CRM ODONTO PRO — Server Running');
  console.log('═══════════════════════════════════════════');
  console.log(`  🌐 Port:        ${PORT}`);
  console.log(`  🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  📡 API:         http://localhost:${PORT}/api`);
  console.log(`  ❤️  Health:      http://localhost:${PORT}/api/health`);
  console.log('═══════════════════════════════════════════');
  console.log('');
});

// Graceful Shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} recebido. Encerrando servidor...`);
  server.close(() => {
    console.log('🛑 Servidor encerrado com sucesso.');
    process.exit(0);
  });

  // Forçar encerramento após 10 segundos
  setTimeout(() => {
    console.error('⚠️ Forçando encerramento...');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Capturar erros não tratados
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  if (process.env.NODE_ENV === 'production') {
    gracefulShutdown('UNHANDLED_REJECTION');
  }
});

process.on('uncaughtException', (err) => {
  console.error('💀 Uncaught Exception:', err.message);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

module.exports = app;
