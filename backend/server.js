const refactor = require('../refactor.js');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require("cors");
const app = express();
const port = 3000;


let revealPositions;
let firstTime = true;
let ISBombClicked = false;
app.use(cors());
app.use(bodyParser.json());

app.post('/api/initializeGameComponents', (req, res) => {
    try {
        FirstTimeData = req.body;
        const level = FirstTimeData[0];
        const bombsNumber = FirstTimeData[1];
        const positions = FirstTimeData[2];

        refactor.chooseGameLevel(level);
        refactor.entryPosition(...positions);
        refactor.setBombPositions(bombsNumber);
        refactor.setBombsCounters();

        refactor.printGameField();
        refactor.addClickedCellToRevealList(...positions);
        console.log("this is the check from the server to see if the gamefieldboard prolbem is form here",refactor.GameFieldfunc(),refactor.revealListfunc());
        res.status(200).json([refactor.GameFieldfunc(), refactor.revealListfunc()]);
    } catch (error) {
        console.error('Error in /api/initializeGameComponents:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/revealCellPost', (req, res) => {
    try {
        revealPositions = req.body;

        refactor.revealList = [];


        if (firstTime) {
            firstTime = false;
            refactor.revealBlock(...revealPositions);
            refactor.addClickedCellToRevealList(...revealPositions);
            res.status(200).json({ revealList: refactor.revealListfunc() });
            // console.log(refactor.revealListfunc())
        } else {
            console.log("..............")
            if (refactor.GameFieldinput(...revealPositions) == -1) {
                ISBombClicked = true;
                console.log("```````");
                res.status(200).json(refactor.bombPositionsfunc());
            } else {
                console.log("not bomb");
                refactor.revealBlock(...revealPositions);
                refactor.addClickedCellToRevealList(...revealPositions);
                res.status(200).json({ revealList: refactor.revealListfunc() });
            }
        }


    }

    catch (error) {
        console.error('Error in /api/revealCellPost:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/playergamefield', (req, res) => {
    try {
        res.status(200).json(refactor.GameFieldOfPlayer())
    } catch (err) {
        console.error('Error in /api/playergamefield:', err)
        res.status(500).json({ error: "internal server error" })
    }
})

app.get('/api/revealCell', (req, res) => {
    try {
        if (ISBombClicked) {
            res.status(200).json([refactor.bombPositionsfunc()]);
        } else {
            // console.log("/api/revealCell",refactor.revealListfunc());
            res.status(200).json([refactor.revealListfunc()]);
        }
    } catch (error) {
        console.error('Error in /api/revealCell:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/revealBombPositions', (req, res) => {
    try {
        res.status(200).json(refactor.bombPositionsfunc());

    } catch (err) {
        console.error("Error from /api/revealBombPositions", err);
        res.status(500).json("Error from /api/revealBombPositions");
    }
})
app.get('/api/restartGame', (req, res) => {
    try {
        firstTime = true;
        ISBombClicked = false;
        refactor.restartToDefault()
        console.log("revealList after restart: ", refactor.revealListfunc());

        res.status(200).json({ list: "iam here and refreshed" });
    } catch (err) {
        console.error(err);
    }
})

app.get('/api/placeNumbers', (req, res) => {
    try {
        res.status(200).json(refactor.GameFieldfunc());
    } catch (error) {
        console.error('Error in /api/placeNumbers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// let revealPositions;

// app.use(cors());
// app.use(bodyParser.json());

// app.post('/api/initializeGameComponents',(req,res)=>{

//     FirstTimeData=req.body;
//     let level=FirstTimeData[0];
//     let bombsNumber=FirstTimeData[1];
//     let positions=FirstTimeData[2];

//     refactor.chooseGameLevel(level);
//     refactor.entryPosition(...positions);
//     refactor.setBombPositions(bombsNumber);
//     refactor.setBombsCounters();
//     console.log("gamefield from the post initalasdjlk",refactor.GameField);
//     res.setHeader('Content-Type', 'application/json'); // Set Content-Type header
//     res.json([refactor.GameField,refactor.revealList]);
//     res.status(200);



// })
// app.post('/api/revealCellPost',(req,res)=>{
//     revealPositions= req.body;
//     console.log("data recieved is: ",revealPositions);
//     console.log("revealList before zeroit is: ",refactor.revealList );
//     refactor.revealList=[];
//     refactor.revealBlock(...revealPositions);
//     console.log("reveal list after zero and new: ",refactor.revealList);
//     res.json({"revealList":refactor.revealList});
//     res.status(200);
// });

// // Define an API endpoint to access the array
// app.get('/api/array', (req, res) => {
//     res.setHeader('Content-Type', 'application/json'); // Set Content-Type header
//     res.json([refactor.GameField,refactor.revealList]);
// });

// app.get('/api/revealCell',(req,res)=>{
//     res.setHeader('Content-Type','application/json');
//     console.log("gamefield form revealcell function",refactor.GameField);
//     res.json([refactor.revealList]);
// });



// app.get('/api/placeNumbers',(req,res)=>{
//     res.header('Content-Type','application/json');
//     res.json(refactor.GameField);
// })

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});




