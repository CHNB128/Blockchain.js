const query = require('../db')
const transaction = require('./transaction')
const { sha256, timestamp, checkProof } = require('../utils')

function create(proof, hash) {
  query(db => {
    db.collection('chain')
      .find()
      .sort({ $natural: -1 })
      .limit(1)
      .toArray((err, res) => {
        let lastblock = res[0]
        let previousHash = sha256(lastblock)
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
        let lastblock = res[0]
        let lastHash = sha256(lastBlock)
        let check = checkProof(lastHash, proof)
        let isProofValid = check.status

        if (!isProofValid) {
          this.emit('wrong proof', lastHash)
        } else {
          create(proof, check.hash)
          console.log('[ INF ] close', lastHash)
          this.broadcast.emit('block closed', lastHash)

          db.collection('transactions')
            .find()
            .count((err, count) => {
              if (err) throw err
              if (count >= 5) {
                db.collection('chain')
                  .find()
                  .sort({ $natural: -1 })
                  .limit(1)
                  .toArray((err, res) => {
                    let lastblock = res[0]
                    this.broadcast.emit('next hash', sha256(lastblock))
                  })
              }
            })
        }
      })
  })
}

module.exports = {
  create,
  close
}
