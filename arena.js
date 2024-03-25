class Arena {
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
            const stringMapClone = JSON.stringify(this.mapData)
            const mapCloned = JSON.parse(stringMapClone)
            const stringBots = JSON.stringify(this.bots)
            const clonedBots = bot.getNextMove(stringBots)
            const move = bot.getNextMove(mapCloned, clonedBots);
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
            fill("#99f");
            ellipse(diamond.col * this.cellSize + (this.cellSize >> 1), diamond.row * this.cellSize + (this.cellSize >> 1), this.cellSize >> 1, this.cellSize >> 1);
        });

        // draw bots 
        this.bots.forEach(bot => {
            bot.draw();
        })
    }
}