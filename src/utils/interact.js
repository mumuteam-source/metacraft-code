import {pinJSONToIPFS} from './pinata.js';
import Web3 from 'web3';
import {fileType} from './filetype.js';
require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const infuraAdd =  process.env.REACT_APP_INFURA_ADD;
console.log("alchemyKey:",alchemyKey);
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
console.log("WebeAddress:",infuraAdd);

let web3 ="";
const web33 = new Web3(new Web3.providers.HttpProvider(infuraAdd));
let currencyAddress="";
let tradeAddress="";
let contractAddress="";
let auctionAddress="";
let collectionAddress="";
let currencyABI ="";
let tradeABI="";
let contractABI="";
let auctionABI="";
let collectionABI="";
//let network="rinkeby";

export const changeNetwork = async (network) => {
    switch (network) {
        case 'rinkeby':
             console.log("rinkeby:",network);
             web3 = createAlchemyWeb3(alchemyKey);
             //web3 = new Web3(new Web3.providers.HttpProvider(infuraAdd));
             currencyAddress = "0x61Ec138849d4e2300a8E8E4AdfCd24B163eD0A76";
             //tradeAddress = "0x1b01f7939e2ec0dDb3aCff9F4aF98E9edE27C0D6";
             //auctionAddress = "0xfe4B29649f5871ea67D438dD28A1D88505596cC7";
             tradeAddress = "0x55f109692EdfDc79e7A28316cA6Fb66E4639122d";
             auctionAddress = "0x96EaaC0F4c02F5757aD7d9bd471b87f3260bAf0D";
             contractAddress = "0xdAB4c4923E6288d412c5c77D05e490758DCffA99";//rinkeby NFT contract
             contractABI = require('../config/MyNFTABI_new.json');
             tradeABI = require('../config/NFTMarketTrade.json');
             auctionABI = require('../config/NFTMarketAuction.json');
             currencyABI = require('../config/TradeABI.json');
             collectionAddress = '0x020fdbb52ca163f9d916cef28bac56eb59462de6';
             collectionABI=require('../config/RinkebyCollectonABI.json');
             return "rinkeby";
        case 'mumbai':
             console.log("mumbai:",network);
             web3 = new Web3(new Web3.providers.HttpProvider(infuraAdd));
             const networkVersion =  web3.eth.net.getId();
             console.log("Network:",networkVersion);
             currencyAddress = "0x7581EEfD8b805798b74e65D49A2E75876745D5c9";
             contractAddress = "0x5749da81AcbC8EC45e8E682E9B5E68e48b21a138";//matic mumbai NFT contract
             tradeAddress = "0x70AFf8fc4122AE8ED05eaf440240cA9Dce935f3E";
             auctionAddress = "0xD06E61a54BB5A7A842c6627a36E01E4374a6db8d";
             currencyABI = require('../config/NFTStore.json');
             contractABI = require('../config/NFTMarket.json');//mumbai NFT BAI
             tradeABI = require('../config/NFTMarketTrade.json');
             auctionABI = require('../config/NFTMarketAuction.json');
             return "mumabi";
    }

};

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

