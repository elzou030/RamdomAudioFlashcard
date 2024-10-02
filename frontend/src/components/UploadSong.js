import React, { useState } from 'react';

function UploadSong({ setSongFilename }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  // Handle the file selection from the file input
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');  // Reset error state on file change
    console.log('Selected file:', e.target.files[0]);  // Log selected file
  };

  // Handle the file upload to the backend
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a song to upload');
      console.error('No file selected');  // Log if no file is selected
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Uploading file:', file);  // Log the file before upload

      const response = await fetch('http://localhost:5100/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setSongFilename(file.name);  // Set the filename in the parent component
        console.log('Upload successful:', data);  // Log success response
      } else {
        const data = await response.json();
        setError(data.message || 'Upload failed');
        console.error('Upload failed:', data);  // Log failure response
      }
    } catch (error) {
      console.error('Error during file upload:', error);  // Log any caught errors
      setError('Failed to upload the file');
    }
  };

  return (
    <div>
      <h2>Upload a Song</h2>
      <input type="file" onChange={handleFileChange} accept="audio/*" />
      <button onClick={handleUpload}>Upload Song</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default UploadSong;
