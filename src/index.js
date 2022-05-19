import "./style.css";
import { modifyDOMcontent } from "./modifyDOMcontent";
import { modifyDOMproject } from "./modifyDOMproject"
import { isToday, parseISO, compareAsc, startOfToday, format, addDays } from 'date-fns';

const projectList = document.querySelector(".project-list");
const content = document.querySelector(".content");
const formextend = document.querySelector("svg");
const buttonAddProject = document.querySelector("button");
const buttonAddTodo = document.querySelector(".form-button");
const formOptionals = document.querySelectorAll(".form-optional");
const sorting = document.querySelectorAll(".sorting");

const projectSelector = document.querySelector("#form-project");
const dateSelector = document.querySelector("#form-date");
const prioritySelector = document.querySelector("#form-priority");

const form = document.querySelector('form'); //Get the FORM DOM element

let projectListArray = ["default", "top"];
let toDoListArray = [];
let todoID = 0; // TODO: WITH LOCAL STORAGE, ID NEED TO START FROM X DEPENDING OF WHAT IS ALREADY STORED
let activeSelection = "";


/****************************************
DOM / CONTENT LOADING / MANIPULATION
****************************************/

modifyDOMcontent.loadAllTodo(toDoListArray, projectListArray); //test
activeSelection = "all"


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
                    modifyDOMcontent.removeATodo(toDoObject.id);
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
    form[1].value = "yyyy-mm-dd";
    form[2].value = "";
    form[3].value = "default";
    form[4].value = 3;
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
        this.id = todoID;
    }

    edit(newData) {
        console.log(newData);
        if (newData[1] !== "") this.title = newData[1];
        this.date = newData[2];
        this.note = newData[3];
        this.project = newData[4];
        this.priority = newData[5];
        this.isDone = newData[0];
    }

    push() {
        console.log(this);
        toDoListArray.push(this);
    }
}

/****************************************
EVENT LISTENER
****************************************/

buttonAddProject.addEventListener("click", () => {
    //TEST
    console.log(toDoListArray);
    //modifyDOMproject.removeProjectList();
});

buttonAddTodo.addEventListener("click", () => {
    // When the button "ADD TODO" is clicked...

    //... Get the datas from the form
    const formDataArray = getFormData(form); // Extract datas as an array from the FORM

    if (formDataArray[0].trim() === "") return;

    //... Create a new object
    const newTodo = new ToDoObject(formDataArray);
    newTodo.push(); //... and push it to the ToDo list array
    ++todoID;
    //... Refresh ToDo Display
    //removeRemoveAllTodo();
    modifyDOMcontent.removeRemoveAllTodo();
    modifyDOMcontent.loadAllTodo(toDoListArray, projectListArray);
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
            modifyDOMcontent.removeATodo(todoID);
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

    for (let element of toDoListArray) {
        if (element.id !== Number(todoID)) continue;
        console.log(element)
        element.edit(formDataArray);
    };

    //editToDo(todoID, formDataArray); //Edit ToDo objet with the new datas
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

sorting.forEach(options => options.addEventListener("click", (e) => {
    const sortingOption = e.target.getAttribute("sorting");
    const sortingOptionDOM = e.target;

    sorting.forEach(options => options.classList.remove("activeSelection"));

    modifyDOMcontent.removeRemoveAllTodo();
    sortingOptionDOM.classList.add("activeSelection");
    clearFormValue();

    switch (sortingOption) {
        case "today":
            modifyDOMcontent.loadTodayTodo(toDoListArray, projectListArray);
            activeSelection = "today";

            form[1].value = format(new Date(), "yyyy-MM-dd");
            break;
        case "next":
            modifyDOMcontent.loadNextWeelTodo(toDoListArray, projectListArray);
            activeSelection = "next";

            const nextWeek = addDays(new Date(), 7)
            form[1].value = format(nextWeek, "yyyy-MM-dd");
            break;
        case "important":
            modifyDOMcontent.loadPrioTodo(toDoListArray, projectListArray);
            activeSelection = "important";

            form[4].value = 1;
            break;
        case "all":
            modifyDOMcontent.loadAllTodo(toDoListArray, projectListArray); //test
            activeSelection = "all";

            break;
        case "project":
            const project = e.target.textContent.toLowerCase();
            modifyDOMcontent.loadProjectTodo(toDoListArray, projectListArray, project);
            activeSelection = "project";

            form[3].value = project;
            break;
        default:
            break;
    };
}));