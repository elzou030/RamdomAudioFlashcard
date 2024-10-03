import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import FolderManager from './components/FolderManager';
import UploadSong from './components/UploadSong';
import './styles/App.css'; 
import './styles/sidebar.css'; 
function App() {
  const [songFilename, setSongFilename] = useState('');

  return (
    <Router>
      <div className="App">
        {/* Sidebar on the left */}
        <Sidebar />

        {/* Content on the right */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/folders"
              element={
                <>
                  {/* FolderManager component */}
                  <FolderManager />

                  {/* UploadSong component (only on the folders page) */}
                  <UploadSong setSongFilename={setSongFilename} />
                  {songFilename && <p>Uploaded Song: {songFilename}</p>}
                </>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
