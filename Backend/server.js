const express = require('express');
const http = require('http');
const cors = require('cors');
const courses=require('./routes/courserouter')
const users=require('./routes/user_router')
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
require("./config/passport");

const connectToDatabase = require('./config/db');
connectToDatabase();

const app = express();
app.set('trust proxy', 1);
const server = http.createServer(app);
app.use(cors({
    origin: ['https://course-generator-ai-eight.vercel.app'],
    credentials: true
}));
app.use(express.json());

// Session is required for OAuth transaction storage
app.use(session({
    secret: process.env.SESSION_SECRET || 'change_this_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: 'none'
    }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.json({ message: 'Backend server is running successfully!' });
});
app.use('/api/courses',courses);
app.use('/api/users',users)

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});