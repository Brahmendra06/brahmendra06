const courseFiles = JSON.parse(localStorage.getItem('courseFiles')) || {}; // Load files from localStorage
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
        displayUploadedFiles(); // Show uploaded files
    } else {
        alert('Incorrect password. Please try again.'); // Alert on incorrect password
    }
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
        courseFiles[courseName].forEach((file, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                ${file.name} 
                <a href="${file.url}" download>Download</a>
                <button onclick="deleteFile('${courseName}', ${index})">Delete</button>
            `;
            materialsList.appendChild(listItem);
        });
    } else {
        materialsList.innerHTML = '<li>No materials uploaded yet.</li>';
    }

    document.getElementById('course-modal').style.display = 'block';
}

// Function to handle file upload
function uploadFile(event) {
    event.preventDefault(); // Prevent form submission
    const fileInput = document.getElementById('file-input');
    const courseName = document.getElementById('course-name').value;

    // Ensure the course exists in the courseFiles object
    if (!courseFiles[courseName]) {
        courseFiles[courseName] = []; // Initialize an empty array for the course if it doesn't exist
    }

    const file = fileInput.files[0]; // Get the uploaded file
    const fileUrl = URL.createObjectURL(file); // Create a URL for the file
    courseFiles[courseName].push({ name: file.name, url: fileUrl }); // Store the file info

    // Save updated courseFiles to localStorage
    localStorage.setItem('courseFiles', JSON.stringify(courseFiles));

    // Display uploaded files in the main section
    displayUploadedFiles(courseName, file);

    // Reset the form
    document.getElementById('upload-form').reset();
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

// Function to delete a file
function deleteFile(courseName, index) {
    // Remove the file from the courseFiles object
    if (courseFiles[courseName] && courseFiles[courseName].length > index) {
        courseFiles[courseName].splice(index, 1); // Remove the file from the array

        // Update localStorage after deletion
        localStorage.setItem('courseFiles', JSON.stringify(courseFiles));
    }
    
    // Update the displayed course materials
    openCourseModal(courseName); // Refresh the modal to reflect changes
}

// Function to close course modal
function closeCourseModal() {
    document.getElementById('course-modal').style.display = 'none';
}
