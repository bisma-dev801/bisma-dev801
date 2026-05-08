const express = require('express');
const { hashPassword, verifyPassword, generateToken } = require('../utils/auth');  
const db = require('../config/db');
const router = express.Router();

router.post('/register', async (req, res) => {
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const query = `SELECT * FROM users WHERE email = ?`;
  db.query(query, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = results[0];
    const isValid = await verifyPassword(password, user.password);  L
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = generateToken(user.id);  
    res.json({ 
      token, 
      user: { id: user.id, email: user.email, name: user.name } 
    });
  });
});

module.exports = router;