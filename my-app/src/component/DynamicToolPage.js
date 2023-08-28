import React, { useState } from 'react';

const DynamicToolPage= () => {
  const [selectedTool, setSelectedTool] = useState('');

  const handleToolChange = (event) => {
    setSelectedTool(event.target.value);
  };

  return (
    <div>
      <h2>Select a Dynamic Tool</h2>
      <select value={selectedTool} onChange={handleToolChange}>
        <option value="">Select a tool</option>
        <option value="mobsf">Mobsf</option>
        <option value="drozer">Drozer</option>
        <option value="drozer">Quark-Engine</option>
        {/* Add more tool options here */}
      </select>
      {selectedTool && (
        <div>
          <h3>Selected Tool: {selectedTool}</h3>
          {/* Render tool-specific content here */}
        </div>
      )}
    </div>
  );
};

export default DynamicToolPage;

