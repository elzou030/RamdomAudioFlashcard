import React, { useState } from 'react';

const Home = () => {
  const [songPath, setSongPath] = useState('');
  const [songName, setSongName] = useState('');
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [audio, setAudio] = useState(null);
  const [showSongName, setShowSongName] = useState(false);

  // Function to generate a random flashcard (random song)
  const generateFlashcard = async () => {
    try {
      const response = await fetch('http://localhost:5100/api/random-song');
      if (response.ok) {
        const data = await response.json();
        setSongPath(`http://localhost:5100/${data.songPath}`);  // Assuming you serve static files
        setSongName(data.songName);
        setShowPlayButton(true);
        setShowSongName(false);  // Hide song name initially
      } else {
        alert('No songs found');
      }
    } catch (error) {
      console.error('Error fetching random song:', error);
    }
  };

  // Play a 30-second segment of the random song
  const playRandomSegment = () => {
    if (!songPath) return;
    
    const audioElement = new Audio(songPath);
    audioElement.play();

    setAudio(audioElement);

    // Stop the song after 30 seconds
    setTimeout(() => {
      audioElement.pause();
    }, 30000);
  };

  return (
    <div>
      <h1>Welcome to the Flashcard Generator</h1>
      <button onClick={generateFlashcard}>Generate Flashcard</button>

      {showPlayButton && (
        <div>
          <button onClick={playRandomSegment}>Play Random 30 Seconds</button>
        </div>
      )}

      {showPlayButton && (
        <div>
          <button onClick={() => setShowSongName(true)}>Show Song Name</button>
        </div>
      )}

      {showSongName && <p>Song Name: {songName}</p>}
    </div>
  );
};

export default Home;
