class Task {
    constructor(id, title, completed = false, category = 'general', priority = 'medium', dueDate = '') {
        this.id = id;
        this.title = title;
        this.completed = completed;
        this.category = category;
        this.priority = priority;
        this.dueDate = dueDate;
        this.createdAt = new Date().toISOString();
    }
    
    static loadTasks() {
        const tasks = Storage.getTasks();
        const categories = Storage.getCategories();
        
        // Update category filter dropdown
        const categoryFilter = document.getElementById('category-filter');
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
        
        // Render all tasks
        document.getElementById('task-list').innerHTML = '';
        tasks.forEach(task => this.renderTask(task));
    }
    
    static renderTask(taskData) {
        const task = taskData instanceof Task ? taskData : new Task(
            taskData.id,
            taskData.title,
            taskData.completed,
            taskData.category,
            taskData.priority,
            taskData.dueDate
        );
        
        const taskList = document.getElementById('task-list');
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'task-completed' : ''}`;
        taskItem.dataset.id = task.id;
        taskItem.dataset.category = task.category;
        taskItem.dataset.priority = task.priority;
        
        // Check if task is overdue
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const isOverdue = dueDate && dueDate < today && !task.completed;
        
        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-details">
                    <span class="task-category">${Category.getCategoryName(task.category)}</span>
                    <span class="task-priority priority-${task.priority}">${task.priority}</span>
                    ${task.dueDate ? `
                        <span class="task-due ${isOverdue ? 'overdue' : ''}">
                            <i class="far fa-calendar-alt"></i>
                            ${new Date(task.dueDate).toLocaleDateString()}
                            ${isOverdue ? ' (Overdue)' : ''}
                        </span>
                    ` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="edit-btn" title="Edit task"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" title="Delete task"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        // Add event listeners
        const checkbox = taskItem.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => {
            task.toggleComplete();
            Task.updateStats();
        });
        
        const editBtn = taskItem.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => this.editTask(task));
        
        const deleteBtn = taskItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
        
        taskList.appendChild(taskItem);
    }
    
    static filterTasks(filterType) {
        const categoryFilter = document.getElementById('category-filter').value;
        const priorityFilter = document.getElementById('priority-filter').value;
        const tasks = document.querySelectorAll('.task-item');
        
        tasks.forEach(task => {
            let showTask = true;
            
            // Apply status filter
            if (filterType === 'active') {
                showTask = !task.classList.contains('task-completed');
            } else if (filterType === 'completed') {
                showTask = task.classList.contains('task-completed');
            }
            
            // Apply category filter
            if (showTask && categoryFilter !== 'all') {
                showTask = task.dataset.category === categoryFilter;
            }
            
            // Apply priority filter
            if (showTask && priorityFilter !== 'all') {
                showTask = task.dataset.priority === priorityFilter;
            }
            
            task.style.display = showTask ? 'flex' : 'none';
        });
    }
    
    static updateStats() {
        const tasks = Storage.getTasks();
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        
        document.getElementById('total-tasks').textContent = `${totalTasks} ${totalTasks === 1 ? 'task' : 'tasks'}`;
        document.getElementById('completed-tasks').textContent = `${completedTasks} completed`;
    }
    
    static editTask(task) {
        const newTitle = prompt('Edit task:', task.title);
        if (newTitle !== null && newTitle.trim() !== '') {
            task.title = newTitle.trim();
            task.save();
            Task.loadTasks();
        }
    }
    
    static deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            Storage.deleteTask(taskId);
            document.querySelector(`.task-item[data-id="${taskId}"]`).remove();
            Task.updateStats();
        }
    }
    
    toggleComplete() {
        this.completed = !this.completed;
        this.save();
        const taskItem = document.querySelector(`.task-item[data-id="${this.id}"]`);
        if (taskItem) {
            taskItem.classList.toggle('task-completed');
        }
    }
    
    save() {
        Storage.saveTask(this);
    }
}