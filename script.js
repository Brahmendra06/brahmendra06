const courseFiles = {}; // Object to store files associated with courses
let isTeacherLoggedIn = false; // Flag to check if the teacher is logged in

// Function to handle teacher login
function loginTeacher(event) {
    event.preventDefault(); // Prevent form submission
    const passwordInput = document.getElementById('password').value;
    
    // Check if the entered password is correct
    if (passwordInput === '9014') {
        isTeacherLoggedIn = true; // Set login status
        document.getElementById('upload-section').style.display = 'block'; // Show upload section
        document.getElementById('login-section').style.display = 'none'; // Hide login section
        loadCourses(); // Load courses to see existing uploads
    } else {
        alert('Incorrect password. Please try again.'); // Alert on incorrect password
    }
}

// Function to load courses from backend
function loadCourses() {
    fetch('http://localhost:3000/courses')
        .then(response => response.json())
        .then(data => {
            Object.assign(courseFiles, data); // Update courseFiles object with fetched data
            displayUploadedFiles(); // Display uploaded files
        })
        .catch(error => console.error('Error loading courses:', error));
}

// Function to open course modal
function openCourseModal(courseName) {
    document.getElementById('modal-title').innerText = courseName;
    document.getElementById('modal-description').innerText = `Details about ${courseName}`;
    
    // Populate course materials
    const materialsList = document.getElementById('course-materials');
    materialsList.innerHTML = ''; // Clear previous items

    // Check if there are files for the selected course
    if (courseFiles[courseName] && courseFiles[courseName].length > 0) {
        courseFiles[courseName].forEach((file) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                ${file.name} 
                <a href="${file.url}" download>Download</a>
                <button onclick="deleteFile('${courseName}', '${file.name}')">Delete</button>
            `;
            materialsList.appendChild(listItem);
        });
    } else {
        materialsList.innerHTML = '<li>No materials uploaded yet.</li>';
    }

    document.getElementById('course-modal').style.display = 'block';
}

// Function to close course modal
function closeCourseModal() {
    document.getElementById('course-modal').style.display = 'none';
}

// Function to handle file upload
function uploadFile(event) {
    event.preventDefault(); // Prevent form submission
    const fileInput = document.getElementById('file-input');
    const courseName = document.getElementById('course-name').value;

    const formData = new FormData(); // Create a FormData object
    formData.append('file', fileInput.files[0]); // Append the file
    formData.append('courseName', courseName); // Append course name

    // Make AJAX request to upload the file
    fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        loadCourses(); // Reload courses to see the new upload
    })
    .catch(error => console.error('Error:', error));
}

// Function to delete a file
function deleteFile(courseName, fileName) {
    fetch('http://localhost:3000/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseName, fileName }) // Send course name and file name
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        loadCourses(); // Reload courses to see updated file list
    })
    .catch(error => console.error('Error deleting file:', error));
}

// Function to display uploaded files
function displayUploadedFiles() {
    const uploadedFilesDiv = document.getElementById('uploaded-files');
    uploadedFilesDiv.innerHTML = ''; // Clear previous content

    // Iterate through the courseFiles object and display files
    for (const courseName in courseFiles) {
        if (courseFiles.hasOwnProperty(courseName)) {
            courseFiles[courseName].forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.innerText = `Uploaded "${file.name}" to "${courseName}"`;
                uploadedFilesDiv.appendChild(fileItem);
            });
        }
    }
}
