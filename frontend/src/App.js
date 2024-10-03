import React, { useState } from 'react';
import UploadSong from './components/UploadSong';
import FolderManager from './components/FolderManager';

function App() {
  const [songFilename, setSongFilename] = useState('');

  return (
    <div className="App">
      <h1>Song Upload Flashcard</h1>
      <FolderManager />
      <UploadSong setSongFilename={setSongFilename} />
      {songFilename && <p>Uploaded Song: {songFilename}</p>}
    </div>
  );
}

export default App;
