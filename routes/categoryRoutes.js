const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Display category management page
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.render('categoryList', { categories, user: req.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Handle adding a new category
router.post('/add', ensureAuthenticated, async (req, res) => {
    const { name } = req.body;
    try {
        await Category.create({
            name,
            user: req.user._id
        });
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Handle deleting a category
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        // Optional: Also remove this category from all tasks that use it.
        // await Task.updateMany({ category: req.params.id }, { $unset: { category: 1 } });
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
