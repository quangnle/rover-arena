const cloneMap = (mapData) => {
    // console.log('mapData', mapData)
    const newMap = {...mapData, diamonds: []}
    for (let i = 0; i < mapData.diamonds.length; i++) {
        newMap.diamonds.push(mapData.diamonds[i])
    }
    // console.log('newMap', newMap)
    return newMap
  }

  const  cloneBots = (bots) => {
    const players = bots.map(b => {
        return { ...b }
    } )
    return players
  }

class Node {
    constructor(mapData, bots, player){
        this.mapData = cloneMap(mapData)
        this.bots = cloneBots(bots)
        this.player = this.bots.find(bot => bot.name == player.name);
        this.children = [];
    }

    evaluate(){
        let playerDistance = 0;
        let botDistance = 0;
        let bot = this.bots.find(bot => bot.name != this.player.name);

        // Calculate the total Manhattan distance from the player & the bot to all diamonds
        this.mapData.diamonds.forEach( diamond => {
            if (diamond.col == -1) return;
            playerDistance += Math.abs(diamond.row - this.player.row) + Math.abs(diamond.col - this.player.col);
            botDistance += Math.abs(diamond.row - bot.row) + Math.abs(diamond.col - bot.col);
        })

        // Calculate the score
        return (this.player.score - bot.score) * 5 + botDistance / playerDistance
    }

    makeAMove(mapData, bots, player, move){
        // this.mapData = cloneMap(mapData)
        // this.bots = cloneBots(bots)
        const clonedMapData = cloneMap(mapData);
        const clonedBots = cloneBots(bots);
        const clonedPlayer = clonedBots.find(bot => bot.name == player.name);
        
        // check the move is valid or not
        if (Math.abs(move.col - clonedPlayer.col) + Math.abs(move.row - clonedPlayer.row) > 1) return;

        // now, processing the move
        // case 1: bot hits wall => destroyed
        if (clonedPlayer.col < 0 || clonedPlayer.col >= clonedMapData.nCols || clonedPlayer.row < 0 || clonedPlayer.row >= clonedMapData.nRows){
            clonedPlayer.alive = false;
            clonedPlayer.score = 0
        }

        // case 2: bot hits the other bot, both are destroyed
        for(let i = 0; i< clonedBots.length; i++){
            if (clonedPlayer.name != clonedBots[i].name && (move.row == clonedBots.row && move.col == clonedBots[i].col)) {
                clonedPlayer.alive = false;
                clonedBots[i].alive = false;
            }
        }

        // case 3: bot hits diamond => bot.points +1, remove the diamond 
        for(let i = 0; i < clonedMapData.diamonds.length; i++){
            const diamond = clonedMapData.diamonds[i];
            if (move.row == diamond.row && move.col == diamond.col) {
                diamond.col = -1;
                diamond.row = -1;
                clonedPlayer.score++;
            }
        }

        // case 4: bot goes to next location =>  update bot's location 
        clonedPlayer.col = move.col;
        clonedPlayer.row = move.row;

        return new Node(clonedMapData, clonedBots, clonedPlayer);
    }

    generateChildren(){
        const directions = [{col: 0, row: -1}, {col: 0, row: 1}, {col: -1, row: 0}, {col: 1, row: 0}];
        const opponent = this.bots.find(bot => bot.name != this.player.name);
        directions.forEach( direction => {
            const col = opponent.col + direction.col;
            const row = opponent.row + direction.row;
            if (col >= 0 && col < this.mapData.nCols && row >= 0 && row < this.mapData.nRows){
                const node = this.makeAMove(this.mapData, this.bots, opponent, {col, row});
                this.children.push(node);
            }
        });
    }
}

class MinimaxBot {
    constructor(name, size = 0){
        this.name = "Minimax Bot";
        this.alive = true;
        this.score = 0;
    }    

    /**
     * Finds the best move for the given node using the minimax algorithm.
     * 
     * node - The current node in the game tree.
     * depth - The current depth of the search.
     * maximizingPlayer - Indicates whether the current player is maximizing or not.
     * @returns - The evaluation score of the best move.
     */
    findBestMove(node, depth, maximizingPlayer) {
        if (depth == 0 || node.bots.some(bot => bot.alive == false)) {
            return node.evaluate();
        }

        if (maximizingPlayer) {
            let maxEval = -Infinity;
            node.generateChildren();
            node.children.forEach(child => {
                const score = this.findBestMove(child, depth - 1, false);
                maxEval = Math.max(maxEval, score);
            });
            return maxEval;
        } else {
            let minEval = Infinity;
            node.generateChildren();
            node.children.forEach(child => {
                const score = this.findBestMove(child, depth - 1, true);
                minEval = Math.min(minEval, score);
            });
            return minEval;
        }
    }

    getNextMove(mapData, bots) {
        const opponent = bots.find(bot => bot.name != this.name);
        const node = new Node(mapData, bots, opponent);
        let bestScore = -Infinity;
        let move = {col: this.col, row: this.row};

        node.generateChildren();
        node.children.forEach(child => {
            const score = this.findBestMove(child, 6, false);
            //child.score = score;
            if (score > bestScore) {
                bestScore = score;
                move = {col: child.player.col, row: child.player.row};
            }
        });
        return move;
    }

    draw() {
        const cellSize = this.size;
            
        push();
        translate(this.col * cellSize + (cellSize >> 1),this.row * cellSize + (cellSize >> 1));

        //draw the face
        fill(this.color);
        rect(-cellSize/4, -cellSize/4, cellSize/2, cellSize/2, 3);
        //draw the eyes
        fill("#fff");
        ellipse(-cellSize/8, -cellSize/8, cellSize/8, cellSize/8);
        ellipse(cellSize/8, -cellSize/8, cellSize/8, cellSize/8);
        //draw the pupils
        fill("#000");
        ellipse(-cellSize/10, -cellSize/10, cellSize/16, cellSize/16);
        ellipse(cellSize/10, -cellSize/10, cellSize/16, cellSize/16);
        //draw the nose
        //draw the nose
        fill("#f00");
        triangle(0, -cellSize/16, -cellSize/16, cellSize/16, cellSize/16, cellSize/16);
        //draw the mouth
        fill("#fff");
        rect(-cellSize/8, cellSize/8, cellSize/4, cellSize/16, 1);


        //draw the name
        fill(this.color);
        textAlign(CENTER);
        textSize(cellSize/4);
        text(this.name[0] + (this.name[1] || '') + (this.name[2] || ''), 0, cellSize/4 + 8);
        pop();
    }
}