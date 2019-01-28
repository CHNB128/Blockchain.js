const query = require('../db')
const transaction = require('./transaction')
const block = require('./block')
const { sha256 } = require('../utils')

function nextHash() {
  query(db => {
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
  })
}

module.exports = {
  nextHash
}
