const NftContract = artifacts.require("NftContract");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(NftContract, { from: accounts[0] });
};
