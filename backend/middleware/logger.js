const Log = require('../../bancodedados/models/Log');

const requestLogger = async (req, res, next) => {
  const start = Date.now();
  const originalSend = res.send;
  res.send = function (data) {
    res.send = originalSend;
    const duration = Date.now() - start;
    if (req.path.startsWith('/api/') && req.user) {
      Log.create({
        clinicId: req.clinicId,
        userId: req.user?._id,
        action: `${req.method} ${req.path}`,
        module: req.path.split('/')[2] || 'system',
        details: { method: req.method, path: req.path, statusCode: res.statusCode, duration },
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date()
      }).catch(() => {});
    }
    return res.send(data);
  };
  next();
};

module.exports = { requestLogger };
