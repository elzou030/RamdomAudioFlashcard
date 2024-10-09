const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Get all folders from the "uploads" directory
router.get('/folders', (req, res) => {
  fs.readdir(uploadsDir, (err, folders) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading folders' });
    }
    
    const onlyFolders = folders.filter((folder) =>
      fs.statSync(path.join(uploadsDir, folder)).isDirectory()
    );

    res.status(200).json({ folders: onlyFolders });
  });
});

// Create a new folder
router.post('/create-folder', (req, res) => {
  const { folderName } = req.body;
  const folderPath = path.join(uploadsDir, folderName);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    res.status(200).json({ message: `Folder '${folderName}' created successfully` });
  } else {
    res.status(400).json({ message: 'Folder already exists' });
  }
});

// Set up multer for song uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.body.folderName || '';
    const folderPath = path.join(uploadsDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);  // Save file with its original name
  }
});
const upload = multer({ storage });

// Route to upload a song to a specific folder
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  res.status(200).json({ message: 'Song uploaded successfully', filename: req.file.filename });
});


router.get('/random-song', (req, res) => {
  // Get all subdirectories and files in the uploads directory
  fs.readdir(uploadsDir, { withFileTypes: true }, (err, entries) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading uploads folder' });
    }

    // Collect all audio files from subdirectories
    const audioFiles = [];
    entries.forEach((entry) => {
      if (entry.isDirectory()) {
        const folderPath = path.join(uploadsDir, entry.name);
        const files = fs.readdirSync(folderPath);

        files.forEach(file => {
          // Filter out only audio files if needed
          if (file.endsWith('.mp3') || file.endsWith('.wav')) {
            audioFiles.push({
              folder: entry.name,
              fileName: file
            });
          }
        });
      }
    });

    // If no audio files are found, return an error
    if (audioFiles.length === 0) {
      return res.status(404).json({ message: 'No audio files found' });
    }

    // Select a random audio file
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    const randomSong = audioFiles[randomIndex];

    res.json({
      songName: randomSong.fileName,
      songPath: `uploads/${randomSong.folder}/${randomSong.fileName}`
    });
  });
});
module.exports = router;
