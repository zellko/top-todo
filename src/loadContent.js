// ES6 Module to load the page content...
// ... load "ToDo" list based on the selection from the sidebar (Today, Next 7 days, Important,...)

import { createTodoCard } from "./todoCardTemplate";

const pageContent = document.querySelector(".content");


const loadContent = (() => {

    const loadAllTodo = (listArray) => {
        console.log(listArray);
        console.log("Loading all ToDo's");

        const toDoCard = createTodoCard();

        console.log(toDoCard.childNodes[0]);
        toDoCard.childNodes[0].value = "tdsdsaest";

        console.log(toDoCard);
        pageContent.appendChild(toDoCard);

    };

    const loadTodayTodo = (listArray) => {
        console.log(listArray);
        console.log("Loading Today ToDo's");
    };

    return { loadAllTodo, loadTodayTodo };
})();

export { loadContent }