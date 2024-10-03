import React, { useState, useEffect } from 'react';

function FolderManager() {
  const [folders, setFolders] = useState([]);
  const [newFolder, setNewFolder] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    const response = await fetch('http://localhost:5100/api/folders');
    const data = await response.json();
    setFolders(data.folders);
  };

  const fetchSongs = async (folderName) => {
    const response = await fetch(`http://localhost:5100/api/folders/${folderName}/songs`);
    const data = await response.json();
    setSongs(data.songs);
    setSelectedFolder(folderName);
  };

  const handleCreateFolder = async () => {
    if (!newFolder) return;

    const response = await fetch('http://localhost:5100/api/create-folder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderName: newFolder }),
    });

    if (response.ok) {
      alert('Folder created successfully');
      setNewFolder('');
      fetchFolders();
    } else {
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
          <li key={folder}>
            <span onClick={() => fetchSongs(folder)}>{folder}</span>
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
}

export default FolderManager;
