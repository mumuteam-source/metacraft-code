import {pinJSONToIPFS} from './pinata.js';
import Web3 from 'web3';
require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const infuraAdd =  process.env.REACT_APP_INFURA_ADD;
console.log("alchemyKey:",alchemyKey);
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
console.log("WebeAddress:",infuraAdd);
//const web3 = createAlchemyWeb3(alchemyKey);
// if (typeof web3 !== 'undefined') {
//    const  web3 = new Web3(web3.currentProvider);
//    } else {
     // set the provider you want from Web3.providers
//const   web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/cb0bceb7d1e44d089cfa70d1972ca633'));
const   web33 = new Web3(new Web3.providers.HttpProvider(infuraAdd));
const   web3 = new Web3(new Web3.providers.HttpProvider(infuraAdd));
//console.log(web3.version);
//const contractABI = require('../config/MyNFTABI_new.json')
//const tradeABI = require('../config/TradeABI.json')
//const auctionABI = require('../config/auctionABI.json')
//Mumbai testnetwork

const currencyABI = require('../config/NFTStore.json')
const contractABI = require('../config/NFTMarket.json')


const currencyAddress = "0x7581EEfD8b805798b74e65D49A2E75876745D5c9";
//const contractAddress = "0x62f87F024A433cbF4a37c29f795d1f54768f710B";
const contractAddress = "0x5749da81AcbC8EC45e8E682E9B5E68e48b21a138";

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
                status: "点击右上方按钮，链接到MetaMask钱包."
            }
        }

  } else {
        return {
            connectedStatus: false,
            status: "请从下面链接下载MetaMask钱包 https://metamask.io/download.html"
        }
      }
};

export const mintNFT = async(url, name, description) => {
//error handling
 if (url.trim() == "" || (name.trim() == "" || description.trim() == "")) {
    return {
        success: false,
        status: "All fileds should be filled",
      }
    }


	  //make metadata
    const metadata = new Object();
    metadata.name = name;
    metadata.image = url;
    metadata.description = description;

    //make pinata call
   const pinataResponse = await pinJSONToIPFS(metadata);
   if (!pinataResponse.success) {
     return {
      success: false,
     status: "tokenURI有误.",

       }
    }
   const tokenURI = pinataResponse.pinataUrl;
   console.log("tokenURI:",tokenURI);
   window.contract = await new web3.eth.Contract(contractABI, contractAddress);
   console.log("Account:",window.ethereum.selectedAddress);
//   window.contract.methods.transferOwnership(window.ethereum.selectedAddress).call((err,res)=>console.log("newOwner:",err));
    //set up your Ethereum transaction
     const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI()//make call to NFT smart contract
       };

   //sign the transaction via Metamask
     try {
         const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
          return {
            success: true,
            status: "从以太网查看交易信息: https://rinkeby.etherscan.io/tx/" + txHash
          }
     } catch (error) {
        return {
          success: false,
            status: "错误： " + error.message
     }

   }

}

//transfrom
export const transNFT = async(from, to, tokenId) => {

   console.log("alchemyKey:",alchemyKey);
   console.log("from:",from,"to:",to,"tokenId:",tokenId);
   console.log("contractAdd:",contractAddress);
  if (from.trim() == "" || (to.trim() == "" || tokenId.trim() == "")) {
    return {
      success: false,
      status: "请按照要求填写相关信息",
         }
  }


window.contract = await new web3.eth.Contract(contractABI, contractAddress);
window.contract.methods.setApprovalForAll(contractAddress,1).call((err,res)=>console.log("approved:",res));
window.contract.methods.ownerOf(tokenId).call((err,res)=>console.log("OwnerOfTOken:",res));
//var gasPrices = await this.getCurrentGasPrices();
const transactionParameters = {
   to: contractAddress, // Required except during contract publications.
   from: from, // must match user's active address.
   'data': window.contract.methods.transNFT(from, to, tokenId ).encodeABI()
   };
//const  status = await window.contract.methods.safeTransferFrom(from, to, tokenId).call((err,result)=>console.log(err));
//console.log(apprData);
//return status;
//window.ethereum.request({
//        method:'eth_sendTransaction',
//        params:[apprData],
//}).then((result)=>{console.log("approve:",result)}).catch((error)=>console.log(error));

 try {
 const txHash = await window.ethereum
   .request({
    method: 'eth_sendTransaction',
    params: [transactionParameters
        ],
    }).then((result)=>{
      console.log("transActionResults:",result);
    }).catch((error)=>{
      console.log(error);
    });
 return {
        success: true,
        status: "Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" + txHash
     }
  } catch (error) {
    console.log(error);
       return {
      success: false,
      status: "Something went wrong: " + error.message
     }
   }

 }
