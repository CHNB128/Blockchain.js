module.exports = function(socket, userData, transactionData) {
  socket.emit('new transaction', userData, transactionData)

  console.log('[ INF ] Transaction sent')

  socket.on('resolve', () => {
    console.log('[ INF ] Transaction applied')
    console.log('[ DAT ]', {
      from: userData.uuid,
      to: transactionData.recipient,
      amount: transactionData.amount
    })
    socket.close()
  })

  socket.on('error', msg => {
    console.log(`[ ERR ] ${msg}`)
    socket.close()
  })
}
