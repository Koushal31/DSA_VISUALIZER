const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  algorithm: { type: String, required: true },
  runCount:  { type: Number, default: 1 },
  dates:     [{ type: Date }],  // one entry per run — used for heatmap
  lastRun:   { type: Date, default: Date.now },
});

// Compound index so each user has one doc per algorithm
ProgressSchema.index({ userId: 1, algorithm: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);