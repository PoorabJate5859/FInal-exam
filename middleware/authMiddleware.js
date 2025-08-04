const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
    ensureAuthenticated: async (req, res, next) => {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect('/login');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                
                return res.redirect('/login');
            }

            req.user = user;
            next();
        } catch (err) {
            console.error('', err.message);
            return res.redirect('/login');
        }
    },

    isAdmin: (req, res, next) => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).send('Access Denied: Admins only.');
        }
    }
};
