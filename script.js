let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setInterval(checkTaskTimes, 60000); // Check every minute
});
document.getElementById('search').addEventListener('keydown', handleSearchKey);

function handleSearchKey(event) {
    if (event.key === 'Enter') {
        searchTasks();
    }
}

function addTask() {
    const taskTitle = document.getElementById('task-title').value.trim();
    const taskDesc = document.getElementById('task-desc').value.trim();
    const taskDate = document.getElementById('task-date').value;
    const taskNumber = document.getElementById('task-number').value;
    const taskPriority = document.getElementById('task-priority').value;
    const taskTime = document.getElementById('task-time').value.trim();
    
    if (taskTitle && taskDate && taskNumber && taskPriority && taskTime) {
        const task = {
            title: taskTitle,
            description: taskDesc,
            date: taskDate,
            number: taskNumber,
            priority: taskPriority,
            time: taskTime,
            addedTime: new Date().getTime() // Record the time when the task was added
        };
        tasks.push(task);
        saveTasks();
        renderTasks();
        
        // Clear inputs
        document.getElementById('task-title').value = '';
        document.getElementById('task-desc').value = '';
        document.getElementById('task-date').value = '';
        document.getElementById('task-number').value = '';
        document.getElementById('task-priority').value = 'Medium';
        document.getElementById('task-time').value = '';
    } else {
        alert('Please fill in all fields.');
    }
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function editTask(index) {
    const task = tasks[index];
    const newTitle = prompt('Edit task title:', task.title);
    const newDesc = prompt('Edit task description:', task.description);
    const newDate = prompt('Edit task date:', task.date);
    const newNumber = prompt('Edit number of tasks:', task.number);
    const newPriority = prompt('Edit priority (High, Medium, Low):', task.priority);
    const newTime = prompt('Edit estimated time (minutes):', task.time);
    
    if (newTitle && newDesc && newDate && newNumber && newPriority && newTime) {
        tasks[index] = {
            title: newTitle.trim(),
            description: newDesc.trim(),
            date: newDate,
            number: newNumber,
            priority: newPriority,
            time: newTime.trim(),
            addedTime: task.addedTime // Preserve the original added time
        };
        saveTasks();
        renderTasks();
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    renderTasks();
}

function renderTasks(taskArray = tasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    if (taskArray.length === 0) {
        taskList.innerHTML = '<li>No tasks found.</li>';
    } else {
        taskArray.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                <span class="task-title">${task.title}</span>
                <span>${task.description}</span>
                <span>Date: ${task.date}</span>
                <span>Number of Tasks: ${task.number}</span>
                <span>Priority: ${task.priority}</span>
                <span>Estimated Time: ${task.time} minutes</span>
                <div class="task-actions">
                    <button onclick="editTask(${index})">Edit</button>
                    <button onclick="deleteTask(${index})">Delete</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    }
}

function searchTasks() {
    const searchText = document.getElementById('search').value.toLowerCase();
    const filteredTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchText) ||
        task.description.toLowerCase().includes(searchText)
    );
    if (filteredTasks.length === 0) {
        renderTasks(filteredTasks);
        document.getElementById('task-list').innerHTML = '<li>No tasks found.</li>';
    } else {
        renderTasks(filteredTasks);
    }
}

function checkTaskTimes() {
    const now = new Date().getTime();
    tasks.forEach(task => {
        const taskDuration = parseFloat(task.time) * 60 * 1000; // Convert minutes to milliseconds
        if (now - task.addedTime >= taskDuration) {
            alert(`Time is up for task: ${task.title}`);
        }
    });
}
