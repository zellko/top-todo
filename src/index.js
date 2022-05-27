import "./style.css";
import { modifyDOMcontent } from "./modifyDOMcontent";
import { modifyDOMproject } from "./modifyDOMproject";
import { modal } from "./modal";
import { storage } from "./storage";
import { dateTime } from "./dateTime";

const content = document.querySelector(".content");
const sidebar = document.querySelector(".sidebar");
const formextend = document.querySelector("svg");
const buttonAddProject = document.querySelector(".project-form button");
const buttonAddTodo = document.querySelector(".form-button");
const formOptionals = document.querySelectorAll(".form-optional");
const modalSection = document.querySelector(".modal");
const formToDo = document.querySelector(".todo-form"); //Get the FORM DOM element
const formProject = document.querySelector(".project-form"); //Get the FORM DOM element
const setSelection = document.querySelector("[sorting='all']");

let projectListArray = ["default", "top"];
let toDoListArray = [];
let activeSelection = "";
let activeProject = "";
let isStorageAvailable = false;


/****************************************
INIT
****************************************/

function init() {
    // Initalisation function, called when the page is loaded

    // Check if browser support local Storage....
    if (storage.checkStorage("localStorage") === true) {

        isStorageAvailable = true;

        // get the project list in storage...
        if (storage.getLocalStorage("projectListArray") !== null) {
            projectListArray = storage.getLocalStorage("projectListArray");
        };

        // get the ToDo's in storage... create ToDo object from them
        if (storage.getLocalStorage("toDoListArray") !== null) {
            const storedTodo = storage.getLocalStorage("toDoListArray");

            for (const todo of storedTodo) {
                const newTodo = new ToDoObject([]);

                let dataArray = [];

                dataArray[0] = todo.isDone;
                dataArray[1] = todo.title;
                dataArray[2] = todo.date;
                dataArray[3] = todo.note;
                dataArray[4] = todo.project;
                dataArray[5] = todo.priority;

                newTodo.edit(dataArray);
                newTodo.push(); //... and push it to the ToDo list array
            };
        };
    };

    // Load ToDo's, projects, and display all ToDo on the page
    modifyDOMcontent.loadAllTodo(toDoListArray, projectListArray);
    modifyDOMproject.loadProjectList(projectListArray);
    activeSelection = "all"

    setSelection.classList.add("activeSelection"); // Highligh the section "All tasks"
};


/****************************************
DOM / CONTENT LOADING / MANIPULATION
****************************************/

function updateDOM(todoID) {
    // After an update of a ToDo, check if it's need to be removed from DOM
    const domElement = document.querySelector(`[id='${todoID}']`); //Get  DOM element of  ToDo modified
    let toDoObject = {};
    let result = undefined;
    let removeTodo = false;

    // Get ToDo object and copy it to toDoObject local variable
    for (let element of toDoListArray) {
        if (element.id !== Number(todoID)) continue;
        toDoObject = element;
    };

    const todayDate = dateTime.todayDate(); // Get today date
    const isoDate = dateTime.parseDate(toDoObject.date); // Get ToDo object date and parse it to be usable.

    // Depending of section, ToDo should be removed or not followiing different rules
    switch (activeSelection) {
        case "today":
            // If section is "Today", check if ToDo date is same as today date. if no, remove it.
            result = dateTime.compareDate(isoDate, todayDate);
            if (result === 1) removeTodo = true;
            break;
        case "next":
            // If section is "Next 7 days", check if ToDo date is after as today date + 7 days. if no, remove it.
            const nextWeekDate = dateTime.nextWeekDate(todayDate);

            result = dateTime.compareDate(isoDate, nextWeekDate);
            if (result === 1) removeTodo = true;
            break;
        case "important":
            // If section is "Important", check if ToDo priority is 1. if no, remove it.
            if (toDoObject.priority !== 1) removeTodo = true;
            break;
        case "project":
            // If section is a project, check if ToDo project is the same. if no, remove it.
            if (toDoObject.project !== activeProject) removeTodo = true;
            break;
    };

    if (removeTodo) {
        // Remove  ToDo from DOM, with a "fading" transition
        domElement.classList.add("removed");

        const modalText = modal.loadModal();
        modalText.textContent = "ToDo moved to correct section!";

        domElement.addEventListener("transitionend", () => {
            modifyDOMcontent.removeATodo(toDoObject.id);
        });
    };
};

/****************************************
FORM DATA
****************************************/

