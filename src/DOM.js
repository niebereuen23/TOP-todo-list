import ModalForm from './DOM-form-todoscreen.js';
import pubsub from './pubsub.js';
import { allProjects } from './index.js';

// All projects page? OR ALL LOGIC IN 1 CLASS? REMEMBER THIS IS LOGIC, EVENTS LISTENER SHOULD BE ADDED HERE. todoModal() call should return a node to which I should add the eventlisteners
export default class DOMController {
    #modalForm = new ModalForm();
    constructor() {
        this.pageTitle = document.querySelector('h2');
        this.navButton = document.querySelector('nav');
        this.actionButtons = document.querySelector('#action-buttons');
        this.itemsList = document.querySelector('#items-list');
        this.dialog = document.querySelector('dialog');
        this.form = document.querySelector('form');
    }
    
    displayTodosScreen(projectItem) {
        // Clear screen
        this.pageTitle.textContent = '';
        this.navButton.textContent = '';
        this.actionButtons.textContent = '';
        this.itemsList.textContent = '';
        this.form.textContent = '';

        // Change modal HTML
        this.#modalForm.todoModal(this.#modalForm.todoPropertiesToInject); 

        // Name of screen
        this.pageTitle.textContent = projectItem.title;
        
        // Nav buttons. Currently only one that takes users back to the Projects screen
        this.navButton.textContent = '< Back to Projects';
        this.navButton.addEventListener('click', e => {
            this.displayProjectsScreen(allProjects);
        })

        // Action buttons. Button to add New Todo item to the project AND Set default checkbox
        const addTodo = document.createElement('button');
        addTodo.textContent = 'New Todo';
        this.actionButtons.appendChild(addTodo);
        addTodo.addEventListener('click', e => {
            
            this.dialog.showModal();
            
        });

        const setDefaultDiv = document.createElement('div');

        const setDefaultProjectLabel = document.createElement('label');
        setDefaultProjectLabel.textContent = 'Set as default';
        setDefaultProjectLabel.setAttribute('for', 'set-as-default-input');

        const setDefaultProjectInput = document.createElement('input');
        setDefaultProjectInput.setAttribute('type', 'checkbox');
        setDefaultProjectInput.setAttribute('id', 'set-as-default-input');
        if (projectItem.isDefault()) {
            setDefaultProjectInput.checked = true;
            setDefaultProjectInput.disabled = true;
        }
        setDefaultProjectInput.addEventListener('change', e => {
            if (setDefaultProjectInput.value === 'on') {
                pubsub.publish('updateProjectDefaultStatus', projectItem);
                setDefaultProjectInput.disabled = true;
            }
        })

        setDefaultDiv.append(setDefaultProjectLabel, setDefaultProjectInput);
        this.actionButtons.appendChild(setDefaultDiv);

        // Items list. All todo items are loaded and displayed here
        if (projectItem.todoList.length === 0) {
            this.itemsList.textContent = 'There are no todos here...'
        } else {
            for (let todoItem of projectItem.todoList) {
                const li = document.createElement('li');

                const span = document.createElement('span');
                span.textContent = todoItem.title;
                span.addEventListener('click', e => {
                    this.displaySingleTodoScreen(todoItem, projectItem);
                })
                li.appendChild(span);
    
                // Delete button generated for each item in the list
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'delete';
                deleteButton.addEventListener('click', e => {
                    pubsub.publish('todoItemDeleted', {todoItem, projectItem});
                })
    
                li.appendChild(deleteButton);
                this.itemsList.appendChild(li);
            }
        }

        // Modal Checklist button
        const checklistDiv = document.querySelector('#checklist-div');
        const checklistInput = document.querySelector('#checklist-input');
        const checklistButton = document.querySelector('#checklist-add-button');
        checklistButton.disabled = true;
        checklistInput.addEventListener('input', e => {
            if (checklistInput.value.length > 0) {
                checklistButton.disabled = false;
            } else {
                checklistButton.disabled = true;
            }
        })

        

        
        const checklistUl = document.createElement('ul');
        checklistDiv.appendChild(checklistUl);

        const checklistArray = []; // for temporary store to then pass it once the todoItem is created (with done button)
        checklistButton.addEventListener('click', e => {
            const checklistObject = {};
            checklistObject.value = checklistInput.value;
            checklistArray.push(checklistObject);
            const li = document.createElement('li');
            li.textContent = checklistInput.value;
            checklistUl.appendChild(li);
            checklistInput.value = '';
            checklistInput.focus();
        })
       
        // New Todo creation Modal. Done + Cancel buttons implemented. Check form-html.js for more details.
        const doneButton = document.querySelector('#todo-project-modal #done-button')
        doneButton.addEventListener('click', e => {
            e.preventDefault();
            const formData = new FormData(this.form);
            const todoItem =  Object.fromEntries(formData.entries());

            if (todoItem.title.trim().length === 0) {
                const errorMsg = document.querySelector('#error-span');
                errorMsg.textContent = 'Please enter add a title';
                return;
            }

            todoItem.checkList = checklistArray;
            pubsub.publish('todoItemAdded', {todoItem, projectItem}); // TODO? add subscribers where needed
            this.form.reset();
            this.dialog.close();
        })

        const modalCancelbutton = document.querySelector('#todo-project-modal #close-dialog');
        modalCancelbutton.addEventListener('click', () => {
            this.dialog.close();
        })
    }
    
