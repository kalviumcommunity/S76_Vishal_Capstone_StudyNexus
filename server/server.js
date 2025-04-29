const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('.db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// Define routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/study-groups', require('./routes/studyGroupRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.send('StudyNexus API is running');
});

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});