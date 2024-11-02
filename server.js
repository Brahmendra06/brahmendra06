const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json());
app.use(express.static('uploads')); // Serve uploaded files

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Folder to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Rename file to avoid name conflicts
    }
});

const upload = multer({ storage });

// Store course files in an object
const courseFiles = {};

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
    const courseName = req.body.courseName;
    const file = { name: req.file.originalname, url: `/${req.file.filename}` };

    if (!courseFiles[courseName]) {
        courseFiles[courseName] = []; // Initialize array for new course
    }

    courseFiles[courseName].push(file); // Add file to the course
    res.json({ message: 'File uploaded successfully' });
});

// Fetch courses
app.get('/courses', (req, res) => {
    res.json(courseFiles); // Send courseFiles object
});

// Delete endpoint
app.delete('/delete', (req, res) => {
    const { courseName, fileName } = req.body;
    
    if (courseFiles[courseName]) {
        courseFiles[courseName] = courseFiles[courseName].filter(file => file.name !== fileName);
        res.json({ message: 'File deleted successfully' });
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
