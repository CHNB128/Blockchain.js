const query = require('../../db')

function validate(packet, next) {
  let route = packet[0]
  let userData = packet[1]

  console.log(route)

  // skip safe operation
  if (['new user', 'get next hash'].indexOf(route) != -1) {
    next()
    return
  }

  // check user data
  let uuid = userData.uuid
  let password = userData.password

  query(db =>
    db.collection('users').findOne({ uuid }, (err, res) => {
      if (err) throw err

      if (res == null) {
        next(new Error('User not found'))
      } else if (res.password != password) {
        next(new Error('Password incorrect'))
      } else {
        next()
      }
    })
  )
}

module.exports = { validate }
