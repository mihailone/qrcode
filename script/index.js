'use strict';

const SVGHistoryOn = '<span class="svg-box"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M480-120q-126 0-223-76.5T131-392q-4-15 6-27.5t27-14.5q16-2 29 6t18 24q24 90 99 147t170 57q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h70q17 0 28.5 11.5T360-600q0 17-11.5 28.5T320-560H160q-17 0-28.5-11.5T120-600v-160q0-17 11.5-28.5T160-800q17 0 28.5 11.5T200-760v54q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm40-376 100 100q11 11 11 28t-11 28q-11 11-28 11t-28-11L452-452q-6-6-9-13.5t-3-15.5v-159q0-17 11.5-28.5T480-680q17 0 28.5 11.5T520-640v144Z"/></svg></span>';
const SVGHistoryOff = '<span class="svg-box"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M480-760q-25 0-54.5 6T373-737q-15 8-31 1t-24-21q-8-15-3-29.5t19-22.5q32-16 71.5-23.5T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 36-8 74.5T810-335q-7 14-22.5 19.5T758-318q-14-8-20-24t1-31q10-23 15.5-52t5.5-55q0-117-81.5-198.5T480-760Zm0 80q17 0 28.5 11.5T520-640v4q0 17-11.5 28.5T480-596q-17 0-28.5-11.5T440-636v-4q0-17 11.5-28.5T480-680Zm0 560q-69 0-130.5-24.5T240-212q-39-35-67.5-81.5T130-393q-5-16 5.5-30t27.5-16q17-2 30 8t18 27q11 39 33.5 74.5T297-268q37 32 84 50t99 18q37 0 70.5-8.5T614-234L288-560H160q-17 0-28.5-11.5T120-600v-128l-36-36q-11-11-11-28t11-28q11-11 28-11t28 11l680 680q11 11 11 28t-11 28q-11 11-28 11t-28-11l-92-92q-42 26-90 41t-102 15Z"/></svg></span>';

document.addEventListener('DOMContentLoaded', () => {
    getLocalStorage()
})

function getLocalStorage() {
    if (LS.getItem('historyDB')) {
        const localDB = JSON.parse(LS.getItem('historyDB'))
        for (let key in localDB) {
            historyDB[key] = {
                historyText: localDB[key].historyText,
            }
            historyPrint(localDB[key].historyText, key)
        }
    }
    if (LS.getItem('saveHistoryStatus')) {
        saveHistory = JSON.parse(LS.getItem('saveHistoryStatus'))
        checkStatusSaveHistory(saveHistory)
    }
}

let saveHistory = true;

const LS = localStorage;

let historyDB = {};

var qrcode = new QRCode(document.getElementById("qrcode"), {
    width: 500,
    height: 500,
    correctLevel: QRCode.CorrectLevel.L
});

const container = document.querySelectorAll('.container');
const navs = document.querySelectorAll('.nav__wrapper');

const sizeSelector = document.querySelector('.size-selection');

const qrInput = document.querySelector('#qr-code-input');
const qrPaste = document.querySelector('.paste-for-qr');
const inputTextRemove = document.querySelector('.remover-text-in-input');

const barInput = document.querySelector('#barcode-input')
const barPaste = document.querySelector('.barcode-paste')

const historyOutput = document.querySelector('.history-output');
const historyBtn = document.querySelector('.save-history-button');
const allHistoryRemove = document.querySelector('.remove-all-history');

function historyPrint(text, id) {
    const html = `
    <span class="history-text" data-text-id="${id}">
        <span class="hs-text">${text}</span>
        <span class="remove-item-in-db" title="Удалить">
            <span class="svg-box">
                <svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px"
                fill="#333">
                <path
                d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z" />
                </svg>
            </span>
        </span>
    </span>`;
    historyOutput.insertAdjacentHTML('afterbegin', html)
}

inputTextRemove.addEventListener('click', (e) => {
    qrInput.value = '';
})

navs.forEach((item, i) => {
    navs[i].addEventListener('click', (e) => {
        for (let i = 0; i < navs.length; i++) {
            navs[i].classList.remove('tab-active');
            container[i].classList.add('hidden');
        }
        if (!navs[i].closest('tab-active')) {
            navs[i].classList.add('tab-active');
            container[i].classList.remove('hidden');
        }
    })
})

function svedHistory(text) {
    if (saveHistory === true) {
        for (let key in historyDB) {
            if (historyDB[key].historyText === text) {
                return
            }
        }
        let historyID = Number(Date.now());
        historyDB[historyID] = {
            historyText: text,
        }
        historyPrint(text, historyID)
        LS.setItem('historyDB', JSON.stringify(historyDB))
    }
}

function makeCode(text) {
    qrcode.makeCode(text);
}

