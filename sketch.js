const mapData = {
    nRows : 21,
    nCols : 21,
    diamonds: [],
    startPoints: [{col: 0, row: 0, color:"#f00"}, {col: 20, row: 20, color: "#00f"}]
};
const cellSize = 35;
const arena = new Arena(mapData, cellSize);

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
    const canvas = document.getElementById("canvasArena");
    createCanvas(cellSize * mapData.nCols, cellSize * mapData.nCols, canvas);
    const bot1 = new Bot("TempBot");
    const bot2 = new StupidBot();

    arena.addBot(bot1);
    arena.addBot(bot2);

    generateDiamonds(mapData, 10);
    updateInforPanel();
}

function draw(){
    arena.draw();    
    
}

function updateInforPanel(){
    const bot1 = arena.bots[0];
    const bot2 = arena.bots[1];

    document.getElementById("bot1-name").innerText = bot1.name;
    document.getElementById("bot1-score").innerText = bot1.score;
    document.getElementById("bot2-name").innerText = bot2.name;
    document.getElementById("bot2-score").innerText = bot2.score;
}


function next(){
    updateInforPanel();
    if (!arena.stillCanPlay()) {
        alert(`Game over! ${arena.bots[0].name} : ${arena.bots[0].score};   ${arena.bots[1].name} : ${arena.bots[1].score}`);
    } else {        
        arena.nextMove();
    }
}