//fetch All NFT tokens under current contract
export const fetchAllNFT = async() => {

  console.log("fetchAllNFT");
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
	   // console.log(window.contract);
	//     //set up your Ethereum transactior
	let tokenURI = [];
	let tokenIds = [];
        const tokens=await window.contract.methods.totalSupply().call((err,res)=>console.log(res));
        //const tokens=await window.contract.methods.balanceOf(window.ethereum.selectedAddress).call((err,res)=>console.log("res:",res));
	console.log("Tokens in this Contract:",tokens);
  for (var i=0;i< tokens;i++){
	const tokId = await window.contract.methods.tokenByIndex(i).call();
	//console.log("TokId:",tokId);
	tokenURI[i]=await window.contract.methods.tokenURI(tokId).call();//make call to NFT smart contract
	tokenIds[i]=tokId;
        }
	//console.log(tokenURI);
                     return {tokuri:tokenURI,tokenIds:tokenIds}
                        //console.log(transactionParameters);

       }
export const fetchNFT = async() => {

  console.log("fetchNFT");
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
	   // console.log(window.contract);
	//     //set up your Ethereum transactior
	let tokenURI = [];
	let tokenIds = [];
        //const tokens=await window.contract.methods.totalSupply().call((err,res)=>console.log(res));
        const tokens=await window.contract.methods.balanceOf(window.ethereum.selectedAddress).call((err,res)=>console.log("res:",res));
	//console.log("Tokens in this COntract:",tokens);
  for (var i=0;i< tokens;i++){
	const tokId = await window.contract.methods.tokenOfOwnerByIndex(window.ethereum.selectedAddress,i).call();
	//console.log("TokId:",tokId);
	tokenURI[i]=await window.contract.methods.tokenURI(tokId).call();//make call to NFT smart contract
	tokenIds[i]=tokId;
        }
	console.log(tokenURI);
                     return {tokuri:tokenURI,tokenIds:tokenIds}
                        //console.log(transactionParameters);

       }
//fetch one NFT for list

export const fetchOneNFT = async(tokenId) => {

  console.log("fetch the NFT for list");
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const tokenURI=await window.contract.methods.tokenURI(tokenId).call();//make call to NFT smart contract
  const owner = await window.contract.methods.ownerOf(tokenId).call();
  console.log("TOKENURI:",tokenURI);
    return {"tokURI":tokenURI,"owner":owner}
     }


//fetch Detail of one auction NFT

export const fetchOneAuction = async(tokenId) => {

  console.log("fetch the NFT for Auction");
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const auctionContract = await new web33.eth.Contract(auctionABI, auctionAddress);
  const tokenURI=await window.contract.methods.tokenURI(tokenId).call();//make call to NFT smart contract
  const owner = await window.contract.methods.ownerOf(tokenId).call();
  console.log("TOKENURI:",tokenURI);
    return {"tokURI":tokenURI,"owner":owner}
     }

//list for sell
export const listNFT = async (from,tokenId,price) =>{
  console.log("from:",from,"tokenId:",tokenId);
 const signMessage ={
   seller: from,
   //expiryTime:1600000000,
   tokenId:web3.utils.toBN(tokenId),
   contract: contractAddress,
   price:web3.utils.toWei(price,"ether"),
}
 //const sign= await web3.eth.personal.sign(web3.utils.toHex(signMessage),from);//.then(signature=>console.log("SiGN:",signature));
  const sign="Not supported by Infura";
  //console.log("SIGN:v-",sign.v,"s-",sign.s,"r-",sign.r);
  //console.log("SIGN:",sign);
  if(sign.length>0){

   const currentOwner= await window.contract.methods.ownerOf(tokenId).call();
   console.log("CurrentOwner:",currentOwner);

   const appParams={
     from:from,
     to:contractAddress,
     "data":window.contract.methods.setApprovalForAll(tradeAddress,1).encodeABI()
   }
   window.ethereum.request({
        method:'eth_sendTransaction',
        params:[appParams],
}).then((result)=>{console.log("approve:",result)}).catch((error)=>console.log(error));

   }else{
    console.log("ERROR");
    }
    //const recov = await web33.eth.accounts.recover(web3.utils.toHex(signMessage),sign);
    const tradeContract = await new web3.eth.Contract(tradeABI,tradeAddress);
    const openParams={
        from:from,
        to: tradeAddress,
        "data":tradeContract.methods.openTrade(tokenId,web3.utils.toWei(price,"ether")).encodeABI()
    }
window.ethereum.request({
    method:'eth_sendTransaction',
    params:[openParams]
}).then((result)=>console.log(result));


//console.log("recov:",recov);
 return {success:true, status:sign};
}
//cancel Sell NFT list
export const cancelSellNFT = async (from,tokenId) =>{
  console.log("from:",from,"tokenId:",tokenId);

   const currentOwner= await window.contract.methods.ownerOf(tokenId).call();
   console.log("CurrentOwner:",currentOwner);
   const tradeContract = await new web3.eth.Contract(tradeABI,tradeAddress);
   const cancelParams={
        from:from,
        to: tradeAddress,
        "data":tradeContract.methods.cancelTrade(tokenId).encodeABI()
    }
window.ethereum.request({
    method:'eth_sendTransaction',
    params:[cancelParams]
}).then((result)=>console.log(result));


//console.log("recov:",recov);
 return {tokenId};
}


