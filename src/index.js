import "./style.css";
import { loadContent } from "./loadContent";
import { isToday, parseISO, compareAsc, startOfToday } from 'date-fns';

const projectList = document.querySelector(".project-list");
const content = document.querySelector(".content");
const formextend = document.querySelector("svg");
const buttonAddProject = document.querySelector("button");
const buttonAddTodo = document.querySelector(".form-button");
const formOptionals = document.querySelectorAll(".form-optional");
const sortingOptions = document.querySelectorAll(".generic-sorting");
let projectListArray = ["default", "top"];
let toDoListArray = [];
let todoID = 0; // TODO: WITH LOCAL STORAGE, ID NEED TO START FROM X DEPENDING OF WHAT IS ALREADY STORED
let activeSelection = "";


/****************************************
DOM / CONTENT LOADING / MANIPULATION
****************************************/

loadContent.loadAllTodo(toDoListArray, projectListArray); //test
activeSelection = "all"

function domLoadAllTodo() {
    loadContent.loadAllTodo(toDoListArray, projectListArray);
};

function removeRemoveAllTodo() {
    const domToDoCard = document.querySelectorAll(".todo-card");
    domToDoCard.forEach(element => content.removeChild(element));
};


function removeATodo(id) {
    const domToDoCard = document.querySelectorAll(".todo-card");
    domToDoCard.forEach(element => {
        const elementID = element.getAttribute("id");
        if (Number(id) === Number(elementID)) content.removeChild(element);
        return;
    });
};

function updateDOM(todoID, domElement) {
    // After an update of a ToDo, check if it's need to be removed from DOM
    let toDoObject = {};
    for (let element of toDoListArray) {
        if (element.id !== Number(todoID)) continue;
        console.log(element + " " + element.id)
        toDoObject = element;
    };

    switch (activeSelection) {
        case "today":
            const todayDate = startOfToday()
            const isoDate = parseISO(toDoObject.date);
            const result = compareAsc(isoDate, todayDate)

            if (result === 1) {
                // TEST TRANSITION
                domElement.classList.add("removed");
                domElement.addEventListener("transitionend", () => {
                    removeATodo(toDoObject.id);
                })
            };

            break;
        case "next":
            break;
        case "important":
            break;
        case "all":
            break;
        default:
            break;
    };
};

/****************************************
GET FORM DATA
****************************************/

function getFormData(data) {


    let formDataArray = [];

    for (let formElement of data) {
        // Store form datas in formDataArray
        if (formElement.getAttribute("type") === "checkbox") {
            formDataArray.push(formElement.checked);
        } else {
            formDataArray.push(formElement.value);
        };
    };

    return formDataArray;
};

/****************************************
TODO OBJECT CREATION / MODIFICATION
****************************************/

// const ToDoObject = (title, note, dueDate, priority = 3, project = "default", groupe, checklist) => {
//     // Factory function to create ToDo Object
//     return { title, note, dueDate, priority, project, groupe, checklist };

// };

const ToDoObject = ([...args]) => {
    // Factory function to create ToDo Object
    //console.log(args);

    // Get the datas from the argument
    const title = args[0];
    const date = args[1];
    const note = args[2];
    const project = args[3];
    const priority = args[4];
    //const getTitle = () => args[0];
    // const getDate = () => args[1];
    // const getNote = () => args[2];
    // const getProject = () => args[3];
    // const getPriority = () => args[4];
    const isDone = false;

    const push = () => {
        // Push the datas to the ToDo list array
        toDoListArray.push({ title: title, date: date, note: note, project: project, priority: priority, isDone: isDone, id: todoID });
        ++todoID;
    };

    return { push };
};

function editToDo(id, newData) {
    // Function to edit ToDo object data

    for (let element of toDoListArray) {
        if (element.id !== Number(id)) continue;
        if (newData[1] !== "") element.title = newData[1];
        element.date = newData[2];
        element.note = newData[3];
        element.project = newData[4];
        element.priority = newData[5];
        element.isDone = newData[0];
        return;
    };

};


