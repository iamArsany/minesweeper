let multiArray = new Array();

for (let i = 0; i < 9; i++) {
    multiArray.push(new Array(9).fill(0));
}
function random() {
    return (Math.round((Math.random() * 10))) % 9;

}

function BombPosition() {
    let randomColumn;
    let randomRow;
    let newcol;
    let newrow;
    for (let i = 0; i < 10; i++) {
        randomColumn = random();
        randomRow = random();
        multiArray[randomColumn][randomRow] = -1;
        let prevColumn = randomColumn - 1;
        let prevRow = randomRow - 1;


        for (let k = 0; k < 3; k++) {
            for (let l = 0; l < 3; l++) {
                newcol = prevColumn + k;
                newrow = prevRow + l;

                if ((prevColumn + 1) == newcol && (prevRow + 1) == newrow) { continue; }

                //set the boundary for the game
                if (newcol >= 0 && newcol < 9 && newrow >= 0 && newrow < 9) {
                    multiArray[newcol][newrow]++;
                }
            }
        }
    }


}
BombPosition();


for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        process.stdout.write(`${multiArray[i][j]}, `);
    }
    console.log("")
}
//console.log(multiArray);




