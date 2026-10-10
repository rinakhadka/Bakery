const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
  provider: { type: String, default: 'Khalti' },
  pidx: { type: String, required: true, unique: true, index: true },
  transactionId: { type: String, default: null },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, default: 'Pending' },
  verified: { type: Boolean, default: false },
  rawResponse: { type: mongoose.Schema.Types.Mixed, default: null },
  paidAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
