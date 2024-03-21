import React, { useState } from 'react';
import './DynamicToolPage.css';

const Reverse = () => {
  const [selectedTool, setSelectedTool] = useState('');

  const handleToolChange = (event) => {
    setSelectedTool(event.target.value);
  };

  return (
    <div className="container">
      <h2>Select a Reverse Tool</h2>
      <select  className="tool-select" value={selectedTool} onChange={handleToolChange}>
        <option value="">Select a tool</option>
        <option value="Virus">Apk Tool</option>
        <option value="Fortify">Frida</option>
        <option value="Vezir">Hackode</option>
        <option value="Vezir">d2j-dex2jar</option>
        <option value="Vezir">JD-GUI</option>
        <option value="Vezir">Virtuous Ten Studio</option>
        {/* Add more tool options here */}
      </select>
      {selectedTool && (
        <div className="tool-info">
          <h3>Selected Tool: {selectedTool}</h3>
          {/* Render tool-specific content here */}
        </div>
      )}
    </div>
  );
};

export default Reverse;

