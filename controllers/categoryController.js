const Category = require('../models/category');


exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('categoryList', { categories, user: req.user });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};


exports.createCategory = async (req, res) => {
    try {
        await Category.create({ name: req.body.name });
        res.redirect('/categories');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};


exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.redirect('/categories');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};
