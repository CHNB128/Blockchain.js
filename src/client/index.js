// vendor
const io = require('socket.io-client')
const program = require('commander')
const fs = require('fs')
const path = require('path')
// local
const { md5, sha256, checkProof, Config } = require('../utils')
const user = require('./user')
const transaction = require('./transaction')
const mining = require('./mining')

const host = 'localhost'
const port = '3000'
const socket = io.connect(`http://${host}:${port}`)

let config

program
  .version('0.1.0')
  .option('-c, --config [PATH]', 'Path to config file')
  .option('-n, --create', 'Create new wallet')
  .option('-m, --mining', 'Start mining process')
  .option('-t, --transaction RECIPIENT AMOUNT', 'Create new transaction')
  .parse(process.argv)

if (!program.config) {
  console.log('[ ERR ] --config is required option')
  process.exit()
} else {
  config = new Config(program.config)
}

if (program.create) {
  user.create(socket, config)
}

if (program.transaction) {
  transaction(
    socket,
    { uuid: config.data.uuid, password: config.data.password },
    { recipient: program.args[0], amount: program.args[1] }
  )
}

if (program.mining) {
  mining(socket, { uuid: config.data.uuid, password: config.data.password })
}
