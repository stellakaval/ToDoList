const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');

document.addEventListener("DOMContentLoaded", getTodos);

toDoBtn.addEventListener('click', addToDo);

toDoList.addEventListener('click', handleTodoAction);

function addToDo(event) {
    event.preventDefault();

    if (toDoInput.value.trim() === '') {
        alert("Please enter a task!");
        return;
    }

    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo');

    const newToDo = document.createElement('li');
    newToDo.innerText = toDoInput.value.trim();
    newToDo.classList.add('todo-item');
    toDoDiv.appendChild(newToDo);

    saveToLocal(toDoInput.value.trim());

    const checkBtn = document.createElement('button');
    checkBtn.innerHTML = '<i class="fas fa-check"></i>';
    checkBtn.classList.add('check-btn');
    checkBtn.setAttribute('aria-label', 'Mark as complete');
    toDoDiv.appendChild(checkBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.setAttribute('aria-label', 'Delete task');
    toDoDiv.appendChild(deleteBtn);

    toDoList.appendChild(toDoDiv);
    toDoInput.value = '';
}

function handleTodoAction(event) {
    const item = event.target.closest('button');
    if (!item) return;

    const todo = item.parentElement;

    if (item.classList.contains('delete-btn')) {
        todo.classList.add("fall");
        removeFromLocal(todo);
        todo.addEventListener('transitionend', () => todo.remove());
    }

    if (item.classList.contains('check-btn')) {
        todo.classList.toggle("completed");
    }
}

function saveToLocal(todo) {
    let todos = getTodosFromLocal();
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    const todos = getTodosFromLocal();
    
    todos.forEach(todo => {
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo");

        const newToDo = document.createElement('li');
        newToDo.innerText = todo;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        const checkBtn = document.createElement('button');
        checkBtn.innerHTML = '<i class="fas fa-check"></i>';
        checkBtn.classList.add("check-btn");
        checkBtn.setAttribute('aria-label', 'Mark as complete');
        toDoDiv.appendChild(checkBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.classList.add("delete-btn");
        deleteBtn.setAttribute('aria-label', 'Delete task');
        toDoDiv.appendChild(deleteBtn);

        toDoList.appendChild(toDoDiv);
    });
}

function getTodosFromLocal() {
    const todos = localStorage.getItem('todos');
    return todos ? JSON.parse(todos) : [];
}

function removeFromLocal(todo) {
    const todos = getTodosFromLocal();
    const todoText = todo.children[0].innerText;
    const todoIndex = todos.indexOf(todoText);
    
    if (todoIndex > -1) {
        todos.splice(todoIndex, 1);
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}
