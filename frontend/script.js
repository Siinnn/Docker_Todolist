class TodoList {
  constructor() {
    this.tasks = [];
    this.apiUrl = '/api/tasks';
    this.loadTasks();
  }

  async loadTasks() {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.tasks = await response.json();
      console.log('✅ Tâches chargées depuis l\'API');
    } catch (error) {
      console.error('❌ Erreur lors du chargement des tâches:', error);
      this.tasks = [];
      this.showError('Impossible de charger les tâches depuis le serveur');
    }
  }

  async addTask(text) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const task = await response.json();
      this.tasks.unshift(task);
      console.log('✅ Tâche ajoutée:', task.text);
      return task;
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout de la tâche:', error);
      this.showError('Impossible d\'ajouter la tâche');
      throw error;
    }
  }

  async deleteTask(id) {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      this.tasks = this.tasks.filter((t) => t.id !== id);
      console.log('✅ Tâche supprimée');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      this.showError('Impossible de supprimer la tâche');
      throw error;
    }
  }

  async toggleTask(id) {
    try {
      const task = this.tasks.find((t) => t.id === id);
      if (!task) {
        throw new Error('Tâche non trouvée');
      }
      
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !task.completed }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedTask = await response.json();
      this.tasks = this.tasks.map((t) => 
        t.id === id ? updatedTask : t
      );
      console.log('✅ Tâche mise à jour');
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error);
      this.showError('Impossible de mettre à jour la tâche');
      throw error;
    }
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #e74c3c;
      color: white;
      padding: 1rem;
      border-radius: 4px;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  }
}

export default TodoList; 