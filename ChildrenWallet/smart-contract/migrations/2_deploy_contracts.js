var ChildrenWallet = artifacts.require("./ChildrenWallet.sol");

module.exports = function(deployer) {  
  deployer.deploy(ChildrenWallet);
};
