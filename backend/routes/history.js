const express = require('express');
const router = express.Router();
const History = require('../models/History');
const auth = require('../middleware/auth');

// GET history items for the authenticated user (sorted newest first, limited to 50)
router.get('/', auth, async (req, res) => {
  try {
    const history = await History.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// POST a new history item for the authenticated user
router.post('/', auth, async (req, res) => {
  try {
    const { thumbnail, verdict, score, summary, fullResult } = req.body;
    
    if (!thumbnail || !verdict || !score || !summary || !fullResult) {
      return res.status(400).json({ error: 'Missing required history fields' });
    }

    const newHistory = new History({
      userId: req.user.id,
      thumbnail,
      verdict,
      score,
      summary,
      fullResult
    });

    const savedHistory = await newHistory.save();
    res.status(201).json(savedHistory);
  } catch (error) {
    console.error('Error saving history:', error);
    res.status(500).json({ error: 'Failed to save history' });
  }
});

module.exports = router;
