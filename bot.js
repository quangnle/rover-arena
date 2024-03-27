class Bot {
    constructor(name, size = 0){
        this.name = name;
        this.alive = true;
        this.score = 0;
    }

    getNextMove(mapData, bots){
        // no processing yet! need to be  implemented!
        return {col: this.col, row: this.row}
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