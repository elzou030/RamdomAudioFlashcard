const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const flashcardRoutes = require('./routes/flashcards');

app.use(cors());
app.use(express.json());

app.use('/api', flashcardRoutes);

app.listen(5100, () => {
  console.log('Server is running on http://localhost:5100');
});