function getFormData(data) {
    // Get the data from form element, and convert it to an array.
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
    // Clear the form on the DOM.
    //form[0].value = "";
    formToDo[1].value = "yyyy-mm-dd";
    formToDo[2].value = "";
    formToDo[3].value = "default";
    formToDo[4].value = 3;
};

/****************************************
TODO OBJECT CREATION / MODIFICATION
****************************************/

function chooseID() {
    // Return a random ID number using Math and Date function
    return Math.floor(Math.random() * Date.now());
}

class ToDoObject {
    // ToDo object Class
    constructor([...args]) {
        this.title = args[0];
        this.date = args[1];
        this.note = args[2];
        this.project = args[3];
        this.priority = args[4];
        this.isDone = false;
        this.id = chooseID();
    };

    edit(newData) {
        // Method to edit ToDo object
        if (newData[1] !== "") this.title = newData[1];
        this.date = newData[2];
        this.note = newData[3];
        this.project = newData[4];
        this.priority = newData[5];
        this.isDone = newData[0];
    };

    push() {
        // Method to push ToDo object into toDoListArray which is storing all ToDo's
        toDoListArray.push(this);
    };
};

function sortTodo(element) {
    // Function to sort ToDo's depending on which section the user is in.

    const sortingOption = element.target.getAttribute("sorting"); // Get target attribute 
    const sortingOptionDOM = element.target; // Get target
    const elementList = document.querySelectorAll(".sorting"); // Get all sorting element 

    elementList.forEach(options => options.classList.remove("activeSelection")); // Remove "highlight" of all sorting element
    sortingOptionDOM.classList.add("activeSelection"); //Highlight the current section

    modifyDOMcontent.removeRemoveAllTodo(); // Clear ToDo's displayed in the DOM

    //clearFormValue();

    // Depending of which section is clicked, ToDo's are displayed in they fit the section. 
    switch (sortingOption) {
        case "today":
            // If section is "Today", load all ToDo's with date as today
            modifyDOMcontent.loadTodayTodo(toDoListArray, projectListArray);
            activeSelection = "today";

            formToDo[1].value = dateTime.formateDate(new Date());
            break;
        case "next":
            // If section is "Next 7 days", load all ToDo's with date as today to +7 days
            modifyDOMcontent.loadNextWeekTodo(toDoListArray, projectListArray);
            activeSelection = "next";

            const nextWeek = dateTime.nextWeekDate(new Date());
            formToDo[1].value = dateTime.formateDate(nextWeek);
            break;
        case "important":
            // If section is "Important", load all ToDo's with priority 1
            modifyDOMcontent.loadPrioTodo(toDoListArray, projectListArray);
            activeSelection = "important";

            formToDo[4].value = 1;
            break;
        case "all":
            // If section is "All taks", load all ToDo's
            modifyDOMcontent.loadAllTodo(toDoListArray, projectListArray);
            activeSelection = "all";

            break;
        case "project":
            // If section is s project, load all ToDo's with this project
            const project = element.target.textContent.toLowerCase();
            modifyDOMcontent.loadProjectTodo(toDoListArray, projectListArray, project);

            activeSelection = "project";
            activeProject = project

            formToDo[3].value = project;
            break;
        default:
            break;
    };
};

/****************************************
PROJECT
****************************************/

function deleteProject(element) {
    // Function to delete a project
    const text = "All your ToDo's related to the project will be deleted!\n\nClick OK or Cancel.";
    if (confirm(text) == false) return; // Inform user that ToDo linked to the project will be also deleted

    const projectName = element.target.parentNode.textContent;

    // Remove the element from the array
    let index = projectListArray.indexOf(projectName.toLowerCase());
    projectListArray.splice(index, 1)

    // Delete related todo from array
    const newArray = toDoListArray.filter(todo => {
        return todo.project !== projectName.toLowerCase();
    });
    toDoListArray = newArray;

    // In case there is no project, create a "default" project and inform user that at least one project need to be created
    if (projectListArray.length === 0) {
        projectListArray.push("default");
        const modalText = modal.loadModal();
        modalText.textContent = "You need to have at least one project! Default project created."
    };

    // Remove the element from the DOM
    modifyDOMproject.removeProjectList();
    modifyDOMproject.loadProjectList(projectListArray);

    // Remove the active section of the list
    const elementList = document.querySelectorAll(".sorting");
    elementList.forEach(options => options.classList.remove("activeSelection"));

    // Update DOM, load "All tasks"
    modifyDOMcontent.removeRemoveAllTodo();
    modifyDOMcontent.loadAllTodo(toDoListArray, projectListArray);
    activeSelection = "all";
    setSelection.classList.add("activeSelection");

    // Inform user that project and ToDo where deleted
    const modalTextb = modal.loadModal();
    modalTextb.textContent = "Project and ToDo deleted!";

}

