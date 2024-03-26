class Bot {
  constructor(name, size = 0) {
    this.name = name
    this.alive = true
    this.score = 0
  }

  getMoves(board, players) {

  }

  evaluate(board, players, player) {

  }

  getNextMove(board, players) {
    console.log(board, players)
    // return getBestMove(board, players, 5)
  }

  minimax(board, players, player, depth, alpha, beta) {
    const diamonds = board.diamonds
    // Base cases:
    if (depth === 0) {
      return evaluate(board, players, player)
    }

    // Maximizing player (you)
    if (player === 1) {
      let maxScore = -Infinity
      for (const [i, j] of diamonds) {
        const newBoard = updateBoard(board, i, j, player) // Simulate move
        const newDiamonds = removeDiamond(diamonds, i, j)
        const score = minimax(newBoard, 2, depth - 1, alpha, beta) // Opponent's turn
        maxScore = Math.max(maxScore, score)
        alpha = Math.max(alpha, maxScore)
        if (beta <= alpha) { // Alpha-beta pruning
          break
        }
      }
      return maxScore
    }
    // Minimizing player (opponent)
    else {
      let minScore = Infinity
      for (const [i, j] of diamonds) {
        const newBoard = updateBoard(board, i, j, player)
        const newDiamonds = removeDiamond(diamonds, i, j)
        const score = minimax(newBoard, 1, depth - 1, alpha, beta) // Your turn
        minScore = Math.min(minScore, score)
        beta = Math.min(beta, minScore)
        if (alpha >= beta) { // Alpha-beta pruning
          break
        }
      }
      return minScore
    }
  }

  getBestMove(board, players, depth) {
    let bestScore = -Infinity
    let bestMove = null
    const diamonds = board.diamonds
    const moves = this.getMoves(board, players)
    for (const [i, j] of moves) {
      const newBoard = updateBoard(board.slice(), i, j, 1) // Copy board to avoid mutation
      const newDiamonds = removeDiamond(diamonds.slice(), i, j) // Copy diamonds to avoid mutation
      const score = minimax(newBoard, players, 2, depth - 1, -Infinity, Infinity)
      if (score > bestScore) {
        bestScore = score
        bestMove = { row: i, col: j }
      }
    }
    return bestMove
  }

  draw() {
    const cellSize = this.size
    fill(this.color)
    // only take 1st char of name to draw
    textAlign(CENTER)
    textSize(20)
    text(this.name[0], this.col * cellSize + (cellSize >> 1), this.row * cellSize + (cellSize >> 1))
  }
}