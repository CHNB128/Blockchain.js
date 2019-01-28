// vendor
const readline = require('readline-sync')
// local
const { md5 } = require('../utils')

function create(socket, config) {
  let password

  password = readline.question('[ INP ] Password: ', { hideEchoBack: true })
  password = md5(password)

  socket.emit('new user', password)

  socket.on('resolve', uuid => {
    console.log('[ INF ] User create success')
    console.log('[ INF ] UUID:', uuid)

    config.data = { ...config.data, uuid, password }
    config.save()

    console.log('[ INF ] Data writed to config, by path :', config.path)
    socket.close()
  })
}

module.exports = { create }
