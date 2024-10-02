const express = require('express');
const cors = require('cors');
const flashcardRoutes = require('./routes/flashcards');

const app = express();

// Enable CORS for cross-origin requests
app.use(cors());

// Use the routes defined in flashcards.js
app.use('/api', flashcardRoutes);

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
