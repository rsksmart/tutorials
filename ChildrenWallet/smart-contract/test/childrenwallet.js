var ChildrenWallet = artifacts.require("./ChildrenWallet.sol");

contract('ChildrenWallet', function() {
  it("initially should return 0 allowed places or wallet", function() {
    return ChildrenWallet.deployed().then(function(instance) {
      return instance.getAllowedNames.call();
    }).then(function(result) {
      assert.equal(result.length, 0, "Initial: 0 allowed wallet for children");
    });
  });

  it("should add a new allowed place, and then getting the allowed names should return one result", function() {
    var contractInstance;    
    return ChildrenWallet.deployed().then(function(result) {
       contractInstance = result; 
       return contractInstance.addAllowed('Library', web3.eth.accounts[1]);
    }).then(function(){      
      return contractInstance.getAllowedNames.call();
    }).then(function(result) {        
      assert.equal(result.length, 1, "It should return one result");
    });
  });

  it("should return the address added in previous test", function() {
    return ChildrenWallet.deployed().then(function(instance) {
      return instance.getAllowedAddresses.call();
    }).then(function(result) {
      assert.equal(result[0], web3.eth.accounts[1], "The result should be: " + web3.eth.accounts[1]);
    });
  });
});
