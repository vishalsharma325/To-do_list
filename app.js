document.addEventListener('DOMContentLoaded', () => {
    // Initialize categories
    Category.init();
    
    // Load tasks from storage
    Task.loadTasks();
    
    // Update stats
    Task.updateStats();
    
    // Event listeners
    document.getElementById('add-task-btn').addEventListener('click', addTask);
    document.getElementById('task-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    // Filter event listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            Task.filterTasks(btn.dataset.filter);
        });
    });
    
    document.getElementById('category-filter').addEventListener('change', () => {
        Task.filterTasks(document.querySelector('.filter-btn.active').dataset.filter);
    });
    
    document.getElementById('priority-filter').addEventListener('change', () => {
        Task.filterTasks(document.querySelector('.filter-btn.active').dataset.filter);
    });
});

function addTask() {
    const input = document.getElementById('task-input');
    const title = input.value.trim();
    
    if (title) {
        const category = document.getElementById('category-select').value;
        const priority = document.getElementById('priority-select').value;
        const dueDate = document.getElementById('due-date').value;
        
        const task = new Task(
            Date.now().toString(),
            title,
            false,
            category,
            priority,
            dueDate
        );
        
        task.save();
        Task.renderTask(task);
        Task.updateStats();
        
        // Reset input
        input.value = '';
    }
}