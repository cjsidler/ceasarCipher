// app that encodes and decodes a Ceasar cipher
// given a certain shift (1 through 25)

// store the input fields, shift drop-downs, and end result span elements
let encodeText = document.getElementById('encodeText');
let encodeShift = document.getElementById('encodeShift');

let decodeText = document.getElementById('decodeText');
let decodeShift = document.getElementById('decodeShift');

let encodeResult = document.getElementById('encode-result');
let decodeResult = document.getElementById('decode-result');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

let awaitingInput = 'Awaiting input <i class="fas fa-clock"></i>'


// Start by setting the result spans to 'Awaiting input'
encodeResult.innerHTML = awaitingInput;
decodeResult.innerHTML = awaitingInput;


function cipher(event, codeType, shifter, outputSpan) {

    // If the change to the input field results in it being empty,
    // change the result span back to 'Awaiting input'
    if (codeType.value === '') {
        outputSpan.innerHTML = awaitingInput;
        outputSpan.classList.remove('show-tool-tip');
        return;
    }

    // convert input string to array and upper case any lower case letters
    let cipherArray = codeType.value.split("");
    let upperArray = cipherArray.map(element => {
        if (alphabet.indexOf(element) < 0) {
            return element.toUpperCase();
        } else {
            return element;
        }
    });


    // Event will be a change to an input field or shift drop-down
    // codeType will be encodeText or decodeText to tell us whether to perform an encode or decode and provide us access to the appropriate input box text.
    // shifter will give us the number of letters to shift left or right
    // outputSpan will be the result span element to put the encoded/decoded text

    let resultArray = [];

    for (let i = 0; i < upperArray.length; i++) {
        if (alphabet.indexOf(upperArray[i]) >=0) {
            if (codeType === encodeText) {
                resultArray.push(encoder(upperArray[i], shifter));
            } else if (codeType === decodeText) {
                resultArray.push(decoder(upperArray[i], shifter));
            }
        } else {
            resultArray.push(upperArray[i]);
        }
    }

    // set the appropriate result element's text to the encoded/decoded text
    outputSpan.innerHTML = resultArray.join("");
    outputSpan.classList.add('show-tool-tip');

}

// return encoded letter shifted right the number of times selected in drop-down
// if char is not a letter, return the char
function encoder(char, shifter) {
    let charIndex = alphabet.indexOf(char);

    // if (charIndex < 0) {
    //     return char;
    // } else if (charIndex >= 0 && charIndex <= ((13 - shifter) * 2) + shifter - 1) {
    //     return alphabet[charIndex + shifter];
    // } else {
    //     return alphabet[charIndex + shifter - 26];
    // }

    if (charIndex < 0) {
        return char;
    } else if (charIndex >= 26 - shifter && charIndex <= 25) {
        return alphabet[charIndex + shifter - 26];
    } else {
        return alphabet[charIndex + shifter];
    }

}

// return decoded letter shifted left the number of times selected in drop-down
// if char is not a letter, return the char
function decoder(char, shifter) {
    let charIndex = alphabet.indexOf(char);

    if (charIndex < 0) {
        return char;
    } else if (charIndex >= shifter && charIndex <= 25) {
        return alphabet[charIndex - shifter];
    } else {
        return alphabet[charIndex - shifter + 26];
    }

}

// populate select drop-downs with #1 - #25
function fillSelect(element) {
    for (let i = 1; i <= 25; i++) {
        let option = document.createElement('option')
        option.innerHTML = i;
        option.value = i;
        element.appendChild(option);
    }
}

fillSelect(encodeShift);
fillSelect(decodeShift);

function toggleBounce(clickedSpan) {
    // toggle bounce-in class on span element clicked
    if (clickedSpan.classList.contains('bounce-in')) {
        clickedSpan.classList.remove('bounce-in');
    } else {
        clickedSpan.classList.add('bounce-in');
    }
}

function bouncey(event) {
    let clickedSpan = event.target;

    if (clickedSpan.classList.contains('show-tool-tip')) {
        
        // change tool tip to Copied and toggle bounce effect
        clickedSpan.classList.remove('copy');
        clickedSpan.classList.add('copied');
        toggleBounce(clickedSpan);
        setTimeout(toggleBounce, 400, clickedSpan);

        // copy to clipboard:
        // get whatever is selected and create a range
        const selection = window.getSelection();
        const range = document.createRange();

        // make the range equal to the contents of the span
        range.selectNodeContents(clickedSpan);
        // remove all existing selections
        selection.removeAllRanges();
        // select the contents of the span
        selection.addRange(range);
        // copy the contents of the span
        document.execCommand('copy');
        // remove the selection of the span
        selection.removeAllRanges();
    }
}

function addToolTip(event) {
    let clickedSpan = event.target;

    if (clickedSpan.classList.contains('show-tool-tip')) {
        clickedSpan.classList.add('tool-tip', 'copy');
    }
}

function removeToolTip(event) {
    let clickedSpan = event.target;

    if (clickedSpan.classList.contains('show-tool-tip')) {
        clickedSpan.classList.remove('tool-tip', 'copied', 'copy');
    }
}

// Event handlers to pass event and additional arguments based on element clicked
let callEncoder = (event) => cipher(event, encodeText, parseInt(encodeShift.value), encodeResult);
let callDecoder = (event) => cipher(event, decodeText, parseInt(decodeShift.value), decodeResult);



// Event listeners for the input fields and shift drop-downs
encodeText.addEventListener('input', callEncoder);
encodeShift.addEventListener('change', callEncoder);

decodeText.addEventListener('input', callDecoder);
decodeShift.addEventListener('change', callDecoder);

// Event listeners for result spans for copy to clipboard tool-tip
encodeResult.addEventListener('click', bouncey);
encodeResult.addEventListener('mouseover', addToolTip);
encodeResult.addEventListener('mouseout', removeToolTip);

decodeResult.addEventListener('click', bouncey);
decodeResult.addEventListener('mouseover', addToolTip);
decodeResult.addEventListener('mouseout', removeToolTip);
