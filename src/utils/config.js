const fs = require('fs')
const path = require('path')

function Config(filePath) {
  this.path = path.resolve(__dirname, filePath)
  this.data = null
  this.read()
}

Config.prototype.read = function() {
  let file = fs.readFileSync(this.path)
  this.data = JSON.parse(file)
}

Config.prototype.save = function() {
  fs.writeFileSync(this.path, JSON.stringify(this.data))
}

module.exports = Config