/****************************************
EVENT LISTENER
****************************************/

buttonAddProject.addEventListener("click", () => {
    //TEST
    console.log(toDoListArray);
});

buttonAddTodo.addEventListener("click", () => {
    // When the button "ADD TODO" is clicked...

    //... Get the datas from the form
    const formElement = document.querySelector('form'); //Get the FORM DOM element
    const formDataArray = getFormData(formElement); // Extract datas as an array from the FORM

    if (formDataArray[0].trim() === "") return;

    //... Create a new object
    const newTodo = ToDoObject(formDataArray);
    newTodo.push(); //... and push it to the ToDo list array

    //... Refresh ToDo Display
    removeRemoveAllTodo();
    domLoadAllTodo();
});

content.addEventListener("click", (e) => {
    // ...
    const elementClass = e.target.classList[0];

    switch (elementClass) {
        case "todo-card-extend":
            const card = e.target.parentElement;
            const chevronImage = e.target;

            for (let child of card.childNodes) {
                if (child.classList[1] === "todo-card-optional") {
                    child.classList.toggle("show");
                };
            };

            chevronImage.classList.toggle("rotate"); // Rotate "chevron" image
            break;

        case "todo-delete":
            const todoID = e.target.parentElement.parentElement.getAttribute("id");

            // Remove ToDo from array
            for (let i = 0; i < toDoListArray.length; ++i) {
                console.log(`Array: ${toDoListArray[i].id} ; index: ${i}; to Delete: ${todoID}`)

                if (toDoListArray[i].id === Number(todoID)) {
                    console.log("found");
                    toDoListArray.splice(i, 1);
                };
            };

            // Remove ToDo from DOM
            removeATodo(todoID);
            break;

        default:
            break;
    }
});

content.addEventListener("change", (e) => {
    // Check for ToDo modification 
    if (e.target.form.classList[0] === "todo-form") return; // ignore if the change is from "Add Todo" form

    const todoID = e.target.parentElement.parentElement.getAttribute("id");
    const toDoFormElement = e.target.parentElement; //Get the FORM DOM element
    const toDoFormData = toDoFormElement.elements; //Get the FORM DOM element data

    const formDataArray = getFormData(toDoFormData); // Extract datas as an array from the FORM

    //If ToDo title is removed, it's restored
    if (toDoFormData[1].value === "") {
        toDoFormData[1].value = toDoListArray[todoID].title;
    };

    editToDo(todoID, formDataArray); //Edit ToDo objet with the new datas
    updateDOM(todoID, toDoFormElement);

    //removeRemoveAllTodo();
    //domLoadAllTodo();
});

formextend.addEventListener("click", (e) => {
    // extend form :
    formOptionals.forEach(input => {
        input.classList.toggle("show");
    });

    formextend.classList.toggle("rotate");
});

sortingOptions.forEach(options => options.addEventListener("click", (e) => {
    const sortingOption = e.target.getAttribute("sorting");
    const sortingOptionDOM = e.target;

    sortingOptions.forEach(options => options.classList.remove("activeSelection"));

    switch (sortingOption) {
        case "today":
            removeRemoveAllTodo();
            loadContent.loadTodayTodo(toDoListArray, projectListArray);
            sortingOptionDOM.classList.add("activeSelection");
            activeSelection = "today"
            break;
        case "next":
            sortingOptionDOM.classList.add("activeSelection");
            activeSelection = "next"
            break;
        case "important":
            sortingOptionDOM.classList.add("activeSelection");
            activeSelection = "important"
            break;
        case "all":
            removeRemoveAllTodo();
            loadContent.loadAllTodo(toDoListArray, projectListArray); //test
            sortingOptionDOM.classList.add("activeSelection");
            activeSelection = "all"
            break;
        default:
            break;
    };
}));