// Ask user to allow notification access
console.log('loading alarm system...');

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
  alarms.forEach((value, index) => {
    const alarmTime = new Date(value.dateTimeString);

    if (alarmTime > currentTime) {
      let timeDifference = alarmTime - currentTime;

      let timeoutId = setTimeout(() => {
        // Play alarm sound
        document.getElementById("notificationSound").play();

        // Trigger browser notification
        let notification = new Notification(value.title, {
          body: value.description,
          requireInteraction: true,
        });

        // Remove alarm after triggering
        deleteAlarm(index);
      }, timeDifference);

      timeoutIds.push(timeoutId);
    }
  });
};

// Load alarms from localStorage
const activeAlarm = localStorage.getItem("alarm");
const ul = document.querySelector("#customers");

if (activeAlarm) {
  const alarms = JSON.parse(activeAlarm);
  console.log(alarms);

  alarms.forEach((value, index) => {
    const alarmTime = new Date(value.dateTimeString);
    
    if (alarmTime > currentTime) {
      const details = document.createElement("tr");
      details.innerHTML = `
        <td>${value.title}</td>
        <td>${value.description}</td>
        <td id="setTime">${value.dateTimeString}</td>
      `;
      ul.append(details);
    } else {
      // Remove expired alarms from localStorage
      deleteAlarm(index);
    }
  });

  // Schedule alarms that are still in the future
  scheduleNotifications(alarms);
}

// Function to delete alarm
const deleteAlarm = (index) => {
  const alarms = JSON.parse(localStorage.getItem("alarm")) || [];
  alarms.splice(index, 1);  // Remove the expired alarm
  localStorage.setItem("alarm", JSON.stringify(alarms));  // Update localStorage
  console.log(`Alarm ${index} deleted.`);
};
