let multiArray = new Array();

//intialize game array

for (let i = 0; i < 9; i++) {
    multiArray.push(new Array(9).fill(0));
}

function random() {
    return (Math.round((Math.random() * 10))) % 9;

}

function entryPosition(col,row){
    let newcol;
    let newrow;
    let prevColumn=col-1;
    let prevRow=row-1;

    multiArray[col][row]="a";
    for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
            newcol = prevColumn + k;
            newrow = prevRow + l;

            if ((prevColumn + 1) == newcol && (prevRow + 1) == newrow) { continue; }

            //set the boundary for the game
            if (newcol >= 0 && newcol < 9 && newrow >= 0 && newrow < 9) {
                multiArray[newcol][newrow]="a";
            }
        }
    }
}

function setBombPosition() {
    let randomColumn;
    let randomRow;
    let newcol;
    let newrow;
    for (let i = 0; i < 10;) {
        randomColumn = random();
        randomRow = random();
        if(multiArray[randomColumn][randomRow]!="a")
        {
            multiArray[randomColumn][randomRow] = -1;
            i++;
           
            let prevColumn = randomColumn - 1;
            let prevRow = randomRow - 1;
            
            for (let k = 0; k < 3; k++) {
                for (let l = 0; l < 3; l++) {
                    newcol = prevColumn + k;
                    newrow = prevRow + l;
    
                    if ((prevColumn + 1) == newcol && (prevRow + 1) == newrow) { continue; }
    
                    //set the boundary for the game
                    if (newcol >= 0 && newcol < 9 && newrow >= 0 && newrow < 9) {
                        if(multiArray[newcol][newrow]=="a"){
                            multiArray[newcol][newrow]=1;
                        }
                        multiArray[newcol][newrow]++;
                    }
                }
            }
        }
    }


}
entryPosition(0,0);
setBombPosition();


for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        process.stdout.write(`${multiArray[i][j]},     `);
    }
    console.log("")
}
//console.log(multiArray);




