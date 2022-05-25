import "./style.css";
import { modifyDOMcontent } from "./modifyDOMcontent";
import { modifyDOMproject } from "./modifyDOMproject";
import { showModal, hideModal } from "./modal";
import { isToday, parseISO, compareAsc, startOfToday, format, addDays, getTime } from 'date-fns';

const content = document.querySelector(".content");
const sidebar = document.querySelector(".sidebar");
const formextend = document.querySelector("svg");
const buttonAddProject = document.querySelector(".project-form button");
const buttonAddTodo = document.querySelector(".form-button");
const formOptionals = document.querySelectorAll(".form-optional");
const sorting = document.querySelectorAll("ul");
// const modal = document.querySelector(".info");
const modalClose = document.querySelector(".info button");

const formToDo = document.querySelector(".todo-form"); //Get the FORM DOM element
const formProject = document.querySelector(".project-form"); //Get the FORM DOM element

let projectListArray = ["default", "top"];
let toDoListArray = [];
let activeSelection = "";
let activeProject = "";

function chooseID() {
    const id = getTime(new Date());
    return id;
}

/****************************************
INIT
****************************************/
modifyDOMcontent.loadAllTodo(toDoListArray, projectListArray);
modifyDOMproject.loadProjectList(projectListArray);
activeSelection = "all"

const setSelection = document.querySelector("[sorting='all']");
setSelection.classList.add("activeSelection");

/****************************************
DOM / CONTENT LOADING / MANIPULATION
****************************************/

function updateDOM(todoID) {
    // After an update of a ToDo, check if it's need to be removed from DOM
    const todayDate = startOfToday()
    const domElement = document.querySelector(`[id='${todoID}']`);
    let toDoObject = {};
    let result = undefined;
    let removeTodo = false;

    for (let element of toDoListArray) {
        if (element.id !== Number(todoID)) continue;
        toDoObject = element;
    };

    const isoDate = parseISO(toDoObject.date);

    switch (activeSelection) {
        case "today":
            result = compareAsc(isoDate, todayDate);
            if (result === 1) removeTodo = true;
            break;
        case "next":
            const nextWeekDate = addDays(todayDate, 7);
            result = compareAsc(isoDate, nextWeekDate);
            if (result === 1) removeTodo = true;
            break;
        case "important":
            if (toDoObject.priority !== 1) removeTodo = true;
            break;
        case "project":
            if (toDoObject.project !== activeProject) removeTodo = true;
            break;
        case "all":
            break;
    };

    if (removeTodo) {
        // TEST TRANSITION
        domElement.classList.add("removed");
        showModal("ToDo moved to correct section!");
        //domElement.addEventListener("transitionend", () => {
        modifyDOMcontent.removeATodo(toDoObject.id);
        //});
    };
};

/****************************************
FORM DATA
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

function clearFormValue() {
    //form[0].value = "";
    formToDo[1].value = "yyyy-mm-dd";
    formToDo[2].value = "";
    formToDo[3].value = "default";
    formToDo[4].value = 3;
};

/****************************************
TODO OBJECT CREATION / MODIFICATION
****************************************/

class ToDoObject {
    // class methods
    constructor([...args]) {
        this.title = args[0];
        this.date = args[1];
        this.note = args[2];
        this.project = args[3];
        this.priority = args[4];
        this.isDone = false;
        this.id = chooseID();
    }

    edit(newData) {
        if (newData[1] !== "") this.title = newData[1];
        this.date = newData[2];
        this.note = newData[3];
        this.project = newData[4];
        this.priority = newData[5];
        this.isDone = newData[0];
    }

    push() {
        toDoListArray.push(this);
    }
}

/****************************************
EVENT LISTENER
****************************************/

buttonAddProject.addEventListener("click", () => {
    const projectName = formProject[0].value.toLowerCase();

    if (projectName !== "" && !projectListArray.includes(projectName)) {
        projectListArray.push(projectName);
        modifyDOMproject.removeProjectList();
        modifyDOMproject.loadProjectList(projectListArray);
        formProject[0].value = "";
    };

});

