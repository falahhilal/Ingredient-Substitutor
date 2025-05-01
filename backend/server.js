const express = require('express');
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes');  
//const bodyParser = require('body-parser');
const recipeRoutes = require('./Routes/recipeRoutes');
const ingredientRoutes = require('./Routes/ingredientRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
//app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/recipes', recipeRoutes);
app.use('/api/ingredients', ingredientRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));