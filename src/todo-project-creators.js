export { TodoItem, ProjectItem, AllProjects };

class TodoItem {
    
    constructor() {
        this.title;
        this.description;
        this.dueDate;
        this.priority;
        this.notes;
        this.checkList = [];
        // TODO LATER: Add images
    }

    addChecklistItem(item, state) {
        const object = {};
        object.value = item;
        if (state) {
            object.state = state;
        } else {
            object.state = false;
        }
        
        this.checkList.push(object);
    }
    removeChecklistItem(item) {
        this.checkList.splice(this.checkList.indexOf(item), 1);
    }
    // TODO: remove checklist item
}

class ProjectItem {
    
    constructor() {
        this._defaultStatus = false;
        this.title;
        this.todoList = [];
        
    }

    isDefault() {
        return this._defaultStatus;
    }

    setDefaultStatus(bool) {
        this._defaultStatus = bool;
    }

    addTodo(todo) {
        this.todoList.push(todo);
    }
    removeTodo(todo) {
        this.todoList.splice(this.todoList.indexOf(todo), 1);
    }
}

class AllProjects {
    projectsList = [];
    addProject(project) {
        this.projectsList.push(project);
    }

    removeProject(project) {
        this.projectsList.splice(this.projectsList.indexOf(project), 1);
    }
}





