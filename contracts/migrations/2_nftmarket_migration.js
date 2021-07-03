const NFTStore = artifacts.require("NFTStore");
const NFTMarket = artifacts.require("NFTMarket");

module.exports = function (deployer) {
  //tokenNum= 10000;
  //deployer.deploy(NFTStore, tokenNum);

  currAdd= "0x7581EEfD8b805798b74e65D49A2E75876745D5c9";
  tokAdd= "0x5749da81AcbC8EC45e8E682E9B5E68e48b21a138";
  //deployer.deploy(NFTMarket);
  //deployer.deploy(nftMarketTrade, currAdd,tokAdd);
  deployer.deploy(nftMarketAuction, currAdd, tokAdd);
};
