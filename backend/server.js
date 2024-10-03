const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const songFolder = path.join(__dirname, 'uploads');

// Middleware
app.use(cors());
app.use(express.json());  // To parse JSON request bodies

// Ensure the uploads directory exists
if (!fs.existsSync(songFolder)) {
  fs.mkdirSync(songFolder, { recursive: true });
}

// Configure multer for song uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.body.folderName || '';
    const folderPath = path.join(songFolder, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// Create a new folder
app.post('/api/create-folder', (req, res) => {
  const { folderName } = req.body;
  const folderPath = path.join(songFolder, folderName);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    res.status(200).json({ message: `Folder '${folderName}' created successfully` });
  } else {
    res.status(400).json({ message: 'Folder already exists' });
  }
});

// Get list of folders
app.get('/api/folders', (req, res) => {
  fs.readdir(songFolder, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading folders' });
    }
    const folders = files.filter(file => fs.statSync(path.join(songFolder, file)).isDirectory());
    res.status(200).json({ folders });
  });
});

// Get list of songs in a folder
app.get('/api/folders/:folderName/songs', (req, res) => {
  const folderPath = path.join(songFolder, req.params.folderName);
  if (!fs.existsSync(folderPath)) {
    return res.status(404).json({ message: 'Folder not found' });
  }

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading songs' });
    }
    const songs = files.filter(file => !fs.statSync(path.join(folderPath, file)).isDirectory());
    res.status(200).json({ songs });
  });
});

// Upload a song to a folder
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ message: 'Song uploaded successfully', filename: req.file.filename });
});

// Error handling for routes not found (404)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
app.listen(5100, () => {
  console.log('Server is running on http://localhost:5100');
});
