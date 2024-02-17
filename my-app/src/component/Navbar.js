// import React from "react";
import "./Navbar.css";
import Tooldropdown from './Tooldropdown';
import Cwe from './Cwe';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Navbar() {
  const [selectedTool, setSelectedTool] = useState('');
  const [selectedCwe, setSelectedCwe] = useState(null);
  const [cweData, setCWEData] = useState(null)
  const handleCweChange = (event) => {
    setSelectedCwe(event.target.value);
    // You can perform additional actions based on the selected CWE here
  };

  const cweNumbers = [5,6,7,8,9,11,12,13,14,15,16,19,20,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,79, 89, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 156, 157, 146 /* Add more CWE numbers as needed */];
  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
  };

  useEffect(function () {
    if (selectedCwe) {
      console.log('api called of selected cwe')
      axios.get(`http://localhost:4000/getcwe/${selectedCwe}`).then(
        res => {
          setCWEData(res.data)
        }
      )
    }

  }, [selectedCwe]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            {" "}
            <span className="brand-icon">🐞</span> Android Bug Finding{" "}
          </a>
          <div className="Tool">
          <div className="tool1 ">
              <select id="cweDropdown" name="cweDropdown" onChange={handleCweChange} value={selectedCwe || ''}>
                <option value="" >Select a cwe number </option>
                {cweNumbers.map((cwe) => (
                  <option key={cwe} value={cwe}>
                    {cwe}
                  </option>
                ))}
              </select>
            </div>
            <div className="tool">
              <select id="toolDropdown" name="toolDropdown" onChange={(e) => handleToolSelect(e.target.value)}>
                <option value="">Select a tool</option>
                <option value="static">Static Analysis Tool</option>
                <option value="dynamic">Dynamic Analysis Tool</option>
              </select>
            </div>
          
          </div>



          <div className="navbarS" >
            <form className="d">

              <input
                className="form-control   "
                type="search"
                placeholder="Search cwenumber"
                aria-label="Search"
              />
              <button className="btn btn-outline-dark bg-white text-black search-button" type="submit">
                Search
              </button>
            </form>
          </div>


        </div>
      </nav>



      {/* <Tooldropdown selectedTool={selectedTool} /> */}
      <Cwe cweData={cweData} />
      {selectedTool && <Tooldropdown selectedTool={selectedTool} />}
      


    </div>
  );
}
