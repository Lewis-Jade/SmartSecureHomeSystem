// 🔁 Fetch data from Flask every 2 seconds

let motionPreviously = false;

setInterval(() => {
  fetch('/dashboard-data')
    .then(res => res.json())
    .then(data => {
      if (!data) return;

      // Update motion
  if (data.motion !== undefined) {
  document.getElementById('motionStatus').textContent = data.motion ? "Motion Detected" : "No Motion";
  setLEDStatus(data.motion);

  // ✅ Only show notification if motion just started
  if (data.motion && !motionPreviously) {
    showNotification("⚠ Motion Detected!");
  }

  // Update memory of last motion state
  motionPreviously = data.motion;
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
function showNotification(message = '⚠ Motion Detected!') {
  const notification = document.getElementById('notification');

  notification.textContent = message;
  notification.classList.remove('d-none');

  addNotification(message); // Add to recent alerts panel

  setTimeout(() => {
    notification.classList.add('d-none');
    notification.textContent = '';
  }, 5000);
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


const notifBtn = document.getElementById('notifBtn');
const notifPanel = document.getElementById('notifPanel');
const notifList = document.getElementById('notifList');
const notifBadge = document.getElementById('notifBadge');

let alertCount = 0;

// Toggle notification panel visibility
notifBtn.addEventListener('click', () => {
  notifPanel.classList.toggle('d-none');
  notifBadge.classList.add('d-none'); // hide red badge once opened
});

// Add a new alert to the recent list
function addNotification(msg) {
  const item = document.createElement('li');
  item.className = 'list-group-item';
  item.textContent = `${new Date().toLocaleTimeString()} - ${msg}`;
  notifList.prepend(item); // add to top

  alertCount++;
  notifBadge.textContent = alertCount;
  notifBadge.classList.remove('d-none'); // show red dot
}

// Optional: Reset badge and alerts (for reset button)
function resetNotifications() {
  notifList.innerHTML = '';
  alertCount = 0;
  notifBadge.classList.add('d-none');
}



// Hide notification if you click outside it
document.addEventListener('click', (e) => {
  const notifBtn = document.getElementById('notifBtn');
  const notifPanel = document.getElementById('notifPanel');

  // If panel is visible and click is outside both the panel and the bell
  if (!notifPanel.classList.contains('d-none') &&
      !notifPanel.contains(e.target) &&
      !notifBtn.contains(e.target)) {
    notifPanel.classList.add('d-none');
  }
});

