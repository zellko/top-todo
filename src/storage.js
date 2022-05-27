const storage = (() => {
    // Module to work with browser storage

    const checkStorage = (type) => {
        // Check if browser is compatible with local storage
        // ... return true if yes
        let storage;
        try {
            storage = window[type];
            let x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return e instanceof DOMException && (
                    // everything except Firefox
                    e.code === 22 ||
                    // Firefox
                    e.code === 1014 ||
                    // test name field too, because code might not be present
                    // everything except Firefox
                    e.name === 'QuotaExceededError' ||
                    // Firefox
                    e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                (storage && storage.length !== 0);
        }
    };

    const populateLocalStorage = (name, value) => {
        // Stringify variable and add it to local storage
        localStorage[name] = JSON.stringify(value);
    };

    const getLocalStorage = (name) => {
        // Parse variable from local storage and return it
        return JSON.parse(localStorage.getItem(name));
    };

    return { checkStorage, populateLocalStorage, getLocalStorage }
})();

export { storage };