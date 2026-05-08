const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const router = express.Router();

router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const query = `SELECT id, email, name FROM users WHERE id = ?`;

    db.query(query, [decoded.userId], (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ error: 'User not found' });
      }

      res.json(results[0]);
    });

  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query =
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)';

    db.query(query, [email, hashedPassword, name], (err) => {
      if (err) {
  console.log("DB ERROR:", err);
  return res.status(500).json({ error: err.sqlMessage });
    }
      res.json({ message: 'User registered successfully' });
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  });
});
module.exports = router;
