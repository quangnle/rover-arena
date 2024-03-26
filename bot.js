class Bot {
  constructor(name, size = 0){
    this.name = name;
    this.alive = true;
    this.score = 0;
  }

  getNextMove(mapData){
    // no processing yet! need to be  implemented!
    return {col: this.col, row: this.row}
  }

  draw() {
    const cellSize = this.size;
    fill(this.color);
    // only take 1st char of name to draw
    textAlign(CENTER);
    textSize(20);
    text(this.name[0], this.col * cellSize + (cellSize >> 1), this.row * cellSize + (cellSize >> 1))
  }
}