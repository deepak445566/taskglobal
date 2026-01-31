// Server start karne ki file
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Database connect kare
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/taskdb')
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.log('❌ Database error:', err));

// Simple route check ke liye
app.get('/', (req, res) => {
  res.send('Task Manager API is running...');
});

// Port pe server start kare
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});