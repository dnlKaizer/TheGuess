const rows = 6;
const cols = 5;

let currentRow = 0;
let currentCol = 0;

function addLettersEvents() {
    for (let i = 0; i < 6; i++) {
        getWord(i).forEach((element, j) => {
            element.addEventListener("keyup", (event) => {
                const str = event.key;
                if ((isLetter(str) || isArrowRight(str) || isDelete(str)) && j + 1 < 6) {
                    getLetter(i,j + 1).focus();
                }
                if ((isBackspace(str) || isArrowLeft(str)) && j - 1 >= 0) {
                    getLetter(i, j - 1).focus();
                }
            });
        });
    }
}
/**
 * 
 * @param {String} char 
 * @returns 
 */
const isLetter = (char) => {
    return char.toLowerCase() >= "a" && char.toLowerCase() <= "z" && char.length == 1;
}
/**
 * @param {String} char 
 * @returns 
 */
const isBackspace = (char) => {
    return char.toLowerCase() == "backspace";
}
/**
 * @param {String} char 
 * @returns 
 */
const isArrowLeft = (char) => {
    return char.toLowerCase() == "arrowleft";
}
/**
 * @param {String} char 
 * @returns 
 */
const isArrowRight = (char) => {
    return char.toLowerCase() == "arrowright";
}
/**
 * @param {String} char 
 * @returns 
 */
const isDelete = (char) => {
    return char.toLowerCase() == "delete";
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