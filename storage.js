class Storage {
    static getTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }
    
    static saveTask(task) {
        const tasks = this.getTasks();
        const existingIndex = tasks.findIndex(t => t.id === task.id);
        
        if (existingIndex >= 0) {
            tasks[existingIndex] = task;
        } else {
            tasks.push(task);
        }
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    static deleteTask(taskId) {
        const tasks = this.getTasks().filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    static getCategories() {
        const categories = localStorage.getItem('categories');
        return categories ? JSON.parse(categories) : [];
    }
    
    static saveCategories(categories) {
        localStorage.setItem('categories', JSON.stringify(categories));
    }
}