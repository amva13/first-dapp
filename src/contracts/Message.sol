// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "truffle/console.sol";

// add is AccessControl
contract Message is AccessControl {

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant USER_ROLE = keccak256("USER_ROLE");
  mapping (address => string) private messages;
  mapping (address => address[]) private hasAccessMap;

  constructor() public {
    _grantRole(ADMIN_ROLE, msg.sender);
  }

  function getMessage() public view returns (string memory resultMessage) {
    require(hasRole(USER_ROLE, msg.sender), "This address has no account. Invoke setMessage(_message) first to setup an account.");
    return messages[msg.sender];
  }

  function setMessage(string memory _message) public returns (string memory newMessage) {
    if(!hasRole(USER_ROLE, msg.sender)){
      _grantRole(USER_ROLE, msg.sender);
    }
    messages[msg.sender] = _message;
    return messages[msg.sender];
  }

  function grantAccess(address other) public returns (uint accessCount, bool hasAccess) {
    require(hasRole(USER_ROLE, msg.sender), "Your address doesn't have an account, invoke setMessage(_message) first to create an account");
    require(hasRole(USER_ROLE, other), "The address you are attempting to grant access to your message to does not have an account");
    hasAccessMap[msg.sender].push(other);
    console.log("\n\nGranted access to %s", other, "from:", msg.sender);
    console.log(msg.sender, "access count is", hasAccessMap[msg.sender].length);
    bool hasAccess = false;
    for(uint i=0; i < hasAccessMap[msg.sender].length; i++) {
      if(hasAccessMap[msg.sender][i] == other) {
        hasAccess = true;
      }
    }

    return (hasAccessMap[msg.sender].length, hasAccess);
  }

  function createAccount() public returns(bool) {
    _grantRole(USER_ROLE,msg.sender);
    return hasRole(USER_ROLE, msg.sender);
  }

  function getMessageFrom(address other) public view returns(string memory message) {
    bool hasAccess = false;
    for(uint i=0; i < hasAccessMap[other].length; i++) {
      if(hasAccessMap[other][i] == msg.sender) {
        hasAccess = true;
      }
    }
    require(hasAccess, "you don't have access to this account!");
    return messages[other];
  }


}
