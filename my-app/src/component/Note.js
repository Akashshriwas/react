import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './action.css';
import 'animate.css';
// import { Accordion, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import cwedata from '../cwe.json';
import Stepbyguide from './Stepbyguide';
import Dropdown from './Dropdown';
import Toolinfo from './Toolinfo';
import Reportsection from './Reportsection';
import Apkselection from './Apkselection'

export default function Note() {
  const [selectedItem, setSelectedItem] = useState('');
  const [result, setResult] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [toolInfo, setToolInfo] = useState('');
  const [reportFilePath, setReportFilePath] = useState('');
  const [apkInfo, setApkInfo] = useState(null); // State to store APK information
  const [reportContent, setReportContent] = useState('');
  const [reportSections, setReportSections] = useState([]);
  const [expandedSections, setExpandedSections] = useState([true]);
  const [selectedApks, setSelectedApks] = useState([]);
  const [selectedDropdownItem, setSelectedDropdownItem] = useState('');
  const [selectedApk, setSelectedApk] = useState(null);
  
  

  // const [reportAlreadyCached, setReportAlreadyCached] = useState(false);
  // const [apkUploaded, setApkUploaded] = useState(false);



  const handleItemClick = (item) => {
    setSelectedItem(item);
    setSelectedDropdownItem(item);
    setToolInfo(getToolInfo(item));
    setReportSections([]);
    setReportContent('');

    setExpandedSections((prevExpandedSections) => {
      const resetExpandedSections = prevExpandedSections.map(() => false);
      resetExpandedSections[0] = true; // Expand the first section
      return resetExpandedSections;
    });

    if (item === 'Androwarn') {
      setToolInfo(
        <>
            <h3>Androwarn</h3>
            <p>
              Androwarn is an open-source static code analyzer designed specifically for detecting and assessing the security risks in Android applications. It is commonly used by security researchers, application developers, and penetration testers to identify potential vulnerabilities and weaknesses in Android apps.
            </p>
            <p>
              Key Features:
            </p>
            <ul>
              <li>Detects insecure data storage</li>
              <li>Identifies permission misuse</li>
              <li>Finds potential component exposure</li>
              <li>Identifies other security vulnerabilities</li>
            </ul>
          </>
      );
    } else if (item === 'Androbugs') {
      setToolInfo(
        <>
        <h3>AndroBugs</h3>
        <p>
          AndroBugs uses static analysis techniques to inspect an Android app's code and identify issues such as insecure data storage, permissions misuse, component exposure, and other security vulnerabilities. By identifying these weaknesses, developers can take appropriate measures to secure their applications and protect user data.
        </p>
        <p>
          Key Features:
        </p>
        <ul>
          <li>Detects insecure data storage</li>
          <li>Identifies permission misuse</li>
          <li>Finds potential component exposure</li>
          <li>Identifies other security vulnerabilities</li>
        </ul>
      </>
      );
    } else if (item === 'Mobsf') {
      setToolInfo(
        'MOBSF (Mobile Security Framework) is an open-source framework and automated tool designed for mobile app security testing. It assists in identifying potential security vulnerabilities and weaknesses in mobile applications. MOBSF is primarily focused on Android and iOS platforms.'
      );
    } else {
      setToolInfo('');
    }
  };

  // ################ on change function for choose file button #######################
  const handleApkSelection = async (event) => {
    console.log('--------------- Running handleApkd selection method ------------------')
    const choosedFile = event.target.files[0];
    console.log('apk selected in handle apk selection:', choosedFile);
    console.log('selected apks : ', selectedApks)
    if (choosedFile) {
        console.log('prev apks:', selectedApks);
        const nameOfSelectedApk = choosedFile.name
        let temp = selectedApks.filter((apk) => {
          return apk.name == nameOfSelectedApk
        })
        if(temp.length > 0) {
          console.log('File already uploaded')
          const userChoice = window.confirm('Duplicate files, wanna delete the existing file?')
          if(!userChoice){
            return;
          }
          handleApkDelete(temp[0])
          // let copyAPK = selectedApk;
          // copyAPK.name = userChoice
          // return;
        }
        const formData = new FormData();
        formData.append('apkFile', choosedFile);

        try {
          const response = await axios.post('http://localhost:4000/upload-apk', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('File uploaded successfully in the server :', response.data);
          const apkInfo = response.data.apkInfo;
          const pre = "uploads\\"
          let fileServerName = apkInfo.filePath;
          fileServerName = fileServerName.slice(fileServerName.indexOf(pre) + pre.length)

          console.log('APK Info:', apkInfo);
          if (selectedApks.length >= 10) {
            // Show an alert
            alert('You have reached the limit of 10 selected APKs. Delete some APKs to add more.');
            
            // return prevSelectedApks; // Return the existing array without changes
            // } else if (!apkAlreadySelected) {
              //   return [...prevSelectedApks, selectedApk];
            // } else {
            //   console.log('APK with the same name already selected.');
            //   return prevSelectedApks; // Return the existing array without changes
            // }
          }else{
                
            choosedFile['fileServerName'] = fileServerName
            choosedFile['packageName'] = apkInfo.packageName
            choosedFile['versionName'] = apkInfo.versionName
            choosedFile.filePath = apkInfo.filePath
            choosedFile.permissions = apkInfo.permissions
            console.log('After adding server response : ', choosedFile)
            // setApkInfo(selectedApk);
            setSelectedApk(choosedFile)
            const temp = [...selectedApks, choosedFile]
            console.log('temp : ', temp)
            setSelectedDropdownItem(choosedFile);
            setSelectedApks((prev) => ([...prev, choosedFile]))
          }
          } catch (error) {
            console.error('Error uploading file:', error);
          }
        // setSelectedDropdownItem(apkSelected);
        // Check if the APK with the same name is already selected
        // const apkAlreadySelected = prevSelectedApks.some((apk) => apk.name === selectedApk.name);
  
        
    }
  };
  
  const handleApkDelete = async (apkToDelete) => {
    try {
      console.log('deleting apk : ', apkToDelete)
      // Check if the APK object is missing or doesn't have necessary properties
      if (!apkToDelete) {
        console.error('Invalid APK object:', apkToDelete);
        return;
      }
  
      // Send a delete request to the backend
      const response = await axios.post('http://localhost:4000/delete-apk', {
        apkIdentifier: apkToDelete.fileServerName,
      });
      if(response.success == false){
        alert('Error while deleting file')
        return;
      }

      console.log('Deleted APK:', apkToDelete.name);
      console.log('Response from delete:', response.data);
      const updatedList = selectedApks.filter((apk) => apk.name != apkToDelete.name)
      if(selectedApk.name == apkToDelete){
        setSelectedApk(null);
      }
      setSelectedApks(updatedList)
      // Update the list of selected APKs here if needed
    } catch (error) {
      console.error('Error deleting APK:', error);
    }
  };
  
  
  
  
  


  // ############################## Changing dropdown item ############################## 
  const handleDropdownSelection = async (event) => {
    console.log('--------------- Running handle dropdown selection method ------------------')
    // console.log('Dropdown value changed !!!!!!!!!!!!')
    const selectedApkIndex = event.target.selectedIndex - 1;
    console.log('index : ', selectedApkIndex)
    const apkSelected = selectedApks[selectedApkIndex]
    console.log('apk selected : ', apkSelected)
    const name = apkSelected.name

    // console.log(event.target.selectedIndex)
    // console.log('apk selected in handle dropdown :', selectedApk);

    // to select apk in the main dropdown
    setSelectedApk(apkSelected);
    // setApkInfo(apkInfo);
    // const formData = new FormData();
    // formData.append('apkFile', apkSelected);

    // try {
    //   const response = await axios.post('http://localhost:4000/upload-apk', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   });
    //   console.log('File uploaded successfully:', response.data);
    //   const apkInfo = response.data.apkInfo;
    //   console.log('APK Info:', apkInfo);
    // } catch (error) {
    //   console.error('Error uploading file:', error);
    // }
    setSelectedDropdownItem(apkSelected);
  }

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain' });

    // Create a temporary URL for the Blob
    const blobUrl = URL.createObjectURL(blob);

    // Create an anchor element
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'downloaded_file.txt'; // Specify the filename

    // Programmatically click the link to start the download
    link.click();

    // Clean up the temporary URL and anchor element
    URL.revokeObjectURL(blobUrl);
    link.remove();
  };
  // Assuming you have the reportContent from the server response
// const reportContent = response.data.reportContent;

// Store the reportContent in the cache using the selectedDropdownItem.name as the key

  // Function to check if the report is already cached for the selected APK
  // const checkReportCache = () => {
  //   const cachedReport = localStorage.getItem(selectedDropdownItem.name);
  //   return cachedReport !== null;
  // };







  const handleRunClick = () => {
    console.log(selectedApk)
    if (!selectedApk) {
      console.error('APK file is not uploaded yet.');
      return;
    }

    // const cachedReport = localStorage.getItem(selectedDropdownItem.name);

    // if (cachedReport) {
    //   // If the report is already cached, display it and show a notification
    //   setReportContent(cachedReport);
    //   setReportAlreadyCached(true);
    //   alert('The report is already generated and available for download.');
    //   return;
    // }

    // const sampleCachedReport = "   ";
   
    // const selectedApkInfo = selectedApks.find((apk) => apk.name === selectedItem);
    // const selectedApk = selectedApks.find((apk) => apk === selectedDropdownItem);

    setIsRunning(true);
    axios
      .post('http://localhost:4000/run-command', {
        tool: selectedItem,
        apkInfo: selectedApk,
      })
      .then((response) => {
        // console.log(response.data);
        setResult(response.data || 'No result available');
        // console.log('file path : ', response.data.reportFilePath)
        // console.log(response.data)
        generateSections(response.data); // Generate sections from the report content
        // if (response.data.reportFilePath) {
        //   axios
        //     .get(`http://localhost:4000/${response.data.reportFilePath}`)
        //     .then((response) => {
        //       console.log('Report Content:', response.data);
        //       setReportContent(response.data);
        //     })
        //     .catch((error) => {
        //       console.error('Error fetching report content:', error);
        //     });
        // }
        // if (response.data.reportContent) {
        //   localStorage.setItem(selectedDropdownItem.name, response.data.reportContent);
        //   setReportAlreadyCached(true);

        // }

      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsRunning(false);
      });
      // localStorage.setItem(selectedDropdownItem.name, sampleCachedReport);
  };
  // useEffect(() => {
  //   const cachedReport = localStorage.getItem(selectedDropdownItem.name);

  //   if (cachedReport) {
  //     setReportContent(cachedReport);
  //     setReportSections([]); // Reset sections since they may not match the cached report
  //     setReportAlreadyCached(true);
  //   } else {
  //     setReportContent('');
  //     setReportAlreadyCached(false);
  //   }
  // }, [selectedDropdownItem.name]);


  // const isReportCached = () => {
  //   // Check if there is a cached report for the selected APK
  //   const cachedReport = localStorage.getItem(selectedDropdownItem.name);
  //   return cachedReport !== null;
  // };

  const generateSectionsForAndrowarn = (reportContent) => {
    const sectionDelimiter = '[+]';
    const subSectionDelimiter = '[.]';
    const sections = reportContent.split(sectionDelimiter);
    const parsedSections = [];
  
    for (let i = 1; i < sections.length; i++) {
      const sectionContent = sections[i].trim();
      const subSections = sectionContent.split(subSectionDelimiter).map(subsection => subsection.trim());
  
      if (subSections.length > 1) {
        const title = subSections.shift(); // Remove the title from subSections
        const content = subSections.join('\n'); // Join the remaining subSections as content
        parsedSections.push({ title, content, subSections });
      } else {
        // If there are no subSections, treat the entire sectionContent as the title and content
        parsedSections.push({ title: sectionContent, content: sectionContent, subSections: [] });
      }
    }
  
    return parsedSections;
  };

  const sampleReportContent = `
[+] Section 1
[.] Subsection 1.1
[.] Subsection 1.2
[+] Section 2
[.] Subsection 2.1
`;

const parsedSections = generateSectionsForAndrowarn(sampleReportContent);
console.log('Parsed Sections:', parsedSections);

  
  
  


  const generateSectionsForAndrobugs = (reportContent) => {
    const delimiter = /(\[Critical\]|\[Warning\]|\[Notice\]|\[Info\])/;
    const sections = reportContent.split(delimiter);
    const parsedSections = [];

    let currentTitle = '';
    let combinedContent = '';
    // console.log('sections : ', sections)

    for (let i = 1; i < sections.length; i += 2) {
      let title = sections[i].trim();
      let content = sections[i + 1].trim();
      title = title.slice(1, title.length-1)
      
      // if(cwedata[title]){ 
      //   console.log('title', title)
      //   // console.log(`content :${content}`)
        // console.log(JSON.stringify(content))
      //   // console.log('json', cwedata[title])
      //   // console.log('json', cwedata[title][content])
      //   // console.log('json : ', cwedata[title][content]["CWE_No"] )
      // }
      // console.log('json', cwedata[title])

      ////////cwe data
      // if (currentTitle === title) {
      //   // If the title is the same as the previous section, append the content
      //   if(cwedata[title] && cwedata[title][content]){
      //     console.log('Number : ', cwedata[title][content]["CWE_No"])
      //     content = cwedata[title][content]["CWE_No"] + " " + content
      //   }
      //   combinedContent += '\n' + content;
      // } else {


        
        // If the title is different, push the previous section and start a new one
      //   if (currentTitle) {
      //     if(cwedata[title] && cwedata[title][content]){
      //       console.log('Number : ', cwedata[title][content]["CWE_No"])
      //       content = cwedata[title][content]["CWE_No"] + " " + content
      //     }
      //     parsedSections.push({ title: currentTitle, content: combinedContent });
      //   }
      //   currentTitle = title;
      //   if(cwedata[title] && cwedata[title][content]){
      //     console.log('Number : ', cwedata[title][content]["CWE_No"])
      //     content = cwedata[title][content]["CWE_No"] + " " + content
      //   }
      //   combinedContent = content;
      // }


      // if(cwedata[title]){
      //   content = cwedata[title][content] + " --- " + content
      // }
    }

    // Push the last section after the loop
    if (currentTitle) {
      parsedSections.push({ title: currentTitle, content: combinedContent });
    }

    return parsedSections;
  };


  const generateSections = (reportContent) => {
    let delimiter;
    let titleRegex;
    let parsedSections;
  
    if (selectedItem === 'Androwarn') {
      parsedSections = generateSectionsForAndrowarn(reportContent);
    } else if (selectedItem === 'Androbugs') {
      parsedSections = generateSectionsForAndrobugs(reportContent);
    } else {
      delimiter = '[+]'; // Default delimiter
      titleRegex = /^(.+)/;
    }

    // const cweNumbers = cwedata[selectedItem]; // This will give you the CWE numbers for critical and warning points

    // // Add CWE numbers to each section
    // parsedSections.forEach((section) => {
    //   const cweNumber = cweNumbers[section.title];
    //   if (cweNumber) {
    //     section.cweNumber = cweNumber;
    //   }
    // });
  
    // ...
  
    setReportSections(parsedSections);
    setExpandedSections(new Array(parsedSections.length).fill(false));
    return parsedSections;
  };
  


  const getToolInfo = () => {
    // Return the corresponding tool information based on the selected item
    // switch (selectedItem) {
    //   case 'Androwarn':
    //     return (
    //       <>
    //         <h3>Androwarn</h3>
    //         <p>
    //           Androwarn is an open-source static code analyzer designed specifically for detecting and assessing the security risks in Android applications. It is commonly used by security researchers, application developers, and penetration testers to identify potential vulnerabilities and weaknesses in Android apps.
    //         </p>
    //         <p>
    //           Key Features:
    //         </p>
    //         <ul>
    //           <li>Detects insecure data storage</li>
    //           <li>Identifies permission misuse</li>
    //           <li>Finds potential component exposure</li>
    //           <li>Identifies other security vulnerabilities</li>
    //         </ul>
    //       </>
    //     );

    //   case 'Androbugs':
    //     return (
    //       <>
    //         <h3>AndroBugs</h3>
    //         <p>
    //           AndroBugs uses static analysis techniques to inspect an Android app's code and identify issues such as insecure data storage, permissions misuse, component exposure, and other security vulnerabilities. By identifying these weaknesses, developers can take appropriate measures to secure their applications and protect user data.
    //         </p>
    //         <p>
    //           Key Features:
    //         </p>
    //         <ul>
    //           <li>Detects insecure data storage</li>
    //           <li>Identifies permission misuse</li>
    //           <li>Finds potential component exposure</li>
    //           <li>Identifies other security vulnerabilities</li>
    //         </ul>
    //       </>
    //     );

    //   case 'Mobsf':
    //     return (
    //       <>
    //         <h3>MOBSF (Mobile Security Framework)</h3>
    //         <p>
    //           MOBSF is an open-source framework and automated tool designed for mobile app security testing. It assists in identifying potential security vulnerabilities and weaknesses in mobile applications, primarily focused on Android and iOS platforms.
    //         </p>
    //         <p>
    //           Key Features:
    //         </p>
    //         <ul>
    //           <li>Comprehensive security testing for mobile apps</li>
    //           <li>Supports both Android and iOS platforms</li>
    //           <li>Identifies security vulnerabilities and weaknesses</li>
    //           <li>Generates detailed security reports</li>
    //         </ul>
    //       </>
    //     );

    //   default:
    //     return '';
    // }
  };


  return (
    <div className="dropdown-container">
      <Stepbyguide />
      <Dropdown selectedItem={selectedItem} handleItemClick={handleItemClick} isRunning={isRunning}/>
      <Toolinfo toolInfo={toolInfo} />
      <Apkselection
        selectedApks={selectedApks}
        selectedApk={selectedApk}
        apkInfo={selectedApk}
        handleApkSelection={handleApkSelection}
        handleDropdownSelection={handleDropdownSelection}
        handleRunClick={handleRunClick}
        isRunning={isRunning}
        selectedDropdownItem={selectedDropdownItem}
        handleApkDelete={handleApkDelete}
      />
      {/* <ResultDisplay result={result} isRunning={isRunning} /> */}
      <Reportsection
        reportsections={reportSections}
        expandedSections={expandedSections}
        setExpandedSections={setExpandedSections}
        handleDownload={handleDownload}
      />
      {/* <ReportContent reportContent={reportContent} /> */}
    </div>
  );
}