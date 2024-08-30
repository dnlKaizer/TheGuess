function configLetters() {
    /**
     * @param {KeyboardEvent} event
     * @param {number} i
     * @param {number} j
     */
    const goThroughLetters = (event, i, j) => {
        const str = event.key;
        // Verifica os casos abaixo e, se forem válidos, .focus() na próxima letra
        if ((isArrowRight(str) || isDelete(str)) && (j + 1) < 5) {
            getLetter(i,j + 1).focus();
        }
        // Verifica os casos abaixo e, se forem válidos, .focus() na letra anterior
        if ((isBackspace(str) || isArrowLeft(str)) && (j - 1) >= 0) {
            getLetter(i, j - 1).focus();
        }
    }
    /**
     * @param {number} i 
     * @param {number} j 
     */
    const goNext = (i,j) => {
        if ((j + 1) < 5) {
            getLetter(i,j + 1).focus();
        }
    }
    /**
     * @param {KeyboardEvent} event 
     */
    const validateKey = (event) => {
        if (!isValidKey(event.key)) {
            event.preventDefault();
        } 
    }

    /**
     * 
     * @param {String} char 
     * @returns {boolean}
     */
    const isLetter = (char) => {
        return ((char.toLowerCase() >= "a" && char.toLowerCase() <= "z") || char.toLowerCase() == "ç") && char.length == 1;
    }
    /**
     * @param {String} char 
     * @returns {boolean}
     */
    const isBackspace = (char) => {
        return char.toLowerCase() == "backspace";
    }
    /**
     * @param {String} char 
     * @returns {boolean}
     */
    const isArrowLeft = (char) => {
        return char.toLowerCase() == "arrowleft";
    }
    /**
     * @param {String} char 
     * @returns {boolean}
     */
    const isArrowRight = (char) => {
        return char.toLowerCase() == "arrowright";
    }
    /**
     * @param {String} char 
     * @returns {boolean}
     */
    const isDelete = (char) => {
        return char.toLowerCase() == "delete";
    }
    /**
     * @param {String} char 
     * @returns {boolean}
     */
    const isValidKey = (char) => {
        return isLetter(char) || isBackspace(char) || isArrowLeft(char)
        || isArrowRight(char) || isDelete(char) || char.toLowerCase() == "tab";
    }

    for (let i = 0; i < 6; i++) {
        getWord(i).forEach((element, j) => {
            // Evento disparado quando uma tecla do teclado é solta
            element.addEventListener("keyup", (event) => {
                goThroughLetters(event, i, j);
            });
            // Evento disparado quando uma tecla do teclado é pressionada
            element.addEventListener("keydown", (event) => {
                validateKey(event);
                let key = event.key; 
                if (isLetter(key)) {
                    element.value = key;
                    goNext(i, j);
                    event.preventDefault();
                }
            })
        });
    }
}

/**
 * @param {number} rowIndex 
 * @returns {HTMLInputElement[]}
 */
const getWord = (rowIndex) => {
    let word = []
    for (let i = 0; i < 5; i++) {
        word[i] = document.querySelector("#row" + rowIndex + " .l" + i);
    }
    return word;
}

/**
 * @param {number} rowIndex 
 * @param {number} colIndex 
 * @returns {HTMLInputElement}
 */
const getLetter = (rowIndex, colIndex) => {
    return document.querySelector("#row" + rowIndex + " .l" + colIndex);
}

/**
 * @param {number} rowIndex 
 */
const setWordStatusOn = (rowIndex) => {
    let word = getWord(rowIndex);
    word.forEach((inputElement, i) => {
        inputElement.classList = "letter letterOn l" + i;
        inputElement.disabled = false;
    });
}

/**
 * @param {number} rowIndex 
 */
const setWordStatusOff = (rowIndex) => {
    let word = getWord(rowIndex);
    word.forEach((inputElement, i) => {
        inputElement.classList = "letter letterOff l" + i;
        inputElement.disabled = true;
    });
}