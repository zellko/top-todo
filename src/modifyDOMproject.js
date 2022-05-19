const domProjectList = document.querySelector(".project-list");

const modifyDOMproject = (() => {

    const loadProjectList = (projectList) => {
        projectList.forEach(project => {
            console.log(project);
        });
    };

    const removeProjectList = () => {
        //console.log(domProjectList);
        const domProjectListNode = document.querySelectorAll(".project-sorting");
        console.log(domProjectListNode);

        for (let node of domProjectListNode) {
            console.log(node);
            domProjectList.removeChild(node);
        };
    };

    return { loadProjectList, removeProjectList };

})();

//function loadProjectList();

export { modifyDOMproject }