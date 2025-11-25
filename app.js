
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const tasksList = document.getElementById('tasksList');

const STORAGE_KEY = 'tasks';
/**
 * Obtiene todas las tareas guardadas en localStorage
 * Retorna un array vacío si no hay tareas guardadas
 */
const STORAGE_KEY = 'tasks';

function getTasks() {
    const tasksJSON = localStorage.getItem(STORAGE_KEY);
    return tasksJSON ? JSON.parse(tasksJSON) : [];
}

/**
 * Guarda el array de tareas en localStorage
 * Convierte el array a formato JSON antes de guardarlo
 */
function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
/**
 * Crea un nuevo objeto tarea con id único, título y estado inicial
 * @param {string} title - El texto de la tarea
 * @returns {Object} Objeto tarea con id, title y completed
 */
function createTask(title) {
    return {
        id: Date.now(),
        title: title.trim(),
        completed: false
    };
}

/**
 * Valida que el input no esté vacío
 * @param {string} value - Valor a validar
 * @returns {boolean} true si el campo tiene contenido válido
 */
function validateTaskText(value) {
    const trimmed = value.trim();
    if (trimmed === '') {
        alert('Por favor, escribe una tarea antes de agregarla.');
function validateInput() {
    const value = taskInput.value.trim();
    if (value === '') {
        alert('Por favor, escribe una tarea antes de agregarla.');
        taskInput.focus();
        return false;
    }
    return true;
}

/**
 * Busca una tarea por su ID en el array de tareas
 * @param {number} taskId - ID de la tarea a buscar
 * @returns {Object|null} La tarea encontrada o null
 */
function findTaskById(taskId) {
    const tasks = getTasks();
    return tasks.find(t => t.id === taskId) || null;
}

/**
 * CREATE: Agrega una nueva tarea al array y la guarda en localStorage
 * Flujo: Validar → Crear → Guardar → Renderizar
 */
function addTask() {
    const inputValue = taskInput.value;
    
    if (!validateTaskText(inputValue)) {
        taskInput.focus();
function addTask() {
    if (!validateInput()) {
        return;
    }

    const tasks = getTasks();
    const newTask = createTask(inputValue);
    const newTask = createTask(taskInput.value);
    tasks.push(newTask);
    saveTasks(tasks);

    taskInput.value = '';
    taskInput.focus();
    renderTasks();
}

/**
 * READ: Renderiza todas las tareas en la lista del DOM
 * Carga las tareas desde localStorage y crea elementos <li> para cada una
 * Flujo: Obtener → Limpiar → Crear elementos → Agregar listeners
 */
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

/**
 * Crea un elemento DOM completo para una tarea
 * Incluye checkbox, texto, botones de editar y eliminar
 * @param {Object} task - Objeto tarea a renderizar
 * @returns {HTMLElement} Elemento <li> completo
 */
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
/**
 * UPDATE: Cambia el estado completado/pendiente de una tarea
 * Actualiza localStorage y re-renderiza la lista
 * Flujo: Buscar → Actualizar → Guardar → Renderizar
 */
function toggleTaskStatus(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        task.completed = !task.completed;
        saveTasks(tasks);
        renderTasks();
    }
}
/**
 * UPDATE: Permite editar el texto de una tarea existente
 * Convierte el texto en un input editable
 * Flujo: Buscar → Crear input → Validar → Actualizar → Guardar → Renderizar
 */
function editTask(taskId) {
    const task = findTaskById(taskId);
function editTask(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    
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
        if (newText === '') {
            alert('La tarea no puede estar vacía.');
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
        task.title = newText;
        saveTasks(tasks);
        renderTasks();
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

/**
 * DELETE: Elimina una tarea del array y actualiza localStorage
 * Flujo: Obtener → Filtrar → Guardar → Renderizar
 */
function deleteTask(taskId) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        return;
    }

    const tasks = getTasks();
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    saveTasks(filteredTasks);
    renderTasks();
}

// Agregar tarea al hacer clic en el botón
addButton.addEventListener('click', addTask);

// Agregar tarea al presionar Enter en el input
function renderTasks() {
    const tasks = getTasks();
    tasksList.innerHTML = '';

    if (tasks.length === 0) {
        return;
    }

    tasks.forEach(task => {
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

        taskItem.setAttribute('data-id', task.id);

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

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(editButton);
        taskItem.appendChild(deleteButton);
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
// Cargar y renderizar las tareas al iniciar la aplicación
renderTasks();