export const mintNFT = async(url, name, description,type,oriName,exType) => {
//error handling
 if (oriName.trim() == "" || (name.trim() == "" || description.trim() == ""||type.trim()== "")) {
    return {
        success: false,
        status: "All fileds should be filled",
      }
    }
   window.contract = await new web3.eth.Contract(contractABI, contractAddress);
   const symbol = await window.contract.methods.symbol().call((err,res)=>console.log("newOwner:",err));
   console.log(url);
    //make metadata
    const metadata = new Object();
    metadata.symbol = symbol;
    metadata.name = name;
    metadata.image = url;
    metadata.description = description;
    metadata.type = type;
    metadata.address = contractAddress;
    metadata.original_creator = window.ethereum.selectedAddress;
    metadata.extype = exType;
    metadata.oriname = oriName
    console.log(metadata);
    //make pinata call

   const pinataResponse = await pinJSONToIPFS(metadata);
   if (!pinataResponse.success) {
     return {
      success: false,
     status: "tokenURI有误.",

       }
    }
    console.log(pinataResponse);
   const tokenURI = pinataResponse.pinataUrl;
   console.log("tokenURI:",tokenURI);
   console.log("Account:",window.ethereum.selectedAddress);

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


window.contract = await new web3.eth.Contract(contractABI, contractAddress);
window.contract.methods.setApprovalForAll(contractAddress,1).call((err,res)=>console.log("approved:",res));
window.contract.methods.ownerOf(tokenId).call((err,res)=>console.log("OwnerOfTOken:",res));
//var gasPrices = await this.getCurrentGasPrices();
const transactionParameters = {
   to: contractAddress, // Required except during contract publications.
   from: from, // must match user's active address.
   'data': window.contract.methods.transferFrom(from, to, tokenId ).encodeABI()
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
  console.log(window.contract);
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

 console.log(contractABI);
 console.log(web3.version,window.ethereum.selectedAddress,window.contract);
	//     //set up your Ethereum transactior
	let tokenURI = [];
	let tokenIds = [];
    console.log("contractNAME:",window.contract.methods.name().call());
    const allTokenNum=await window.contract.methods.totalSupply().call((err,res)=>console.log("TokenNO.",res));
    const tokens=await window.contract.methods.balanceOf(window.ethereum.selectedAddress).call((err,res)=>console.log("res:",res,"ERR:",err));
	console.log("Tokens in this COntract:",tokens);
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
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
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
console.log("buyPrice:",price);
const value=web3.utils.toWei(price,"ether");
 console.log("buyNFT",to,tokenId,value,currencyAddress, tradeAddress, poster);
 window.contract = await new web33.eth.Contract(tradeABI,tradeAddress);
 window.currContract = await new web3.eth.Contract(currencyABI,currencyAddress);
 window.contract3 = await new web3.eth.Contract(contractABI, contractAddress);
 const owner = await window.contract3.methods.ownerOf(tokenId).call();
 /**
  const incAllTradeParams = {
        from:to,
        to: currencyAddress,
        data: window.currContract.methods.increaseAllowance(tradeAddress,value).encodeABI()
    }
    window.ethereum.request({
        method:'eth_sendTransaction',
        params:[incAllTradeParams]
 });

 const allOfTrade= await window.currContract.methods.allowance(to,tradeAddress).call();
 console.log("Value:",allOfTrade);
 console.log("owner:",owner,"poster:",poster);
**/
 const buyParams = {
     from:to,
     to:tradeAddress ,
     //price:web3.utils.toWei(price,"ether"),
     value:parseInt(web3.utils.toWei(price,"ether")).toString(16),
     "data":window.contract.methods.executeTrade(tokenId).encodeABI()
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

 window.contract = await new web3.eth.Contract(tradeABI,tradeAddress);
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
 window.contract3 = await new web3.eth.Contract(contractABI, contractAddress);
 const sellingCount = await window.contract3.methods.balanceOf(auctionAddress).call((err,res)=>console.log("sellings:",res));
 console.log("sellingCount:",sellingCount);
  for (var i=0;i< sellingCount;i++){
	const tokId = await window.contract3.methods.tokenOfOwnerByIndex(auctionAddress,i).call();
	console.log("TokId:",tokId);
	tokenURI[i]=await window.contract3.methods.tokenURI(tokId).call();//make call to NFT smart contract
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
 window.contract = await new web3.eth.Contract(auctionABI,auctionAddress);

 const contract3 = await new web3.eth.Contract(contractABI, contractAddress);
 const owner = await contract3.methods.ownerOf(tokenId).call();
 console.log(owner)
/**
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
**/
// console.log("owner:",owner,"poster:",poster);
 const bidParams = {
     from:to,
     to:auctionAddress,
//     price:web3.utils.toWei(price,"ether"),
    value:parseInt(web3.utils.toWei(price,"ether")).toString(16),
     "data":window.contract.methods.bidAuction(tokenId).encodeABI()
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
  const tradeContract = await new web3.eth.Contract(tradeABI,tradeAddress);
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
//  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  window.auctionContract = await new web3.eth.Contract(auctionABI,auctionAddress);
  const sellStatus=await window.auctionContract.methods.getAuction(tokenId).call((err,res)=>console.log(res));//make call to NFT smart contract
  console.log("JS_SellStatus:",sellStatus);
    tradeStatus['seller'] = sellStatus[0];
    tradeStatus['price']=web3.utils.fromWei(sellStatus[1]);
    tradeStatus['startTime']=sellStatus[3];
    tradeStatus['endTime']=sellStatus[4];
    tradeStatus['highestBid']=web3.utils.fromWei(sellStatus[5]);
 const bidCount = await window.auctionContract.methods.getBidsCount(tokenId).call();
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
 });

//const aucApp = await currContract.methods.approve(auctionAddress,value).call();
 const allOfTrade= await currContract.methods.allowance(from,auctionAddress).call();
 console.log("Value:",allOfTrade);
 //console.log("owner:",owner,"poster:",poster);
**/
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

//The Collection and Box functions
//
//Added on Jul 25 2021


export const createCollection = async(info,collaborators) => {
//error handling
 if (info=="" || collaborators =="") {
    return {
        success: false,
        status: "All fileds should be filled",
      }
    }
   window.collection = await new web3.eth.Contract(collectionABI, collectionAddress);
   console.log(info);
    //make metadata
    /**
    const metadata = new Object();
    metadata.name = name;
    metadata.image = url;
    metadata.description = description;
    metadata.size = size;
    metadata.address = collectionAddress;
    metadata.original_creator = window.ethereum.selectedAddress;
    metadata.collaborators = collaborators;
    console.log(metadata);
    //make pinata call

   const pinataResponse = await pinJSONToIPFS(metadata);
   if (!pinataResponse.success) {
     return {
      success: false,
     status: "tokenURI有误.",

       }
    }
    console.log(pinataResponse);
   const tokenURI = pinataResponse.pinataUrl;
   console.log("tokenURI:",tokenURI);
   **/
   console.log("Account:",window.ethereum.selectedAddress);

    //set up your Ethereum transaction
     const transactionParameters = {
        to: collectionAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        'data': window.collection.methods.createCollection(info,collaborators).encodeABI()//make call to NFT smart contract
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
            status: "see detail from: https://rinkeby.etherscan.io/tx/" + txHash
          }
     } catch (error) {
        return {
          success: false,
            status: "error： " + error.message
     }

   }
}
export const publishCollection = async(wallet,collectionId,deadline) => {
//error handling
 if (wallet==""||collectionId=="" || deadline =="") {
    return {
        success: false,
        status: "All fileds should be filled",
      }
    }
   window.collection = await new web3.eth.Contract(collectionABI, collectionAddress);
     const transactionParameters = {
        to: collectionAddress, // Required except during contract publications.
        from: wallet, // must match user's active address.
        'data': window.collection.methods.publishCollection(collectionId,deadline).encodeABI()//make call to NFT smart contract
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
            status: "see detail from: https://rinkeby.etherscan.io/tx/" + txHash
          }
     } catch (error) {
        return {
          success: false,
            status: "error： " + error.message
     }

   }
}

export const unPublishCollection = async(wallet,collectionId) => {
//error handling
 if (wallet==""||collectionId=="" ) {
    return {
        success: false,
        status: "All fileds should be filled",
      }
    }
   window.collection = await new web3.eth.Contract(collectionABI, collectionAddress);
     const transactionParameters = {
        to: collectionAddress, // Required except during contract publications.
        from: wallet, // must match user's active address.
        'data': window.collection.methods.unpublishCollection(collectionId).encodeABI()//make call to NFT smart contract
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
            status: "see detail from: https://rinkeby.etherscan.io/tx/" + txHash
          }
     } catch (error) {
        return {
          success: false,
            status: "error： " + error.message
     }

   }
}

