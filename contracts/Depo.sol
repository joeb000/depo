pragma solidity ^0.5.0;

contract Depo {
    mapping (address => string) public uri;
    string public schema;

    // TODO add schema hash
    constructor (string memory _s) public {
        schema = _s;
    }

    function set(string memory _uri) public {
        uri[msg.sender] = _uri;
    }
}