makeCode(qrInput.value.trim());

qrPaste.addEventListener('click', (e) => {
    navigator.clipboard.readText()
    navigator.permissions
        .query({ name: 'clipboard-read' })
        .then(allowed => {
            if (allowed.state === 'granted') {
                navigator.clipboard
                    .readText()
                    .then(text => {
                        if (text.trim().length !== 0) {
                            qrInput.value = '';
                            qrInput.value = text.trim();
                            makeCode(text.trim());
                            svedHistory(text.trim())
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    });
            } else {
                console.log('Access to clipboard is denied');
            }
        })
})


// barPaste.addEventListener('click', (e) => {
//     navigator.permissions
//         .query({ name: 'clipboard-read' })
//         .then(allowed => {
//             if (allowed.state === 'granted') {
//                 navigator.clipboard
//                     .readText()
//                     .then(text => {
//                         barInput.value = ''
//                         barInput.value = text.trim();
//                     })
//                     .catch(err => {
//                         console.error(err);
//                     });
//             } else {
//                 console.log('Access to clipboard is denied');
//             }
//         })
// })


//skroll history
function scrollHorizontally(e) {
    e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    historyOutput.scrollLeft -= (delta * 40); // Multiplied by 10
    e.preventDefault();
}
if (historyOutput.addEventListener) {
    // IE9, Chrome, Safari, Opera
    historyOutput.addEventListener("mousewheel", scrollHorizontally, false);
    // Firefox
    historyOutput.addEventListener("DOMMouseScroll", scrollHorizontally, false);
} else {
    // IE 6/7/8
    historyOutput.attachEvent("onmousewheel", scrollHorizontally);
}
// debounce input 
function debounce(callee, timeoutMs) {
    return function perform(...args) {
        let previousCall = this.lastCall

        this.lastCall = Date.now()

        if (previousCall && this.lastCall - previousCall <= timeoutMs) {
            clearTimeout(this.lastCallTimer)
        }

        this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs)
    }
}


historyOutput.addEventListener('click', (e) => {
    const taregt = e.target;
    if (taregt.closest('.hs-text')) {
        qrInput.value = taregt.closest('.hs-text').textContent;
        qrcode.makeCode(taregt.closest('.hs-text').textContent);
    }
    if (taregt.closest('.remove-item-in-db')) {
        const parent = taregt.closest('.remove-item-in-db').parentNode;
        const textID = parent.dataset.textId;
        delete historyDB[textID]
        parent.remove()
        LS.setItem('historyDB', JSON.stringify(historyDB))
    }
})

historyBtn.addEventListener('click', (e) => {
    if (saveHistory) {
        saveHistory = false
        document.querySelector('.save-history-button').title = 'Включить историю';
        document.querySelector('.history-row').classList.add('hidden');
        document.querySelector('.save-history-button').classList.add('off-history');
        historyBtn.innerHTML = SVGHistoryOn;
    } else {
        saveHistory = true
        document.querySelector('.save-history-button').title = 'Выключить историю';
        document.querySelector('.history-row').classList.remove('hidden');
        document.querySelector('.save-history-button').classList.remove('off-history');
        historyBtn.innerHTML = SVGHistoryOff;
    }
    LS.setItem('saveHistoryStatus', JSON.stringify(saveHistory))
})

function checkStatusSaveHistory(status) {
    if (status) {
        document.querySelector('.save-history-button').title = 'Выключить историю';
        document.querySelector('.history-row').classList.remove('hidden');
        document.querySelector('.save-history-button').classList.remove('off-history');
        historyBtn.innerHTML = SVGHistoryOff;
    } else {
        document.querySelector('.save-history-button').title = 'Включить историю';
        document.querySelector('.history-row').classList.add('hidden');
        document.querySelector('.save-history-button').classList.add('off-history');
        historyBtn.innerHTML = SVGHistoryOn;
    }
}

// print function

const debouncedHandle = debounce(printINputText, 500);

function printINputText() {
    if (qrInput.value.trim().length !== 0) {
        qrcode.makeCode(qrInput.value.trim())
        svedHistory(qrInput.value.trim())
    }
}

qrInput.addEventListener('input', debouncedHandle)

//автовделение текста 
document.querySelector('input[type="text"]').addEventListener('focus', event => event.target.select());

//all history remove 
allHistoryRemove.addEventListener('click', (e) => {
    historyDB = {};
    historyOutput.innerHTML = '';
    LS.setItem('historyDB', JSON.stringify(historyDB))
})
//active hitory tab
historyOutput.addEventListener('click', (e) => {
    const target = e.target;
    document.querySelectorAll('.history-text').forEach((item, i) => {
        item.classList.remove('active-tab')
    })
    target.closest('.history-text').classList.add('active-tab')
})
