const { checkProof, sha256 } = require('../utils')

module.exports = function(socket, userData) {
  let miningIntervalId, currentHash

  let mining = hash => {
    let proof1 = 0
    let proof2 = 0
    return setInterval(() => {
      if (checkProof(hash, proof1).status) {
        socket.emit('close block', userData, proof1)
        clearInterval(miningIntervalId)
      } else {
        proof1++
      }
      if (checkProof(hash, proof2).status) {
        socket.emit('close block', userData, proof2)
        clearInterval(miningIntervalId)
      } else {
        proof2--
      }
    }, 10)
  }

  console.log('[ INF ] start mining process')

  socket.emit('get next hash')

  socket.on('next hash', hash => {
    console.log('[ INF ] start on', hash)
    currentHash = hash
    miningIntervalId = mining(hash)
  })

  socket.on('block closed', hash => {
    if (currentHash == hash) {
      clearInterval(miningIntervalId)
      currentHash = null
      socket.emit('get last hash')
    }
  })

  socket.on('wrong proof', hash => {
    console.log('[ INF ] wrong proof on', hash)
    clearInterval(miningIntervalId)
  })
}
