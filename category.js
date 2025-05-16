class Category {
    static init() {
        const defaultCategories = [
            { id: 'general', name: 'General' },
            { id: 'work', name: 'Work' },
            { id: 'personal', name: 'Personal' },
            { id: 'shopping', name: 'Shopping' }
        ];
        
        // Initialize categories if they don't exist
        if (!Storage.getCategories().length) {
            Storage.saveCategories(defaultCategories);
        }
        
        // Update category select dropdown
        const categorySelect = document.getElementById('category-select');
        categorySelect.innerHTML = '';
        
        this.getCategories().forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }
    
    static getCategories() {
        return Storage.getCategories();
    }
    
    static getCategoryName(categoryId) {
        const category = this.getCategories().find(c => c.id === categoryId);
        return category ? category.name : 'Uncategorized';
    }
    
    static addCategory(name) {
        const id = name.toLowerCase().replace(/\s+/g, '-');
        const categories = this.getCategories();
        
        if (!categories.some(c => c.id === id)) {
            categories.push({ id, name });
            Storage.saveCategories(categories);
            this.init(); // Refresh UI
            return true;
        }
        
        return false;
    }
}