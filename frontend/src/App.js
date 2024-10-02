import React, { useState } from 'react';
import UploadSong from './components/UploadSong';

function App() {
  const [songFilename, setSongFilename] = useState('');

  return (
    <div className="App">
      <h1>Song Upload Flashcard</h1>
      <UploadSong setSongFilename={setSongFilename} />
      {songFilename && <p>Uploaded Song: {songFilename}</p>}
    </div>
  );
}

export default App;
