const { timestamp } = require('../utils')

function Block(proof, hash, previousHash, transactions) {
  this.timestamp = timestamp()
  this.transactions = transactions
  this.proof = proof
  this.hash = hash
  this.previousHash = previousHash
}

module.exports = Block
