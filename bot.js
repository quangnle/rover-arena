class Bot{
    constructor(name, size = 0){
        this.name = name;
        this.alive = true;
        this.score = 0;
    }

    getNextMove(mapData){
      // no processing yet! need to be  implemented!
      // find the nearest diamond by calculating the distance of the bot to each diamond
      let nearestDiamond = { col: -1, row: -1 }
      let minDistance = 10e6
      const diamondRanges = []
      for (let i = 0; i < mapData.diamonds.length; i++) {
        const diamond1 = mapData.diamonds[i]
        if (diamond1.col == -1) {
          diamondRanges.push(10e8)
          continue
        }

        let diamondRange = 0
        for (let j = 0; j < mapData.diamonds.length; j++) {
          if (i == j) continue
          const diamond2 = mapData.diamonds[j]
          if (diamond2.col == -1) continue
          const distance =
            Math.abs(diamond1.col - diamond2.col) +
            Math.abs(diamond1.row - diamond2.row)
          diamondRange += distance
        }
        diamondRanges.push(diamondRange)
      }
      const centerDiamond = mapData.diamonds.find(
        (d) => d.col === 10 && d.row === 10
      )
      for (let i = 0; i < mapData.diamonds.length; i++) {
        const diamond = mapData.diamonds[i]
        if (diamond.col == -1) continue
        const diamondRange = diamondRanges[i]
        const centerDiamondRange = centerDiamond
          ? Math.abs(10 - diamond.col) + Math.abs(10 - diamond.row)
          : 0
        const distance =
          Math.abs(this.col - diamond.col) +
          Math.abs(this.row - diamond.row) +
          diamondRange * 0.01 +
          centerDiamondRange * 0.5
        if (distance < minDistance) {
          minDistance = distance
          nearestDiamond = diamond
        }
      }

      // move to the nearest diamond
      let move = { col: this.col, row: this.row }
      if (nearestDiamond.col > this.col)
        move = { col: this.col + 1, row: this.row }
      else if (nearestDiamond.col < this.col)
        move = { col: this.col - 1, row: this.row }
      else if (nearestDiamond.row > this.row)
        move = { col: this.col, row: this.row + 1 }
      else if (nearestDiamond.row < this.row)
        move = { col: this.col, row: this.row - 1 }
      return move
    }

    draw(){
        const cellSize = this.size;
        fill(this.color);
        // only take 1st char of name to draw
        textAlign(CENTER);
        textSize(20);
        text(this.name[0], this.col * cellSize + (cellSize >> 1), this.row * cellSize + (cellSize >> 1));
    }
}