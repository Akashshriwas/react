import React from 'react';

export default function ToolInfo({ toolInfo }) {
  return (
    <div className="tool-info m-3">
      {toolInfo && (
        <div>
          <h3>Tool Information:</h3>
          <p>{toolInfo}</p>
        </div>
      )}
    </div>
  );
}
