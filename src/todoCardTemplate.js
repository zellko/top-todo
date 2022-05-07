import extendIcon from './chevron-down.svg';
import deleteIcon from './delete.svg';

function createTodoCard() {
    const toDoCard = document.createElement("div");
    toDoCard.classList.add("todo-card");

    const toDoCheckBox = document.createElement("input");
    toDoCheckBox.type = "checkbox";

    const toDoDate = document.createElement("input");
    toDoDate.type = "date";

    const toDoTitle = document.createElement("input");

    const toDoextend = document.createElement("img");
    toDoextend.src = extendIcon;

    const toDoDelete = document.createElement("img");
    toDoDelete.src = deleteIcon;

    const test = document.createElement("input");
    test.classList.add("todo-card-input");
    test.classList.add("todo-card-optional");

    toDoextend.classList.add("todo-card-extend");
    toDoTitle.classList.add("todo-card-input");
    toDoCheckBox.classList.add("todo-card-input");
    toDoDate.classList.add("todo-card-input");
    toDoCard.append(toDoCheckBox, toDoTitle, toDoDate, toDoextend, toDoDelete, test);

    return toDoCard;
};

export { createTodoCard };