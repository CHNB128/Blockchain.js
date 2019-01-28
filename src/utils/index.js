const { sha256, md5 } = require('./crypto')
const Config = require('./config')

const timestamp = () => new Date().getTime()

const checkProof = (lastHash, proof) => {
  let hash = sha256(lastHash + proof)
  // console.log(hash.slice(-1) == '0', hash, proof)
  return { status: hash.slice(-1) == '0', hash }
}

module.exports = {
  timestamp,
  checkProof,
  Config,
  sha256,
  md5
}
