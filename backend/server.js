const express = require('express');
const path = require('path');
const cors = require('cors');
const flashcardsRouter = require('./routes/flashcards');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api', flashcardsRouter);

// Serve static files (if needed, e.g., for uploaded songs)
app.use('/uploads', express.static('uploads'));

// Start the server
const PORT = 5100;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
