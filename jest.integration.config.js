var config = require('./jest.config')
config.testRegex = 'ispec\\.ts$'
console.log('RUNNING INTEGRATION TESTS')
module.exports = config
