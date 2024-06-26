class Arena {
    static increment = 0
    constructor(mapData, cellSize){
        this.mapData = mapData;
        this.cellSize = cellSize;
        this.bots = [];
        this.moves = [];
    }

    addBot(bot){
        // add bot into defined start points
        if (this.bots.length < this.mapData.startPoints.length){
            bot.col = this.mapData.startPoints[this.bots.length].col;
            bot.row = this.mapData.startPoints[this.bots.length].row;
            bot.color = this.mapData.startPoints[this.bots.length].color; 
            bot.size = this.cellSize;
            bot.name = bot.name + '#' + Arena.increment++

            this.bots.push(bot);
            return true;
        }

        // exceed number of bots
        return false;
    }

    stillCanPlay(){
        // check if still has diamonds to collect
        let nDiamonds = 0;
        for (let i = 0; i< this.mapData.diamonds.length; i++){
            if (this.mapData.diamonds[i].col != -1) nDiamonds++;
        }

        //check if no bot alives
        let nAlives = 0;
        for (let i = 0; i< this.bots.length; i++){
            if (this.bots[i].alive) nAlives++;
        }

        return nAlives > 0 && nDiamonds > 0;
    }

    nextMove(){
        if (!this.stillCanPlay()) return;

        this.bots.forEach(bot => {
            if (!bot.alive) return
            const jsonMapData = JSON.stringify(this.mapData)
            const clonedMap = JSON.parse(jsonMapData)
            const jsonBotData = JSON.stringify(this.bots)
            const clonedBots = JSON.parse(jsonBotData)
            const move = bot.getNextMove(clonedMap, clonedBots);
            // check the move is valid or not
            if (Math.abs(move.col - bot.col) + Math.abs(move.row - bot.row) > 1) return;

            // now, processing the move
            // case 1: bot hits wall => destroyed
            if (bot.col < 0 || bot.col >= this.mapData.nCols || bot.row < 0 || bot.row >= this.mapData.nRows){
                bot.alive = false;
                bot.score = 0
            }

            // case 2: bot hits the other bot, both are destroyed
            for(let i = 0; i< this.bots.length; i++){
                if (bot.name != this.bots[i].name && (move.row == this.bots[i].row && move.col == this.bots[i].col)) {
                    bot.alive = false;
                    this.bots[i].alive = false;
                }
            }

            // case 3: bot hits diamond => bot.points +1, remove the diamond from this.mapData.diamonds
            for(let i = 0; i < this.mapData.diamonds.length; i++){
                const diamond = this.mapData.diamonds[i];
                if (move.row == diamond.row && move.col == diamond.col) {
                    diamond.col = -1;
                    diamond.row = -1;
                    bot.score++;
                }
            }

            // case 4: bot goes to next location =>  update bot's location 
            bot.col = move.col;
            bot.row = move.row;

            // save the bot's move to trace back later on
            this.moves.push({bot:bot, col: move.col, row:move.row});
        });
    }

    draw(){
        // draw the arena
        for(let col = 0; col < this.mapData.nCols; col++){
            for (let row=0; row < this.mapData.nRows; row++){
                fill("#fff");
                rect(col *this.cellSize, row * this.cellSize, this.cellSize, this.cellSize);
            }
        }
        
        // draw the diamonds
        this.mapData.diamonds.forEach(diamond => {
            if (diamond.row != -1 && diamond.col != -1) { // only draw the diamond if it's not collected yet
                fill("#99f");
                const offset = this.cellSize * 0.1; // 10% offset for each side, total 20% for width and height
                const diamondSize = this.cellSize * 0.8; // 80% of the cell size

                beginShape();
                vertex(diamond.col * this.cellSize + this.cellSize / 2, diamond.row * this.cellSize + offset);
                vertex(diamond.col * this.cellSize + this.cellSize - offset, diamond.row * this.cellSize + diamondSize / 2 + offset);
                vertex(diamond.col * this.cellSize + this.cellSize / 2, diamond.row * this.cellSize + diamondSize + offset);
                vertex(diamond.col * this.cellSize + offset, diamond.row * this.cellSize + diamondSize / 2 + offset);
                endShape(CLOSE);
            }
        });

        // draw bots 
        this.bots.forEach(bot => {
            bot.draw();
        })
    }
}