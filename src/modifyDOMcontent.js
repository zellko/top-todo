// ES6 Module to load the page content...
// ... load "ToDo" list based on the selection from the sidebar (Today, Next 7 days, Important,...)

import { createTodoCard } from "./todoCardTemplate";
import { dateTime } from "./dateTime";

const pageContent = document.querySelector(".content");
const todayDate = dateTime.todayDate();


function loadToDoDom(todo, projectList) {
    const isInPast = dateTime.isDateInPast(todo.date);

    const toDoCard = createTodoCard(projectList, isInPast);
    populateCard(toDoCard, todo);

    const toDoID = todo.id;
    toDoCard.setAttribute("ID", toDoID);
    pageContent.appendChild(toDoCard);
}

function populateCard(toDoCard, element) {
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

    if (element.isDone) toDoCheckbox.checked = true;
};

function displayMessage(message) {
    const noToDoMessage = document.createElement("h2");
    noToDoMessage.textContent = message;
    pageContent.appendChild(noToDoMessage);
};

function removeMessage() {
    const noToDoMessage = document.querySelector("h2");
    if (noToDoMessage !== null) pageContent.removeChild(noToDoMessage);
};

const modifyDOMcontent = (() => {

    const removeRemoveAllTodo = () => {
        console.log("Removing all ToDo's");
        const domToDoCard = document.querySelectorAll(".todo-card");
        domToDoCard.forEach(element => pageContent.removeChild(element));
    };

    const removeATodo = (id) => {
        const domToDoCard = document.querySelectorAll(".todo-card");
        domToDoCard.forEach(element => {
            const elementID = element.getAttribute("id");
            if (Number(id) === Number(elementID)) pageContent.removeChild(element);
            return;
        });
    };

    const loadAllTodo = (listArray, projectList) => {
        console.log("Loading all ToDo's");

        removeMessage();

        if (listArray.length === 0) {
            displayMessage("No ToDo found! Create your first ToDo using the form above!");
            return;
        };

        listArray.forEach(element => {
            loadToDoDom(element, projectList);
        });
    };

    const loadTodayTodo = (listArray, projectList) => {
        console.log("Loading Today ToDo's");
        let todayArray = [];

        removeMessage();

        for (let element of listArray) {
            const isoDate = dateTime.parseDate(element.date);
            const result = dateTime.compareDate(isoDate, todayDate)

            if (result === 1) continue; // If ToDo date is in future, ignore it.
            if (element.date === "") continue; // If ToDo date is not defined, ignore it.

            loadToDoDom(element, projectList);

            todayArray.push(element);
        };

        if (todayArray.length === 0) {
            displayMessage("You are up do date! No Todo with due date today!");
            return;
        };
    };

    const loadNextWeekTodo = (listArray, projectList) => {
        console.log("Loading NextWeek ToDo's");
        let nextWeekArray = [];

        removeMessage();

        for (let element of listArray) {
            const isoDate = dateTime.parseDate(element.date);
            const nextWeekDate = dateTime.nextWeekDate(todayDate, 7);

            const result = dateTime.compareDate(isoDate, nextWeekDate)

            if (result === 1) continue; // If ToDo date is in future, ignore it.
            if (element.date === "") continue; // If ToDo date is not defined, ignore it.

            loadToDoDom(element, projectList);

            nextWeekArray.push(element);
        };

        if (nextWeekArray.length === 0) {
            displayMessage("You are up do date! No Todo with due date this week!");
            return;
        };
    };

    const loadPrioTodo = (listArray, projectList) => {
        console.log("Loading High prio ToDo's");
        let prioArray = [];

        removeMessage();

        for (let element of listArray) {

            if (element.priority !== "1") continue; // If ToDo date is not defined, ignore it.
            loadToDoDom(element, projectList);

            prioArray.push(element);
        };

        if (prioArray.length === 0) {
            displayMessage("You are up do date! No Todo with priority 1!");
            return;
        };
    };

    const loadProjectTodo = (listArray, projectList, project) => {
        console.log(`Loading project: ${project} ToDo's`);

        let projectArray = [];
        removeMessage();

        for (let element of listArray) {
            // const isoDate = parseISO(element.date);
            // const result = compareAsc(isoDate, todayDate)

            if (element.project !== project) continue; // If ToDo date is not defined, ignore it.

            loadToDoDom(element, projectList);

            projectArray.push(element);
        };

        if (projectArray.length === 0) {
            displayMessage(`No ToDo for ${project.toUpperCase()} project! Create your first ToDo using the form above!`);
            return;
        };
    };

    const loadATodo = (todo, projectList) => {
        console.log(`Loading a single ToDo's`);

        removeMessage();
        loadToDoDom(todo, projectList);
    };

    return { removeATodo, removeRemoveAllTodo, loadAllTodo, loadTodayTodo, loadNextWeekTodo, loadPrioTodo, loadProjectTodo, loadATodo };
})();

export { modifyDOMcontent }