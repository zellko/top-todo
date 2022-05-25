const modal = document.querySelector(".info");
const modalText = document.querySelector(".info h3");

function showModal(message) {
    modalText.textContent = message;
    modal.classList.add("show");
};

function hideModal(message) {
    modal.classList.remove("show")
};

export { showModal, hideModal }