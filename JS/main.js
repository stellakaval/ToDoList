const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const toDoForm = document.querySelector('form');

document.addEventListener("DOMContentLoaded", getTodos);

toDoForm.addEventListener('submit', addToDo);

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

    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.classList.add('edit-btn');
    editBtn.setAttribute('aria-label', 'Edit task');
    toDoDiv.appendChild(editBtn);

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

    if (item.classList.contains('edit-btn')) {
        enterEditMode(todo);
    }

    if (item.classList.contains('save-btn')) {
        saveEdit(todo);
    }

    if (item.classList.contains('cancel-btn')) {
        cancelEdit(todo);
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

        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.classList.add("edit-btn");
        editBtn.setAttribute('aria-label', 'Edit task');
        toDoDiv.appendChild(editBtn);

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
    const todoItem = todo.querySelector('.todo-item');
    const todoText = todoItem.innerText;
    const todoIndex = todos.indexOf(todoText);
    
    if (todoIndex > -1) {
        todos.splice(todoIndex, 1);
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

function enterEditMode(todo) {
    const allTodos = document.querySelectorAll('.todo');
    allTodos.forEach(t => {
        if (t !== todo && t.classList.contains('editing')) {
            cancelEdit(t);
        }
    });

    const todoItem = todo.querySelector('.todo-item');
    const originalText = todoItem.innerText;
    
    todo.setAttribute('data-original-text', originalText);
    
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.classList.add('edit-input');
    editInput.value = originalText;
    editInput.setAttribute('aria-label', 'Edit task text');
    
    todoItem.replaceWith(editInput);
    
    const editBtn = todo.querySelector('.edit-btn');
    const checkBtn = todo.querySelector('.check-btn');
    const deleteBtn = todo.querySelector('.delete-btn');
    
    editBtn.style.display = 'none';
    checkBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
    
    const saveBtn = document.createElement('button');
    saveBtn.innerHTML = '<i class="fas fa-save"></i>';
    saveBtn.classList.add('save-btn');
    saveBtn.setAttribute('aria-label', 'Save changes');
    todo.appendChild(saveBtn);
    
    const cancelBtn = document.createElement('button');
    cancelBtn.innerHTML = '<i class="fas fa-times"></i>';
    cancelBtn.classList.add('cancel-btn');
    cancelBtn.setAttribute('aria-label', 'Cancel editing');
    todo.appendChild(cancelBtn);
    
    todo.classList.add('editing');
    
    editInput.focus();
    editInput.select();
    
    editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveEdit(todo);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit(todo);
        }
    });
}

function saveEdit(todo) {
    const editInput = todo.querySelector('.edit-input');
    const newText = editInput.value.trim();
    
    if (newText === '') {
        alert("Task cannot be empty!");
        return;
    }
    
    const originalText = todo.getAttribute('data-original-text');
    
    const newTodoItem = document.createElement('li');
    newTodoItem.innerText = newText;
    newTodoItem.classList.add('todo-item');
    
    editInput.replaceWith(newTodoItem);
    
    const saveBtn = todo.querySelector('.save-btn');
    const cancelBtn = todo.querySelector('.cancel-btn');
    saveBtn.remove();
    cancelBtn.remove();
    
    const editBtn = todo.querySelector('.edit-btn');
    const checkBtn = todo.querySelector('.check-btn');
    const deleteBtn = todo.querySelector('.delete-btn');
    
    editBtn.style.display = '';
    checkBtn.style.display = '';
    deleteBtn.style.display = '';
    
    todo.classList.remove('editing');
    todo.removeAttribute('data-original-text');
    
    updateLocalStorage(originalText, newText);
}

function cancelEdit(todo) {
    const editInput = todo.querySelector('.edit-input');
    const originalText = todo.getAttribute('data-original-text');
    
    const newTodoItem = document.createElement('li');
    newTodoItem.innerText = originalText;
    newTodoItem.classList.add('todo-item');
    
    editInput.replaceWith(newTodoItem);
    
    const saveBtn = todo.querySelector('.save-btn');
    const cancelBtn = todo.querySelector('.cancel-btn');
    saveBtn.remove();
    cancelBtn.remove();
    
    const editBtn = todo.querySelector('.edit-btn');
    const checkBtn = todo.querySelector('.check-btn');
    const deleteBtn = todo.querySelector('.delete-btn');
    
    editBtn.style.display = '';
    checkBtn.style.display = '';
    deleteBtn.style.display = '';
    
    todo.classList.remove('editing');
    todo.removeAttribute('data-original-text');
}
function updateLocalStorage(oldText, newText) {
    const todos = getTodosFromLocal();
    const todoIndex = todos.indexOf(oldText);
    
    if (todoIndex > -1) {
        todos[todoIndex] = newText;
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

