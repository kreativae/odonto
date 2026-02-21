const asyncHandler = require('express-async-handler');
const Transaction = require('../../bancodedados/models/Transaction');
const AuditLog = require('../../bancodedados/models/AuditLog');

// @desc    Get all transactions
// @route   GET /api/financial
// @access  Private (Admin/Financial)
const getTransactions = asyncHandler(async (req, res) => {
  // Verificar permissão
  if (req.user.role !== 'admin' && req.user.role !== 'financial' && req.user.role !== 'manager') {
    res.status(403);
    throw new Error('Acesso negado aos dados financeiros');
  }

  const transactions = await Transaction.find({ clinicId: req.user.clinicId });
  res.status(200).json(transactions);
});

// @desc    Create new transaction
// @route   POST /api/financial
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'financial') {
    res.status(403);
    throw new Error('Permissão insuficiente para criar transações');
  }

  const { description, amount, type, category, date, status, paymentMethod } = req.body;

  if (!description || !amount || !type) {
    res.status(400);
    throw new Error('Preencha os campos obrigatórios');
  }

  const transaction = await Transaction.create({
    clinicId: req.user.clinicId,
    description,
    amount,
    type,
    category,
    date,
    status,
    paymentMethod,
    createdBy: req.user.id
  });

  // Log de Auditoria
  await AuditLog.create({
    user: req.user.id,
    action: 'CREATE',
    entity: 'Financial',
    entityId: transaction._id,
    details: { amount, type },
    ipAddress: req.ip
  });

  res.status(201).json(transaction);
});

// @desc    Update transaction
// @route   PUT /api/financial/:id
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'financial') {
    res.status(403);
    throw new Error('Permissão insuficiente');
  }

  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transação não encontrada');
  }

  const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  // Log de Auditoria
  await AuditLog.create({
    user: req.user.id,
    action: 'UPDATE',
    entity: 'Financial',
    entityId: updatedTransaction._id,
    details: { changes: req.body },
    ipAddress: req.ip
  });

  res.status(200).json(updatedTransaction);
});

// @desc    Delete transaction
// @route   DELETE /api/financial/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Apenas Administradores podem excluir transações');
  }

  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transação não encontrada');
  }

  await transaction.remove();

  // Log de Auditoria
  await AuditLog.create({
    user: req.user.id,
    action: 'DELETE',
    entity: 'Financial',
    entityId: req.params.id,
    details: { amount: transaction.amount },
    ipAddress: req.ip
  });

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};