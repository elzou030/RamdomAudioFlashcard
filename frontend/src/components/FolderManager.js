import React, { useState, useEffect } from 'react';

const FolderManager = () => {
  const [folders, setFolders] = useState([]);
  const [newFolder, setNewFolder] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetchFolders();
  }, []);

  // Fetch the list of folders
  const fetchFolders = async () => {
    const response = await fetch('http://localhost:5100/api/folders');
    const data = await response.json();
    setFolders(data.folders);
  };

  // Fetch songs in the selected folder
  const fetchSongs = async (folderName) => {
    const response = await fetch(`http://localhost:5100/api/folders/${folderName}/songs`);
    const data = await response.json();
    setSongs(data.songs);
    setSelectedFolder(folderName);
  };

  // Handle creating a new folder
  const handleCreateFolder = async () => {
    if (!newFolder) {
      alert("Please enter a folder name");
      return;
    }

    try {
      const response = await fetch('http://localhost:5100/api/create-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderName: newFolder }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);  // Notify the user about success
        setNewFolder('');     // Clear the input field
        fetchFolders();       // Refresh the folder list
      } else {
        const error = await response.json();
        alert(error.message);  // Display any error message
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder');
    }
  };

  return (
    <div>
      <h2>Folders</h2>
      <div>
        <input
          type="text"
          placeholder="New Folder Name"
          value={newFolder}
          onChange={(e) => setNewFolder(e.target.value)}
        />
        <button onClick={handleCreateFolder}>Add Folder</button>
      </div>
      <ul>
        {folders.map(folder => (
          <li key={folder} onClick={() => fetchSongs(folder)}>
            {folder}
          </li>
        ))}
      </ul>

      {selectedFolder && (
        <div>
          <h3>Songs in {selectedFolder}</h3>
          <ul>
            {songs.map(song => (
              <li key={song}>{song}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FolderManager;
