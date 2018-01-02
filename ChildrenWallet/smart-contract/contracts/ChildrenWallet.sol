pragma solidity ^0.4.4;

contract ChildrenWallet {
  WalletAllowed[] public allowed;
  address parents;

  struct WalletAllowed {
    bytes32 name;
    address account;
  }
  
  function ChildrenWallet() {
    parents = msg.sender;
  }

  function addAllowed(bytes32 _name, address _account) returns (bool _success) {

    WalletAllowed memory newAllowed;
    newAllowed.name = _name;
    newAllowed.account = _account;

    allowed.push(newAllowed);
    return true;
  }

  function getAllowedNames() constant returns (bytes32[]) {    
      uint length = allowed.length;
      bytes32[] memory names = new bytes32[](length);

      for (uint i = 0; i < length; i++) {
          names[i] = allowed[i].name;
      }

      return names;
  }

  function getAllowedAddresses() constant returns (address[]) {    
      uint length = allowed.length;
      address[] memory addresses = new address[](length);

      for (uint i = 0; i < length; i++) {
          addresses[i] = allowed[i].account;
      }

      return addresses;
  }

  function buySomething(address _to) constant returns (string) {   
      uint length = allowed.length;
      for (uint i = 0; i < length; i++) {
          if (_to == allowed[i].account) {
            return "You can buy here";
          }
      } 
      return "You can not buy here";    
  }

  function getParentBalance() constant returns (uint) {
      return parents.balance;
  }
}
