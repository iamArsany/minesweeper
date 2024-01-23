let GameField;
let BoundaryCol;
let BoundaryRow;
let stack = new Array();
let revealList = new Array();
let bombPositions = new Array();
let CheckedPositions;
let startposition;
let entrySurroundingsPositions;
function chooseGameLevel(level) {
    GameField = new Array();
    CheckedPositions = new Array();
    switch (level) {
        case "easy":
            BoundaryCol = 9;
            BoundaryRow = 9;

            console.log("easy");
            for (let i = 0; i < BoundaryCol; i++) {
                GameField.push(new Array(BoundaryRow).fill(0));
                CheckedPositions.push(new Array(BoundaryRow).fill(0));
            }
            break;
        case "medium":
            console.log("medium");
            BoundaryCol = 16;
            BoundaryRow = 16;
            for (let i = 0; i < BoundaryCol; i++) {
                GameField.push(new Array(BoundaryRow).fill(0));
                CheckedPositions.push(new Array(BoundaryRow).fill(0));
            }
            break;
        case "hard":
            BoundaryCol = 30;
            BoundaryRow = 16;
            console.log("hard");
            for (let i = 0; i < BoundaryCol; i++) {
                GameField.push(new Array(BoundaryRow).fill(0));
                CheckedPositions.push(new Array(BoundaryRow).fill(0));
            }
    }

}

function getRandomPosition() {
    let col = (Math.round((Math.random() * 10))) % BoundaryCol;
    let row = (Math.round((Math.random() * 10))) % BoundaryRow;
    return [col, row];
}

function getPointSurroundings(x, y) {

    let surroudingX = x - 1;
    let surroudingY = y - 1;
    let positions = new Array();

    for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {

            newcol = surroudingX + k;
            newrow = surroudingY + l;

            //if ((prevColumn + 1) == newcol && (prevRow + 1) == newrow) { continue; }

            //set the boundary for the game
            if (newcol >= 0 && newcol < BoundaryCol && newrow >= 0 && newrow < BoundaryRow) {
                let position = [newcol, newrow];
                positions.push(position);
            }
        }
    }
    return positions;
}

function setBombPositions(bombsNumber) {

    for (let i = 0; i < bombsNumber;) {


        let randomPostion = getRandomPosition();
        if (GameField[randomPostion[0]][randomPostion[1]] >= 0) {

            GameField[randomPostion[0]][randomPostion[1]] = -1;
            bombPositions.push([randomPostion[0], randomPostion[1]]);
            i++;
        }
    }
    resetEntryPositinsSurrounding();
}

function setBombsCounters() {
    bombPositions.forEach(position => {
        let surroudingPositions = getPointSurroundings(position[0], position[1]);
        surroudingPositions.forEach(surroudingPosition => {
            if (GameField[surroudingPosition[0]][surroudingPosition[1]] != -1) {
                if (GameField[surroudingPosition[0]][surroudingPosition[1]] == -5) {
                    GameField[surroudingPosition[0]][surroudingPosition[1]] = 0;
                }
                GameField[surroudingPosition[0]][surroudingPosition[1]]++;
            }
        });
    });

}

function entryPosition(xPosition, yPosition) {
    startposition = [xPosition, yPosition];

    entrySurroundingsPositions = getPointSurroundings(xPosition, yPosition)
    entrySurroundingsPositions.forEach(position => {

        GameField[position[0]][position[1]] = -5;
    })

    return entrySurroundingsPositions;
}

function resetEntryPositinsSurrounding() {
    entrySurroundingsPositions.forEach(position => {
        if (GameField[position[0]][position[1]] == -5) {
            GameField[position[0]][position[1]] = 0;
        }
    });

}

function printGameField() {
    for (let i = 0; i < BoundaryCol; i++) {
        for (let j = 0; j < BoundaryRow; j++) {
            process.stdout.write(`${GameField[i][j]},     `);
        }
        console.log("")
    }
    console.log(" seperator")

}

function real() {
    let stack = new Array();
    getPointSurroundings(startposition[0], startposition[1]).forEach(posistion => {
        if (GameField[posistion[0]][posistion[1]] == 0) {
            stack.push([posistion[0], posistion[1]]);
        }

        let posotion = stack.pop();

    });

}

// function reveal(pointToRevealx, poinToRevealy) {
//     let currentPositionValue = GameField[pointToRevealx][poinToRevealy];

//     if (currentPositionValue == 0) {

//         stack.push([pointToRevealx, poinToRevealy]);
//     }

//     let poppedElementPosition = stack.pop();

//     getPointSurroundings(poppedElementPosition[0], poppedElementPosition[1])
//         .forEach(position => {


//             if (GameField[position[0]][position[1]] > 0) {
//                 revealList.push([position[0], position[1]]);
//             }
//             if (GameField[position[0]][position[1]] == 0) {
//                 revealList.push([position[0], position[1]]);
//                 //stack.push([position[0],position[1]]);
//                 reveal(position[0], position[1]);
//             }
//         })
//     if (stack.length == 0) {
//         return;
//     }


// }

function newreveal(pointToRevealx, pointToRevealy) {
    let currentPositionValue = GameField[pointToRevealx][pointToRevealy];
    if (pointToRevealx == startposition[0] && pointToRevealy == startposition[1]) {
        if (stack.length == 0) {
            if (CheckedPositions[pointToRevealx][pointToRevealy] == 0) {


                stack.push([pointToRevealx, pointToRevealy]);
                CheckedPositions[pointToRevealx][pointToRevealy] = 1;
                console.log("the first stack",stack);

            }

        }

    }


    if ((pointToRevealx >= 0 && pointToRevealx < BoundaryCol && pointToRevealy >= 0 && pointToRevealy < BoundaryRow) && stack.length != 0) {

        getPointSurroundings(pointToRevealx, pointToRevealy).forEach(posistion => {
            if (GameField[posistion[0]][posistion[1]] == 0) {
                if (posistion[0] != startposition[0] || posistion[1] != startposition[1]) {
                    if (CheckedPositions[posistion[0]][posistion[1]] == 0) {

                        stack.push([posistion[0], posistion[1]]);
                        CheckedPositions[posistion[0]][posistion[1]] = 1;
                        revealList.push([posistion[0], posistion[1]], `value:${GameField[posistion[0]][posistion[1]]}`);
                        console.log(`this is the stack ${stack}`);
                        
                    }
                }
            }



        })

        let poppedElementPosition = stack.pop();
        //stack.pop();
        console.log(`this is the stack after popped ${stack}`);
        console.log(poppedElementPosition);
        
        newreveal(poppedElementPosition[0], poppedElementPosition[1]);
        GameField[poppedElementPosition[0]][poppedElementPosition[1]] = "ccc";
    }
}



function main() {
    chooseGameLevel("easy");
    entryPosition(5, 5);
    GameField[5][5] = 0;
    setBombPositions(10);
    setBombsCounters();
    newreveal(5, 5);
    printGameField();

}


main();
console.log(stack);
console.log(revealList);
console.log("adsfasdf");
