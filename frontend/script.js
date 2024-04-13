let firstTime = true;
let FirstTimeBomb = true;
let GameFieldBoard;
let revealLst;
let newlist;
let arrayOfNumberDigits = ["number-zero", "number-one", "number-two", "number-three", "number-four", "number-five", "number-six", "number-seven", "number-eight"];
let arrayOfCounterDigits = ["counter-zero", "counter-one", "counter-two", "counter-three", "counter-four", "counter-five", "counter-six", "counter-seven", "counter-eight", "counter-nine"];
let valueOfGameField;
let LevelAndBombs;
let FirstTimeData;
let indexOfClickedCell;
let FlagsCounter;
let timeCounter = 0;
let minuteCounter=0;
let firstTimeCountMinute = true;
let intervalId;
let cells;
let numOfCells;
let CheckForTheLastFlagMark = false;

function startCounter() {
    // Start the counter interval
    intervalId = setInterval(updateCounter, 1000); // Update every second
}

function updateCounter() {
    // Increment the counter value
    if ((timeCounter % 60) == 0) {
        if (firstTimeCountMinute) {
            firstTimeCountMinute = false;
        } else {
        minuteCounter++;
        }
    }

    timeCounter %= 60;
    timeCounter++;

    let firstDigitOfTimeCounter = Math.trunc(timeCounter / 10);
    let secondDigitOfTimeCounter = timeCounter % 10;

    // Display the updated counter value
    changeDisplayOfTimeNumbers(firstDigitOfTimeCounter, secondDigitOfTimeCounter);
}

function stopCounter() {
    clearInterval(intervalId); // Stop the counter interval
}

function SmileFaceLose() {
    document.getElementsByClassName('middle')[0].classList.remove('smileface-natural');
    document.getElementsByClassName('middle')[0].classList.remove('smileface-win');

    document.getElementsByClassName('middle')[0].classList.add('smileface-lose');

}

function naturalSmileFace() {
    document.getElementsByClassName('middle')[0].classList.remove('smileface-lose');
    document.getElementsByClassName('middle')[0].classList.remove('smileface-win');

    document.getElementsByClassName('middle')[0].classList.add('smileface-natural');
}

function smilefaceWin() {
    document.getElementsByClassName('middle')[0].classList.remove('smileface-lose');
    document.getElementsByClassName('middle')[0].classList.remove('smileface-natural');

    document.getElementsByClassName('middle')[0].classList.add('smileface-win');
}

function ChangeCounterOfFlags(cell) {

    let isCellContainFlag = cell.classList.contains('flag-mark');
    if (isCellContainFlag) {
        FlagsCounter++;
    } else {
        if (FlagsCounter > 0) {
            FlagsCounter--;
        }
    }


    let firstDigitOfCounter = Math.trunc(FlagsCounter / 10);
    let secondDigitOfCounter = FlagsCounter % 10;

    changeDisplayOfFlagNumbers(firstDigitOfCounter, secondDigitOfCounter);

}

function changeDisplayOfFlagNumbers(firstDigit, SecondDigit) {

    const leftElments = document.getElementsByClassName("left")[0].getElementsByClassName("cell-counter");


    leftElments[0].classList = [`cell-counter ${arrayOfCounterDigits[SecondDigit]}`];
    leftElments[1].classList = [`cell-counter ${arrayOfCounterDigits[firstDigit]}`];


}

function changeDisplayOfTimeNumbers(firstDigit, secondDigit) {
    const rightElements = document.getElementsByClassName("right")[0].getElementsByClassName("cell-counter");

    rightElements[0].classList = [`cell-counter ${arrayOfCounterDigits[secondDigit]}`]
    rightElements[1].classList = [`cell-counter ${arrayOfCounterDigits[firstDigit]}`]
}

