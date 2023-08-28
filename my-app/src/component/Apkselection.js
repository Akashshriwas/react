import React from 'react';
import "./Apkselection.css";

export default function ApkSelection({
  selectedApks,
  selectedApk,
  apkInfo,
  handleApkSelection,
  handleDropdownSelection,
  handleRunClick,
  isRunning, // Add isRunning prop
  selectedDropdownItem,
  handleApkDelete,
}) {
  console.log('ApkInfo in frontend ', apkInfo)
  return (
    <div className="file-input m-3 text-bar-container animate__animated animate__fadeIn">
      <input type="file" accept=".apk" onChange={handleApkSelection} id="file-input" className="custom-file-input" />

      {apkInfo && (
        <div className="apk-info">
          <h3>APK Information:</h3>
          <p>Package Name: {apkInfo.name}</p>
          <p>Version Name: {apkInfo.versionName}</p>
          <p>Permissions: {apkInfo && apkInfo.permissions ? apkInfo.permissions.join(', ') : 'N/A'}</p>
          {/* Add more relevant APK information */}
        </div>
      )}

      <button
        className={`btn1 btn-primary m-3 ${isRunning ? 'disabled' : ''} animate__animated animate__fadeIn`}
        onClick={handleRunClick}
        disabled={isRunning || !apkInfo}
      >
        {isRunning ? 'Running...' : 'Run'}
      </button>

      {selectedApks.length > 0 && (
        <div className="selected-apks">
          <h3>Selected APKs:</h3>
          <select value={selectedDropdownItem.name} onChange={handleDropdownSelection}>
            <option key={-1} value="selectapk">Select APK</option>
            {selectedApks.map((apk, index) => (
              <option key={index} value={apk.name}>
                {apk.name}
              </option>
            ))}
          </select>

          <ul className="apk-list">
  {selectedApks.map((apk, index) => (
    <li key={index}>
      {apk.name}{' '}
      <span onClick={() => handleApkDelete(apk)} className="cross-sign">&#x2716;</span>
    </li>
  ))}
</ul>
        </div>
      )}
    </div>
  );
}
