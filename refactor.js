let GameField;
let BoundaryCol;
let BoundaryRow;
let stack = new Array();
let revealList = new Array();
let bombPositions = new Array();
let duplicatedGameField = new Array();
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
                duplicatedGameField.push(new Array(BoundaryRow).fill(0));
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


}

function printDuplicatedGameField(duplicatedGameField) {

    for (let i = 0; i < BoundaryCol; i++) {
        for (let j = 0; j < BoundaryRow; j++) {
            process.stdout.write(`${duplicatedGameField[i][j]},     `);
        }
        console.log("")
    }

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




function revealBlock(x, y) {
    const currentPositionValue = GameField[x][y];

    if ( isStackEmpty() && !isCheckedPosition(x, y)) {
        stack.push([x, y]);
        markCheckedPosition(x, y);
        GameField[x][y] = "z";

    }

    if (isWithinBoundaries(x, y) && !isStackEmpty()) {
        getPointSurroundings(x, y).forEach(position => {
            if (isEmptyCell(position) && !isStartPoint(...position) && !isCheckedPosition(...position)) {
                stack.push([...position]);
                markCheckedPosition(...position);
                revealList.push([...position], `value:${GameField[position[0]][position[1]]}`);
                GameField[position[0]][position[1]] = "c";

            } else if (!isEmptyCell(position) && !isStartPoint(...position) && !isCheckedPosition(...position)) {
                revealList.push([...position], `value:${GameField[position[0]][position[1]]}`);
                markCheckedPosition(...position);
                GameField[position[0]][position[1]] = "m";
            }
        });

        const poppedElementPosition = stack.pop();
        revealBlock(...poppedElementPosition);


    }

}

// Helper functions
function isStartPoint(x, y) {
    return x === startposition[0] && y === startposition[1];
}

function isStackEmpty() {
    return stack.length === 0;
}

function isCheckedPosition(x, y) {
    return CheckedPositions[x][y] === 1;
}

function markCheckedPosition(x, y) {
    CheckedPositions[x][y] = 1;
}

function isWithinBoundaries(x, y) {
    return x >= 0 && x < BoundaryCol && y >= 0 && y < BoundaryRow;
}

function isEmptyCell(position) {
    const [x, y] = position;
    return GameField[x][y] === 0;
}



function main() {
    chooseGameLevel("easy");
    entryPosition(1, 1);
    setBombPositions(10);
    setBombsCounters();
    let duplicatedGameField = [...GameField];
    printDuplicatedGameField(duplicatedGameField);
    revealBlock(2, 2);
    revealBlock(6,5);
    printGameField();


}


main();
console.log(stack);
console.log(revealList.length/2);
console.log(revealList);