export const fetchCollectionIds = async() => {
   window.collection = await new web3.eth.Contract(collectionABI, collectionAddress);
   const collectionId = await window.collection.methods.nextCollectionId().call();
   return collectionId;
}

export const fetchCollaboratorsById = async(id) => {
   window.collection = await new web3.eth.Contract(collectionABI, collectionAddress);
   const clbNum = await window.colletcion.methods.collaborators(id).call();
   const collection = await window.collection.methods.getCollectionById(id).call();
   console.log("collection:",collection);
   return collection;
}
export const fetchCollectionById = async(id) => {
   console.log("fetchcollectionsby ID");
   window.collection = await new web3.eth.Contract(collectionABI, collectionAddress);
   const collection = await window.collection.methods.getCollectionById(id).call();
   console.log("collection:",collection);
   return collection;
}

export const isPublished = async(id) => {
   window.collection = await new web3.eth.Contract(collectionABI, collectionAddress);
   const isPublish= await window.collection.methods.isPublished(id).call();
   console.log("isPublished:",isPublish);
   return isPublish;
}
export const fetchCollectionsByOwner = async(owner) => {
   console.log(owner);
   window.collection = await new web3.eth.Contract(collectionABI, collectionAddress);
   const collections = await window.collection.methods.getCollectionByOwner(owner).call();
   /**The old method
    * do not use again
    *
   let collection=[];
   let j=0;
   const ids = await fetchCollectionIds();
    console.log("IDs",ids);
    for(var i=1;i<=ids;i++){
        console.log("ids:",[i]);
        const collect= await fetchCollectionsbyId(i);
        console.log(collect[0]);
        collection = collect[0];
       // collection.type = "Art";
        if(collection.owner.toLowerCase()===owner){
        collections[j] = collection;
        j++
        }
        //collection[i].information= JSON.stringify(collections[i],undefined,4);
    }
    **/
    return collections;
}
export const fetchCollectionsByClb = async(address) =>{
   let collections=[];
   let collection=[];
   let isClbor;
   let j = 0;
   window.collection = await new web3.eth.Contract(collectionABI, collectionAddress);
   const ids = await fetchCollectionIds();
    for (var i=1;i<=ids;i++){
        isClbor=false;
        isClbor = await window.collection.methods.isCollaborator(i,address).call();
        console.log(i,isClbor);
        if(isClbor) {
          console.log("fetch",i);
          const collect= await fetchCollectionById(i);
          //console.log(collect);
        if(collect[0].owner.toLowerCase()!=address){
            collections[j] = collect[0];
            j++;
          }
        }
    }
    return collections;

}
export const boxNFT = async(from,boxTokenId,collectionId,boxPrice) =>{
    console.log(from,boxTokenId,collectionId,boxPrice);
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);
    //   const price = web3.utils.toWei(boxPrice,"ether");
   const price = web3.utils.toWei(boxPrice,"ether");
   //const tokenId = web3.utils.toBN(boxTokenId);
   console.log(price);
   const appParams={
     from:from,
     to:contractAddress,
     "data":window.contract.methods.setApprovalForAll(collectionAddress,1).encodeABI()
   }
   window.ethereum.request({
        method:'eth_sendTransaction',
        params:[appParams],
}).then((result)=>{console.log("approve:",result)}).catch((error)=>console.log(error));

   window.collection = await new web3.eth.Contract(collectionABI, collectionAddress);
    const boxParams={
            from:from,
            to: collectionAddress,
        "data": window.collection.methods.addNFTToCollection(contractAddress,boxTokenId,collectionId,price).encodeABI()
    }
    console.log("boxParams",boxParams);
    const txHash =window.ethereum.request({
             method:'eth_sendTransaction',
             params:[boxParams]
   }).then((result)=>console.log(result));
   return {txHash};
}

