
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');


router.get('/register', (req, res) => {
  res.render('register');
});


router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash('success', 'Welcome to the Chat App!');
      res.redirect('/chat');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
});


router.get('/login', (req, res) => {
  res.render('login');
});


router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), (req, res) => {
  req.flash('success', 'Welcome back!');
  res.redirect('/chat');
});


router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success', 'Logged you out!');
    res.redirect('/');
  });
});

module.exports = router;
