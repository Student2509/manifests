import {data} from './data.js';

const results = document.querySelector('.list-body')
const surname = results.querySelector('.list-body__surname');
const name = results.querySelector('.list-body__name');
const date = results.querySelector('.list-body__date');
const tail = results.querySelector('.list-body__tail');
const direction = results.querySelector('.list-body__direction');
//surname.textContent = 'surname' + '\n' + 'another';
const authForm = document.querySelector('.autorization-form');
const authFormLoginInput = authForm.querySelector('.login-input');
const authFormPasswordInput = authForm.querySelector('.password-input');
const authFormButton = authForm.querySelector('.form__button');
const authFormStatusSpan = authForm.querySelector('.autorization-form__error');

const searchForm = document.querySelector('.search-form');
const searchFormButton = searchForm.querySelector('.form__button');
const searchFormInput = searchForm.querySelector('.form__input');
const resultTextAreas = document.querySelectorAll('.list-cell-text-area');

function setTextAreaHeight(numberOfLines) {
    const height = numberOfLines * 16;
    Array.from(resultTextAreas).forEach((textArea) => {
        textArea.style.height = `${height}px`;
    })
}

authForm.addEventListener('submit', handleAuthorization);

function handleAuthorization(evt) {
    evt.preventDefault();
    if ((authFormLoginInput.value === 'Askjet') && (authFormPasswordInput.value === 'Askjet555')) {
        searchFormButton.disabled = false;
        searchFormButton.classList.remove('search-form__button_disabled');
        authFormStatusSpan.textContent = '';
    } else {
        authFormStatusSpan.textContent = 'wrong Login or Password';
    }
    authFormLoginInput.value = '';
    authFormPasswordInput.value = '';
}

function splitLineToCells (line) {
    if (line.endsWith('%%%')) {
        const newLine = line.slice(0, (line.length - 3));
        // console.log(newLine);
        return newLine.split('%%%');
    }
    return line.split('%%%');
}

function splitCellToFields (line) {
    return line.split('@#$');
}


let currentID = 0;
function makeLineObj (field) {
    const obj = {};
    obj.id = currentID;
    currentID++;
    obj.surname = field[0];
    obj.name = field[1];
    obj.passport = field[2];
    obj.tail = field[3];
    obj.direction = field[4];
    obj.dateDay = field[5];
    obj.dateMonth = field[6];
    obj.dateYear = field[7];
    obj.date = `${obj.dateDay}.${obj.dateMonth}.${obj.dateYear}`;
    // obj.operator = field[7];
    // obj.manifests = field[8];
    return obj;
}

function makeDataBase(data) {
    var dataBase = [];
    data.forEach((line) => {
        const cells = splitLineToCells(line);
        cells.forEach((cell) => {
            const fields = splitCellToFields(cell);
            const lineObj = makeLineObj(fields);
            dataBase.push(lineObj);
        });
    });
    // const cells = splitLineToCells(data);
    // cells.forEach((cell) => {
    //     const fields = splitCellToFields(cell);
    //     const lineObj = makeLineObj(fields);
    //     dataBase.push(lineObj);
    // });
    return dataBase;
}

const dataBase = makeDataBase(data);

// console.log(dataBase);

function getIdsByFieldAndValue(fieldType, value) {
    var finalIdList = [];
    dataBase.forEach((flightLine) => {
        // if (flightLine[fieldType].toLowerCase() === value.toLowerCase()) {
        //     finalIdList.push(flightLine.id);
        // }
        if (flightLine[fieldType].toLowerCase().includes(value.toLowerCase())) {
            finalIdList.push(flightLine.id);
        }
    });
    return finalIdList;
}

// console.log(getIdsByFieldAndValue('surname', 'Abramovich'));

function showLines(idList) {
    surname.textContent = '';
    name.textContent = '';
    date.textContent = '';
    tail.textContent = '';
    direction.textContent = '';
    idList.forEach((id) => {
        const currentLine = dataBase[id];
        surname.textContent += currentLine.surname + '\n';
        name.textContent += currentLine.name + '\n';
        date.textContent += currentLine.date + '\n';
        tail.textContent += currentLine.tail + '\n';
        direction.textContent += currentLine.direction + '\n';
    });
}

// console.log(dataBase[2].name);

function handleSearch(evt) {
    evt.preventDefault();
    const requestedValue = searchFormInput.value;
    const idList = getIdsByFieldAndValue('surname', requestedValue);
    setTextAreaHeight(idList.length);
    showLines(idList);
}

searchForm.addEventListener('submit', handleSearch);
















function makeExcelFormula(firstCell, lastCell) {
    const fieldsDevider = '@#$';
    const linesDevider = '$$$';
    let result = '';
    let flag = true;
    for (let i = firstCell; i <= lastCell; i++) {
        const previousResult = result;
        const line = `=сцепить(A${i};${fieldsDevider};B${i};${fieldsDevider};C${i};${fieldsDevider};D${i};${fieldsDevider};E${i};${fieldsDevider};день(F${i});${fieldsDevider};месяц(F${i});${fieldsDevider};год(F${i});${fieldsDevider};G${i};${fieldsDevider};H${i};)`;
        result += `${line}${linesDevider}`;
        if ((result.length > 8192) && (flag)) {
            // console.log(`step ${i}, total: ${previousResult.length}`);
            flag = false;
        }
    }
    return result;
}

const someArray = makeExcelFormula(4, 10000);