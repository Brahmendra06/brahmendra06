function calculateAttendance() {
    const lectureAttendance = parseFloat(document.getElementById("lectureAttendance").value) || null;
    const tutorialAttendance = parseFloat(document.getElementById("tutorialAttendance").value) || null;
    const practicalAttendance = parseFloat(document.getElementById("practicalAttendance").value) || null;
    const seminarAttendance = parseFloat(document.getElementById("seminarAttendance").value) || null;

    const result = document.getElementById("result");
    const message = document.getElementById("message");
    const belowGif = document.getElementById("belowGif");
    const aboveGif = document.getElementById("aboveGif");

    const attendanceValues = [lectureAttendance, tutorialAttendance, practicalAttendance, seminarAttendance].filter(value => value !== null);

    if (attendanceValues.length === 0) {
        result.innerHTML = "<strong>Please enter at least one attendance percentage.</strong>";
        result.style.color = "red";
        return;
    }

    const overallPercentage = attendanceValues.reduce((sum, value) => sum + value, 0) / attendanceValues.length;

    result.style.color = overallPercentage >= 85 ? "green" : "red";
    result.innerHTML = `<strong>Overall Attendance: ${overallPercentage.toFixed(2)}%</strong>`;

    // Show or hide GIFs, messages, and change background color based on attendance percentage
    if (overallPercentage < 85) {
        message.innerHTML = "<strong>⚠️ MAVA, NUVU CLASSES KI VELLALI!</strong>";
        message.style.color = "orange";
        belowGif.style.display = "block";
        aboveGif.style.display = "none";
        document.body.style.backgroundColor = "#8B0000"; // Dark red background
    } else {
        message.innerHTML = "<strong>SUPER MAVA 🤩</strong>";
        message.style.color = "green";
        belowGif.style.display = "none";
        aboveGif.style.display = "block";
        document.body.style.backgroundColor = "#006400"; // Dark green background
    }
}

function resetFields() {
    document.getElementById("lectureAttendance").value = "";
    document.getElementById("tutorialAttendance").value = "";
    document.getElementById("practicalAttendance").value = "";
    document.getElementById("seminarAttendance").value = "";
    document.getElementById("result").innerText = "";
    document.getElementById("message").innerHTML = ""; 
    document.getElementById("belowGif").style.display = "none"; 
    document.getElementById("aboveGif").style.display = "none"; 
    document.body.style.backgroundColor = "#ffffff"; // Reset background color to white
}
