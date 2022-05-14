// ES6 Module to load the page content...
// ... load "ToDo" list based on the selection from the sidebar (Today, Next 7 days, Important,...)

import { createTodoCard } from "./todoCardTemplate";

const pageContent = document.querySelector(".content");


const loadContent = (() => {

    const loadAllTodo = (listArray, projectList) => {
        console.log("Loading all ToDo's");
        console.log("project list: ");
        console.log(projectList);

        listArray.forEach(element => {
            const toDoCard = createTodoCard(projectList);

            const toDoTitle = toDoCard.childNodes[1];
            const toDoDate = toDoCard.childNodes[2];
            const toDoNote = toDoCard.childNodes[5];
            const toDoProject = toDoCard.childNodes[6];
            const toDoPrority = toDoCard.childNodes[7];

            toDoTitle.value = element.title;
            toDoDate.value = element.date;
            toDoNote.value = element.note;
            toDoProject.value = element.project;
            toDoPrority.value = element.priority;
            const toDoID = element.id;

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