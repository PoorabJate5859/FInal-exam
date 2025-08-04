const User = require('../models/User');
const jwt = require('jsonwebtoken');


const generateToken = (id, role) => {
    return jwt.sign({ id, role }, 'a_secure_and_long_secret_key_that_is_not_this', {
        expiresIn: '1d'
    });
};


exports.register = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const userExists = await User.findOne({ username });

        if (userExists) {
            return res.status(400).send('User already exists');
        }

        const user = await User.create({
            username,
            password,
            role
        });

        if (user) {
            res.status(201).redirect('/login');
        } else {
            res.status(400).send('Invalid user data');
        }
    } catch (error) {
        res.status(500).send('Server Error');
    }
};


// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && (await user.comparePassword(password))) {
            const token = generateToken(user._id, user.role);

            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            res.redirect('/tasks');
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        res.status(500).send('Server Error');
    }
};


exports.logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.redirect('/login');
};
