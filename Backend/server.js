const express = require('express');
const http = require('http');
const cors = require('cors');
const courses=require('./routes/courserouter')
const users=require('./routes/user_router')
require('dotenv').config();
require("./config/passport");

const connectToDatabase = require('./config/db');
connectToDatabase();

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Backend server is running successfully!' });
});
app.use('/api/courses',courses);
app.use('/api/users',users)

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});