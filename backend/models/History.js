const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  thumbnail: {
    type: String, // base64 string
    required: true
  },
  verdict: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  fullResult: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('History', historySchema);
