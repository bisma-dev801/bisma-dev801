const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

// ✅ ONE CORS setup (both local + live)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://myapp.vercel.app'
  ],
  credentials: true
}));

// middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));  

// Routes
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolios');

app.use('/api/auth', authRoutes);
app.use('/api/portfolios', portfolioRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Portfolio Builder API Ready!' 
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Portfolio Builder API v1.0',
    endpoints: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      portfolios: '/api/portfolios'
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});