const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const toDoForm = document.querySelector('form');
const wheelModal = document.getElementById('wheel-modal');
const wheelCanvas = document.getElementById('wheel-canvas');
const wheelResult = document.getElementById('wheel-result');
const wheelClose = document.querySelector('.wheel-close');

let wheelContext = null;
let isSpinning = false;
let currentRotation = 0;
let currentTodoDiv = null;

const categories = ['School', 'Work', 'Home'];
const colors = ['#4CAF50', '#2196F3', '#FF9800'];

document.addEventListener("DOMContentLoaded", () => {
    getTodos();
    initWheel();
    setupModalListeners();
});

toDoForm.addEventListener('submit', addToDo);

toDoList.addEventListener('click', handleTodoAction);
toDoList.addEventListener('click', handleTodoItemClick);

function addToDo(event) {
    event.preventDefault();

    if (toDoInput.value.trim() === '') {
        alert("Please enter a task!");
        return;
    }

    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo');

    const wheelBtn = createWheelButton();
    toDoDiv.appendChild(wheelBtn);

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

function createWheelButton() {
    const wheelBtn = document.createElement('button');
    wheelBtn.innerHTML = '<i class="fas fa-dice"></i>';
    wheelBtn.classList.add('wheel-btn');
    wheelBtn.setAttribute('aria-label', 'Spin category wheel');
    wheelBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!wheelBtn.disabled && !isSpinning) {
            openWheelModal(wheelBtn.closest('.todo'));
        }
    });
    return wheelBtn;
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

function handleTodoItemClick(event) {
    // Don't trigger if clicking on a button or if in edit mode
    if (event.target.closest('button') || event.target.closest('.edit-input')) {
        return;
    }

    const todoItem = event.target.closest('.todo-item');
    if (!todoItem) return;

    // Check if text is overflowing
    const isOverflowing = todoItem.scrollWidth > todoItem.clientWidth;
    
    if (isOverflowing) {
        // Toggle scrollable class
        todoItem.classList.toggle('scrollable');
        
        // If making scrollable, scroll to show the beginning
        if (todoItem.classList.contains('scrollable')) {
            todoItem.scrollLeft = 0;
        }
    }
}

