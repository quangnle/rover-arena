const mapData = {
    nRows : 21,
    nCols : 21,
    diamonds: [ 
        // {col: 8, row: 8}, {col: 10, row: 8}, {col: 12, row: 8},
        // {col: 8, row: 10}, {col: 10, row: 10}, {col: 12, row: 10},
        // {col: 8, row: 12}, {col: 10, row: 12}, {col: 12, row: 12},
        
    ],
    startPoints: [{col: 0, row: 0, color:"#f00"}, {col: 20, row: 20, color: "#0f0"}]
};
const arena = new Arena(mapData, 35);

function addOneDiamond(mapData, row, col){
    let centerRow = mapData.nRows >> 1;
    let centerCol = mapData.nCols >> 1;
    
    mapData.diamonds.push({row, col});
    mapData.diamonds.push({row: centerRow + (centerRow - row), col});
    mapData.diamonds.push({row, col: centerCol + (centerCol - col)});
    mapData.diamonds.push({row: centerRow + (centerRow - row), col: centerCol + (centerCol - col)});
}

function generateDiamonds(mapData, nDiamonds){
    let centerRow = mapData.nRows >> 1;
    let centerCol = mapData.nCols >> 1;
    mapData.diamonds.push({row: centerRow, col: centerCol});

    for(let i = 0; i < nDiamonds; i++){
        let row = Math.floor(Math.random() * mapData.nRows);
        let col = Math.floor(Math.random() * mapData.nCols);
        addOneDiamond(mapData, row, col);
    }

}

function setup(){
    createCanvas(1200, 1200);
    const bot1 = new Bot("A");
    const bot2 = new StupidBot();

    arena.addBot(bot1);
    arena.addBot(bot2);

    generateDiamonds(mapData, 10);

    let nextMove = bot2.getNextMove(mapData, arena.bots);
}

function draw(){
    arena.draw();
}

function next(){
    if (!arena.stillCanPlay()) {
        alert(`Game over! ${arena.bots[0].name} : ${arena.bots[0].score};   ${arena.bots[1].name} : ${arena.bots[1].score}`);
    } else {        
        arena.nextMove();
    }
}