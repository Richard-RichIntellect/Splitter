var Splitter = artifacts.require("Splitter");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(Splitter);
};