//fetch My Boxes
export const fetchBoxIds = async() => {
   window.collection = await new web3.eth.Contract(collectionABI, collectionAddress);
   const BoxIds = await window.collection.methods.nextNFTId().call();
   return BoxIds;
}
export const fetchBoxByOwner = async(owner) => {
   console.log(owner);
   window.collection = await new web3.eth.Contract(collectionABI, collectionAddress);
   let box=[];
   let j=0;
   const ids = await fetchBoxIds();
    console.log("IDs",ids);
    for(var i=0;i<ids;i++){
        console.log("ids:",[i]);
        const nftId= await window.collection.methods.nftsByOwner(owner,i).call();
        box[i] = await window.collection.methods.allNFTs(nftId).call();
        }
        //collection[i].information= JSON.stringify(collections[i],undefined,4);
//    console.log(box);
    return box;
}
export const editCollection = async(collectionId,info,collaborators) => {
//error handling
 if (info=="" || collaborators =="") {
    return {
        success: false,
        status: "All fileds should be filled",
      }
    }
   window.collection = await new web3.eth.Contract(collectionABI, collectionAddress);
   console.log(info);

    //set up your Ethereum transaction
     const transactionParameters = {
        to: collectionAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        'data': window.collection.methods.editCollection(collectionId,info,collaborators).encodeABI()//make call to NFT smart contract
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
            status: "see detail from: https://rinkeby.etherscan.io/tx/" + txHash
          }
     } catch (error) {
        return {
          success: false,
            status: "error： " + error.message
     }

   }
}

export const removeBox = async(from,nftId,collectionId) =>{
   console.log(nftId,collectionId);

   window.collection = await new web3.eth.Contract(collectionABI, collectionAddress);
    const boxParams={
            from:from,
            to: collectionAddress,
        "data": window.collection.methods.removeNFTFromCollection(nftId,collectionId).encodeABI()
    }
    console.log("boxParams",boxParams);
    const txHash =window.ethereum.request({
             method:'eth_sendTransaction',
             params:[boxParams]
   }).then((result)=>console.log(result));
   return {txHash};
}
export const editBox = async(from,nftId,collectionId,boxPrice) =>{
   console.log(nftId,collectionId,boxPrice);

   const price = web3.utils.toWei(boxPrice,"ether");
   window.collection = await new web3.eth.Contract(collectionABI, collectionAddress);

    const boxParams={
            from:from,
            to: collectionAddress,
        "data": window.collection.methods.editNFTInCollection(nftId,collectionId,price).encodeABI()
    }
    console.log("boxParams",boxParams);
    const txHash =window.ethereum.request({
             method:'eth_sendTransaction',
             params:[boxParams]
   }).then((result)=>console.log(result));
   return {txHash};
}
export const fetchPubCollections = async() => {
    let pubCollections = [];
    let j=0;
    const cIds = await fetchCollectionIds()
    window.collection = await new web3.eth.Contract(collectionABI, collectionAddress);
    for (var i=1;i<=cIds;i++){
        const isPubC = isPublished(i)
        if (isPubC){
            pubCollections[j]=await window.collection.methods.allCollections(i).call()
            j++;
        }
        console.log("pubCs:",pubCollections);
        return pubCollections;
    }
}
