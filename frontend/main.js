import TodoList from "./script.js";

const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

const todo = new TodoList();

function showConnectionStatus(isConnected) {
  const statusDiv = document.getElementById('connectionStatus') || createStatusDiv();
  statusDiv.textContent = isConnected ? '🟢 Connecté' : '🔴 Déconnecté';
  statusDiv.className = `connection-status ${isConnected ? 'connected' : 'disconnected'}`;
}

function createStatusDiv() {
  const statusDiv = document.createElement('div');
  statusDiv.id = 'connectionStatus';
  statusDiv.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    z-index: 1000;
  `;
  document.body.appendChild(statusDiv);
  return statusDiv;
}

async function renderTasks() {
  try {
    taskList.innerHTML = '<li class="loading">Chargement des tâches...</li>';
    
    await todo.loadTasks();
    taskList.innerHTML = "";
    
    if (todo.tasks.length === 0) {
      taskList.innerHTML = '<li class="empty-state">Aucune tâche pour le moment. Ajoutez-en une !</li>';
      return;
    }
    
    todo.tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = `task-item ${task.completed ? "completed" : ""}`;
      li.setAttribute('data-task-id', task.id);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", async () => {
        try {
          await todo.toggleTask(task.id);
          renderTasks();
        } catch (error) {
          checkbox.checked = !checkbox.checked;
        }
      });

      const span = document.createElement("span");
      span.textContent = task.text;
      span.className = "task-text";

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-btn";
      deleteButton.textContent = "Supprimer";
      deleteButton.addEventListener("click", async () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
          try {
            await todo.deleteTask(task.id);
            renderTasks();
          } catch (error) {
          }
        }
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(deleteButton);
      taskList.appendChild(li);
    });
    
    showConnectionStatus(true);
  } catch (error) {
    console.error('Erreur lors du rendu:', error);
    taskList.innerHTML = '<li class="error-state">❌ Erreur lors du chargement des tâches</li>';
    showConnectionStatus(false);
  }
}

async function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    taskInput.focus();
    return;
  }

  addTaskButton.disabled = true;
  addTaskButton.textContent = "Ajout...";

  try {
    await todo.addTask(text);
    taskInput.value = "";
    await renderTasks();
  } catch (error) {
  } finally {
    addTaskButton.disabled = false;
    addTaskButton.textContent = "Ajouter";
    taskInput.focus();
  }
}

addTaskButton.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

setInterval(async () => {
  try {
    const response = await fetch('/health');
    showConnectionStatus(response.ok);
  } catch (error) {
    showConnectionStatus(false);
  }
}, 30000);

renderTasks();

taskInput.focus(); 