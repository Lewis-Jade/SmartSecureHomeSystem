// 🔁 Fetch data from Flask every 2 seconds
setInterval(() => {
  fetch('/dashboard-data')
    .then(res => res.json())
    .then(data => {
      if (!data) return;

      // Update motion
      if (data.motion !== undefined) {
        document.getElementById('motionStatus').textContent = data.motion ? "Motion Detected" : "No Motion";
        setLEDStatus(data.motion);
        showNotification(data.motion ? "⚠ Motion Detected!" : "");
      }

      // Update distance
      if (data.distance !== undefined) {
        updateDistance(data.distance);
      }

      // Update RFID
      if (data.rfid !== undefined) {
        document.getElementById('rfidStatus').textContent = data.rfid;
      }

      // Update Door
      if (data.door !== undefined) {
        document.getElementById('doorStatus').textContent = data.door ? "Open" : "Closed";
      }
    })
    .catch(err => {
      console.error("Error fetching dashboard data:", err);
    });
}, 2000);

// ✅ LED update
function setLEDStatus(on) {
  const led = document.getElementById('ledStatus');
  led.style.backgroundColor = on ? 'green' : 'gray';
}

// ✅ Distance update
function updateDistance(value) {
  const distanceText = document.getElementById('distanceValue');
  const distanceBar = document.getElementById('distanceBar');


  
  distanceText.textContent = `${value} cm`;

  let percent = Math.min(value, 100);
  distanceBar.style.width = percent + '%';
  distanceBar.setAttribute('aria-valuenow', percent);

  if (value < 20) {
    distanceBar.className = 'progress-bar bg-danger';
  } else if (value < 50) {
    distanceBar.className = 'progress-bar bg-warning';
  } else {
    distanceBar.className = 'progress-bar bg-info';
  }
}

// ✅ Show alert
function showNotification(message) {
  const alertBox = document.getElementById("notification");
  alertBox.textContent = message;
  if (message) {
    alertBox.classList.remove("d-none");
    setTimeout(() => {
      alertBox.classList.add("d-none");
    }, 5000);
  }
}

// ✅ Servo button
document.getElementById('servoBtn').addEventListener('click', () => {
  fetch('/set-command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ servo: "on" })
  })
  .then(res => res.json())
  .then(data => console.log("Command set:", data));
});

// ✅ Reset button
document.getElementById('resetBtn').addEventListener('click', () => {
  fetch('/iot/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(data => {
    alert(data.status); // "System reset successful!"

    // 👇 Reset UI components visually
    document.getElementById('ledStatus').style.backgroundColor = 'gray';
    document.getElementById('distanceValue').textContent = '-- cm';

    const distanceBar = document.getElementById('distanceBar');
    distanceBar.style.width = '0%';
    distanceBar.className = 'progress-bar';

    document.getElementById('motionStatus').textContent = 'No motion detected';
    document.getElementById('doorStatus').textContent = 'Closed';

    const notification = document.getElementById('notification');
    notification.classList.add('d-none'); // Hide it
    notification.textContent = ''; // Clear any message
  })
  .catch(err => {
    console.error('Error resetting system:', err);
    alert('Failed to reset system.');
  });
});


// Handle "Close Door" button click (was: servoBtn)
document.getElementById('servoBtn').addEventListener('click', () => {
  fetch('/iot/servo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(data => {
    alert(data.status); // Example: "Door closed (servo triggered)"
  })
  .catch(err => {
    console.error('Error triggering door/servo:', err);
    alert('Failed to close door.');
  });
});
