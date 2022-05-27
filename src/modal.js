const modalSection = document.querySelector(".modal");

const modal = (() => {
    // Module to load / remove modal on DOM

    const loadModal = () => {

        const offset = 50 + modalSection.childElementCount * 58; // New modal is placed on the bottom with an offset, depending on how much modal are already displayed.

        const modalBox = document.createElement("div");
        modalBox.classList.add("info");
        modalBox.classList.add("show");
        modalBox.style.bottom = `${offset}px`;
        const modalText = document.createElement("h3");
        const modalButton = document.createElement("button");
        modalButton.textContent = "×";

        modalBox.append(modalText, modalButton);
        modalSection.appendChild(modalBox);

        return modalText;
    };

    const deleteModal = (element) => {
        modalSection.removeChild(element);
        return;
    };

    return { loadModal, deleteModal };
})();

export { modal }