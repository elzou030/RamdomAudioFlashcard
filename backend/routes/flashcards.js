const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const songFolder = path.join(__dirname, '../uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(songFolder)) {
  console.log('Uploads directory does not exist, creating...');
  fs.mkdirSync(songFolder, { recursive: true });
} else {
  console.log('Uploads directory exists:', songFolder);
}

// Configure multer to save files to the uploads folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Saving file to uploads folder:', songFolder);
    cb(null, songFolder);
  },
  filename: function (req, file, cb) {
    console.log('Saving file with original name:', file.originalname);
    cb(null, file.originalname);  // Use the original filename
  }
});

const upload = multer({ storage: storage });

// POST route to upload files
router.post('/upload', (req, res) => {
  console.log('Received file upload request');

  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);  // Log the error for debugging
      return res.status(500).json({ message: 'Failed to upload file' });
    }

    if (!req.file) {
      console.error('No file uploaded');  // Log the missing file
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log(`File uploaded successfully: ${req.file.filename}`);
    res.status(200).json({ message: 'Song uploaded successfully', filename: req.file.filename });
  });
});

module.exports = router;
