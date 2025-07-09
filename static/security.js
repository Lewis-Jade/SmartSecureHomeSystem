function showMotionAlert() {
  const alertBox = document.getElementById("notification");
  alertBox.classList.remove("d-none");

  setTimeout(() => {
    alertBox.classList.add("d-none");
  }, 5000); // hide after 5 seconds
}

// Example: simulate motion detection every 8 seconds
setInterval(() => {
    showMotionAlert();
}, 8000);

function updateDistance(value) {
  const distanceText = document.getElementById('distanceValue');
  const distanceBar = document.getElementById('distanceBar');

    distanceText.textContent = `${value} cm`;



  // Assuming max sensor range is 100cm for bar scaling
  let percent = Math.min(value, 100);
  distanceBar.style.width = percent + '%';
  distanceBar.setAttribute('aria-valuenow', percent);

  // Optional: change bar color based on distance
  if (value < 20) {
    distanceBar.className = 'progress-bar bg-danger'; // too close
  } else if (value < 50) {
    distanceBar.className = 'progress-bar bg-warning'; // caution
  } else {
    distanceBar.className = 'progress-bar bg-info'; // safe distance
  }
}
// Demo: update distance every 3 seconds with random values
setInterval(() => {
  const randomDistance = Math.floor(Math.random() * 100);
  updateDistance(randomDistance);
}, 3000);
document.getElementById('servoBtn').addEventListener('click', () => {
  // Replace with actual servo control code or API call
  console.log('Servo move triggered');
  alert('Servo moving!');
  // Example: send command to backend/microcontroller
  // fetch('/api/servo/move', { method: 'POST' });
});

document.getElementById('resetBtn').addEventListener('click', () => {
  // Reset system logic here
  console.log('System reset triggered');
  alert('System is resetting...');
  // Example: fetch('/api/system/reset', { method: 'POST' });
});
function setLEDStatus(on) {
  const led = document.getElementById('ledStatus');
  led.style.backgroundColor = on ? 'green' : 'gray';
}
function setLEDStatus(on) {
  const led = document.getElementById('ledStatus');
  led.style.backgroundColor = on ? 'green' : 'gray';
}

// Function to show notification message
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
}

// Function to update distance value
function updateDistance(distance) {
  const distanceValue = document.getElementById('distanceValue');
  distanceValue.textContent = distance;
}

// Simulate receiving data every 2 seconds
setInterval(() => {
  // Simulated data (replace with real sensor data)
  const motionDetected = Math.random() > 0.6; // 40% chance motion detected
  const distance = (Math.random() * 100).toFixed(2); // random distance in cm
  // Update LED: on if motion detected
  setLEDStatus(motionDetected);

  // Update notification
  if (motionDetected) {
    showNotification('⚠ Motion Detected!');
  } else {
    showNotification('');
  }

  // Update distance dashboard
  updateDistance(distance);
}, 2000);// Update LED: on if motion detected
  setLEDStatus(motionDetected);

  // Update notification
  if (motionDetected) {
    showNotification('⚠ Motion Detected!');
  } else {
    showNotification('');
  }

  // Update distance dashboard
  updateDistance(distance);





