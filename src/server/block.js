const query = require('../db')
const transaction = require('./transaction')
const { nextHash } = require('./mining')
const { sha256, timestamp, checkProof } = require('../utils')

function create(proof, hash) {
  query(db => {
    db.collection('chain')
      .find()
      .sort({ $natural: -1 })
      .limit(1)
      .toArray((err, res) => {
        if (err) throw err
        let lastBlock = res[0]
        let previousHash = sha256(lastBlock)
        db.collection('transactions')
          .find()
          .toArray((err, transactions) => {
            if (err) throw err
            let block = {
              timestamp: timestamp(),
              proof,
              hash,
              previousHash,
              transactions
            }
            db.collection('chain').insertOne(block, err => {
              if (err) throw err
              // Empty current transaction
              transaction.clear()
            })
          })
      })
  })
}

function close({ uuid, password }, proof) {
  query(db => {
    db.collection('chain')
      .find()
      .sort({ $natural: -1 })
      .limit(1)
      .toArray((err, res) => {
        if (err) throw err
        let lastBlock = res[0]
        let lastHash = sha256(lastBlock)
        let check = checkProof(lastHash, proof)
        let isProofValid = check.status

        if (!isProofValid) {
          this.emit('wrong proof', lastHash)
        } else {
          create(proof, check.hash)
          console.log('[ INF ] close', lastHash)
          this.broadcast.emit('block closed', lastHash)
        }
      })
  })
  nextHash.call(this)
}

module.exports = {
  create,
  close
}
