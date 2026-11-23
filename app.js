// Task List app: tasks are stored locally in this browser with localStorage.
const STORAGE_KEY = 'student-task-list-v1';
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const count = document.querySelector('#task-count');
const emptyState = document.querySelector('#empty-state');
const message = document.querySelector('#form-message');
const clearCompletedButton = document.querySelector('#clear-completed');


// Save/load helper supplied by this implementation (localStorage).
function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    message.textContent = 'Could not save tasks in this browser. Storage may be unavailable.';
    return false;
  }
}
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.filter(task => task && typeof task.text === 'string') : [];
  } catch (error) {
    return [];
  }
}
let tasks = loadTasks();

function renderTasks() {
  list.replaceChildren();
  tasks.forEach(task => {
    const item = document.createElement('li');
    item.className = `task-item${task.completed ? ' completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-check';
    checkbox.checked = Boolean(task.completed);
    checkbox.setAttribute('aria-label', `Mark ${task.text} as ${task.completed ? 'not completed' : 'completed'}`);
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      saveTasks(tasks);
      renderTasks();
    });

    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete task: ${task.text}`);
    deleteButton.addEventListener('click', () => {
      tasks = tasks.filter(current => current.id !== task.id);
      saveTasks(tasks);
      renderTasks();
    });

    item.append(checkbox, taskText, deleteButton);
    list.append(item);
  });
  const completedCount = tasks.filter(task => task.completed).length;
  count.textContent = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}${completedCount ? ` · ${completedCount} done` : ''}`;
  emptyState.hidden = tasks.length > 0;
  clearCompletedButton.hidden = completedCount === 0;
}


form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    message.textContent = 'Please type a task before adding it.';
    input.focus();
    return;
  }
  tasks.unshift({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, text, completed: false });
  saveTasks(tasks);
  renderTasks();
  message.textContent = '';
  input.value = '';
  input.focus();
});

clearCompletedButton.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks(tasks);
  renderTasks();
});

renderTasks();
