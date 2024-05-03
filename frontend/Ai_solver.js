let playergamefield;
let firstTimeinitialization = true;
let flags = 11;


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
    console.log("this is the cell getting flagged", playergamefield[x][y])
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
    let returned = [positions, unRevealedCounter, flaggedCounter];
    return returned;
}

function getPointSurroundingsUnrevealedOfGeneratedGameField(GeneratedGameField, x, y) {
    let BoundaryCol = 9;
    let BoundaryRow = 9;
    let surroundingX = x - 1;
    let surroundingY = y - 1;
    let positions = [];
    let unRevealedCounter = 0;
    let flaggedCounter = 0;
    let CantChangeCounter = 0;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let newcol = surroundingX + i;
            let newrow = surroundingY + j;

            // set the boundary for the game

            if (newcol >= 0 && newcol < BoundaryCol && newrow >= 0 && newrow < BoundaryRow) {
                //  add the unrevealed tile and flag tile as well
                console.log("newcol",newcol,"generatedGamefield",GeneratedGameField);

                if (GeneratedGameField[newcol][newrow] == "u") {
                    unRevealedCounter++;
                    let position = [[newcol, newrow], "u"];
                    positions.push(position);
                } else if (GeneratedGameField[newcol][newrow] == "f") {
                    flaggedCounter++;
                    let position = [[newcol, newrow], "f"];
                    positions.push(position);
                } else if (GeneratedGameField[newcol][newrow] == "c") {
                    CantChangeCounter++;
                    let position = [[newcol, newrow], "c"];
                    positions.push(position);

                }
            }
        }
    }
    console.log("positions: ", positions);
    let returned = [positions, unRevealedCounter, flaggedCounter];
    return returned;
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
                    // cell[neighbor].style.backgroundColor = "#FF8F00";
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

async function Solve_With_logic(ListOfnumbers, posToReveal) {
    flags = 11;
    while (flags > 0) {
        for (let i = 0; i < ListOfnumbers.length; i++) {
            let pos = ListOfnumbers[i];
            let PointSurroundingData = await getPointSurroundingsUnrevealed(...pos); // Ensure to await the async function call
            let unrevealedNum = PointSurroundingData[1];
            let FlagsNum = PointSurroundingData[2];
            let positionsOfNums = PointSurroundingData[0];

            if (playergamefield[pos[0]][pos[1]] == (unrevealedNum + FlagsNum)) {
                for (const Pos of positionsOfNums) {
                    if (playergamefield[Pos[0][0]][Pos[0][1]] !== 'f') {
                        console.log("this is should be flagged: ", playergamefield[Pos[0][0]][Pos[0][1]]);
                        playergamefield[Pos[0][0]][Pos[0][1]] = "f";
                        // flagCell(...Pos[0]);
                    }
                }

            }

            if (playergamefield[pos[0]][pos[1]] == FlagsNum) {
                for (let j = 0; j < positionsOfNums.length; j++) {
                    let posInfo = positionsOfNums[j];
                    if (posInfo[1] == 'u') {
                        await revealCell(...posInfo[0]);
                    }
                }
            }
        }
        ListOfnumbers = breadthFirstSearch(...posToReveal);
        flags--;
    }
    await flagAllCells();
}

async function flagAllCells() {
    let positionsToFlag = [];

    // Iterate through playergamefield and save positions
    for (let x = 0; x < playergamefield.length; x++) {
        for (let y = 0; y < playergamefield[x].length; y++) {
            let pos = x * 9 + y; // Calculate position in the HTML grid
            let cell = document.getElementsByClassName("cell")[pos]; // Get corresponding HTML cell

            if (!cell.classList.contains("flag-cell") && playergamefield[x][y] == "f") { // Check if cell has class "flag-cell"
                if (playergamefield[x][y] === 'f') {

                    // cell.style.backgroundColor = "#ff0000"
                    positionsToFlag.push([x, y]);
                    console.log("cells will be flagged: ", [x, y]) // Save position [x, y] if value is 'u' or 'f' and cell doesn't have class "flag-cell"
                }
            }
        }
    }

    // Iterate through saved positions and flag each cell
    for (let i = 0; i < positionsToFlag.length; i++) {
        let [x, y] = positionsToFlag[i];


        // document.getElementsByClassName("cell")[x * 9 + y].style.backgroundColor = "#0000ff"
        await flagCell(x, y);

    }
}



