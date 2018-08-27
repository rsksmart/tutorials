var HDWalletProvider = require('truffle-hdwallet-provider')

var mnemonic = 'thing tuition ranch ... YOUR MNEMONIC'
var publicNode = 'https://public-node.testnet.rsk.co:443'

module.exports = {
  networks: {
    rsk: {
      provider: () =>
        new HDWalletProvider(mnemonic, publicNode),
      network_id: '*',
      gas: 2500000,
      gasPrice: 183000
    }
  }
}