function saveToLocal(todo) {
    let todos = getTodosFromLocal();
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    const todos = getTodosFromLocal();
    const spunTodos = getSpunTodosFromLocal();
    
    todos.forEach(todo => {
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo");

        const wheelBtn = createWheelButton();
        if (spunTodos.includes(todo)) {
            wheelBtn.disabled = true;
        }
        toDoDiv.appendChild(wheelBtn);

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
    
    // Also remove from spun todos if it exists
    const spunTodos = getSpunTodosFromLocal();
    const spunIndex = spunTodos.indexOf(todoText);
    if (spunIndex > -1) {
        spunTodos.splice(spunIndex, 1);
        localStorage.setItem('spunTodos', JSON.stringify(spunTodos));
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
    
    // Update spun todos if the old text was spun
    const spunTodos = getSpunTodosFromLocal();
    const spunIndex = spunTodos.indexOf(oldText);
    if (spunIndex > -1) {
        spunTodos[spunIndex] = newText;
        localStorage.setItem('spunTodos', JSON.stringify(spunTodos));
    }
}

// Wheel Functions
function initWheel() {
    wheelContext = wheelCanvas.getContext('2d');
    drawWheel(0);
}

function drawWheel(rotation) {
    const centerX = wheelCanvas.width / 2;
    const centerY = wheelCanvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    wheelContext.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    
    wheelContext.save();
    wheelContext.translate(centerX, centerY);
    wheelContext.rotate((rotation * Math.PI) / 180);
    
    const sliceAngle = (2 * Math.PI) / categories.length;
    
    categories.forEach((category, index) => {
        const startAngle = index * sliceAngle;
        const endAngle = (index + 1) * sliceAngle;
        
        // Draw slice
        wheelContext.beginPath();
        wheelContext.moveTo(0, 0);
        wheelContext.arc(0, 0, radius, startAngle, endAngle);
        wheelContext.closePath();
        wheelContext.fillStyle = colors[index];
        wheelContext.fill();
        wheelContext.strokeStyle = '#fff';
        wheelContext.lineWidth = 3;
        wheelContext.stroke();
        
        // Draw text
        wheelContext.save();
        wheelContext.rotate(startAngle + sliceAngle / 2);
        wheelContext.textAlign = 'center';
        wheelContext.textBaseline = 'middle';
        wheelContext.fillStyle = '#fff';
        wheelContext.font = 'bold 28px Work Sans';
        wheelContext.shadowColor = 'rgba(0, 0, 0, 0.5)';
        wheelContext.shadowBlur = 4;
        wheelContext.fillText(category, radius * 0.65, 0);
        wheelContext.restore();
    });
    
    wheelContext.restore();
}

function setupModalListeners() {
    wheelClose.addEventListener('click', closeWheelModal);
    wheelModal.addEventListener('click', (e) => {
        if (e.target === wheelModal) {
            closeWheelModal();
        }
    });
}

function openWheelModal(todoDiv) {
    currentTodoDiv = todoDiv;
    wheelModal.classList.add('show');
    wheelResult.classList.remove('show');
    wheelResult.textContent = '';
    currentRotation = 0;
    drawWheel(0);
    
    // Start spinning after a short delay
    setTimeout(() => {
        spinWheel();
    }, 300);
}

function closeWheelModal() {
    if (!isSpinning) {
        wheelModal.classList.remove('show');
        currentTodoDiv = null;
    }
}

function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    const spinDuration = 3000; // 3 seconds
    const randomCategory = Math.floor(Math.random() * categories.length);
    const targetRotation = 360 * 5 + (360 / categories.length) * randomCategory + (360 / categories.length) / 2;
    const startRotation = currentRotation;
    const startTime = Date.now();
    
    wheelResult.classList.remove('show');
    wheelResult.textContent = '';
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        
        // Easing function for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentRotation = startRotation + (targetRotation - startRotation) * easeOut;
        
        drawWheel(currentRotation);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Wheel stopped
            isSpinning = false;
            const selectedCategory = categories[randomCategory];
            wheelResult.textContent = `Category: ${selectedCategory}!`;
            wheelResult.classList.add('show');
            
            // Play celebration sound
            playCelebrationSound();
            
            // Show confetti
            showConfetti();
            
            // Disable the wheel button
            if (currentTodoDiv) {
                const wheelBtn = currentTodoDiv.querySelector('.wheel-btn');
                if (wheelBtn) {
                    wheelBtn.disabled = true;
                    
                    // Save to localStorage
                    const todoItem = currentTodoDiv.querySelector('.todo-item');
                    if (todoItem) {
                        saveSpunTodo(todoItem.innerText);
                    }
                }
            }
        }
    }
    
    animate();
}

function playCelebrationSound() {
    // Create a simple celebration sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 523.25; // C5 note
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // Add a second note for more celebration
    setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        
        oscillator2.frequency.value = 659.25; // E5 note
        oscillator2.type = 'sine';
        
        gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 0.5);
    }, 100);
}

function showConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;
    
    const interval = setInterval(() => {
        if (Date.now() > end) {
            clearInterval(interval);
            return;
        }
        
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0.5, y: 0.5 },
            colors: colors
        });
        
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 0.5, y: 0.5 },
            colors: colors
        });
    }, 50);
}

function getSpunTodosFromLocal() {
    const spunTodos = localStorage.getItem('spunTodos');
    return spunTodos ? JSON.parse(spunTodos) : [];
}

function saveSpunTodo(todo) {
    const spunTodos = getSpunTodosFromLocal();
    if (!spunTodos.includes(todo)) {
        spunTodos.push(todo);
        localStorage.setItem('spunTodos', JSON.stringify(spunTodos));
    }
}

