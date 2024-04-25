let playergamefield;
let firstTimeinitialization = true;
let flags = 10;


async function getPlayerGameField() {

    try {
        const response = await fetch("http://localhost:3000/api/playergamefield");
        const data = await response.json();
        // Make sure that the playergamefield is of the size of 9
        playergamefield = data.slice(0, 9);
        console.log("This is player gamefield", playergamefield);
        return playergamefield;
    } catch (error) {
        console.error('Error fetching player gamefield:', error);
        throw error; // Propagate the error for handling elsewhere if needed
    }
}

async function checkFirstTime(firstTimeinitialization) {
    if (firstTimeinitialization) {
        await getPlayerGameField();
        firstTimeinitialization = false;
    }
}

function getInput() {
    const input = document.getElementById("positionToReveal");
    return input.value;
}

function getFlaggedinput() {
    const input = document.getElementById("positionToFlag");
    return input.value;
}

async function revealCell(x, y) {
    let pos = x * 9 + y;

    await toggleclickedCell(document.getElementsByClassName("cell")[pos]);

    fetch('http://localhost:3000/api/revealCell')
        .then(response => response.json())
        .then(data => {
            let revealLst = data[0];
            revealLst.forEach(element => {
                let pos = element[0];
                let value = element[1];

                pos = pos[0] * 9 + pos[1];

                // document.getElementsByClassName("cell")[pos].style.backgroundColor = "green";
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    await checkFirstTime(firstTimeinitialization);

}

async function flagCell(x, y) {
    playergamefield[x][y] = 'f';
    let pos = x * 9 + y;
    await toggleFlagMarkCell(document.getElementsByClassName("cell")[pos])
}

function getPointSurroundingsUnrevealed(x, y) {
    let BoundaryCol = 9;
    let BoundaryRow = 9;
    let surroundingX = x - 1;
    let surroundingY = y - 1;
    let positions = [];
    let unRevealedCounter = 0;
    let flaggedCounter = 0;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let newcol = surroundingX + i;
            let newrow = surroundingY + j;

            // set the boundary for the game
            if (newcol >= 0 && newcol < BoundaryCol && newrow >= 0 && newrow < BoundaryRow) {
                //  add the unrevealed tile and flag tile as well
                if (playergamefield[newcol][newrow] == "u") {
                    unRevealedCounter++;
                    let position = [[newcol, newrow], "u"];
                    positions.push(position);
                } else if (playergamefield[newcol][newrow] == "f") {
                    flaggedCounter++;
                    let position = [[newcol, newrow], "f"];
                    positions.push(position);
                }
            }
        }
    }
    let returned=[positions,unRevealedCounter,flaggedCounter];
    return returned;
}

function getNeighbors(cellValue) {
    let y = Math.floor(cellValue / 9); // Extract y coordinate
    let x = cellValue % 9; // Extract x coordinate

    let prevValue = x !== 0 && playergamefield[y][x - 1] !== 'u' ? cellValue - 1 : undefined; // Check if not in the leftmost column
    let aboveValue = y !== 0 && playergamefield[y - 1][x] !== 'u' ? cellValue - 9 : undefined; // Check if not in the top row
    let nextValue = x !== 8 && playergamefield[y][x + 1] !== 'u' ? cellValue + 1 : undefined; // Check if not in the rightmost column
    let belowValue = y !== 8 && playergamefield[y + 1][x] !== 'u' ? cellValue + 9 : undefined; // Check if not in the bottom row

    // Include corner neighbors
    let topLeftValue = (x !== 0 && y !== 0) && playergamefield[y - 1][x - 1] !== 'u' ? cellValue - 10 : undefined;
    let topRightValue = (x !== 8 && y !== 0) && playergamefield[y - 1][x + 1] !== 'u' ? cellValue - 8 : undefined;
    let bottomLeftValue = (x !== 0 && y !== 8) && playergamefield[y + 1][x - 1] !== 'u' ? cellValue + 8 : undefined;
    let bottomRightValue = (x !== 8 && y !== 8) && playergamefield[y + 1][x + 1] !== 'u' ? cellValue + 10 : undefined;

    // Filter out undefined values and also check if they are within the range of the board
    let neighbors = [prevValue, aboveValue, nextValue, belowValue, topLeftValue, topRightValue, bottomLeftValue, bottomRightValue]
        .filter(value => value !== undefined && value >= 0 && value < 81);

    return neighbors;
}

function breadthFirstSearch(startX, startY) {

    let startCell = startY * 9 + startX;

    let frontier = [startCell];
    let reached = new Set([startCell]);

    let ListOfnumbers = []


    let cell = document.querySelectorAll(".cell");

    async function explore() {
        while (frontier.length != 0) {
            let current = frontier.shift();
            let neighbors = getNeighbors(current);

            for (let neighbor of neighbors) {
                if (!reached.has(neighbor)) {
                    reached.add(neighbor);
                    frontier.push(neighbor);
                    // await new Promise(resolve => setTimeout(resolve, 100));
                    cell[neighbor].style.backgroundColor = "#FF8F00";
                    //add only the number to the list;
                    let x = Math.floor(neighbor / 9);
                    let y = neighbor % 9;
                    if (playergamefield[x][y] != 0 && playergamefield[x][y] != 'u') {
                        ListOfnumbers.push([x, y]);
                    }
                }
            }
        }
    }

    explore();
    console.log("list", ListOfnumbers);
    return ListOfnumbers;
}



async function Ai_solver() {
    let posToReveal = [0, 0];
    await revealCell(...posToReveal);
    console.log("test", playergamefield);
    
    let ListOfnumbers = breadthFirstSearch(...posToReveal); // Retrieve list of cell coordinates to explore

     /* assume you have defined flags variable */

    // while (flags > 0) {
        for (let i = 0; i < ListOfnumbers.length; i++) {
            let pos = ListOfnumbers[i];
            let PointSurroundingData = getPointSurroundingsUnrevealed(...pos);
            let unrevealedNum = PointSurroundingData[1];
            let FlagsNum = PointSurroundingData[2];
            let positionsOfNums = PointSurroundingData[0];
            if (playergamefield[pos[0]][pos[1]] == (unrevealedNum + FlagsNum)) {
                positionsOfNums.forEach((Pos) => {
                    flagCell(...Pos[0]);
                });
            }
        }
        // flags--;
    // }
}



/*
the functions you should use to make the reveal cell or flag the cell is:

/// This will flag the cell 
await flagCell("number of cell");

/// This will reveal the cell 
await reveaCell("number of cell");

*/