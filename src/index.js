import { TodoItem, ProjectItem, AllProjects } from './todo-project-creators.js';
import pubsub from './pubsub.js';
import DOMController from './DOM.js'
import storageAvailable from './storage-validator.js';
import retrieveStoredData from './storage-recover.js';

export {allProjects}

// Add subscribers
pubsub.subscribe('todoItemDeleted', deleteTodo); // ...THINKING GEMNI PROMPT TO UNDERSTAND HOW TO DELETE AN OBJECT (TODO OR PROJECT)
pubsub.subscribe('todoItemAdded', addNewTodo);

pubsub.subscribe('projectItemDeleted', deleteProject); // ...THINKING GEMNI PROMPT TO UNDERSTAND HOW TO DELETE AN OBJECT (TODO OR PROJECT)
pubsub.subscribe('projectItemAdded', addNewProject);

pubsub.subscribe('todoItemAdded', updateTodosScreen);
pubsub.subscribe('todoItemDeleted', updateTodosScreen);

pubsub.subscribe('projectItemDeleted', updateProjectsScreen);
pubsub.subscribe('projectItemAdded', updateProjectsScreen);

pubsub.subscribe('checklistItemDeleted', deleteChecklistItem);
pubsub.subscribe('checklistItemDeleted', updateSingleTodoScreen);

pubsub.subscribe('checklistItemAdded', addChecklistItem);
pubsub.subscribe('checklistItemAdded', updateSingleTodoScreen);

pubsub.subscribe('updateProjectDefaultStatus', updateProjectDefaultStatus);

// Pubsub for storage events
pubsub.subscribe('localStorageUpdated', updateLocalStorage);


// show ProjectX screen by default
const displayController = new DOMController();


// STORAGE
let allProjects;
if (!localStorage.getItem('allProjects')) {
    // Instantiate the All Projects class only once
    allProjects = new AllProjects();

    // If no previous storage manipulation, create default "My Project"
    const firstDefaultProject = new ProjectItem();
    firstDefaultProject.setDefaultStatus(true);
    firstDefaultProject.title = 'My Project';
    pubsub.publish('projectItemAdded', firstDefaultProject);
    displayController.displayTodosScreen(firstDefaultProject); // TODO: need to decide how the default will be set 
    
} else {
    allProjects = retrieveStoredData('allProjects');
    console.log(allProjects);
    for (let project of allProjects.projectsList) {
        if (project.isDefault) {
            displayController.displayTodosScreen(project);
            break;
        }
    }
}

/*
PENDING:
- ADD STORAGE
*/

// Helper functions for pubsub
// Functions to create new Todo or Project items, or add new checklist items
function addNewTodo({todoItem, projectItem}) {
    let newTodoItem = new TodoItem();
    for (let property in todoItem) {
        if (property === '_state') {
            continue;
        } else {
            if (property === 'due-date') { // as HTML attribute for name is 'due-date' whereas todoItem property is 'dueDate'
                newTodoItem.dueDate = todoItem[property];
            } else {
                newTodoItem[property] = todoItem[property];
            }
        }
        
    }
    projectItem.addTodo(newTodoItem);
    pubsub.publish('localStorageUpdated');
}

function addNewProject(projectItem) {
    let newProjectItem = new ProjectItem();
    for (let property in projectItem) { // projectItem does not have #defaultStatus (when passed from form) OR has it for firstDefaultProject
        if (property === '_defaultStatus') {
            continue;
        } else {
            if (property === 'isdefault') {
                if (projectItem.isdefault === 'on') {
                    newProjectItem.setDefaultStatus(true);
    
                    // Now we need to set the REST of projectItems from allProjects as not default
                    for (let project of allProjects.projectsList) {
                        if (project.isDefault()) {
                            project.setDefaultStatus(false);
                            break;
                        }
                    }
                    console.log(projectItem.title, 'project is now the default');
                } else {
                    newProjectItem.setDefaultStatus(false);
                }
            } else {
                newProjectItem[property] = projectItem[property];
            }
        }
    }
    if (projectItem.isDefault) { // This statement only useful for the firstDefaultProject
        projectItem.isDefault() ? newProjectItem.setDefaultStatus(true) : newProjectItem.setDefaultStatus(false);
    }

    allProjects.addProject(newProjectItem);
    pubsub.publish('localStorageUpdated');
}

function addChecklistItem({ checklistItem, todoItem }) {
    todoItem.addChecklistItem(checklistItem);
    pubsub.publish('localStorageUpdated');
}

// Functions to delete Checklist, Todo or Project items
function deleteChecklistItem({ checklistItem, todoItem }) {
    todoItem.removeChecklistItem(checklistItem);
    pubsub.publish('localStorageUpdated');
}

function deleteProject(projectItem) {
    allProjects.removeProject(projectItem);
    pubsub.publish('localStorageUpdated');
}

function deleteTodo({todoItem, projectItem}) {
    projectItem.removeTodo(todoItem);
    pubsub.publish('localStorageUpdated');
}


// Function to update the DOM after any event related to data modification (that is visible to user) is triggered
function updateSingleTodoScreen({ checklistItem, todoItem, projectItem }) {
    displayController.displaySingleTodoScreen(todoItem, projectItem);
    pubsub.publish('localStorageUpdated');
}

function updateTodosScreen({todoItem, projectItem}) { // Note destructuring is used here
    displayController.displayTodosScreen(projectItem);
    pubsub.publish('localStorageUpdated');
}

function updateProjectsScreen() { // 
    displayController.displayProjectsScreen(allProjects);
    pubsub.publish('localStorageUpdated');
}

// Function to update Local Storage
function updateLocalStorage() {
    if (storageAvailable('localStorage')) {
        console.log(allProjects);
        localStorage.setItem('allProjects', JSON.stringify(allProjects));
        console.log('Local Storage Updated!');
    } else {
        alert('Too bad, no localStorage for us');
    }
}

//
function updateProjectDefaultStatus(projectItem) {
    projectItem.setDefaultStatus(true);
    // Now we need to set the REST of projectItems from allProjects as not default
    for (let project of allProjects.projectsList) {
        if (projectItem !== project && project.isDefault()) {
            project.setDefaultStatus(false);
            break;
        }
    }
    pubsub.publish('localStorageUpdated');
}

/* LIST OF THINGS I DON'T LIKE ABOUT THIS WEBAPP
    - Manually adding pubsub.publish('localStorageUpdated') to every single place where data is changed. Perhaps I could add the publish to the object methods directly?
    - Lots of DRY principle violations
*/