buttonAddTodo.addEventListener("click", () => {
    // When the button "ADD TODO" is clicked...

    //... Get the datas from the formToDo
    const formDataArray = getFormData(formToDo); // Extract datas as an array from the FORM

    if (formDataArray[0].trim() === "") return;

    //... Create a new object
    const newTodo = new ToDoObject(formDataArray);
    newTodo.push(); //... and push it to the ToDo list array

    //... Refresh ToDo Display
    modifyDOMcontent.loadATodo(newTodo, projectListArray);
    updateDOM(newTodo.id);
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
                if (toDoListArray[i].id === Number(todoID)) {
                    toDoListArray.splice(i, 1);
                };
            };

            // Remove ToDo from DOM
            modifyDOMcontent.removeATodo(todoID);
            break;

        default:
            break;
    }
});

content.addEventListener("change", (e) => {
    // Check for ToDo modification 
    const todoID = e.target.parentElement.parentElement.getAttribute("id");
    if (todoID === null) return;

    const toDoFormElement = e.target.parentElement; //Get the FORM DOM element
    const toDoFormData = toDoFormElement.elements; //Get the FORM DOM element data
    const formDataArray = getFormData(toDoFormData); // Extract datas as an array from the FORM

    //If ToDo title is removed, it's restored
    if (toDoFormData[1].value === "") {
        toDoFormData[1].value = toDoListArray[todoID].title;
    };

    for (let element of toDoListArray) {
        if (element.id !== Number(todoID)) continue;
        element.edit(formDataArray);
    };

    updateDOM(todoID);
});

formextend.addEventListener("click", (e) => {
    // extend form :
    formOptionals.forEach(input => {
        input.classList.toggle("show");
    });

    formextend.classList.toggle("rotate");
});

sidebar.addEventListener("click", (e) => {
    const elementClass = e.target.classList[0];

    // need to create a  project delete function!
    if (elementClass === "project-delete") {

        // Remove the element from the DOM
        const projectName = e.target.parentNode.textContent;
        modifyDOMproject.removeProject(projectName);

        // Remove the element from the array
        let index = projectListArray.indexOf(projectName.toLowerCase());
        projectListArray.splice(index, 1)

        // Delete related todo from array
        const newArray = toDoListArray.filter(todo => {
            return todo.project !== projectName.toLowerCase();
        });
        toDoListArray = newArray;

        // Update DOM
        modifyDOMcontent.removeRemoveAllTodo();
        modifyDOMcontent.loadAllTodo(toDoListArray);
        setSelection.classList.add("activeSelection");
        showModal("Project and ToDo deleted!");
    };

    // need to create a todo sorting function!
    const sortingOption = e.target.getAttribute("sorting");
    const sortingOptionDOM = e.target;
    const elementList = document.querySelectorAll(".sorting");

    if (sortingOptionDOM.localName !== "li") return;

    elementList.forEach(options => options.classList.remove("activeSelection"));

    modifyDOMcontent.removeRemoveAllTodo();
    sortingOptionDOM.classList.add("activeSelection");
    clearFormValue();

    switch (sortingOption) {
        case "today":
            modifyDOMcontent.loadTodayTodo(toDoListArray, projectListArray);
            activeSelection = "today";

            formToDo[1].value = format(new Date(), "yyyy-MM-dd");
            break;
        case "next":
            modifyDOMcontent.loadNextWeelTodo(toDoListArray, projectListArray);
            activeSelection = "next";

            const nextWeek = addDays(new Date(), 7)
            formToDo[1].value = format(nextWeek, "yyyy-MM-dd");
            break;
        case "important":
            modifyDOMcontent.loadPrioTodo(toDoListArray, projectListArray);
            activeSelection = "important";

            formToDo[4].value = 1;
            break;
        case "all":
            modifyDOMcontent.loadAllTodo(toDoListArray, projectListArray);
            activeSelection = "all";

            break;
        case "project":
            const project = e.target.textContent.toLowerCase();
            modifyDOMcontent.loadProjectTodo(toDoListArray, projectListArray, project);

            activeSelection = "project";
            activeProject = project

            formToDo[3].value = project;
            break;
        default:
            break;
    };
});

modalClose.addEventListener("click", hideModal);