pragma solidity ^0.4.4;

contract HelloWorld {
    string greeting;
    
    function HelloWorld() {
        greeting = "Hello smart world!";
    }
    
    function getGreeting () constant returns (string) {
        return greeting;
    }
    
    function setGreeting(string _newGreeting) returns (bool success) {
        greeting = _newGreeting;
        return true;
    }
}