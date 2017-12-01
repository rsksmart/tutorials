module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      gas : 2500000,
      gasPrice: 1,
			from : "0xa2ee03075c25465b7f3d26c0e903416a7dad5ac9",
      network_id: "*" // Match any network id
    }
  }
};
