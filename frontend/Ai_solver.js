let playergamefield;
let firstTimeinitialization=true;
function getPlayerGameField() {

    fetch("http://localhost:3000/api/playergamefield")
        .then(response => response.json())
        .then(data => {
            //to make sure that the playergamefield is of the size of 9
            playergamefield = data.slice(0,9);
            console.log("this is player gamefield", playergamefield);
        });

}

async function checkFirstTime(firstTimeinitialization){
    if (firstTimeinitialization) {
        await getPlayerGameField();
        firstTimeinitialization=false;
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

async function revealCell(pos) {
    await toggleclickedCell(document.getElementsByClassName("cell")[pos]);

    fetch('http://localhost:3000/api/revealCell')
        .then(response => response.json())
        .then(data => {
            let revealLst = data[0];
            revealLst.forEach(element => {
                let pos = element[0];
                let value = element[1];

                pos = pos[0] * 9 + pos[1];

                document.getElementsByClassName("cell")[pos].style.backgroundColor = "green";
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

checkFirstTime(firstTimeinitialization);
    
}

async function flagCell(pos) {
    await toggleFlagMarkCell(document.getElementsByClassName("cell")[getFlaggedinput()])
}




async function Ai_solver() {
    
    await revealCell(10);







}


/*
the functions you should use to make the reveal cell or flag the cell is:

/// This will flag the cell 
await flagCell("number of cell");

/// This will reveal the cell 
await reveaCell("number of cell");

*/