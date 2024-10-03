import React, { useState } from 'react';

function UploadSong({ setSongFilename }) {
  const [file, setFile] = useState(null);
  const [folder, setFolder] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleFolderChange = (e) => {
    setFolder(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a song to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderName', folder);

    try {
      const response = await fetch('http://localhost:5100/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setSongFilename(file.name);
      } else {
        const data = await response.json();
        setError(data.message || 'Upload failed');
      }
    } catch (error) {
      setError('Failed to upload the file');
    }
  };

  return (
    <div>
      <h2>Upload a Song</h2>
      <input type="file" onChange={handleFileChange} accept="audio/*" />
      <input
        type="text"
        placeholder="Folder Name"
        value={folder}
        onChange={handleFolderChange}
      />
      <button onClick={handleUpload}>Upload Song</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default UploadSong;
