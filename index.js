require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const connectDB = require('./config/db');

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));


app.set('view engine', 'ejs');


connectDB();


app.use('/', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/categories', categoryRoutes);


app.get('/', (req, res) => {
    res.redirect('/login');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
