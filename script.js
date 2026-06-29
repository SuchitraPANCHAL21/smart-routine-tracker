// ===== OPEN MONTH PICKER =====
function openMonthPicker() {
  const picker = document.getElementById("monthPicker");
  picker.style.display = "block";
  picker.click();

  picker.onchange = generateCalendar;
}

// ===== GENERATE CALENDAR =====
function generateCalendar() {
  const input = document.getElementById("monthPicker").value;

  if (!input) {
    alert("Please select a month");
    return;
  }

  const [year, month] = input.split("-");

  const monthName = new Date(year, month - 1).toLocaleString('default', {
    month: 'long'
  });

  document.getElementById("selectedMonth").innerText =
    "📅 " + monthName + " " + year;

  const daysInMonth = new Date(year, month, 0).getDate();

  const calendar = document.getElementById("calendar");
  calendar.innerHTML = ""; // clear old

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);

    const dayName = date.toLocaleString('default', {
      weekday: 'short'
    });

    const box = document.createElement("div");
    box.className = "day-box";

    box.innerHTML = `
      <h4>${d} (${dayName})</h4>
      <input type="text" id="task-${d}" placeholder="Enter task">
      <button onclick="addTask(${d})">➕</button>
      <ul id="list-${d}"></ul>
    `;

    calendar.appendChild(box);

    loadTasks(d);
  }
}

// ===== SHOW PERFORMANCE CHART =====
function showChart() {
  let completed = 0;
  let total = 0;

  // loop through all days
  for (let i = 1; i <= 31; i++) {
    let tasks = JSON.parse(localStorage.getItem("tasks-" + i)) || [];
    total += tasks.length;
  }

  // completed tasks stored separately
  let completedTasks = JSON.parse(localStorage.getItem("completed")) || [];
  completed = completedTasks.length;

  let pending = total - completed;

  if (total === 0) {
    alert("No tasks added yet!");
    return;
  }

  renderPieChart(completed, pending);
}

// ===== TRACK COMPLETED TASK =====
function removeTask(btn, day) {
  const li = btn.parentElement;
  const text = li.firstChild.textContent.trim();

  li.remove();

  // remove from active list
  let tasks = JSON.parse(localStorage.getItem("tasks-" + day)) || [];
  tasks = tasks.filter(t => t !== text);
  localStorage.setItem("tasks-" + day, JSON.stringify(tasks));

  // add to completed list
  let completed = JSON.parse(localStorage.getItem("completed")) || [];
  completed.push(text);
  localStorage.setItem("completed", JSON.stringify(completed));
}

// ===== RENDER PIE CHART =====
function renderPieChart(done, pending) {
  const container = document.getElementById("chartContainer");

  container.innerHTML = `
    <h3>📊 Your Performance</h3>
    <canvas id="pieChart"></canvas>
  `;

  const ctx = document.getElementById("pieChart").getContext("2d");

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Completed', 'Pending'],
      datasets: [{
        data: [done, pending]
      }]
    }
  });
}

// ===== ADD TASK =====
function addTask(day) {
  const input = document.getElementById(`task-${day}`);
  const value = input.value.trim();

  if (value === "") return;

  const list = document.getElementById(`list-${day}`);

  const li = document.createElement("li");
  li.innerHTML = `
    ${value} 
    <button onclick="removeTask(this, ${day})">❌</button>
  `;

  list.appendChild(li);

  saveTask(day, value);

  input.value = "";
}

// ===== REMOVE TASK =====
function removeTask(btn, day) {
  const li = btn.parentElement;
  const text = li.firstChild.textContent.trim();

  li.remove();

  let tasks = JSON.parse(localStorage.getItem("tasks-" + day)) || [];
  tasks = tasks.filter(t => t !== text);

  localStorage.setItem("tasks-" + day, JSON.stringify(tasks));
}

// ===== SAVE TASK =====
function saveTask(day, task) {
  let tasks = JSON.parse(localStorage.getItem("tasks-" + day)) || [];

  tasks.push(task);

  localStorage.setItem("tasks-" + day, JSON.stringify(tasks));
}

// ===== LOAD TASKS =====
function loadTasks(day) {
  const list = document.getElementById(`list-${day}`);
  const tasks = JSON.parse(localStorage.getItem("tasks-" + day)) || [];

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${task}
      <button onclick="removeTask(this, ${day})">❌</button>
    `;
    list.appendChild(li);
  });
}