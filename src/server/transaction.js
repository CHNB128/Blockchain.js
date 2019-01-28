const query = require('../db')
const { sha256, timestamp } = require('../utils')

function create({ uuid, _ }, { recipient, amount }) {
  query(db => {
    let data, transactionsCount

    // validate recipient
    try {
      if (uuid === recipient) {
        throw 'Invalid transaction'
      }

      db.collection('users').findOne({ uuid: recipient }, (err, res) => {
        if (err) throw err
        if (res == null) throw 'Recipient not found'
      })
    } catch (e) {
      this.emit('error', e)
    }

    data = {
      timestamp: timestamp(),
      sender: uuid,
      recipient,
      amount: Number.parseFloat(amount)
    }

    db.collection('transactions').insertOne(data, err => {
      if (err) throw err
    })

    this.emit('resolve')

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

// function count(callback) {
//   query(db => {

//   })
// }

/**
  Clear transactions pool
 */
function clear() {
  query(db =>
    db.collection('transactions').deleteMany({}, err => {
      if (err) throw err
    })
  )
}

module.exports = { create, clear }
