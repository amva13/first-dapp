// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// import "@openzeppelin/contracts/access/AccessControl.sol";
import "truffle/console.sol";

// add is AccessControl
contract Message {

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant USER_ROLE = keccak256("USER_ROLE");
  mapping (address => string) private messages;
  string private message;

  constructor() public {
    // _grantRole(ADMIN_ROLE, msg.sender);
    message = "initial";
  }

  function getMessage() public view returns (string memory validator, string memory resultMessage) {
    // require(hasRole(USER_ROLE, msg.sender), "This address has no account. Invoke setMessage(_message) first to setup an account.");
    // return messages[msg.sender];
    // return message;
    console.log("contract got rpc for getting message, the message is currently set to", message); // TODO: why is message not changed?
    return ("test string", message);
  }

  function setMessage(string calldata _message) public {
    // if(!hasRole(USER_ROLE, msg.sender)){
    //   _grantRole(USER_ROLE, msg.sender);
    // }
    // messages[msg.sender] = _message;
    console.log("contract got rpc for setting _message", _message);
    message = _message;
    console.log("contract set message variable, it is now", message); // note: it does changes here.. why doesn't it persist ?
  }


}
