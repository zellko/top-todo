import "./style.css";
import { loadContent } from "./loadContent";

const projectList = document.querySelector(".project-list");
const content = document.querySelector(".content");
const formextend = document.querySelector("svg");
const buttonAddProject = document.querySelector("button");
const buttonAddTodo = document.querySelector(".form-button");
const formOptionals = document.querySelectorAll(".form-optional");
let projectListArray = ["default", "top"];
let toDoListArray = [];



/****************************************
DOM / CONTENT LOADING / MANIPULATION
****************************************/

// loadContent.loadAllTodo(["12345"]); //test

function domLoadAllTodo() {
    loadContent.loadAllTodo(toDoListArray, projectListArray); //test
};

function removeRemoveAllTodo() {
    const domToDoCard = document.querySelectorAll(".todo-card");
    domToDoCard.forEach(element => content.removeChild(element));
};

/****************************************
GET FORM DATA
****************************************/

function getFormData() {
    const formData = new FormData(document.querySelector('form'));
    //... Convert form data to array
    let formDataArray = [];
    for (let pair of formData.entries()) {
        if (pair[0] === "form-title" && pair[1] === "") return; // Ignore click if title is empty
        formDataArray.push(pair[1]);
    }

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
    const todoID = toDoListArray.length;

    const push = () => {
        // Push the datas to the ToDo list array
        toDoListArray.push({ title: title, date: date, note: note, project: project, priority: priority, isDone: isDone, id: todoID })
    };

    return { push };
};

function editToDo(id, newData) {
    // Function to edit ToDo object data
    if (newData[1] !== "") toDoListArray[id].title = newData[1];
    toDoListArray[id].date = newData[2];
    toDoListArray[id].note = newData[3];
    toDoListArray[id].project = newData[4];
    toDoListArray[id].priority = newData[5];
    toDoListArray[id].isDone = newData[0];
};


/****************************************
EVENT LISTENER
****************************************/

buttonAddProject.addEventListener("click", () => {
    console.log(toDoListArray);
});

buttonAddTodo.addEventListener("click", () => {
    // When the button "ADD TODO" is clicked...

    //... Get the datas from the form
    const formData = getFormData();
    //console.log(formData);

    //... Create a new object
    const newTodo = ToDoObject(formData);
    newTodo.push(); //... and push it to the ToDo list array

    //... Refresh ToDo Display
    removeRemoveAllTodo();
    domLoadAllTodo();

    console.log(toDoListArray)
});

content.addEventListener("click", (e) => {
    //console.log(e);
    //console.log(e.target.classList);

    // Extend the ToDo card if the button is clicked 
    if (e.target.classList[0] === "todo-card-extend") {
        const card = e.target.parentElement;
        const chevronImage = e.target;

        //console.log(e.target)
        for (let child of card.childNodes) {
            if (child.classList[1] === "todo-card-optional") {
                child.classList.toggle("show");
            };
        };

        chevronImage.classList.toggle("rotate"); // Rotate "chevron" image

    };
});

content.addEventListener("change", (e) => {
    if (e.target.form.classList[0] === "todo-form") return; // ignore if the change is from "Add Todo" form

    const todoID = e.target.parentElement.parentElement.getAttribute("id");
    const toDoForm = e.target.parentElement;
    const toDoFormData = toDoForm.elements;
    let formDataArray = [];

    for (let formElement of toDoFormData) {
        // console.log(formElement);
        if (formElement.getAttribute("type") === "checkbox") {
            formDataArray.push(formElement.checked);
        } else {
            formDataArray.push(formElement.value);
        };
    };

    //If ToDo title is remvoed, it's restored
    if (toDoFormData[1].value === "") {
        toDoFormData[1].value = toDoListArray[todoID].title;
    };

    editToDo(todoID, formDataArray);



    //removeRemoveAllTodo();
    //domLoadAllTodo();
});

formextend.addEventListener("click", (e) => {
    // extend form :
    formOptionals.forEach(input => {
        input.classList.toggle("show");
    });

    formextend.classList.toggle("rotate");
})

// buttonAddProject.addEventListener("click", (e) => {
//     console.log("button clicked");
//     const newTodo = ToDoObject(["TitleTest", 1]);
//     toDoListArray.push(newTodo);
//     console.log(toDoListArray);
// })

// content.addEventListener("click", (e) => {
//     console.log(toDoListArray[0]);
//     toDoListArray[0].title = "Changed name";
// })

// projectList.addEventListener("click", (e) => {
//     console.log(toDoListArray[0]);
//     console.log(toDoListArray[0]["title"]);
//     console.log(toDoListArray);
// })