//buy NFT
export const buyNFT = async (to,poster,tokenId, price) => {

const value=web3.utils.toWei(price,"ether");
 console.log("buyNFT",to,tokenId,value,currencyAddress, tradeAddress, poster);
 window.contract = await new web33.eth.Contract(tradeABI,tradeAddress);
 const currContract = await new web3.eth.Contract(currencyABI,currencyAddress);
 const contract3 = await new web3.eth.Contract(contractABI, contractAddress);
 const owner = await contract3.methods.ownerOf(tokenId).call();
 const incAllTradeParams = {
        from:to,
        to: currencyAddress,
        data: currContract.methods.increaseAllowance(tradeAddress,value).encodeABI()
    }
    window.ethereum.request({
        method:'eth_sendTransaction',
        params:[incAllTradeParams]
 });

 const allOfTrade= await currContract.methods.allowance(to,tradeAddress).call();
 console.log("Value:",allOfTrade);
 console.log("owner:",owner,"poster:",poster);

 const buyParams = {
     from:to,
     to:tradeAddress ,
     //price:web3.utils.toWei(price,"ether"),
     //value:parseInt(web3.utils.toWei(price,"ether")).toString(16),
     "data":window.contract.methods.executeTrade(tokenId,value).encodeABI()
 }
  console.log(buyParams);
 window.ethereum.request({
    method:'eth_sendTransaction',
    params:[buyParams]
 }).then((result)=>{console.log("execTrade:",result)}).catch((error)=>console.log("ExecERR:",error));

 console.log(to,tokenId,price);
 return {tokenId}
}
//fetch the Selling list
export const salesNFT = async () => {

	let tokenURI = [];
	let tokenIds = [];

 window.contract = await new web33.eth.Contract(tradeABI,tradeAddress);
 const contract3 = await new web3.eth.Contract(contractABI, contractAddress);
 const sellingCount = await contract3.methods.balanceOf(tradeAddress).call((err,res)=>console.log("sellings:",res));
 console.log("sellingCount:",sellingCount);
  for (var i=0;i< sellingCount;i++){
	const tokId = await contract3.methods.tokenOfOwnerByIndex(tradeAddress,i).call();
	console.log("TokId:",tokId);
	tokenURI[i]=await contract3.methods.tokenURI(tokId).call();//make call to NFT smart contract
	tokenIds[i]=tokId;
        }
	console.log(tokenURI);
    return {tokuri:tokenURI,tokenIds:tokenIds}
                        //console.log(transactionParameters);

}
//fetch the Auctioning list
export const fetchAuctionNFT = async () => {

	let tokenURI = [];
	let tokenIds = [];

 //window.contract = await new web33.eth.Contract(auctionABI,auctionAddress);
 const contract3 = await new web3.eth.Contract(contractABI, contractAddress);
 const sellingCount = await contract3.methods.balanceOf(auctionAddress).call((err,res)=>console.log("sellings:",res));
 console.log("sellingCount:",sellingCount);
  for (var i=0;i< sellingCount;i++){
	const tokId = await contract3.methods.tokenOfOwnerByIndex(auctionAddress,i).call();
	console.log("TokId:",tokId);
	tokenURI[i]=await contract3.methods.tokenURI(tokId).call();//make call to NFT smart contract
	tokenIds[i]=tokId;
        }
	console.log(tokenURI);
    return {tokuri:tokenURI,tokenIds:tokenIds}
                        //console.log(transactionParameters);

}

