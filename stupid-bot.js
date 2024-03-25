class StupidBot{
    constructor(name="Stupid Bot"){
        this.name = name;
        this.alive = true;
        this.score = 0;
    }

    /// <summary>
    /// Get the next move of the bot
    /// Greedy and empty brained thinking :)
    /// Simply move to the nearest diamond
    /// </summary>
    getNextMove(mapData, bots){      
        // find the nearest diamond by calculating the distance of the bot to each diamond
        let nearestDiamond = {col: -1, row: -1};
        let minDistance = mapData.nCols + mapData.nRows;        
        for (let i = 0; i < mapData.diamonds.length; i++){
            const diamond = mapData.diamonds[i];
            if (diamond.col == -1) continue;

            const distance = Math.abs(this.col - diamond.col) + Math.abs(this.row - diamond.row);
            if (distance < minDistance){
                minDistance = distance;
                nearestDiamond = diamond;
            }
        }

        // move to the nearest diamond
        if (nearestDiamond.col > this.col) return {col: this.col + 1, row: this.row};
        if (nearestDiamond.col < this.col) return {col: this.col - 1, row: this.row};
        if (nearestDiamond.row > this.row) return {col: this.col, row: this.row + 1};
        if (nearestDiamond.row < this.row) return {col: this.col, row: this.row - 1};

        return {col: this.col, row: this.row};
    }

    draw(){
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
        textSize(8);        
        text(this.name[0] + (this.name[1] || '') + (this.name[2] || ''), 0, cellSize/4 + 8);
        pop();
    }
}