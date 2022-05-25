import extendIcon from './chevron-down.svg';
import deleteIcon from './delete.svg';

function createTodoCard(projectList, isInPast) {
    const toDoCard = document.createElement("div");
    toDoCard.classList.add("todo-card");
    const toDoForm = document.createElement("form");

    const toDoCheckBox = document.createElement("input");
    toDoCheckBox.type = "checkbox";

    const toDoDate = document.createElement("input");
    toDoDate.type = "date";

    const toDoTitle = document.createElement("input");

    const toDoextend = document.createElement("img");
    toDoextend.src = extendIcon;

    const toDoDelete = document.createElement("img");
    toDoDelete.src = deleteIcon;

    const toDoNote = document.createElement("textarea");

    const toDoProject = document.createElement("select");
    for (let project of projectList) {
        const projectOption = document.createElement("option");
        projectOption.value = project;
        projectOption.textContent = project;
        toDoProject.appendChild(projectOption);
    };

    const toDoPriotity = document.createElement("select");
    const prioOne = document.createElement("option");
    const prioTwo = document.createElement("option");
    const prioTree = document.createElement("option");
    prioOne.value = 1;
    prioOne.textContent = "1";
    prioTwo.value = 2;
    prioTwo.textContent = "2";
    prioTree.value = 3;
    prioTree.textContent = "3";
    toDoPriotity.append(prioOne, prioTwo, prioTree);

    toDoextend.classList.add("todo-card-extend");
    toDoTitle.classList.add("todo-card-input");
    toDoCheckBox.classList.add("todo-card-input");
    toDoDate.classList.add("todo-card-input");
    toDoDate.classList.add("todo-card-optional");
    toDoNote.classList.add("todo-card-input");
    toDoNote.classList.add("todo-card-optional");
    toDoProject.classList.add("todo-card-input");
    toDoProject.classList.add("todo-card-optional");
    toDoPriotity.classList.add("todo-card-input");
    toDoPriotity.classList.add("todo-card-optional");
    toDoDelete.classList.add("todo-delete");

    if (isInPast) toDoForm.classList.add("inPast");
    toDoForm.classList.add("card-form");

    toDoForm.append(toDoCheckBox, toDoTitle, toDoDate, toDoNote, toDoProject, toDoPriotity, toDoextend, toDoDelete);
    toDoCard.appendChild(toDoForm);
    return toDoCard;
};

export { createTodoCard };