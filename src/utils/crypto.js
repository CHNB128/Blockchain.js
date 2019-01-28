const crypto = require('crypto')

const hash = (method, value) => {
  let data
  try {
    data = crypto
      .createHash(method)
      .update(value)
      .digest('hex')
  } catch (e) {
    // if value is not string
    if (e instanceof TypeError) {
      data = hash(method, JSON.stringify(value))
    }
  }
  return data
}

const sha256 = value => hash('sha256', value)
const md5 = value => hash('md5', value)

module.exports = {
  sha256,
  md5
}
