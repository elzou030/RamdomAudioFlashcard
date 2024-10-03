const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const songFolder = path.join(__dirname, '../uploads');

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

// Create a folder
router.post('/create-folder', (req, res) => {
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
router.get('/folders', (req, res) => {
  fs.readdir(songFolder, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading folders' });
    }
    const folders = files.filter(file => fs.statSync(path.join(songFolder, file)).isDirectory());
    res.status(200).json({ folders });
  });
});

// Get songs in a folder
router.get('/folders/:folderName/songs', (req, res) => {
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

// Upload a song
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ message: 'Song uploaded successfully', filename: req.file.filename });
});

module.exports = router;
