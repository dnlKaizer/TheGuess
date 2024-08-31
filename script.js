let accentIsLastKey = false;
let currentWord = 0;
let dayWord = "letra";

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
        if (!isValidKey(event.key) || accentIsLastKey) {
            if (event.key == "Dead") accentIsLastKey = true;
            else accentIsLastKey = false;
            event.preventDefault();
            return false;
        } 
        return true;
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
                if (event.key.toLowerCase() === "enter") {
                    event.preventDefault();
                    jogar();
                    return;
                }
                if (!validateKey(event)) return;
                let key = event.key; 
                if (isLetter(key)) {
                    element.value = key;
                    goNext(i, j);
                    event.preventDefault();
                }
                if (isDelete(event.key)) {
                    element.setSelectionRange(0,0);
                } else if (isBackspace(event.key)) {
                    element.setSelectionRange(0,1);
                }
            })
        });
    }
}

const jogar = () => {
    const word = passWordToString(getWord(currentWord));
    
    if (word.length != 5) return; // Informar usuário que está faltando letras

    // Colocando classe letterOff e disabled = true
    setWordStatusOff(currentWord);

    // Mudando as cores
    setWordColors(word);
}

/**
 * @param {String} word 
 * @returns {number[]} 
 */
const verifyWord = (word) => {
    let colors = [0,0,0,0,0];
    // 0 - Letra errada
    // 1 - Letra certa, lugar errado
    // 2 - Letra certa, lugar certo
    let arrayDayWord = dayWord.split("");
    for (let i = 0; i < 5; i++) {
        if (word.charAt(i) === arrayDayWord[i]) {
            colors[i] = 2;
            arrayDayWord[i] = "0";
            continue;
        } 
    }
    compare:
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (word.charAt(i) === arrayDayWord[j]) {
                colors[i] = 1;
                arrayDayWord[j] = "0";
                continue compare;
            }
        }
    }
    return colors;
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
 * @param {HTMLInputElement[]} word 
 * @returns {String}
 */
const passWordToString = (word) => {
    let wordString = "";
    word.forEach((letter) => {
        wordString += letter.value.toLowerCase();
    });
    return wordString;
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

const setWordColors = (word) => {
    let colors = verifyWord(word);
    const array = [" gray", " yellow", " green"];
    colors.forEach((color, i) => {
        getLetter(currentWord, i).classList += array[color]
    });
}