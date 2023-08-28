const express = require('express');
const app = express();
const cors = require('cors');
// const MongoDB = require('./db');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const path = require('path');
const fs = require('fs'); 
// const reportDirectory = path.join(__dirname, 'reports');

// const stagingAreaDirectory = 'staging_area/';
const fileMapping = {}; // Maintain a mapping of original filenames to unique identifiers




// MongoDB();
const maxFileCount = 10; // Maximum number of files to store
const uploadDirectory = 'uploads/';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const { exec } = require('child_process');


app.post('/run-command', (req, res) => {
  const { tool, apkInfo } = req.body;
  console.log('apkinfo:', apkInfo);
  let toolPath = '';
  let command = '';

  if (tool === 'Androwarn') {
    toolPath = 'C:/Users/HP/Desktop/androwarn/androwarn.py';
    command = `python ${toolPath} -i "${apkInfo.filePath.replace(/\\/g, '\\\\')}" -r txt -v 1`;

    console.log(apkInfo.filePath); // Log the filePath for debugging purposes
  } else if (tool === 'Androbugs') {
    toolPath = 'C:/Users/Admin/Desktop/androbugs2/androbugs.py';
    command = `python "${toolPath}" -f "${apkInfo.filePath.replace(/\\/g, '\\\\')}"`;

  } else if (tool === 'Mobsf') {
    toolPath = 'C:/path/to/mobsf/mobsf.py';
    command = `python "${toolPath}" -f "${apkInfo.filePath}"`;
  } else {
    return res.status(400).json({ error: 'Invalid tool' });
  }

  console.log('Tool Path:', toolPath);
  console.log('Command:', command);

  exec(command, { stdio: 'pipe' }, (error, stdout, stderr) => {
    // ...
  
    // Generate a unique file name\
    // console.log(stdout)
    // console.log('\n\n')
    let str = "backend"
    let ind = stdout.indexOf(str)+str.length+1
    let fileName = stdout.slice(ind)
    if(tool == 'Androwarn'){
      var commaInd = fileName.indexOf('\'')
    }else if(tool == 'Androbugs'){
      var commaInd = fileName.indexOf(' >>>')
    }
    fileName = fileName.slice(0, commaInd)
    console.log('filename length : ', fileName.length)
    console.log('\' index : ', commaInd)
    console.log('file name : ', fileName)
    let filePath = path.join(__dirname, fileName)
    console.log('file path : ', filePath)
    // console.log(__dirname)


    if (fs.existsSync(filePath)) {
      // Set the appropriate headers for file download
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="downloaded_file.txt"');
  
      // Stream the file to the client
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      res.status(404).json({ error: 'File not found' });
    }




// Sanitize the generated file name
// const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9]/g, '_') + '.txt';

// // Construct the full file path within the report directory
// const reportFilePath = path.join(reportDirectory, sanitizedFileName);

// console.log('Sanitized File Name:', sanitizedFileName);
// console.log('Report File Path:', reportFilePath);

// // ... (rest of the code)

// if (fs.existsSync(reportFilePath)) {
//   // Set the appropriate headers for file download
//   res.setHeader('Content-Type', 'text/plain');
//   res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFileName}"`);

//   // Stream the file to the client
//   const fileStream = fs.createReadStream(reportFilePath);
//   fileStream.pipe(res);
// } else {
//   res.status(404).json({ error: 'File not found' });
// }

    // res.download(filePath, 'downloaded_file.txt', (err) => {
    //   if (err) {
    //     console.error('Error downloading file:', err);
    //     res.status(500).send('Error downloading file');
    //   }
    // });
    // const timestamp = Date.now();
    // const reportFileName = `report_${timestamp}.txt`;
  
    // // Specify the directory where the report files will be stored
    // const reportDirectory = 'C:/Users/Admin/Desktop/react/phone/backend'; // Replace with the actual directory path
  
    // // Construct the full file path
    // const reportFilePath = path.join(reportDirectory, reportFileName);
  
    // // Generate the text file and write the content
    // // console.log('reportFilePath', reportFilePath)
    // res.json({ result: 'Command executed successfully', reportFilePath });
  });
  
});
function deleteOldFiles() {
  fs.readdir(uploadDirectory, (err, files) => {
    if (err) {
      console.error('Error reading upload directory:', err);
      return;
    }

    // Sort the files by modified date in ascending order
    files.sort((a, b) => {
      return fs.statSync(uploadDirectory + a).mtime.getTime() - fs.statSync(uploadDirectory + b).mtime.getTime();
    });

    // Calculate the number of files to delete
    const filesToDeleteCount = files.length - maxFileCount;

    // Delete older files if the count exceeds the limit
    if (filesToDeleteCount > 0) {
      const filesToDelete = files.slice(0, filesToDeleteCount);

      filesToDelete.forEach((file) => {
        fs.unlink(uploadDirectory + file, (err) => {
          if (err) {
            console.error('Error deleting file:', file, err);
          } else {
            console.log('Deleted file:', file);
          }
        });
      });
    }
  });
}



