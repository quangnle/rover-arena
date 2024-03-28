class Bot {
  constructor(name, size = 0) {
    this.name = name
    this.alive = true
    this.score = 0
    this.centerDiamond = { col: 10, row: 10 }
  }

  getDiamondRanges(diamonds, stupidBot) {
    const diamondRanges = []
    for (let i = 0; i < diamonds.length; i++) {
      const diamond1 = diamonds[i]
      if (diamond1.col == -1) {
        diamondRanges.push(10e8)
        continue
      }

      const stupidBotRange =
        Math.abs(diamond1.col - stupidBot.col) +
        Math.abs(diamond1.row - stupidBot.row)

      let diamondRange = 0
      for (let j = 0; j < diamonds.length; j++) {
        if (i == j) continue
        const diamond2 = diamonds[j]
        if (diamond2.col == -1) continue
        const distance =
          Math.abs(diamond1.col - diamond2.col) +
          Math.abs(diamond1.row - diamond2.row)
        diamondRange += distance
      }
      diamondRange += stupidBotRange
      diamondRanges.push(diamondRange)
    }
    return diamondRanges
  }

  getCenterDiamond(diamonds, diamondRanges) {
    if (this.centerDiamond) {
      const centerDiamond = diamonds.find(
        (diamond) =>
          diamond.col == this.centerDiamond.col &&
          diamond.row == this.centerDiamond.row
      )
      if (centerDiamond) return this.centerDiamond
    }
    let minRange = 10e8
    let nearestDiamond = diamonds[0]
    for (let i = 1; i < diamonds.length; i++) {
      const range = diamondRanges[i]
      if (range < minRange) {
        minRange = range
        nearestDiamond = diamonds[i]
      }
    }
    if (nearestDiamond.col != -1) {
      this.centerDiamond = nearestDiamond
      return this.centerDiamond
    }
    return null
  }

  getNextMove(mapData, bots) {
    // no processing yet! need to be  implemented!
    // find the nearest diamond by calculating the distance of the bot to each diamond
    const stupidBot = bots.find((bot) => bot.name != this.name)
    let nearestDiamond = { col: -1, row: -1 }
    let minDistance = 10e8
    const diamondRanges = this.getDiamondRanges(mapData.diamonds, stupidBot)
    const centerDiamond = this.getCenterDiamond(mapData.diamonds, diamondRanges)
    for (let i = 0; i < mapData.diamonds.length; i++) {
      const diamond = mapData.diamonds[i]
      if (diamond.col == -1) continue
      const diamondRange = diamondRanges[i]
      const centerDiamondRange = centerDiamond
        ? Math.abs(centerDiamond.col - diamond.col) +
          Math.abs(centerDiamond.row - diamond.row)
        : 0
      const nearestDiamondRange =
        Math.abs(this.col - diamond.col) + Math.abs(this.row - diamond.row)
      const distance =
        nearestDiamondRange * 1.5 +
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

  draw() {
    const cellSize = this.size
    fill(this.color)
    // only take 1st char of name to draw
    textAlign(CENTER)
    textSize(20)
    text(
      this.name[0],
      this.col * cellSize + (cellSize >> 1),
      this.row * cellSize + (cellSize >> 1)
    )
  }
}
