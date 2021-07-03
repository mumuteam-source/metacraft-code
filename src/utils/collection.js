require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
console.log(alchemyKey);
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey); 
const contractABI = require('../config/MyNFTABI_new.json')
//const contractAddress = "0x4C4a07F737Bf57F6632B6CAB089B78f62385aCaE";

//const contractAddress = "0x64C628E173d5b8a4FC07c2Ef0F0B7Cbee2560916";
const contractAddress = "0xb59EBa3F1E99917529AF6Dbe7EC3F93B06a677bC";

export const connectWallet = async () => {
  if (window.ethereum) { //check if Metamask is installed
        try {
            const address = await window.ethereum.enable(); //connect Metamask
            const obj = {
                    connectedStatus: true,
                    status: "",
                    address: address
                }
                return obj;
             
        } catch (error) {
            return {
                connectedStatus: false,
                status: "Connect to Metamask using the button on the top right."
            }
        }
        
  } else {
        return {
            connectedStatus: false,
            status: " You must install Metamask into your browser: https://metamask.io/download.html"
        }
      } 
};

export const fetchNFT = async(tokenId) => {


   window.contract = await new web3.eth.Contract(contractABI, contractAddress);
   // console.log(window.contract);
    //set up your Ethereum transaction
	const tokenURI=await window.contract.methods.tokenURI(tokenId).call();//make call to NFT smart contract 
       
	return {tokuri:tokenURI}
     //console.log(transactionParameters);
                             
   //sign the transaction via Metamask


}
