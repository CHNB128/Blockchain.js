const query = require('../db')
const { nextHash } = require('./mining')
const { timestamp } = require('../utils')

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
  })
  nextHash.call(this)
}

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
