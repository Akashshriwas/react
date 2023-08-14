import React from 'react';
import "./Reportsection.css";

export default function Reportsections({ reportsections, expandedSections, handleDownload,setExpandedSections }) {
  return (
    <div className="report-sections">
      {reportsections.map((section, index) => (
        <div className="section" key={index}>
          <div
            className="section-header"
            onClick={() => {
              setExpandedSections((prevExpandedSections) => {
                const updatedExpandedSections = [...prevExpandedSections];
                updatedExpandedSections[index] = !prevExpandedSections[index];
                return updatedExpandedSections;
              });
              
            }}
          >
            {expandedSections[index] ? '[-] ' : '[+] '}
            {section.title}
            {section.cweNumber && <span className="cwe-number">CWE No: {section.cweNumber}</span>}
          </div>
          {expandedSections[index] && (
            <div className="section-content">
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
        Download Report
      </button>
    </div>
  );
}
