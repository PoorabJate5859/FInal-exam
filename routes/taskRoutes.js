const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Category = require('../models/Category');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Display all tasks
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user._id };
        const tasks = await Task.find(query).populate('user', 'username').populate('category', 'name').sort({ createdAt: -1 });
        res.render('taskList', { tasks, user: req.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Display form to add a new task
router.get('/add', ensureAuthenticated, async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('taskForm', { user: req.user, categories, task: undefined });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Compatibility: Display form via /tasks/form (same as /tasks/add)
router.get('/form', ensureAuthenticated, async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('taskForm', { user: req.user, categories, task: undefined });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Handle adding a new task
router.post('/add', ensureAuthenticated, async (req, res) => {
    const { title, description, status, category } = req.body;
    try {
        await Task.create({
            title,
            description,
            status,
            category: category || null,
            user: req.user._id
        });
        res.redirect('/tasks');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Display form to edit a task
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        const categories = await Category.find();
        if (!task) {
            return res.status(404).send('Task not found');
        }
        // Add authorization check if needed (e.g., only admin or task owner can edit)
        res.render('taskForm', { task, categories, user: req.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Handle editing a task
router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        await Task.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/tasks');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Handle deleting a task
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.redirect('/tasks');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
