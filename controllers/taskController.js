const Task = require('../models/task');
const User = require('../models/User');
const Category = require('../models/category');


exports.getTasks = async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'admin') {
                        tasks = await Task.find({}).populate('user', 'username role').populate('category');
        } else {
            tasks = await Task.find({ user: req.user._id }).populate('category');
        }
        res.render('taskList', {
            tasks: tasks,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


exports.showTaskForm = async (req, res) => {
    try {
        const categories = await Category.find();
        let task = {};
        if (req.query.id) {
            task = await Task.findById(req.query.id);
            if (!task || (task.user.toString() !== req.user.id && req.user.role !== 'admin')) {
                return res.status(404).send('Task not found or not authorized');
            }
        }
        res.render('taskForm', {
            task: task,
            categories: categories,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


exports.saveTask = async (req, res) => {
    const { id, title, description, status } = req.body;
    let { category } = req.body;

    // If category is an empty string, set it to null to avoid CastError
    if (category === '') {
        category = null;
    }
    try {
        if (id) {
            // Update
            let task = await Task.findById(id);
            if (!task || (task.user.toString() !== req.user.id && req.user.role !== 'admin')) {
                return res.status(404).send('Task not found or not authorized');
            }
            await Task.findByIdAndUpdate(id, { title, description, status, category });
        } else {
            // Create
            const task = new Task({
                title,
                description,
                status,
                category,
                user: req.user._id
            });
            await task.save();
            await User.findByIdAndUpdate(req.user._id, { $push: { tasks: task._id } });
        }
        res.redirect('/tasks');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task || (task.user.toString() !== req.user.id && req.user.role !== 'admin')) {
            return res.status(404).send('Task not found or not authorized');
        }
        await User.findByIdAndUpdate(task.user, { $pull: { tasks: task._id } });
        await task.deleteOne();
        res.redirect('/tasks');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