/****************************************
EVENT LISTENER
****************************************/

buttonAddProject.addEventListener("click", () => {
    // When the button "add project (+)" is clicked...
    const projectName = formProject[0].value.toLowerCase();

    // If project name is not filled, ignore click
    if (projectName !== "" && !projectListArray.includes(projectName)) {
        projectListArray.push(projectName); // Push project to array
        modifyDOMproject.removeProjectList(); // Clear DOM
        modifyDOMproject.loadProjectList(projectListArray); // Reload all project
        formProject[0].value = ""; // Clear input
    };

    // Update local storage, if available
    if (isStorageAvailable) storage.populateLocalStorage("projectListArray", projectListArray);
});

buttonAddTodo.addEventListener("click", () => {
    // When the button "ADD TODO" is clicked...

    //... Get the datas from the formToDo
    const formDataArray = getFormData(formToDo); // Extract datas as an array from the FORM

    if (formDataArray[0].trim() === "") return; // If title is empty, ignore the click

    //... Create a new object
    const newTodo = new ToDoObject(formDataArray);
    newTodo.push(); //... and push it to the ToDo list array

    //... Refresh ToDo Display
    modifyDOMcontent.loadATodo(newTodo, projectListArray);
    updateDOM(newTodo.id);

    // Update local storage, if available
    if (isStorageAvailable) storage.populateLocalStorage("toDoListArray", toDoListArray);
});

content.addEventListener("click", (e) => {
    // When user click on an element of the content...
    const elementClass = e.target.classList[0];

    switch (elementClass) {
        case "todo-card-extend":
            // If user clicked on "ToDo extend" arrow, extend the form
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
            // If it clicked on "ToDo delete" button,...
            const todoID = e.target.parentElement.parentElement.getAttribute("id");

            // Remove ToDo from array
            for (let i = 0; i < toDoListArray.length; ++i) {
                if (toDoListArray[i].id === Number(todoID)) {
                    toDoListArray.splice(i, 1);
                };
            };

            // Remove ToDo from DOM
            modifyDOMcontent.removeATodo(todoID);

            // Update local storage, if available
            if (isStorageAvailable) storage.populateLocalStorage("toDoListArray", toDoListArray);
            break;
    }
});

content.addEventListener("change", (e) => {
    // Check for ToDo modification 
    const todoID = e.target.parentElement.parentElement.getAttribute("id");
    if (todoID === null) return;

    const toDoFormElement = e.target.parentElement; //Get the FORM DOM element
    const toDoFormData = toDoFormElement.elements; //Get the FORM DOM element data
    const formDataArray = getFormData(toDoFormData); // Extract data's as an array from the FORM

    //If ToDo title is removed, it's restored
    if (toDoFormData[1].value === "") {
        toDoFormData[1].value = toDoListArray[todoID].title;
    };

    for (let element of toDoListArray) {
        if (element.id !== Number(todoID)) continue;
        element.edit(formDataArray); // Edit modified ToDo with new values
    };

    updateDOM(todoID); // Check if DOM need to be modified

    // Update local storage, if available
    if (isStorageAvailable) storage.populateLocalStorage("toDoListArray", toDoListArray);
});

formextend.addEventListener("click", (e) => {
    // Extend or close form when user click on the arrow
    formOptionals.forEach(input => {
        input.classList.toggle("show");
    });

    formextend.classList.toggle("rotate");
});

sidebar.addEventListener("click", (e) => {
    // When user click on an element of the sidebar...

    const elementClass = e.target.classList[0]; //... Get class name of the element...

    if (elementClass === "project-delete") { //... delete the project
        deleteProject(e);

        // Update local storage, if available
        if (isStorageAvailable) {
            storage.populateLocalStorage("projectListArray", projectListArray)
        };
    };
    if (elementClass === "sorting") sortTodo(e); //... or sort the ToDo's
});

modalSection.addEventListener("click", (e) => {
    // Remove modal from DOM when user click on "close" button
    const modalDiv = e.target.offsetParent;

    if (e.target.localName === "button") {
        modal.deleteModal(modalDiv);
    };
});

/** INIT **/
init()