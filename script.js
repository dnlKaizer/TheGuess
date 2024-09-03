let accentIsLastKey = false;
let currentWord = 0;
let dayWord = "letra";
let userWon = false;
let dados = [];
let today = new Date();
today = {
    day: today.getUTCDate(),
    month: today.getUTCMonth() + 1,
    year: today.getUTCFullYear()
}

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
                saveLetterOnDados();
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
                    saveLetterOnDados();
                }
                if (isDelete(event.key)) {
                    element.setSelectionRange(0,0);
                } else if (isBackspace(event.key)) {
                    element.setSelectionRange(0,1);
                }
            })
        });
    }

    getLetter(0,0).focus();

    loadData();
}

const jogar = () => {
    saveWordOnDados(currentWord);
    exec();
}
const exec = () => {
    const word = getWord(currentWord);

    if (passWordToString(word).length != 5) return; // Informar usuário que está faltando letras

    // Colocando classe letterOff e disabled true
    setWordStatusOff(word);

    // Mudando as cores
    setWordColors(word);

    // Verifica se o usuário ganhou
    if (verifyWord(word)) return;

    // Incrementa currentWord e habilita próxima word
    enableNextWord();
}

/**
 * @param {HTMLInputElement[]} word 
 * @returns {boolean}
 */
const verifyWord = (word) => {
    return passWordToString(word) === dayWord;
}

/**
 * @param {String} word 
 * @returns {number[]} 
 */
const getWordColors = (word) => {
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
 * @param {HTMLInputElement[]} word 
 */
const setWordStatusOn = (word) => {
    word.forEach((letter, i) => {
        letter.classList = "letter letterOn l" + i;
        letter.disabled = false;
    });
}

/**
 * @param {HTMLInputElement[]} word 
 */
const setWordStatusOff = (word) => {
    word.forEach((letter, i) => {
        letter.classList = "letter letterOff l" + i;
        letter.disabled = true;
    });
}

/**
 * @param {HTMLInputElement[]} word 
 */
const setWordColors = (word) => {
    let colors = getWordColors(passWordToString(word));
    const array = [" gray", " yellow", " green"];
    colors.forEach((color, i) => {
        word[i].classList += array[color]
    });
}

const enableNextWord = () => {
    if (currentWord < 5) {
        currentWord++;
        const nextWord = getWord(currentWord);
        setWordStatusOn(nextWord);
        nextWord[0].focus()
    }
}

const saveLetterOnDados = () => {
    let word = getWord(currentWord);
    dados[currentWord].string = passWordToString(word);
    sessionStorage.setItem("dados", JSON.stringify(dados));
}

const saveWordOnDados = () => {
    dados[currentWord].played = true;
    sessionStorage.setItem("dados", JSON.stringify(dados));
}

/**
 * @param { [{index: number, string: String, played: boolean, date: Date}] } dados
 */
const setDadosDate = (dados) => {
    dados.forEach(word => {
        word.date = today;
    });
}

/**
 * @param { {index: number, string: String, played: boolean, date: Date} } wordObj
 */
const setWordFromDados = (wordObj) => {
    let {index, string, played,} = wordObj;

    let word = getWord(index);
    word.forEach((letter, i) => {
        letter.value = string.charAt(i);
    });

    if (played) {
        exec();
    }
}

const loadData = () => {
    if (sessionStorage.getItem("dados")) {
        dados = [...JSON.parse(sessionStorage.getItem("dados"))];
        let dateOfObj = dados[0].date;
        if (compareDates(dateOfObj, today)) {
            dados.forEach((wordObj) => {
                setWordFromDados(wordObj);
            }); 
        } else {
            getStorageData();
        }
    } else if (localStorage.getItem("dados")) {
        dados = [...JSON.parse(localStorage.getItem("dados"))];
        if (compareDates(dados[0].date, today)) {
            dados.forEach((wordObj) => {
                setWordFromDados(wordObj);
            }); 
        } else {
            getStorageData();
        }
    } else {
        getStorageData();
    }
}

const getStorageData = async () => {
    try {  
        const response = await fetch('./data.json');
        const data = await response.json();

        dados = [...data];
        setDadosDate(dados);

        // ADICIONAR AQUI CASO EM QUE USUÁRIO ESTÁ LOGADO
        sessionStorage.setItem("dados", JSON.stringify(dados));

    } catch (err) {    
        alert(`Atenção: Erro ${err}`);
        console.error(err);
    }
}

/**
 * @param { {day: number, month: number, year: number} } date1 
 * @param { {day: number, month: number, year: number} } date2 
 */
const compareDates = (date1, date2) => {
    return (date1.day == date2.day && date1.month == date2.month && date1.year == date2.year);
}

const configCadastro = () => {
    const form = document.querySelector("#cadastro-form");
    form.addEventListener("submit", () => {
        
    })
}

const configLogin = () => {
    const form = document.querySelector("#login-form");
    form.addEventListener("submit", () => {
        
    })
}