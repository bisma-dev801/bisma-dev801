const express = require('express');
const multer = require('multer');
const path = require('path');
const { generateSlug } = require('../utils/helpers'); 
const db = require('../config/db');
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/', upload.single('profileImage'), (req, res) => {
  const { userId, name, bio, skills, projects, theme } = req.body;
  const profileImage = req.file ? `/uploads/${req.file.filename}` : null;
  const slug = generateSlug(name);  

  const query = `
    INSERT INTO portfolios (user_id, name, bio, skills, projects, profile_image, theme, slug)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [userId, name, bio, skills, projects, profileImage, theme || 'dark', slug], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: 'Portfolio created successfully',
      portfolioId: result.insertId,
      slug,  
      shareUrl: `http://localhost:5173/portfolio/${slug}`
    });
  });
});

router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  db.query('SELECT id, name, slug, theme, updated_at FROM portfolios WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
