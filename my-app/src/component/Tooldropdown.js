import React, { useState } from 'react';
import { Routes, Route, BrowserRouter as Router, Outlet } from 'react-router-dom';
import StaticToolpage from './StaticToolpage';
import DynamicToolPage from './DynamicToolPage';
import './Tooldropdown.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Tooldropdown />} />
        <Route path="/static-tool" element={<StaticToolpage />} />
        <Route path="/dynamic-tool" element={<DynamicToolPage />} />
      </Routes>
    </Router>
  );
}

function Tooldropdown() {
  const [selectedTool, setSelectedTool] = useState('');

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
  };

  let toolContent = null;

  if (selectedTool === 'static') {
    toolContent = <StaticToolpage />;
  } else if (selectedTool === 'dynamic') {
    toolContent = <DynamicToolPage />;
  }

  return (
    <div className="page-container">
    <div className='container'>
      <h1>APK Analysis Tool</h1>
      <select onChange={(e) => handleToolSelect(e.target.value)}>
        <option value="">Select a tool</option>
        <option value="static">Static Analysis Tool</option>
        <option value="dynamic">Dynamic Analysis Tool</option>
      </select>

      {toolContent}

      <Outlet /> {/* This will render nested routes */}
    </div>
    </div>
  );
}