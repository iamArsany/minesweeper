const { get } = require("http");
const { parse } = require("path");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function getanswer() {
    rl.question("enter your answer: ", (userInput) => {

        if (userInput.toLowerCase() == "exit") { rl.close(); }else{
        userInput = parseInt(userInput);
        userInput += 5;

        console.log(`your answer: ${userInput}`);
        //rl.close();
        
   getanswer();} 
})

    
}
getanswer();

rl.on('close', () => { console.log("Readline interface closed") });



module.exports =getanswer;