// Ask user to alloe notification access 

console.log('testing alarm app');

if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
        if (Notification.permission !=="granted") {
            alert("please allow notification access");
            location.reload()
        }
    }).catch((error) => {
        alert("error: " + error)
    })
}
let timeoutIds = []

// let timeoutIds = JSON.parse(localStorage.getItem('timeoutIds')) || [];

// const saveTimeoutIds = () => {
//     localStorage.setItem('timeoutIds', JSON.stringify(timeoutIds));
// };

const scheduleReminder = () => {
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;

    let dateTimeString = date + " " + time;
    let scheduleTime = new Date(dateTimeString)
    let currentTime  = new Date()
    let timeDifference = scheduleTime - currentTime

    if (timeDifference > 0) {
        addReminder(title, description, dateTimeString)

        let timeoutId = setTimeout(() => {
            document.getElementById("notificationSound").play()

            let notification = new Notification(title, {
                // title: title,
                body: description,
                requireInteraction: true 
            }) 
        }, timeDifference)

        timeoutIds.push(timeoutId)
        
    } else {
        alert("the schedue time is in the past!")
    }

    console.log('alarm time');
    // console.log(timeoutIds)

}

const addReminder = (title, description, dateTimeString) => {
    const data = {
        title: title,
        description: description,
        dateTimeString: dateTimeString
    }
    console.log(data);
    localStorage.setItem('alarm', JSON.stringify([data]));
    
    let tableBody = document.getElementById("reminderTableBody")

    let row = tableBody.insertRow()

    let titleCell = row.insertCell(0)
    let descriptionCell = row.insertCell(1)
    let dateTimeCell = row.insertCell(2)
    let actionCell = row.insertCell(3)

    titleCell.innerHTML = title
    descriptionCell.innerHTML = description
    dateTimeCell.innerHTML = dateTimeString
    actionCell.innerHTML = 
    '<button type="button" onclick="deleteReminder(this);">Delete</button>'

}

const deleteReminder = (button) => {
    let row = button.closest('tr')
    var index = row.rowIndex

    clearTimeout(timeoutIds[index - 1])
    timeoutIds.splice(index - 1, 1)

    row.remove()
 }
