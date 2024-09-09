document.getElementById('add-button').addEventListener('click', addTodo);
document.getElementById('filter-priority').addEventListener('change', filterTodos);

window.onload = function() {
    loadTodos();
};

function addTodo() {
    const todoInput = document.getElementById('todo-input');
    const dueDateInput = document.getElementById('due-date');
    const priorityLevelInput = document.getElementById('priority-level');

    const todoText = todoInput.value.trim();
    const dueDate = dueDateInput.value;
    const priorityLevel = priorityLevelInput.value;

    if (todoText === '') {
        alert('Please enter a task.');
        return;
    }

    const todo = {
        text: todoText,
        dueDate: dueDate,
        priority: priorityLevel,
        completed: false,
    };

    saveTodoToLocalStorage(todo);
    renderTodoItem(todo);
    clearInputs();
}

function renderTodoItem(todo) {
    const todoList = document.getElementById('todo-list');
    const todoItem = document.createElement('li');
    todoItem.className = 'todo-item';

    const todoSpan = document.createElement('span');
    todoSpan.className = 'todo-text';
    todoSpan.textContent = todo.text;
    todoSpan.addEventListener('click', function() {
        toggleComplete(todo, todoItem);
    });

    const dueDateSpan = document.createElement('span');
    dueDateSpan.className = 'todo-date';
    dueDateSpan.textContent = todo.dueDate ? `Due: ${todo.dueDate}` : '';

    const prioritySpan = document.createElement('span');
    prioritySpan.className = `todo-priority ${todo.priority}`;
    prioritySpan.textContent = `Priority: ${todo.priority}`;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        deleteTodoFromLocalStorage(todo, todoItem);
    });

    todoItem.appendChild(todoSpan);
    todoItem.appendChild(dueDateSpan);
    todoItem.appendChild(prioritySpan);
    todoItem.appendChild(deleteButton);

    if (todo.completed) {
        todoSpan.classList.add('completed');
    }

    todoList.appendChild(todoItem);
}

function toggleComplete(todo, todoItem) {
    todo.completed = !todo.completed;
    updateTodoInLocalStorage(todo);
    const todoSpan = todoItem.querySelector('.todo-text');
    todoSpan.classList.toggle('completed');
}

function deleteTodoFromLocalStorage(todo, todoItem) {
    const todos = getTodosFromLocalStorage();
    const filteredTodos = todos.filter(t => t.text !== todo.text || t.dueDate !== todo.dueDate || t.priority !== todo.priority);
    localStorage.setItem('todos', JSON.stringify(filteredTodos));
    todoItem.remove();
}

function saveTodoToLocalStorage(todo) {
    const todos = getTodosFromLocalStorage();
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function updateTodoInLocalStorage(todo) {
    const todos = getTodosFromLocalStorage();
    const updatedTodos = todos.map(t => {
        if (t.text === todo.text && t.dueDate === todo.dueDate && t.priority === todo.priority) {
            return todo;
        }
        return t;
    });
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
}

function loadTodos() {
    const todos = getTodosFromLocalStorage();
    todos.forEach(todo => {
        renderTodoItem(todo);
    });
}

function getTodosFromLocalStorage() {
    return JSON.parse(localStorage.getItem('todos')) || [];
}

function clearInputs() {
    document.getElementById('todo-input').value = '';
    document.getElementById('due-date').value = '';
    document.getElementById('priority-level').value = 'low';
}

function filterTodos() {
    const filterValue = document.getElementById('filter-priority').value;
    const todos = getTodosFromLocalStorage();
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    const filteredTodos = filterValue === 'all' ? todos : todos.filter(todo => todo.priority === filterValue);

    filteredTodos.forEach(todo => {
        renderTodoItem(todo);
    });
}
