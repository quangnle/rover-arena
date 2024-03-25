class RedBot {
  constructor(name = "Red Bot") {
    this.name = name;
    this.alive = true;
    this.score = 0;
  }

  getNextMove(mapData, bots) {
    let targetDiamond = { col: -1, row: -1 };
    let minDistance = mapData.nCols + mapData.nRows;
    const diamonds = mapData.diamonds.map((diamond) => {
      const distanceOtherDiamonds = [];
      let minDistanceOtherDiamond = null;
      let numberDiamondNear = 0;
      const distanceBot =
        Math.abs(this.col - diamond.col) + Math.abs(this.row - diamond.row);
      for (let i = 0; i < mapData.diamonds.length; i++) {
        const otherDiamond = mapData.diamonds[i];
        if (
          diamond.col !== otherDiamond.col ||
          diamond.row !== otherDiamond.row
        ) {
          const distanceOtherDiamond =
            Math.abs(otherDiamond.col - diamond.col) +
            Math.abs(otherDiamond.row - diamond.row);
          if (
            minDistanceOtherDiamond === null ||
            distanceOtherDiamond < minDistanceOtherDiamond
          ) {
            minDistanceOtherDiamond = distanceOtherDiamond;
            numberDiamondNear = 1;
          } else {
            if (distanceOtherDiamond === minDistanceOtherDiamond) {
              minDistanceOtherDiamond = distanceOtherDiamond;
              numberDiamondNear += 1;
            }
          }
          distanceOtherDiamonds.push(distanceOtherDiamond);
        }
      }
      return {
        ...diamond,
        distanceBot,
        distanceOtherDiamonds,
        numberDiamondNear,
        minDistanceOtherDiamond,
      };
    });

    for (let i = 0; i < diamonds.length; i++) {
      const diamond = diamonds[i];
      if (diamond.col == -1) {
        continue;
      } else {
        if (targetDiamond.col !== -1) {
          if (
            diamond.distanceBot < targetDiamond.distanceBot ||
            (diamond.distanceBot === targetDiamond.distanceBot &&
              diamond.numberDiamondNear > targetDiamond.numberDiamondNear)
          ) {
            targetDiamond = diamond;
          }
        } else {
          targetDiamond = diamond;
        }
      }
    }

    // move to the nearest diamond
    if (targetDiamond.col > this.col)
      return { col: this.col + 1, row: this.row };
    if (targetDiamond.col < this.col)
      return { col: this.col - 1, row: this.row };
    if (targetDiamond.row > this.row)
      return { col: this.col, row: this.row + 1 };
    if (targetDiamond.row < this.row)
      return { col: this.col, row: this.row - 1 };

    return { col: this.col, row: this.row };
  }

  draw() {
    const cellSize = this.size;

    push();
    translate(
      this.col * cellSize + (cellSize >> 1),
      this.row * cellSize + (cellSize >> 1)
    );

    //draw the face
    fill(this.color);
    rect(-cellSize / 4, -cellSize / 4, cellSize / 2, cellSize / 2, 3);
    //draw the eyes
    fill("#fff");
    ellipse(-cellSize / 8, -cellSize / 8, cellSize / 8, cellSize / 8);
    ellipse(cellSize / 8, -cellSize / 8, cellSize / 8, cellSize / 8);
    //draw the pupils
    fill("#000");
    ellipse(-cellSize / 10, -cellSize / 10, cellSize / 16, cellSize / 16);
    ellipse(cellSize / 10, -cellSize / 10, cellSize / 16, cellSize / 16);
    //draw the nose
    //draw the nose
    fill("#f00");
    triangle(
      0,
      -cellSize / 16,
      -cellSize / 16,
      cellSize / 16,
      cellSize / 16,
      cellSize / 16
    );
    //draw the mouth
    fill("#fff");
    rect(-cellSize / 8, cellSize / 8, cellSize / 4, cellSize / 16, 1);

    //draw the name
    fill(this.color);
    textAlign(CENTER);
    textSize(8);
    text(this.name[0] + this.name[1] + this.name[2], 0, cellSize / 4 + 8);
    pop();
  }
}
