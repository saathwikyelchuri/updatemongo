// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToMongoDB } = require('./connection');
const reportRoute=require('./routes/report');
const app = express();
const PORT = 3000;


connectToMongoDB('mongodb://127.0.0.1:27017/result')
.then(()=>console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));


app.use(cors({
    origin: 'http://localhost:5173'  // Frontend origin
}));
// Middleware setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ limit: '10mb' }));
app.use('/',reportRoute);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));