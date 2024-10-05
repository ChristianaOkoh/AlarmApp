const activeAlarm = localStorage.getItem("alarm");

const ul = document.querySelector("#customers");

const alarms = JSON.parse(activeAlarm);
console.log(alarms);

alarms.forEach((value) => {
  const details = document.createElement("tr");
  console.log(value.title);

  details.innerHTML = `
         <td>${value.title}</td>
          <td>${value.description}</td>
          <td id="setTime">${value.dateTimeString}</td>
    `;

    ul.append(details);
});