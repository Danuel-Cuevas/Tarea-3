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

function validateTaskText(value) {
    const trimmed = value.trim();
    if (trimmed === '') {
        alert('Por favor, escribe una tarea antes de agregarla.');
        return false;
    }
    return true;
}

function findTaskById(taskId) {
    const tasks = getTasks();
    return tasks.find(t => t.id === taskId) || null;
}

function addTask() {
    const inputValue = taskInput.value;
    
    if (!validateTaskText(inputValue)) {
        taskInput.focus();
        return;
    }

    const tasks = getTasks();
    const newTask = createTask(inputValue);
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
        const taskItem = createTaskElement(task);
        tasksList.appendChild(taskItem);
    });
}

function createTaskElement(task) {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    if (task.completed) {
        taskItem.classList.add('completed');
    }
    taskItem.setAttribute('data-id', task.id);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTaskStatus(task.id));

    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.title;

    const editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', () => editTask(task.id));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(editButton);
    taskItem.appendChild(deleteButton);

    return taskItem;
}

function toggleTaskStatus(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        task.completed = !task.completed;
        saveTasks(tasks);
        renderTasks();
    }
}

function editTask(taskId) {
    const task = findTaskById(taskId);
    if (!task) return;

    const taskItem = document.querySelector(`[data-id="${taskId}"]`);
    const taskText = taskItem.querySelector('.task-text');
    const currentText = taskText.textContent;

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'task-edit-input';
    editInput.value = currentText;
    
    taskItem.classList.add('editing');
    taskText.replaceWith(editInput);
    editInput.focus();
    editInput.select();

    function saveEdit() {
        const newText = editInput.value.trim();
        
        if (!validateTaskText(newText)) {
            editInput.focus();
            return;
        }

        const tasks = getTasks();
        const taskToUpdate = tasks.find(t => t.id === taskId);
        if (taskToUpdate) {
            taskToUpdate.title = newText;
            saveTasks(tasks);
            renderTasks();
        }
    }

    function cancelEdit() {
        renderTasks();
    }

    editInput.addEventListener('blur', saveEdit);
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            editInput.blur();
        } else if (e.key === 'Escape') {
            cancelEdit();
        }
    });
}

function deleteTask(taskId) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        return;
    }

    const tasks = getTasks();
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    saveTasks(filteredTasks);
    renderTasks();
}

addButton.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

renderTasks();
