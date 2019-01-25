const Transaction = require('./transaction')
const Block = require('./block')
const { sha256 } = require('../utils')

function Blockchain() {
  // TODO: tree insted of array
  this.chain = []
  this.currentTransaction = []
  this.lastBlock = null
  this.newBlock(100, 1)
}
Blockchain.prototype.newBlock = function(proof, hash) {
  let previousHash = this.lastBlock.hash
  let block = new Block(proof, hash, previousHash, this.currentTransaction)
  // Empty current transaction
  this.currentTransaction = []
  this.chain.push(block)
  this.lastBlock = block
}
Blockchain.prototype.newTransaction = function(sender, recipient, amount) {
  this.currentTransaction.push(new Transaction(sender, recipient, amount))
}

module.exports = Blockchain
