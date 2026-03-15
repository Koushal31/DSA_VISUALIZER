const express = require('express');
const jwt = require('jsonwebtoken');
const Progress = require('../models/Progress');
const User = require('../models/user');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dsaviz_secret_change_in_prod';

// Middleware: verify JWT
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// POST /api/progress/log
router.post('/log', auth, async (req, res) => {
  try {
    const { algorithm } = req.body;
    const today = new Date();

    const prog = await Progress.findOneAndUpdate(
      { userId: req.user.id, algorithm },
      { $inc: { runCount: 1 }, $push: { dates: today }, $set: { lastRun: today } },
      { upsert: true, new: true }
    );

    // Update streak on User
    const user = await User.findById(req.user.id);
    const lastActive = new Date(user.lastActive);
    const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) user.streak += 1;
    else if (diffDays > 1) user.streak = 1;
    user.lastActive = today;
    await user.save();

    res.json({ success: true, runCount: prog.runCount, streak: user.streak });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/progress/profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    const progress = await Progress.find({ userId: req.user.id });

    // Build heatmap: count runs per date for last 84 days (12 weeks)
    const heatmap = {};
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 84);
    progress.forEach(p => {
      p.dates.forEach(d => {
        if (d >= cutoff) {
          const key = d.toISOString().split('T')[0];
          heatmap[key] = (heatmap[key] || 0) + 1;
        }
      });
    });

    // Badges
    const totalRuns = progress.reduce((s, p) => s + p.runCount, 0);
    const algorithmsUsed = progress.length;
    const badges = [];
    if (totalRuns >= 1)    badges.push({ id: 'first_run',   icon: '🚀', label: 'First Run',      desc: 'Ran your first algorithm' });
    if (totalRuns >= 10)   badges.push({ id: 'curious',     icon: '🔍', label: 'Curious Learner', desc: '10 algorithm runs' });
    if (totalRuns >= 50)   badges.push({ id: 'dedicated',   icon: '🔥', label: 'Dedicated',       desc: '50 algorithm runs' });
    if (algorithmsUsed >= 3) badges.push({ id: 'explorer',  icon: '🗺️', label: 'Explorer',        desc: 'Tried 3+ algorithms' });
    if (algorithmsUsed >= 5) badges.push({ id: 'all_sorts', icon: '🏆', label: 'Sort Master',     desc: 'Tried all sorting algorithms' });
    if (user.streak >= 3)  badges.push({ id: 'streak3',    icon: '⚡', label: '3-Day Streak',    desc: 'Active 3 days in a row' });
    if (user.streak >= 7)  badges.push({ id: 'streak7',    icon: '💎', label: 'Week Warrior',    desc: 'Active 7 days in a row' });

    res.json({
      user: { name: user.name, email: user.email, createdAt: user.createdAt, streak: user.streak, lastActive: user.lastActive },
      stats: { totalRuns, algorithmsUsed, algorithmsCompleted: progress.filter(p => p.runCount >= 3).length },
      progress: progress.map(p => ({ algorithm: p.algorithm, runCount: p.runCount, lastRun: p.lastRun })),
      heatmap,
      badges
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;