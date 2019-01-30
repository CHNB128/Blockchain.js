// vendor
const server = require('http').createServer()
const io = require('socket.io')(server)
// local
const middleware = require('./middleware')
const transaction = require('./transaction')
const user = require('./user')
const block = require('./block')
const mining = require('./mining')

const port = 3000

block.create(0, 0)
block.close.call(io, ({ uuid: 0, password: 0 }, 0))
io.on('connection', client => {
  client.use(middleware.user.validate)
  client.on('error', error => client.emit('error', error))
  client.on('new user', user.create)
  client.on('new transaction', transaction.create)
  client.on('close block', block.close)
  client.on('get next hash', mining.nextHash)
})

// Start
server.listen(port, () => console.log(`[ INF ] Blockchain start on ${port}`))
