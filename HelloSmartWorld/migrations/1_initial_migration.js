var Migrations = artifacts.require("./Migrations.sol");
var HelloWorld = artifacts.require("./HelloWorld.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(HelloWorld);
};
