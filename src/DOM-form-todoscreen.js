import pubsub from "./pubsub";

export default class NewModalForm {
    
    projectModal() {
        const form = document.querySelector('form');
        form.textContent = '';

        const title = document.createElement('label');
        title.textContent = 'Title:';
        const titleInput = document.createElement('input');
        titleInput.setAttribute('name', 'title');
        titleInput.setAttribute('id', 'title');
        titleInput.setAttribute('type', 'text');

        const isDefault = document.createElement('label');
        isDefault.textContent = 'Set as default';
        const isDefaultInput = document.createElement('input');
        isDefaultInput.setAttribute('name', 'isdefault');
        isDefaultInput.setAttribute('id', 'isdefault');
        isDefaultInput.setAttribute('type', 'checkbox');
        

        const doneButton = document.createElement('button');
        doneButton.textContent = 'Done';
        doneButton.setAttribute('id', 'done-button');

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Cancel';
        closeButton.setAttribute('id', 'close-dialog');
        closeButton.setAttribute('formmethod', 'dialog');
        closeButton.setAttribute('type', 'button');

        const errorSpan = document.createElement('span');
        errorSpan.setAttribute('id', 'error-span');

        return form.append(title, titleInput, isDefault, isDefaultInput, doneButton, closeButton, errorSpan);
    }

    todoPropertiesToInject = [
        new TodoTitle(),
        new TodoDescription(),
        new TodoDueDate(),
        new TodoPriority(),
        new TodoNotes(),
        new TodoChecklist(),
    ]

    todoModal(properties) {
        // Clear the form
        const form = document.querySelector('form');
        form.textContent = '';
        //
        for (let property of properties) {
            const label = document.createElement('label');
            label.textContent = property.name;
            label.setAttribute('for', property.nameAsHTMLAttribute);

            form.append(label, property.createInputElementsForForm());
        }

        const doneButton = document.createElement('button');
        doneButton.textContent = 'Done';
        doneButton.setAttribute('id', 'done-button');
        doneButton.setAttribute('type', 'submit');

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Cancel';
        closeButton.setAttribute('id', 'close-dialog');
        closeButton.setAttribute('formmethod', 'dialog');
        closeButton.setAttribute('type', 'button');

        const errorSpan = document.createElement('span');
        errorSpan.setAttribute('id', 'error-span');

        form.append(doneButton, closeButton, errorSpan);
    }

}

// Interfaces ?(still not sure what this term means). Each instance should be passed to the todo() method
class TodoTitle {
    constructor() {
        this.name = 'Title';
        this.nameAsHTMLAttribute = 'title';
    }
    
    createInputElementsForForm() {
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('id', this.nameAsHTMLAttribute);
        input.setAttribute('name', this.nameAsHTMLAttribute);
        return input;
    }
    // The title won't be rendered as an item in the Single Todo screen as it will be the Title of the whole page instead. This is why this one will be skipped when iterating the properties injected in DOM.js

    displayDetailsFromTodoAsEditable(todoItem) {
        const titleInput = document.createElement('input');
        titleInput.setAttribute('type', 'text');
        titleInput.setAttribute('id', 'title-input');
        

        // Pre-fill input fields with saved data
        titleInput.value = todoItem.title;
        return titleInput;
    }
}

class TodoDescription {
    constructor() {
        this.name = 'Description';
        this.nameAsHTMLAttribute = 'description';
    }
    
    createInputElementsForForm() {
        const input = document.createElement('textarea');
        input.setAttribute('id', this.nameAsHTMLAttribute);
        input.setAttribute('name', this.nameAsHTMLAttribute);
        return input;
    }

    displayElementsWithContentForTodoScreen(todoItem) {
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = this.name;
        fieldset.appendChild(legend);

        const p = document.createElement('p');
        p.textContent = todoItem.description;
        fieldset.appendChild(p);

        return fieldset;
    }

    displayDetailsFromTodoAsEditable(todoItem) {
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = this.name;
        fieldset.appendChild(legend);

        const input = this.createInputElementsForForm();
        fieldset.appendChild(input);

        // Pre-fill input fields with saved data        
        input.textContent = todoItem.description;
        return fieldset;
    }
}

class TodoDueDate {
    constructor() {
        this.name = 'Due Date';
        this.nameAsHTMLAttribute = 'due-date';
    }
    createInputElementsForForm() {
        const input = document.createElement('input');
        input.setAttribute('type', 'date');
        input.setAttribute('id', this.nameAsHTMLAttribute);
        input.setAttribute('name', this.nameAsHTMLAttribute);
        return input;
    }

    displayElementsWithContentForTodoScreen(todoItem) {
        const fieldset = document.createElement('fieldset'); // this is what is expected to be returned
        const legend = document.createElement('legend');
        legend.textContent = this.name;
        fieldset.appendChild(legend);

        const p = document.createElement('p');
        p.textContent = todoItem.dueDate;
        fieldset.appendChild(p);

        return fieldset;
    }

    displayDetailsFromTodoAsEditable(todoItem) {
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = this.name;
        fieldset.appendChild(legend);
        
        const input = this.createInputElementsForForm();
        fieldset.appendChild(input);

        // Pre-fill input fields with saved data
        input.value = todoItem.dueDate;
        return fieldset;
    }
}

