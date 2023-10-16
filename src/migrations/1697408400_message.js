
var Message = artifacts.require("Message");

module.exports = function(_deployer) {
  const deployer = _deployer;
  deployer.deploy(Message);
};
