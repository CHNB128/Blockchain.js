const query = require('../db')
const transaction = require('./transaction')
const { sha256, timestamp } = require('../utils')

function create(password) {
  query(db => {
    let uuid = sha256(password + timestamp())

    db.collection('users').insertOne({ uuid, password }, err => {
      if (err) throw err
      transaction.create.call(
        this,
        { uuid: 0 },
        { recipient: uuid, amount: 100 }
      )
    })

    this.emit('resolve', uuid)
  })
}

module.exports = {
  create
}
