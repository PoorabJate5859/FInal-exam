const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Display registration page
router.get('/register', (req, res) => {
    res.render('register', { user: req.user });
});

// Handle registration
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).render('register', { error: 'Username already exists', user: req.user });
        }
        const user = new User({ username, password, role });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).render('register', { error: 'Server error during registration', user: req.user });
    }
});

// Display login page
router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

// Handle login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).render('login', { error: 'Invalid credentials', user: req.user });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.redirect('/tasks');
    } catch (err) {
        console.error(err);
        res.status(500).render('login', { error: 'Server error during login', user: req.user });
    }
});

// Handle logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

module.exports = router;
