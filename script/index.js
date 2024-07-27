'use strict';

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
    historyOutput.innerHTML += html
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
        document.querySelector('.history-output').classList.add('hidden');
        document.querySelector('.save-history-button').classList.add('off-history');
    } else {
        saveHistory = true
        document.querySelector('.save-history-button').title = 'Выключить историю';
        document.querySelector('.history-output').classList.remove('hidden');
        document.querySelector('.save-history-button').classList.remove('off-history');

    }
    LS.setItem('saveHistoryStatus', JSON.stringify(saveHistory))
})

function checkStatusSaveHistory(status) {
    console.log(status);
    if (status) {
        document.querySelector('.save-history-button').title = 'Выключить историю';
        document.querySelector('.history-output').classList.remove('hidden');
        document.querySelector('.save-history-button').classList.remove('off-history');
    } else {
        document.querySelector('.save-history-button').title = 'Включить историю';
        document.querySelector('.history-output').classList.add('hidden');
        document.querySelector('.save-history-button').classList.add('off-history');
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