class TodoPriority {
    constructor() {
        this.name = 'Priority';
        this.nameAsHTMLAttribute = 'priority';
    }
    createInputElementsForForm() {
        const select = createSelectWithPriorityOptions();
        select.setAttribute('id', this.nameAsHTMLAttribute);
        select.setAttribute('name', this.nameAsHTMLAttribute);
        return select;
    }

    displayElementsWithContentForTodoScreen(todoItem) {
        const fieldset = document.createElement('fieldset'); // this is what is expected to be returned
        const legend = document.createElement('legend');
        legend.textContent = this.name;
        fieldset.appendChild(legend);

        const p = document.createElement('p');
        p.textContent = todoItem.priority;
        fieldset.appendChild(p);

        return fieldset;
    }

    displayDetailsFromTodoAsEditable(todoItem) {
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = this.name;
        fieldset.appendChild(legend);
        
        const input = this.createInputElementsForForm();
        fieldset.appendChild(input);

        // Pre-fill input fields with saved data
        input.value = todoItem.priority;
        return fieldset;
    }
}

class TodoNotes {
    constructor() {
        this.name = 'Notes';
        this.nameAsHTMLAttribute = 'notes';
    }
    createInputElementsForForm() {
        const input = document.createElement('textarea');
        input.setAttribute('id', this.nameAsHTMLAttribute);
        input.setAttribute('name', this.nameAsHTMLAttribute);
        return input;
    }

    displayElementsWithContentForTodoScreen(todoItem) {
        const fieldset = document.createElement('fieldset'); // this is what is expected to be returned
        const legend = document.createElement('legend');
        legend.textContent = this.name;
        fieldset.appendChild(legend);

        const p = document.createElement('p');
        p.textContent = todoItem.notes;
        fieldset.appendChild(p);

        return fieldset;
    }

    displayDetailsFromTodoAsEditable(todoItem) {
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = this.name;
        fieldset.appendChild(legend);
        
        const input = this.createInputElementsForForm();
        fieldset.appendChild(input);

        // Pre-fill input fields with saved data
        input.textContent = todoItem.notes;
        return fieldset;
    }
}

class TodoChecklist {
    constructor() {
        this.name = 'Checklist';
        this.nameAsHTMLAttribute = 'checklist-input';
    }
    createInputElementsForForm() {
        const div = document.createElement('div');
        div.setAttribute('id', 'checklist-div');

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('id', this.nameAsHTMLAttribute);
        // input.setAttribute('name', this.nameAsHTMLAttribute); IGNORED, TO CONFIRM!

        const button = document.createElement('button');
        button.textContent = 'Add';
        button.setAttribute('type', 'button');
        button.setAttribute('id', 'checklist-add-button');

        div.append(input, button);
        return div;
    }

    displayElementsWithContentForTodoScreen(todoItem, projectItem) {
        const fieldset = document.createElement('fieldset'); // this is what is expected to be returned
        fieldset.setAttribute('id', 'checklist-fieldset');
        const legend = document.createElement('legend');
        legend.textContent = this.name;
        fieldset.appendChild(legend);

        // add more checklist items
        const div = document.createElement('div');
        const checklistInput = document.createElement('input');
        checklistInput.setAttribute('id', 'checklist-input-todo');

        const button = document.createElement('button');
        button.textContent = 'Add';
        button.setAttribute('id', 'checklist-add-button-todo');
        div.append(checklistInput, button);
        fieldset.appendChild(div);

        const ul = document.createElement('ul');
        for (let checklistItem of todoItem.checkList) {
            const li = document.createElement('li');
            ul.appendChild(li);

            const input = document.createElement('input');
            input.setAttribute('type', 'checkbox');
            if (checklistItem.state === true) {
                input.checked = true;
            } else {
                input.checked = false;
            }
            input.addEventListener('change', e => { // checklist items are created with a state value of 'false';
                if (checklistItem.state === true) {
                    checklistItem.state = false;
                } else {
                    checklistItem.state = true;
                }
                pubsub.publish('localStorageUpdated');
            })

            const label = document.createElement('label');
            label.textContent = checklistItem.value;

            const deleteChecklistButton = document.createElement('button');
            deleteChecklistButton.textContent = 'x';

            deleteChecklistButton.addEventListener('click', e => {
                pubsub.publish('checklistItemDeleted', { checklistItem, todoItem, projectItem });
            })

            li.append(input, label, deleteChecklistButton);
        }
        fieldset.appendChild(ul);

        return fieldset;
    }
}


// TodoPriority Helper function
function createSelectWithPriorityOptions() {
    const select = document.createElement('select');
    const priorities = ['High', 'Medium', 'Normal'];
    // Need a default option in case no priority is selected
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Select an option';
    defaultOption.setAttribute('value', '');
    defaultOption.setAttribute('selected', '');
    select.appendChild(defaultOption);

    for (let priority of priorities) {
        const option = document.createElement('option');
        option.textContent = priority;
        option.setAttribute('value', priority[0].toLowerCase() + priority.slice(1));
        select.appendChild(option);
    }

    return select;
}