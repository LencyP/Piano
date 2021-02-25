let keyboard = document.querySelector('.piano_keyboard');
let controls = document.querySelectorAll('.piano_control_option');
let pianoNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
let keyboardMap = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N'];
let playBtn = document.querySelector('.piano_play-btn');
let tempoSelect = document.querySelector('.piano_tempo');
let songSelect = document.querySelector('.piano_song-list');
let keys = [];

let jingleBells = `B3,,B3,,B3,,,,B3,,B3,,B3,,,,
                       B3,,D4,,G3,,A3,B3,,,,,,
                       C4,,C4,,C4,,,,C4,C4,,B3,,B3,,,,
                       B3,B3,B3,,A3,,A3,,B3,,A3,,,,D4`;
let happyBirthday = `G4,G4,A4,,G4,,C5,,B4,,,,
                     G4,G4,A4,,G4,,D5,,C5,,,,
                     G4,G4,G5,,E5,,C5,,B4,,A4,,
                     F5,F5,E5,,C5,,D5,,C5,,,,`;


let playSong = (notesString, tempo, cb) => { //cb = callback
    let notes = notesString.split(',');
    let currentNote = 0;
    let mousedown = new Event('mousedown');
    let mouseup = new Event('mouseup');
    let btn;

    let interval = setInterval(() => {
            if (currentNote < notes.length) {
                if (notes[currentNote].trim() != '') {
                    if (btn) {
                        btn.dispatchEvent(mouseup);
                    }
                    btn = document.querySelector(`[data-letter-note="${notes[currentNote].trim()}"]`)
                    btn.dispatchEvent(mousedown);
                }
                currentNote++;
            } else {
                btn.dispatchEvent(mouseup);
                clearInterval(interval);
                cb();
            }
        },
        300 / tempo);
};

playBtn.addEventListener('mousedown', () => {
    let tempo = +tempoSelect.value;
    let songNum = +songSelect.value;
    playBtn.disabled = true;

    let enablePlayBtn = () => playBtn.disabled = false;

    switch (songNum) {
        case 1:
            ;
            playSong(jingleBells, tempo, enablePlayBtn);
            break

        case 2:
            playSong(happyBirthday, tempo, enablePlayBtn);
            break
    }
});


//create white and black keys
let init = () => {
    for (let i = 1; i <= 5; i++) {
        //Since each octave has seven musical notes, we create a second for loop
        for (let j = 0; j < 7; j++) {
            let key = createKey('white', pianoNotes[j], i);
            key.dataset.keyboard = keyboardMap[j + (i - 1) * 7]; //we have two octave so we have to add i and j (i starts from 1 that's why -1)
            keyboard.appendChild(key);

            if (j != 2 && j != 6) {
                key = createKey('black', pianoNotes[j], i);
                key.dataset.keyboard = '⇧+' + keyboardMap[j + (i - 1) * 7];
                let emptySpace = document.createElement('div');
                emptySpace.className = 'empty-space';
                emptySpace.appendChild(key);
                keyboard.appendChild(emptySpace);
            }
        }
    }
}


//the type of the key is white, the second argument is the musical note of this key so that we can insert different musical notes
let createKey = (type, note, octave) => {
    let key = document.createElement('button');
    key.className = `piano_key piano_key-${type}`;
    key.dataset.letterNote = type == 'white' ? note + octave : note + '#' + octave;
    key.dataset.letterNoteFileName = type == 'white' ? note + octave : note + 's' + octave;
    key.textContent = key.dataset.letterNote;
    keys.push(key);

    key.addEventListener('mousedown', () => {
        playSound(key);
        key.classList.add('piano_key-playing'); //blue color when you press the key
    })

    key.addEventListener('mouseup', () => {
        key.classList.remove('piano_key-playing');
    })

    key.addEventListener('mouseleave', () => {
        key.classList.remove('piano_key-playing');
    })

    return key;
}

document.addEventListener('keydown', (e) => {
    if (e.repeat) {
        return;
    }
    pressKey('mousedown', e);
})

document.addEventListener('keyup', (e) => {
    pressKey('mouseup', e)
})

let pressKey = (mouseEvent, e) => {
    let lastLetter = e.code.substring(e.code.length - 1);
    // "P" = "keyP".substring(length -1)
    let isShiftPressed = e.shiftKey;
    let selector;
    if (isShiftPressed) {
        selector = `[data-keyboard="⇧+${lastLetter}"]`;
    } else {
        selector = `[data-keyboard=${lastLetter}]`
    }
    let key = document.querySelector(selector);
    if (key !== null) {
        let event = new Event(mouseEvent);
        key.dispatchEvent(event);
    }
}


let playSound = (key) => {
    let audio = document.createElement('audio');
    audio.src = 'sounds/' + key.dataset.letterNoteFileName + '.mp3';
    audio.play().then(() => {
        audio.remove();
    });
}

//for each input element, we need to attach its own event handler 
controls.forEach((input) => {
    input.addEventListener('input', () => {
        let value = input.value;
        let type;
        switch (value) {
            case 'letterNotes':
                type = 'letterNote';
                break;
            case 'keyboard':
                type = 'keyboard';
                break;
            case 'none':
                type = '';
        }
        keys.forEach((key) => {
            key.textContent = key.dataset[type];
        })
    });
});

init();