    displayProjectsScreen(allProjects) {
        // Clear screen
        this.pageTitle.textContent = '';
        this.navButton.textContent = '';
        this.actionButtons.textContent = '';
        this.itemsList.textContent = '';
        this.form.textContent = '';

        // Change modal HTML
        this.#modalForm.projectModal(); 

        // Name of screen
        this.pageTitle.textContent = 'All Projects';
        
        // Action buttons. Currently only a button to add New Project item.
        const addProject = document.createElement('button');
        addProject.textContent = 'New Project';
        this.actionButtons.appendChild(addProject);
        addProject.addEventListener('click', e => {
            this.dialog.showModal();
        });

        // Items list. All Project items are loaded and displayed here
        if (allProjects.projectsList.length === 0) {
            this.itemsList.textContent = 'There are no projects...'
        } else {
            for (let projectItem of allProjects.projectsList) {
                const li = document.createElement('li');

                const span = document.createElement('span');
                span.textContent = projectItem.title;
                span.addEventListener('click', e => {
                    this.displayTodosScreen(projectItem);
                })
                li.appendChild(span);
    
                // Delete button generated for each item in the list
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'delete';
                deleteButton.addEventListener('click', e => {
                    pubsub.publish('projectItemDeleted', projectItem);
                })
    
                li.appendChild(deleteButton);
                this.itemsList.appendChild(li);
            }
        }
       
        // New Project creation Modal. Done + Cancel buttons implemented. Check form-html.js for more details.
        const doneButton = document.querySelector('#todo-project-modal #done-button')
        doneButton.addEventListener('click', e => {
            e.preventDefault();
            const formData = new FormData(this.form);
            const projectItemObject =  Object.fromEntries(formData.entries());

            if (projectItemObject.title.trim().length === 0) {
                const errorMsg = document.querySelector('#error-span');
                errorMsg.textContent = 'Please type the project name';
                return;
            }

            pubsub.publish('projectItemAdded', projectItemObject);
            this.form.reset();
            this.dialog.close();
        })

        const modalCancelbutton = document.querySelector('#todo-project-modal #close-dialog');
        modalCancelbutton.addEventListener('click', () => {
            this.dialog.close();
        })
    }

    displaySingleTodoScreen(todoItem, projectItem) {
        // Clear screen /
        this.pageTitle.textContent = '';
        this.navButton.textContent = '';
        this.actionButtons.textContent = '';
        this.itemsList.textContent = '';
        this.form.textContent = '';

        // Name of screen /
        this.pageTitle.textContent = todoItem.title;
        
        // Nav buttons. Currently only one that takes users back to the Todos screen /
        // const projectItem = todoItem.getParent();
        this.navButton.textContent = '< Back to Todos list';
        this.navButton.addEventListener('click', e => {
            this.displayTodosScreen(projectItem);
        })

        // Action buttons. Currently only a button to add New Project item. *
        const editTodoButton = document.createElement('button');
        editTodoButton.textContent = 'Edit';
        this.actionButtons.appendChild(editTodoButton);
            // EDIT MODE
        editTodoButton.addEventListener('click', e => {
            if (editTodoButton.textContent === 'Edit') {
                // Change todo screen to Edit mode
                editTodoButton.textContent = 'Save changes';
                this.itemsList.textContent = '';

                for (let todoProperty of this.#modalForm.todoPropertiesToInject) {
                    if (todoProperty.name === 'Title') {
                        this.pageTitle.textContent = '';
                        this.pageTitle.appendChild(todoProperty.displayDetailsFromTodoAsEditable(todoItem));
                    } else if(todoProperty.name === 'Checklist') {
                        continue;
                    } else {
                        this.itemsList.appendChild(todoProperty.displayDetailsFromTodoAsEditable(todoItem));
                    }
                }

                // Additionaly a span box to show validation errors
                const errorSpan = document.createElement('span');
                errorSpan.setAttribute('id', 'error-span')
                errorSpan.textContent = '';
                this.itemsList.appendChild(errorSpan);
            } else { // When it's the Save changes button
                const titleInput = document.querySelector('#title-input');
                const descriptionField = document.querySelector('#description');
                const dueDateField = document.querySelector('#due-date');
                const priorityField = document.querySelector('#priority');
                const notesField = document.querySelector('#notes');

                // Update todo items with newly added data 
                if (titleInput.value.trim().length === 0) {
                    const errorSpan = document.querySelector('#error-span');
                    errorSpan.textContent = 'Todo must have a title';
                    return;
                }

                todoItem.title = titleInput.value;
                todoItem.description = descriptionField.value;
                todoItem.dueDate = dueDateField.value;
                todoItem.priority = priorityField.value;
                todoItem.notes = notesField.value;

                this.displaySingleTodoScreen(todoItem, projectItem);
                pubsub.publish('localStorageUpdated');
            }
        });

        // Items list. All todo items are loaded and displayed here
        for (let todoProperty of this.#modalForm.todoPropertiesToInject) { //array of objects that have a method to create display elements
            if (todoProperty.name === 'Title') {
                continue;
            }

            this.itemsList.appendChild(todoProperty.displayElementsWithContentForTodoScreen(todoItem, projectItem)); // end of block
        }

        // Checklist add button
        const checklistButton = document.querySelector('#checklist-add-button-todo');
        const checklistInput = document.querySelector('#checklist-input-todo');
        checklistButton.disabled = true;
        checklistInput.addEventListener('input', e => {
            if (checklistInput.value.length > 0) {
                checklistButton.disabled = false;
            } else {
                checklistButton.disabled = true;
            }
        })

        checklistButton.addEventListener('click', e => {
            let checklistItem = checklistInput.value
            pubsub.publish('checklistItemAdded', { checklistItem, todoItem, projectItem });
        })
    }
}