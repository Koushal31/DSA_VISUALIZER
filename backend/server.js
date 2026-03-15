const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/progress', require('./routes/progress'));

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dsaviz';
console.log('ℹ️ Using MONGO_URI:', MONGO_URI);
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    // Choose port (Render sets process.env.PORT automatically)
    let port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

    const http = require('http');

    const startServer = (p) => {
      const server = http.createServer(app);

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.warn(`⚠️ Port ${p} in use, trying ${p + 1}...`);
          startServer(p + 1);
        } else {
          console.error('❌ Server error:', err);
          process.exit(1);
        }
      });

      server.listen(p, () => console.log(`🚀 Server running on http://localhost:${p}`));
    };

    startServer(port);
  })
  .catch(err => { console.error('❌ MongoDB connection failed:', err.message); process.exit(1); });