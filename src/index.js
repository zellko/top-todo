function component() {
    const element = document.createElement('div');

    // Testing webpack
    element.textContent = "Webpack Test DevMode";

    return element;
}

document.body.appendChild(component());