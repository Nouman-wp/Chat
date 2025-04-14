const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
  res.render('index');
});

router.post('/chat', (req, res) => {
  const { username } = req.body;
  if (!username || username.trim() === '') {
    return res.redirect('/');
  }
  res.render('chat', { username });
});
module.exports = router;
