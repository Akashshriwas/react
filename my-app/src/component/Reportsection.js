import React from 'react';
import "./Reportsection.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faFileDownload } from '@fortawesome/free-solid-svg-icons';


export default function Reportsections({ reportsections, expandedSections, handleDownload,setExpandedSections }) {
   console.log('Reportsections Data:', reportsections); 
  return (
    <div className="report-sections">
      {reportsections.map((section, index) => (
        <div className="section" key={index}>
          <div
             className={`section-header ${expandedSections[index] ? 'open' : ''}`}
            onClick={() => {
              setExpandedSections((prevExpandedSections) => {
                const updatedExpandedSections = [...prevExpandedSections];
                updatedExpandedSections[index] = !prevExpandedSections[index];
                return updatedExpandedSections;
              });
              console.log(`Section ${index} clicked. expandedSections:`, expandedSections);
              
            }}
          >
            <div className="title">{section.title}</div>
            <div className="toggle-icon">{expandedSections[index] ? '-' : '+'}</div>
            {section.cweNumber && <span className="cwe-number">CWE No: {section.cweNumber}</span>}
          </div>
          {expandedSections[index] && (
                 <div className={`section-content ${expandedSections[index] ? 'open' : ''}`}>
              <pre>{section.content}</pre>
              {section.subSections > 0 && (
                <div className="subsection-header" onClick={(e) => e.stopPropagation()}>
                  {section.subSections} Subsection{section.subSections > 1 ? 's' : ''}:
                  <div
                    className="toggle-icon"
                    onClick={() => {
                      setExpandedSections((prevExpandedSections) => {
                        const updatedExpandedSections = [...prevExpandedSections];
                        updatedExpandedSections[index] = !prevExpandedSections[index];
                        return updatedExpandedSections;
                      });
                    }}
                  >
                    {expandedSections[index] ? '-' : '+'}
                  </div>
                </div>
              )}
              {expandedSections[index] && section.subSections > 0 && (
                <div className="subsection-content">
                   {console.log(`Section ${index} Subsections:`, section.subSections)} {/* Add this line */}
                  {section.subSections.map((subsection, subIndex) => (
                    <div key={subIndex}>{subsection}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      <button className="btnn btn-primary" onClick={handleDownload}>
        <FontAwesomeIcon icon={faFileDownload} /> Download Report
      </button>
    </div>
  );
}