//bid NFT
export const bidNFT = async (to,tokenId, price) => {

 const value=web3.utils.toWei(price,"ether");
 console.log("bidNFT",to,tokenId,price);
 window.contract = await new web33.eth.Contract(auctionABI,auctionAddress);

 const contract3 = await new web3.eth.Contract(contractABI, contractAddress);
 const owner = await contract3.methods.ownerOf(tokenId).call();
 console.log(owner)
 const currContract = await new web3.eth.Contract(currencyABI,currencyAddress);
 const incAllAuctionParams = {
        from:to,
        to: currencyAddress,
        data: currContract.methods.increaseAllowance(auctionAddress,value).encodeABI()
    }
    window.ethereum.request({
        method:'eth_sendTransaction',
        params:[incAllAuctionParams]
 });

 const allOfTrade= await currContract.methods.allowance(to,auctionAddress).call();
 console.log("Value:",allOfTrade);

// console.log("owner:",owner,"poster:",poster);
 const bidParams = {
     from:to,
     to:auctionAddress,
//     price:web3.utils.toWei(price,"ether"),
 //    value:parseInt(web3.utils.toWei(price,"ether")).toString(16),
     "data":window.contract.methods.bidAuction(tokenId,value).encodeABI()
  }
  console.log(bidParams);
 window.ethereum.request({
    method:'eth_sendTransaction',
    params:[bidParams]
 }).then((result)=>{console.log("bidNFT:",result)}).catch((error)=>console.log("ExecERR:",error));

 console.log(to,tokenId,price);
 return {tokenId}
}
//withDraw ETH
export const withDrawETH = async () => {


 window.contract = await new web33.eth.Contract(tradeABI,tradeAddress);
 const withDrawParams={
   from:window.ethereum.selectedAddress,
   to:tradeAddress,
   "data": window.contract.methods.withdrawFunds().encodeABI()
};

const txHash = await window.ethereum
    .request({
    method:'eth_sendTransaction',
    params:[withDrawParams],
    }).then((result)=>console.log("withDrawETH result:",result));

    return {status:txHash}

}
//fetch the selling status

export const fetchSellStatus = async(tokenId) => {
  let tradeStatus= [];
  console.log("fetch the status of Selling NFT");
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const tradeContract = await new web33.eth.Contract(tradeABI,tradeAddress);
  const sellStatus=await tradeContract.methods.getTrade(tokenId).call((err,res)=>console.log(res));//make call to NFT smart contract
  console.log("JS_SellStatus:",sellStatus);
    tradeStatus['poster'] = sellStatus[0];
    tradeStatus['price']=web3.utils.fromWei(sellStatus[2]);
    tradeStatus['status']=web3.utils.hexToString(sellStatus[3]);
    console.log("JS_tradeStatus:",tradeStatus);
    return {tradeStatus}
     }


//fetch the autcioning status

export const fetchAuctionStatus = async(tokenId) => {
  let tradeStatus= [];
  console.log("fetch the status of Selling NFT");
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const auctionContract = await new web33.eth.Contract(auctionABI,auctionAddress);
  const sellStatus=await auctionContract.methods.getAuction(tokenId).call((err,res)=>console.log(res));//make call to NFT smart contract
  console.log("JS_SellStatus:",sellStatus);
    tradeStatus['seller'] = sellStatus[0];
    tradeStatus['price']=web3.utils.fromWei(sellStatus[1]);
    tradeStatus['startTime']=sellStatus[3];
    tradeStatus['endTime']=sellStatus[4];
    tradeStatus['highestBid']=web3.utils.fromWei(sellStatus[5]);
 const bidCount = await auctionContract.methods.getBidsCount(tokenId).call();
    tradeStatus['bidsCount'] = bidCount;
    console.log("JS_tradeStatus:",tradeStatus);
    console.log("bidsCount",bidCount);

    return {tradeStatus}
     }

