'use strict';

var qrcode = new QRCode(document.getElementById("qrcode"), {
    correctLevel: QRCode.CorrectLevel.H,
    width: 500,
    height: 500
});


const container = document.querySelectorAll('.container');
const navs = document.querySelectorAll('.nav__wrapper');

const qrInput = document.querySelector('#qr-code-input');
const qrPaste = document.querySelector('.paste-for-qr');

const barInput = document.querySelector('#barcode-input')
const barPaste = document.querySelector('.barcode-paste')

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

qrInput.addEventListener('input', (e) => {
    qrcode.makeCode(qrInput.value.trim());
})

function makeCode(text) {
    qrcode.makeCode(text);
}

makeCode(qrInput.value.trim());

qrPaste.addEventListener('click', (e) => {
    navigator.permissions
        .query({ name: 'clipboard-read' })
        .then(allowed => {
            if (allowed.state === 'granted') {
                navigator.clipboard
                    .readText()
                    .then(text => {
                        qrInput.value = ''
                        qrInput.value = text.trim();
                        makeCode(text.trim());
                    })
                    .catch(err => {
                        console.error(err);
                    });
            } else {
                console.log('Access to clipboard is denied');
            }
        })
})


barPaste.addEventListener('click', (e) => {
    navigator.permissions
        .query({ name: 'clipboard-read' })
        .then(allowed => {
            if (allowed.state === 'granted') {
                navigator.clipboard
                    .readText()
                    .then(text => {
                        barInput.value = ''
                        barInput.value = text.trim();
                    })
                    .catch(err => {
                        console.error(err);
                    });
            } else {
                console.log('Access to clipboard is denied');
            }
        })
})