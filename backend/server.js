const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// Connect to MongoDB (with memory-server fallback)
connectDB();

// Express Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Welcome route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Welcome to the Innovation Idea Hub API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      ideas: '/api/ideas',
      stats: '/api/ideas/stats'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);

// Serve Frontend Static Assets in Production / Deployment
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(frontendDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      next();
    }
  });
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] Innovation Idea Hub backend server running on port ${PORT}`);
});