//list for Auction
export const auctionNFT = async (from,tokenId,price,startTime,endTime) =>{
   console.log("from:",from,"tokenId:",tokenId,"startTime:",startTime,"endTime:",endTime);
   const signMessage ={
      seller: from,
      startTime:startTime,
      endTime: endTime,
      tokenId:web3.utils.toBN(tokenId),
      contract: auctionAddress,
      price:web3.utils.toWei(price,"ether"),
      }
   //const sign= await web3.eth.personal.sign(web3.utils.toHex(signMessage),from);//then(signature=>console.log("SiGN:",signature));
    //
   //console.log("SIGN:v-",sign.v,"s-",sign.s,"r-",sign.r);
   //console.log("SIGN:",sign);
    const sign ="Not supported by Infura";
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);
    const currentOwner= await window.contract.methods.ownerOf(tokenId).call();
    console.log("CurrentOwner:",currentOwner);
    if(sign.length>0){
      const currentOwner= await window.contract.methods.ownerOf(tokenId).call();
      console.log("CurrentOwner:",currentOwner);
      const appParams={
           from:from,
           to:contractAddress,
           "data":window.contract.methods.setApprovalForAll(auctionAddress,1).encodeABI()
            }
     window.ethereum.request({
     method:'eth_sendTransaction',
     params:[appParams],
            }).then((result)=>{console.log("approve:",result)}).catch((error)=>console.log(error));
    }else{
           console.log("ERROR");
    }

   // const recov = await web33.eth.accounts.recover(web3.utils.toHex(signMessage),sign);
    const auctionContract = await new web3.eth.Contract(auctionABI,auctionAddress);
    const auctionParams={
            from:from,
            to: auctionAddress,
        "data":auctionContract.methods.createAuction(tokenId,web3.utils.toWei(price,"ether"),startTime,endTime).encodeABI()
    }
    const txHash =window.ethereum.request({
             method:'eth_sendTransaction',
             params:[auctionParams]
   }).then((result)=>console.log(result));
   //console.log("recov:",recov);
   return {txHash};
 }
//cancel Auction
export const cancelAuction = async (from,tokenId) =>{
   console.log("from:",from,"tokenId:",tokenId);

   window.contract = await new web3.eth.Contract(contractABI, contractAddress);
   const currentOwner= await window.contract.methods.ownerOf(tokenId).call();
   console.log("CurrentOwner:",currentOwner);
    window.contract1  = await new web33.eth.Contract(auctionABI,auctionAddress);
    const auctionParams={
            from:from,
            to: auctionAddress,
        "data":window.contract1.methods.cancelAuction(tokenId).encodeABI()
    }
    const txHash =window.ethereum.request({
             method:'eth_sendTransaction',
             params:[auctionParams]
   }).then((result)=>console.log(result));
   return {txHash};
 }
//finish Auction
export const finishAuction = async (from,tokenId,price) =>{

 const value=web3.utils.toWei(price,"ether");
   console.log("from:",from,"tokenId:",tokenId,value);
//const value=web3.utils.toWei(price,"ether");
   window.contract = await new web3.eth.Contract(contractABI, contractAddress);
   const currentOwner= await window.contract.methods.ownerOf(tokenId).call();
   console.log("CurrentOwner:",currentOwner);

const currContract = await new web3.eth.Contract(currencyABI,currencyAddress);
/**
 const incAllAuctionParams = {
        from:from,
        to: currencyAddress,
        data: currContract.methods.approve(auctionAddress,value).encodeABI()
    }
    window.ethereum.request({
        method:'eth_sendTransaction',
        params:[incAllAuctionParams]
 });**/

//const aucApp = await currContract.methods.approve(auctionAddress,value).call();
 const allOfTrade= await currContract.methods.allowance(from,auctionAddress).call();
 console.log("Value:",allOfTrade);
 //console.log("owner:",owner,"poster:",poster);

    window.contract1  = await new web33.eth.Contract(auctionABI,auctionAddress);
    const auctionParams={
            from:from,
            to: auctionAddress,
        "data":window.contract1.methods.finishAuction(tokenId).encodeABI()
    }
    const txHash =window.ethereum.request({
             method:'eth_sendTransaction',
             params:[auctionParams]
   }).then((result)=>console.log(result));
   return {txHash};
 }

//Burn NFT
export const burnNFT = async (from,tokenId) =>{
   console.log("from:",from,"tokenId:",tokenId);

   window.contract = await new web3.eth.Contract(contractABI, contractAddress);
   const currentOwner= await window.contract.methods.ownerOf(tokenId).call();
   console.log("CurrentOwner:",currentOwner);
    const burnParams={
            from:from,
            to: contractAddress,
        "data":window.contract.methods.burnNFT(tokenId).encodeABI()
    }
    const txHash =window.ethereum.request({
             method:'eth_sendTransaction',
             params:[burnParams]
   }).then((result)=>console.log(result));
   return {txHash};
 }
