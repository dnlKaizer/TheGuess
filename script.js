/**
 * @param {number} index 
 * @returns {HTMLInputElement[]}
 */
const getWord = (index) => {
    let word = []
    for (let i = 0; i < 5; i++) {
        word[i] = document.querySelector("#row" + index + " .l" + (i + 1));
    }
    return word;
}

/**
 * @param {number} index 
 */
const setWordStatusOn = (index) => {
    let word = getWord(index);
    word.forEach((inputElement, i) => {
        inputElement.classList = "letter letterOn l" + i;
        inputElement.disabled = false;
    });
}

/**
 * @param {number} index 
 */
const setWordStatusOff = (index) => {
    let word = getWord(index);
    word.forEach((inputElement, i) => {
        inputElement.classList = "letter letterOff l" + i;
        inputElement.disabled = true;
    });
}