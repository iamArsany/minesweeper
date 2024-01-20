let GameField;
let BoundaryCol;
let BoundaryRow;
let bombPositions = new Array();

function chooseGameLevel(level) {
    GameField = new Array();
    switch (level) {
        case "easy":
            BoundaryCol = 9;
            BoundaryRow = 9;

            console.log("easy");
            for (let i = 0; i < BoundaryCol; i++) {
                GameField.push(new Array(BoundaryRow).fill(0));
            }
            break;
        case "medium":
            console.log("medium");
            BoundaryCol = 16;
            BoundaryRow = 16;
            for (let i = 0; i < BoundaryCol; i++) {
                GameField.push(new Array(BoundaryRow).fill(0));
            }
            break;
        case "hard":
            BoundaryCol = 30;
            BoundaryRow = 16;
            console.log("hard");
            for (let i = 0; i < BoundaryCol; i++) {
                GameField.push(new Array(BoundaryRow).fill(0));
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

    for (let i = 0; i < bombsNumber; i++) {

        let randomPostion = getRandomPosition();
        GameField[randomPostion[0]][randomPostion[1]] = -1;
        bombPositions.push([randomPostion[0], randomPostion[1]]);
    }
}

function setBombsCounters() {
    bombPositions.forEach(position => {
        let surroudingPositions = getPointSurroundings(position[0], position[1]);
        surroudingPositions.forEach(surroudingPosition => {
            if (GameField[surroudingPosition[0]][surroudingPosition[1]] != -1) {
                GameField[surroudingPosition[0]][surroudingPosition[1]]++;
            }
        });
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


function main() {
    chooseGameLevel("easy");
    setBombPositions(10);
    setBombsCounters();
    printGameField();
}


main();