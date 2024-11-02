const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Configure storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Set the destination folder for uploads
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name
    }
});

const upload = multer({ storage });

// To hold the course files
const courseFiles = {};

// Endpoint to get all courses and their files
app.get('/courses', (req, res) => {
    res.json(courseFiles);
});

// Endpoint to upload a file
app.post('/upload', upload.single('file'), (req, res) => {
    const courseName = req.body.courseName;

    if (!courseFiles[courseName]) {
        courseFiles[courseName] = []; // Initialize if the course doesn't exist
    }

    const fileInfo = {
        name: req.file.originalname,
        url: `http://localhost:${PORT}/uploads/${req.file.filename}` // URL for accessing the uploaded file
    };

    courseFiles[courseName].push(fileInfo); // Store file info
    res.json({ message: 'File uploaded successfully!' });
});

// Endpoint to delete a file
app.delete('/delete', (req, res) => {
    const { courseName, fileName } = req.body;

    if (courseFiles[courseName]) {
        courseFiles[courseName] = courseFiles[courseName].filter(file => file.name !== fileName);

        // Optionally delete the file from the filesystem
        const filePath = path.join(__dirname, 'uploads', fileName);
        fs.unlink(filePath, (err) => {
            if (err) console.error(err);
        });
        res.json({ message: 'File deleted successfully!' });
    } else {
        res.status(404).json({ message: 'Course or file not found!' });
    }
});

// Serve static files from the uploads folder
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
