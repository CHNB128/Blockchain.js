const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
// Connection URL
const url = 'mongodb://localhost:32769/blockchain'
// Use connect method to connect to the server
module.exports = function(callback) {
  MongoClient.connect(
    url,
    { useNewUrlParser: true },
    (err, database) => {
      if (err) throw Error
      callback(database.db('blockchain'))
      // database.close()
    }
  )
}
