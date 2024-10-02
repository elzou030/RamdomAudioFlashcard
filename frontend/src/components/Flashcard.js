import React from 'react';
/*
function Flashcard({ songFilename }) {
  const handleGenerateFlashcard = async () => {
    const response = await fetch(`http://localhost:5001/api/get-flashcard/${songFilename}`);
    
    if (response.ok) {
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audioElement = document.getElementById('song-clip');
      audioElement.src = audioUrl;
    } else {
      alert('Failed to generate flashcard');
    }
  };

  return (
    <div>
      <h2>{songFilename}</h2>
      <button onClick={handleGenerateFlashcard}>Generate Flashcard</button>
      <audio id="song-clip" controls />
    </div>
  );
}

export default Flashcard;
*/