function chooseLevel(Level) {
    const levelElement = document.querySelector(".level");

    // Remove all child elements inside the "level" element
    levelElement.innerHTML = '';
    document.getElementsByClassName("level")[0].classList.remove("level");


    if (Level === "easy") {
        LevelAndBombs = [Level, 10];
        FlagsCounter = LevelAndBombs[1];
        numOfCells = 9 * 9;
        changeDisplayOfFlagNumbers(1, 0);
    } else if (Level === "medium") {
        LevelAndBombs = [Level, 40]
        FlagsCounter = LevelAndBombs[1];
        numOfCells = 16 * 16;
        changeDisplayOfFlagNumbers(4, 0);
    } else if (Level === "hard") {
        LevelAndBombs = [Level, 99]
        numOfCells = 30 * 16;
        FlagsCounter = LevelAndBombs[1];
        changeDisplayOfFlagNumbers(9, 9);
    }

}

function displayWinningMsg(message) {
    
    const popup = document.createElement("div");
    popup.classList.add("popup");

    // Apply CSS styles to center the popup
    popup.style.position = "fixed";
    popup.style.width = "30%";
    popup.style.maxWidth = "400px"; 
    popup.style.height = "auto";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.backgroundColor = "black";
    popup.style.color = "white";
    popup.style.padding = "20px";
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";

    // Create a div for the "Congratulations" message
    const congratsMsg = document.createElement("div");
    congratsMsg.textContent = "Congratulations!";
    congratsMsg.style.fontWeight = "bold";
    congratsMsg.style.marginBottom = "10px"; 
    congratsMsg.style.textAlign = "center";

    // Create a simple line separator
    const separator = document.createElement("hr");
    separator.style.border = "none";
    separator.style.borderTop = "1px solid white";
    separator.style.margin = "10px 0"; 

    // Create a div for the message body
    const msgBody = document.createElement("div");
    msgBody.innerHTML = `<br>Time: ${minuteCounter}: ${message}`;

    msgBody.style.fontSize = "1em"; 
    msgBody.style.textAlign = "center";

    // Create an OK button
    const okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.style.width = "100%";
    okButton.style.padding = "10px";
    okButton.style.fontSize = "1em"; 
    okButton.style.marginTop = "20px";

    okButton.addEventListener("click", () => {
        popup.remove();
    });

    // Append the elements to the popup
    popup.appendChild(congratsMsg);
    popup.appendChild(separator);
    popup.appendChild(msgBody);
    popup.appendChild(okButton);


    document.body.appendChild(popup);
}







function checkIfWin() {
    let winCounter = 0;
    const cells = document.querySelectorAll(".cell");
    const totalCells = cells.length;

    cells.forEach(cell => {
        const hasBomb = cell.classList.contains("bomb");
        const isFlagged = cell.classList.contains("flag-mark");
        const isClicked = cell.classList.contains("clickedCell");

        if ((hasBomb && isFlagged) || isClicked) {
            winCounter++; // Increment win counter
        }
    });
    if (winCounter === totalCells) {
        stopCounter(); // Stop the counter (assuming you have a stopCounter function)
        smilefaceWin();
        displayWinningMsg(timeCounter);
        return 0
    }
    return -1
}



document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
})

let originalOnclickState;

function toggleFlagMarkCell(cell) {

    if (FirstTimeBomb && FlagsCounter > 0) {

        if (CheckForTheLastFlagMark) {
            FlagsCounter--;
            CheckForTheLastFlagMark = false;
        }

        ChangeCounterOfFlags(cell);

        cell.classList.toggle('flag-mark');
        if (cell.onclick == null) {
            cell.onclick = originalOnclickState;
        } else {
            originalOnclickState = cell.onclick;
            cell.onclick = null;
        }
        if (FlagsCounter <= 1) {
           checkIfWin(); 
        }

    } else if (FirstTimeBomb && FlagsCounter == 0 && cell.classList.contains("flag-mark")) {
        FlagsCounter++;
        CheckForTheLastFlagMark = true;
        toggleFlagMarkCell(cell);
    }

}




