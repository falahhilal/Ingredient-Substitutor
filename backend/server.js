const express = require('express');
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes');  // Import the auth routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); 

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));