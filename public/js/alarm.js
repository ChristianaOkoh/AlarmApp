// Ask user to allow notification access
console.log('Loading alarm system...');

// Define the base API URL depending on the environment
const API_BASE_URL = "https://used-pony-testalarmapp-c5c0b55b.koyeb.app/api";

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
const currentTime = new Date();

// Function to check and schedule notifications for upcoming alarms
const scheduleNotifications = (alarms) => {
  alarms.forEach((alarm) => {
    const alarmTime = new Date(alarm.dateTime);
    if (alarmTime > currentTime) {
      let timeDifference = alarmTime - currentTime;

      let timeoutId = setTimeout(() => {
        // Play alarm sound
        document.getElementById("notificationSound").play();

        // Trigger browser notification
        new Notification(alarm.title, {
          body: alarm.description,
          requireInteraction: true,
        });
      }, timeDifference);

      timeoutIds.push(timeoutId);
    }
  });
};

// Function to load alarms from the database and display them in the table
const loadAlarmsFromDatabase = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reminders`);

    if (response.ok) {
      const alarms = await response.json();
      console.log("Loaded alarms:", alarms);

      const ul = document.querySelector("#customers");

      alarms.forEach((alarm) => {
        const alarmTime = new Date(alarm.dateTime);

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

// Load alarms from the database when the page loads
document.addEventListener("DOMContentLoaded", loadAlarmsFromDatabase);
