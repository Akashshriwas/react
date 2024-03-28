import React, { useState } from "react";
import "./DynamicToolPage.css";
import Instruction from "./Instruction";

const Reverse = () => {
  const [selectedTool, setSelectedTool] = useState("");

  const handleToolChange = (event) => {
    setSelectedTool(event.target.value);
  };

  return (
    <div className="page-container">
      <Instruction />
      <h2>Select a Network Web Tool</h2>
      <select
        className="tool-select"
        value={selectedTool}
        onChange={handleToolChange}
      >
        <option value="">Select a tool</option>
        <option value="BurpSuite">BurpSuite</option>
        <option value="OWASP ZAP">OWASP ZAP</option>
        <option value="bettercap">bettercap</option>
        <option value="Immuniweb">Immuniweb</option>
        <option value="zANTI">zANTI</option>
        <option value="MWR Labs Mercury">MWR Labs Mercury</option>
        <option value="Mallory">Mallory</option>
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
