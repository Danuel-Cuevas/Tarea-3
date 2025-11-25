const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const tasksList = document.getElementById('tasksList');

const STORAGE_KEY = 'tasks';

function getTasks() {
    const tasksJSON = localStorage.getItem(STORAGE_KEY);
    return tasksJSON ? JSON.parse(tasksJSON) : [];
}

function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTask(title) {
    return {
        id: Date.now(),
        title: title.trim(),
        completed: false
    };
}

function validateInput() {
    const value = taskInput.value.trim();
    if (value === '') {
        alert('Por favor, escribe una tarea antes de agregarla.');
        taskInput.focus();
        return false;
    }
    return true;
}

function addTask() {
    if (!validateInput()) {
        return;
    }

    const tasks = getTasks();
    const newTask = createTask(taskInput.value);
    tasks.push(newTask);
    saveTasks(tasks);

    taskInput.value = '';
    taskInput.focus();
    renderTasks();
}

function renderTasks() {
    const tasks = getTasks();
    tasksList.innerHTML = '';

    if (tasks.length === 0) {
        return;
    }

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.setAttribute('data-id', task.id);

        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.title;

        taskItem.appendChild(taskText);
        tasksList.appendChild(taskItem);
    });
}

addButton.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

renderTasks();

