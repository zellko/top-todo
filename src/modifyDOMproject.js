import deleteIcon from './delete.svg';
const domProjectList = document.querySelector(".project-list");

function updateFormProjectList(projectList) {
    const formProjectList = document.querySelector("#form-project");
    const optionsLenght = formProjectList.length;

    for (let index = 0; index < optionsLenght; index++) {
        formProjectList.remove(0);

    }

    projectList.forEach(project => {
        const projectName = document.createElement("option");
        projectName.textContent = project;
        projectName.value = project;
        formProjectList.appendChild(projectName);
    });
};

function updateCardProjectList(projectList) {
    const todoCard = document.querySelectorAll(".todo-card");

    todoCard.forEach(card => {
        const formProjectList = card.childNodes[0][4];
        const optionsLenght = formProjectList.length;

        for (let index = 0; index < optionsLenght; index++) {
            formProjectList.remove(0);
        };

        projectList.forEach(project => {
            const projectName = document.createElement("option");
            projectName.textContent = project;
            projectName.value = project;
            formProjectList.appendChild(projectName);
        });
    });
};

const modifyDOMproject = (() => {

    const loadProjectList = (projectList) => {
        projectList.forEach(project => {
            const projectDOMli = document.createElement("li");
            const projectDOMimg = document.createElement("img");

            projectDOMli.textContent = project.toUpperCase();
            projectDOMimg.src = deleteIcon;

            projectDOMimg.className = "project-delete";
            projectDOMli.className = "sorting";
            projectDOMli.setAttribute("sorting", "project");

            projectDOMli.appendChild(projectDOMimg);
            domProjectList.appendChild(projectDOMli);
        });

        updateFormProjectList(projectList);
        updateCardProjectList(projectList);
    };

    const removeProjectList = () => {
        const domProjectListNode = document.querySelectorAll("[sorting='project']");

        for (let node of domProjectListNode) {
            domProjectList.removeChild(node);
        };
    };

    const removeProject = (projectName) => {
        const domProjectListNode = document.querySelectorAll("[sorting='project']");

        for (let node of domProjectListNode) {
            if (node.textContent === projectName) domProjectList.removeChild(node);
        };
    };

    return { loadProjectList, removeProjectList, removeProject };

})();

export { modifyDOMproject }