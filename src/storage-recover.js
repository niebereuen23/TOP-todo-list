import { TodoItem, ProjectItem, AllProjects } from './todo-project-creators.js';

export default function retrieveStoredData(key) {
    const allMyRawProjects = JSON.parse(localStorage.getItem(key));

    const allMyRestoredProjects = new AllProjects();

    for (let projectItemRaw of allMyRawProjects.projectsList) {
        const projectItemRestored = new ProjectItem();
      
        // 'For of' loops to restore the todoList and checkList only 
        for (let todoItemRaw of projectItemRaw.todoList) {
            const todoItemRestored = new TodoItem();

            // checkList is just an array so we just copy
            for (let checklistItemRaw of todoItemRaw.checkList) {
                const checklistItemRestored = checklistItemRaw;
                todoItemRestored.addChecklistItem(checklistItemRestored, checklistItemRaw.state);
            }

            // 'For in' to restore todo properties except for checkList
            for (let todoProperty in todoItemRaw) {
                if (todoProperty === 'checkList') {
                    continue;
                } else {
                    todoItemRestored[todoProperty] = todoItemRaw[todoProperty];
                }
            }

            projectItemRestored.addTodo(todoItemRestored);
        }

        // 'For in' to restore project properties except for todoList
        for (let projectProperty in projectItemRaw) {
            if (projectProperty === 'todoList') {
                continue;
            } else {
                projectItemRestored[projectProperty] = projectItemRaw[projectProperty];
            }
        }
        
        allMyRestoredProjects.addProject(projectItemRestored);
    }
    return allMyRestoredProjects;
}