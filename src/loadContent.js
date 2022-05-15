// ES6 Module to load the page content...
// ... load "ToDo" list based on the selection from the sidebar (Today, Next 7 days, Important,...)

import { createTodoCard } from "./todoCardTemplate";
import { isToday, parseISO, compareAsc, startOfToday } from 'date-fns';


const pageContent = document.querySelector(".content");
const todayDate = startOfToday()

function compareDate(date) {
    const isoDate = parseISO(date);
    const result = compareAsc(isoDate, todayDate)
    let isInPast = false;
    if (result === -1) isInPast = true;
    return isInPast;
};

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

const loadContent = (() => {

    const loadAllTodo = (listArray, projectList) => {
        console.log("Loading all ToDo's");

        removeMessage();

        if (listArray.length === 0) {
            displayMessage("No ToDo found! Create your first ToDo using the form above!");
            return;
        };

        listArray.forEach(element => {
            const isInPast = compareDate(element.date);

            const toDoCard = createTodoCard(projectList, isInPast);
            populateCard(toDoCard, element);

            const toDoID = element.id;
            toDoCard.setAttribute("ID", toDoID);
            pageContent.appendChild(toDoCard);
        });



    };

    const loadTodayTodo = (listArray, projectList) => {
        console.log("Loading Today ToDo's");
        let todayArray = [];

        removeMessage();

        for (let element of listArray) {
            const isoDate = parseISO(element.date);
            const result = compareAsc(isoDate, todayDate)

            if (result === 1) continue; // If ToDo date is in future, ignore it.
            if (element.date === "") continue; // If ToDo date is not defined, ignore it.

            const isInPast = compareDate(element.date);

            const toDoCard = createTodoCard(projectList, isInPast);
            populateCard(toDoCard, element);

            const toDoID = element.id;

            toDoCard.setAttribute("ID", toDoID);
            pageContent.appendChild(toDoCard);

            todayArray.push(element);
        };

        if (todayArray.length === 0) {
            displayMessage("You are up do date! No Todo with due date as today!");
            return;
        };
    };

    return { loadAllTodo, loadTodayTodo };
})();

export { loadContent }