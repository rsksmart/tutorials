pragma solidity ^0.4.24;

contract SimpleStorage {
    address private deployer;
    uint private storedData;

    constructor() public {
        deployer = msg.sender;
    }

    function set(uint n) public {
        if(msg.sender == deployer)
            storedData = n;
    }

    function get() public view returns (uint) {
        return storedData;
    }
}