async function Ai_solver() {
    let posToReveal = [4, 4];
    await revealCell(...posToReveal);
    console.log("test", playergamefield);

    let ListOfnumbers = breadthFirstSearch(...posToReveal);
    console.log("this is the list of numbers i should bactrack on:", ListOfnumbers);
    let flagsLeft = flags; // Number of flags left
    let visited = new Set();


    Solve_With_logic(ListOfnumbers, posToReveal);
    // console.log("num of generatedStates", generateStates(ListOfnumbers));
}




function backtrack(newstate, x, y) {
    let list = getPointSurroundingsUnrevealedOfGeneratedGameField(newstate, x, y)[0];
    let forbidden = list.filter(position => position[1] !== 'u');
    let numOfFinForbidden = forbidden.length;

    let value = newstate[x][y] - numOfFinForbidden;
    for (let elem of list) {
        if (elem[1] !== "f" && value !== 0) {
            elem[1] = "u";
            value--;
        }
        if (value === 0) {
            break;
        }
    }

    let s = new Set();

    function back(forbidden, list, visited, res) {
        if (list.length === res.length) {
            for (let i = 0; i < forbidden.length; i++) {
                if (res[i][1] !== 'f') { // Check if the position is not 'u'
                    return;
                }
            }
            s.add(JSON.stringify(res));
        }
        for (let i = 0; i < list.length; i++) {
            if (!visited[i]) {
                visited[i] = true;
                res.push(list[i]); // Push the entire element
                back(forbidden, list, visited, res);
                visited[i] = false;
                res.pop();
            }
        }
    }

    let visited = new Array(list.length).fill(false);
    back(forbidden, list, visited, []);
    return s; // Return the set of possible combinations
}

function generateStates(ListOfnumbers) {
    let localGameField = [...playergamefield];
    let states = backtrack([...localGameField], ListOfnumbers[0][0], ListOfnumbers[0][1]);
    ListOfnumbers.shift();
    console.log("states",states);

    for (let tile of ListOfnumbers) {
        let tmpstates = [];
        for (let state of states) {
            let newstates = backtrack(JSON.parse(state), ...tile);
            console.log("problem");
            tmpstates.push(...newstates);
        }
        states = tmpstates;
    }

    return states;
}


function countU(state) {
    let Ucounter = 0;
    for (let i = 0; i < state.length; i++) {
        for (let j = 0; j < state[0].length; j++) {
            if (state[i][j] == "u") {
                Ucounter++;
            }
        }

    }
    return Ucounter;
};
function binomialCoefficient(n, r) {
    if (r === 0 || r === n) {
        return 1;
    } else {
        return binomialCoefficient(n - 1, r - 1) + binomialCoefficient(n - 1, r);
    }
}

function calcluateProbability(ListOfnumbers, states) {
    let filteredSurrondings = new Map(); // Use Map instead of Set to store probabilities

    for (let state of states) {
        for (let surrounding of ListOfnumbers) {
            let positions = getPointSurroundingsUnrevealedOfGeneratedGameField(state, surrounding[0][0], surrounding[0][1])[0];
            let counterofBombs = positions.filter(position => position !== "u").length;
            let Ucounter = positions.filter(position => position !== "f").length;
            let numOfU = countU(state);
            let unrevealedCells = numOfU - Ucounter;
            let restOfFLags = 10 - counterofBombs;
            let resultOfC = binomialCoefficient(unrevealedCells, restOfFLags);
            let total = binomialCoefficient(numOfU, 10);
            let probabilityofFlag = (resultOfC / total) * 100;

            // Update the probability for each position in filteredSurrondings
            positions.forEach(position => {
                if (!filteredSurrondings.has(position)) {
                    filteredSurrondings.set(position, 0); // Initialize probability to 0 if not present
                }
                filteredSurrondings.set(position, filteredSurrondings.get(position) + probabilityofFlag); // Add probability
            });
        }
    }

    // Normalize probabilities (sum should be 100%)
    let totalProbability = Array.from(filteredSurrondings.values()).reduce((acc, val) => acc + val, 0);
    filteredSurrondings.forEach((value, key) => {
        filteredSurrondings.set(key, (value / totalProbability) * 100);
    });

    return filteredSurrondings;
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
