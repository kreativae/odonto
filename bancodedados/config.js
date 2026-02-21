const mongoose = require('mongoose');

const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;

  const options = {
    // Connection Pool — controla quantas conexões simultâneas ao MongoDB
    maxPoolSize: 10,
    minPoolSize: 2,

    // Timeouts — evita que o servidor trave esperando o banco
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,

    // Heartbeat — verifica se a conexão ainda está viva
    heartbeatFrequencyMS: 10000,

    // Auto index — desabilitar em produção para performance
    autoIndex: process.env.NODE_ENV !== 'production',
  };

  const connect = async () => {
    try {
      const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/odontopro';

      const conn = await mongoose.connect(MONGO_URI, options);

      console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
      console.log(`📦 Database: ${conn.connection.name}`);
      console.log(`🔒 SSL/TLS: ${conn.connection.host.includes('mongodb.net') ? 'Ativo (Atlas)' : 'Local'}`);

      // Event listeners para monitorar saúde da conexão
      mongoose.connection.on('error', (err) => {
        console.error('❌ Erro na conexão MongoDB:', err.message);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB desconectado. Tentando reconectar...');
        if (retries < MAX_RETRIES) {
          retries++;
          setTimeout(connect, 5000);
        }
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconectado com sucesso.');
        retries = 0;
      });

      // Graceful shutdown — fecha conexão quando o processo é encerrado
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('🛑 Conexão MongoDB fechada (SIGINT).');
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        await mongoose.connection.close();
        console.log('🛑 Conexão MongoDB fechada (SIGTERM).');
        process.exit(0);
      });

    } catch (error) {
      console.error(`❌ Falha ao conectar ao MongoDB (tentativa ${retries + 1}/${MAX_RETRIES}):`, error.message);
      retries++;
      if (retries < MAX_RETRIES) {
        console.log(`🔄 Tentando novamente em 5 segundos...`);
        setTimeout(connect, 5000);
      } else {
        console.error('💀 Máximo de tentativas atingido. Encerrando.');
        process.exit(1);
      }
    }
  };

  await connect();
};

module.exports = connectDB;
