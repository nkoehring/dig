export default class PlayerChanges {
  constructor () {
    this.changes = {}
  }

  getKey (level, column) {
    return `${column}.${level}`
  }

  apply (level, column, newBlock) {
    const key = this.getKey(level, column)
    this.changes[key] = newBlock
    console.log('applied', level, column, newBlock, this.changes)
  }

  level (level, column, row) {
    for (let i = 0; i < row.length; i++) {
      const key = this.getKey(level - 1, column + i)
      const change = this.changes[key]
      if (change) row[i] = change
    }
  }
}
