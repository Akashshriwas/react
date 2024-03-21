// import React from "react";
import "./Navbar.css";
import Tooldropdown from './Tooldropdown';
import Cwe from './Cwe';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
// import StaticToolpage from './StaticToolpage';

export default function Navbar() {
  const [selectedTool, setSelectedTool] = useState('');
  const [selectedCwe, setSelectedCwe] = useState(null);
  const [cweData, setCWEData] = useState(null)
  const navigate = useNavigate()
  const handleCweChange = (event) => {
    setSelectedCwe(event.target.value);
    // You can perform additional actions based on the selected CWE here
  };

  const cweNumbers = [5,6,7,8,9,11,12,13,14,15,16,19,20,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,79, 89, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 156, 157, 146 /* Add more CWE numbers as needed */];
  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    // navigate(`/${tool}`)
  };

  // useEffect(function () {
  //   if (selectedCwe) {
  //     console.log('api called of selected cwe')
  //     axios.get(`http://localhost:4000/getcwe/${selectedCwe}`).then(
  //       res => {
  //         setCWEData(res.data)
  //       }
  //     )
  //   }

  // }, [selectedCwe]);

  const changeCWE = () => {
    if (selectedCwe) {
      console.log('api called of selected cwe')
      axios.get(`http://localhost:4000/getcwe/${selectedCwe}`).then(
        res => {
          console.log(res.data)
          if(!res.data.success){
            setCWEData({success : false, data : {CWE_No : selectedCwe, description : 'This CWE Number does not exist' }  })
          }else{
            setCWEData(res.data)
          }
        }
      )
    }
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <span className="brand-icon">🐞</span> Android Pentesting
          </Link>
          <div className="Tool">
            {/* <div className="tool1 ">
              <select id="cweDropdown" name="cweDropdown" onChange={handleCweChange} value={selectedCwe || ''}>
                <option value="">Select a CWE number</option>
                {cweNumbers.map((cwe) => (
                  <option key={cwe} value={cwe}>
                    {cwe}
                  </option>
                ))}
              </select>
            </div> */}
            <div className="tool">
              <select id="toolDropdown" name="toolDropdown" onChange={(e) => handleToolSelect(e.target.value)}>
                <ul><li>Static Analysis</li></ul>
                <option value="">Category of Tools</option>
                <option value="static"><Link to='/static'>Static Analysis</Link></option>
                <option value="dynamic">Dynamic Analysis</option>
                <option value="malware">Malware Detection</option>
                <option value="reverse">Reverse Engineering</option>
                <option value="network-web">Network/Web</option>
                <option value="pentesting-environments">Pentesting Environments</option>
                <option value="insecure-data-storage">Insecure Data Storage</option>
              </select>
            </div>
          </div>

          <div className="navbarS">
            {/* <form className="d"> */}
              <input
                className="form-control"
                type="search"
                placeholder="Search CWE number"
                aria-label="Search"
                value = {selectedCwe}
                onChange = {(e) => setSelectedCwe(e.target.value)}
              />
              <button className="btn btn-outline-dark bg-white text-black search-button" type="submit" onClick={changeCWE}>
                Search
              </button>
            {/* </form> */}
          </div>
        </div>
      </nav>

    

      {/* <Tooldropdown selectedTool={selectedTool} /> */}
      <Cwe cweData={cweData} />
      {selectedTool && <Tooldropdown selectedTool={selectedTool} />}
    </div>
  );
  
}