async function toggleclickedCell(cell) {
    var index = Array.from(cell.parentNode.children).indexOf(cell);
    col = index % 9;
    row = Math.trunc(index / 9);
    PositionsToReveal = [row, col];
    indexOfClickedCell = col * 9 + row;
    try {
        if (firstTime) {
            await initializeGame();
            //start the counter
            startCounter();
        }

        await fetch('http://localhost:3000/api/revealCellPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(PositionsToReveal),
        });

        const response = await fetch('http://localhost:3000/api/revealCell');
        const data = await response.json();
        revealLst = data[0];
        



        const cell_element = document.getElementsByClassName('cell');
        let valueOfGameField;

        for (let i = 0; i < revealLst.length; i++) {
            
            let divIndex = revealLst[i][0];
            divIndex = divIndex[0] * 9 + divIndex[1];

            cell_index = revealLst[i][0];
            cell_value = revealLst[i][1];

            valueOfGameField = GameFieldBoard[cell_index[0]][cell_index[1]];


            if (cell_value != -1 && !(cell_element[divIndex].classList.contains("flag-mark"))) {

                cell_element[divIndex].classList.add('clickedCell');
                cell_element[divIndex].onclick = null;
                cell_element[divIndex].oncontextmenu = null;

            } else {

                // handle the lose situation
                let CellElemetHasFlag = cell_element[divIndex].classList.contains('flag-mark');

                if (CellElemetHasFlag) {
                    cell_element[divIndex].onclick = null;
                    cell_element[divIndex].oncontextmenu = null;
                   
                } else {
                    cell_element[divIndex].classList.add('clickedCell');
                    cell_element[divIndex].onclick = null;
                    cell_element[divIndex].oncontextmenu = null;
                    if (FirstTimeBomb) {

                        cell.style.backgroundColor = "red";
                        cell.removeEventListener('click', toggleclickedCell);
                        FirstTimeBomb = false;

                        //smileface to lose and stop counter
                        SmileFaceLose();
                        stopCounter();

                    }
                }


            }
        }
        if (FirstTimeBomb) {

            cell.classList.add('clickedCell');
            cell.onclick = null;
            cell.oncontextmenu = null;
        }

        if (FlagsCounter <= 1) {
            checkIfWin();
        }

    } catch (error) {
        // Handle errors in a more informative way
        console.error('Error from the asyncronus:', error.message);
    }
}

async function initializeGame() {
    if (firstTime) {
        FirstTimeData = [...LevelAndBombs];
        FirstTimeData[2] = PositionsToReveal;

        try {
            const response1 = await fetch('http://localhost:3000/api/initializeGameComponents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(FirstTimeData),
            });
            const data1 = await response1.json();
            GameFieldBoard = data1[0];


            const response3 = await fetch('http://localhost:3000/api/placeNumbers');
            const data3 = await response3.json();

            const cell_element = document.getElementsByClassName('cell');

            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    const divIndex = i * 9 + j;
                    cell_value = data3[i][j];

                    if (cell_value >= 0) {
                        cell_value = arrayOfNumberDigits[data3[i][j]];
                        cell_element[divIndex].classList.add(cell_value);
                    } else {
                        if (cell_value == "m" || cell_value == "c" || cell_value == "z") {
                           
                            // Handle m case
                        }
                        else {

                            cell_element[divIndex].classList.add("bomb");
                        }
                    }
                }
            }

            firstTime = false;
        } catch (error) {
            console.error('Error from InitialzeGame function():', error.message);
            throw error;
        }
    }
}

async function restartGame() {

    try {
        await fetch("http://localhost:3000/api/restartGame");

        console.log("Server-side restart initiated.");
        setTimeout(() => {

            location.reload();

        }, 100);
        

    } catch (error) {

        console.error('Error during fetch:', error);
    }

}



