// Ask user to allow notification access
console.log('Loading alarm system...');

if ("Notification" in window) {
  Notification.requestPermission().then((permission) => {
    if (permission !== "granted") {
      alert("Please allow notification access");
      location.reload();
    }
  }).catch((error) => {
    alert("Error: " + error);
  });
}

let timeoutIds = [];

// Function to check and schedule notifications for upcoming alarms
const scheduleNotifications = (alarms) => {
  const currentTime = new Date(); // Ensure current time is updated each time scheduleNotifications is called
  alarms.forEach((alarm) => {
    const alarmTime = new Date(alarm.dateTime);
    console.log(`Current Time: ${currentTime}, Alarm Time: ${alarmTime}`);

    if (alarmTime > currentTime) {
      console.log(`Scheduling alarm for: ${alarm.title}`);
      let timeDifference = alarmTime - currentTime;

      let timeoutId = setTimeout(() => {
        // Ensure notification permissions are granted before displaying notification
        if (Notification.permission === "granted") {
          // Play alarm sound
          document.getElementById("notificationSound").play();

          // Trigger browser notification
          new Notification(alarm.title, {
            body: alarm.description,
            requireInteraction: true,
          });
        }
      }, timeDifference);

      timeoutIds.push(timeoutId);
    } else {
      console.log(`Alarm time for ${alarm.title} has already passed.`);
    }
  });
};

// Function to load alarms from the database and display them in the table
const loadAlarmsFromDatabase = async () => {
  try {
    const response = await fetch("https://imaginative-isobel-testalarmapp-b9675341.koyeb.app/api/reminders");

    if (response.ok) {
      const alarms = await response.json();
      console.log("Loaded alarms:", alarms);

      const ul = document.querySelector("#customers");

      alarms.forEach((alarm) => {
        const alarmTime = new Date(alarm.dateTime);
        const currentTime = new Date(); // Update current time before each alarm check

        if (alarmTime > currentTime) {
          const details = document.createElement("tr");
          details.innerHTML = `
            <td>${alarm.title}</td>
            <td>${alarm.description}</td>
            <td>${alarm.dateTime}</td>
          `;
          ul.append(details);
        }
      });

      // Schedule alarms that are still in the future
      scheduleNotifications(alarms);
    } else {
      console.error("Failed to load alarms:", response.statusText);
    }
  } catch (error) {
    console.error("Error loading alarms:", error);
  }
};

const initializeAlarms = () => {
  loadAlarmsFromDatabase(); // Load and schedule alarms after user interaction
  document.getElementById("startAlarms").style.display = 'none'; // Hide button after interaction
};

// Load alarms from the database when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startAlarms");
  startButton.style.display = 'block'; // Ensure button is visible when page loads
});