app.post('/upload-apk', upload.single('apkFile'), (req, res) => {
  if (req.file) {
    // File uploaded successfully
    const { originalname, path, mimetype } = req.file;
    console.log(path)
    // Process the uploaded APK file and extract information
    // Implement your APK analysis logic here to extract the necessary information
    // You can use libraries like APKTool or AndroGuard to extract APK information

    // Example implementation using mock APK information
    const apkInfo = {
      packageName: 'com.example.app',
      versionName: '1.0',
      permissions: ['android.permission.CAMERA', 'android.permission.ACCESS_FINE_LOCATION'],
      filePath: path, // Assign the file path to the filePath property
      // Add more relevant APK information
    };

    res.json({ apkInfo });
  } else {
    // No file uploaded
    res.status(400).json({ error: 'No file uploaded' });
  }
  deleteOldFiles();
});


app.post('/delete-apk', (req, res) => {
  const { apkIdentifier } = req.body;

  if (!apkIdentifier) {
    return res.status(400).json({ error: 'APK identifier is missing' });
  }
  const pathTillNow =  process.cwd()
  // Construct the file path based on the unique identifier
  const filePath = path.join(pathTillNow, uploadDirectory, apkIdentifier);
  console.log('File path 208 : ', filePath)
  console.log('Upload directory : ', uploadDirectory)
  console.log('Deleting file:', filePath);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', filePath, err);
      return res.status(500).json({ success : false, error: 'Error deleting file' });
    }

    console.log('Deleted file:', filePath);

    // You can perform additional tasks here if needed
    // ...

    res.json({ success : true, message: 'APK deleted successfully' });
  });
});





// app.post('/upload-apk', upload.single('apkFile'), (req, res) => {
//   if (req.file) {
//     // File uploaded successfully
//     const { originalname, path: uploadedFilePath, mimetype } = req.file;

//     // Process the uploaded APK file and extract information
//     // ...

//     // Example implementation using mock APK information
//     const apkInfo = {
//       packageName: 'com.example.app',
//       versionName: '1.0',
//       permissions: ['android.permission.CAMERA', 'android.permission.ACCESS_FINE_LOCATION'],
//       filePath: uploadedFilePath, // Assign the uploaded file path to the filePath property
//       // Add more relevant APK information
//     };

//     // Move the uploaded file to the staging area directory
//     const newFilePath = path.join(__dirname, stagingAreaDirectory, originalname);
//     fs.renameSync(uploadedFilePath, newFilePath); // Move the file

//     res.json({ apkInfo });
//   } else {
//     // No file uploaded
//     res.status(400).json({ error: 'No file uploaded' });
//   }
//   deleteOldFiles();
// });


// app.post('/upload-apk', upload.single('apkFile'), (req, res) => {
//   if (req.file) {
//     // File uploaded successfully
//     const { originalname, path: uploadedFilePath, mimetype } = req.file;

//     // Process the uploaded APK file and extract information
//     // ...
//     const apkInfo = {
//             packageName: 'com.example.app',
//             versionName: '1.0',
//             permissions: ['android.permission.CAMERA', 'android.permission.ACCESS_FINE_LOCATION'],
//             filePath: uploadedFilePath, // Assign the uploaded file path to the filePath property
//             // Add more relevant APK information
//           };
      

//     // Generate a sanitized file name
//     const sanitizedFileName = apkInfo.packageName.replace(/\s+/g, '_') + '_report.txt';

//     // Construct the file path within the report directory
//     const filePath = path.join(reportDirectory, sanitizedFileName);

//     // Move the uploaded file to the staging area directory
//     const newFilePath = path.join(__dirname, stagingAreaDirectory, originalname);
//     fs.renameSync(uploadedFilePath, newFilePath); // Move the file

//     // Update the filePath property in the apkInfo object
//     apkInfo.filePath = filePath; // Use the sanitized file path

//     res.json({ apkInfo });
//   } else {
//     // No file uploaded
//     res.status(400).json({ error: 'No file uploaded' });
//   }
//   deleteOldFiles();
// });



app.get('/download-report', (req, res) => {
  const { fileName } = req.query;

  if (!fileName) {
    return res.status(400).json({ error: 'File name is missing' });
  }

  // Specify the directory where the report files are stored
  const reportDirectory = 'C:/Users/HP/Desktop/react/phone/backend'; // Replace with the actual directory path

  // Construct the full file path
  const filePath = path.join(reportDirectory, fileName);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Set the appropriate headers and trigger file download
    res.download(filePath, fileName);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});



const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});