// ES6 Module to load the page content...
// ... load "ToDo" list based on the selection from the sidebar (Today, Next 7 days, Important,...)

import { createTodoCard } from "./todoCardTemplate";

const pageContent = document.querySelector(".content");


const loadContent = (() => {

    const loadAllTodo = (listArray, projectList) => {
        console.log("Loading all ToDo's");
        // console.log("project list: ");
        // console.log(projectList);

        listArray.forEach(element => {
            const toDoCard = createTodoCard(projectList);
            const toDoCardForm = toDoCard.childNodes[0];

            const toDoCheckbox = toDoCardForm.childNodes[0];
            const toDoTitle = toDoCardForm.childNodes[1];
            const toDoDate = toDoCardForm.childNodes[2];
            const toDoNote = toDoCardForm.childNodes[3];
            const toDoProject = toDoCardForm.childNodes[4];
            const toDoPrority = toDoCardForm.childNodes[5];

            toDoTitle.value = element.title;
            toDoDate.value = element.date;
            toDoNote.value = element.note;
            toDoProject.value = element.project;
            toDoPrority.value = element.priority;
            const toDoID = element.id;

            if (element.isDone) toDoCheckbox.checked = true;

            toDoCard.setAttribute("ID", toDoID);
            pageContent.appendChild(toDoCard);

        });



    };

    const loadTodayTodo = (listArray) => {
        console.log("Loading Today ToDo's");
    };

    return { loadAllTodo, loadTodayTodo };
})();

export { loadContent }