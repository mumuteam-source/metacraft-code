import { ElementsConsumer } from "@stripe/react-stripe-js";
import parse from "parse";
parse.serverURL = "http://47.117.135.250:1338/parse";
parse.initialize("nftstore", "zxd19761214"); //传入APPID和JavaScript key即可

export function isLogin(){
  var currentUser = parse.User.current();
  if (currentUser) {
      return true;
  } else {
      // show the signup or login page
      return false;
  }
}

export const doLogin1 = async (username, password) => {
  let loginResult = false;
  console.log(username);
  console.log(password);
  parse.User.logIn(username, password, null).then(
    function (user) {
      // 登录成功
      //console.log(user.get("登录成功"));
      loginResult = true;
    },
    function (error) {
      // The save failed.  Error is an instance of Parse.Error.
      console.log(error);
    }
  );
  return loginResult;
};

export const doLogin = async (username, password) => {
  let loginResult = false;
  console.log(username);
  console.log(password);
  let user;
  try {
    user = await parse.User.logIn(username, password, null);
  } catch (error) {
    console.log(error.message);
  }
  console.log("hello world");
  if (user) {
    console.log(user.getEmail());
    return true;
  } else return false;
};

export const doRegister = async (username, password) => {
  let registerResult = false;
  let errorMessage = "";
  const user = new parse.User();
  user.set("username", username);
  user.set("password", password);
  user.set("email", username);
  user.set("headImage","/avatar.png");

  // other fields can be set just like with Parse.Object
  user.set("phone", "415-392-0202");
  user.set("walletAddress", "");

  try {
    await user.signUp();
    // Hooray! Let them use the app now.
    console.log(user.getEmail());
    registerResult = true;
    errorMessage = "sucess";
  } catch (error) {
    // Show the error message somewhere and let the user try again.
    console.log("Error: " + error.code + " " + error.message);
    errorMessage = error.message;
  }
  return {registerResult,errorMessage};
};

export const doTest = async () => {
  // 创建一个新的Parse.Object子类
  var GameScore = parse.Object.extend("NFT");
  var query = new parse.Query(GameScore);
  let target;
  await query.find().then(
    function (results) {
      console.log(results);

      for (let i = 0; i < results.length; i++) {
        const object = results[i];
        console.log(object.id);
      }
      target = results[0];
    },
    function (error) {
      // The save failed.  Error is an instance of Parse.Error.
      console.log(error);
    }
  );
  return target;

};

export function hasLogin(){
  var currentUser = parse.User.current();
  if (currentUser) {
      return true;
  } else {
      return false;
      // show the signup or login page
  }
};
    // let result = doTest().then(function (result) {
    //   if(result){
    //     console.log(result.get("name"));
    //   }
    //   else{
    //     console.log(result);
    //   }
    // });
    // try{
    // let target = await doTest();
    // console.log('hello');
    // console.log(target);
    // }catch (error) {
    //   // Show the error message somewhere and let the user try again.
    //   alert("Error: " + error.code + " " + error.message);
    // }

/**
 * GRocky 20210630
 * added for fetch tokens
 * from Parse
 **/

export const fetchMyTokens = async(address,network)=>{
    console.log("parse query", address, network);
    const nftTokens = parse.Object.extend("NFTTokens");
    const query1 = new parse.Query(nftTokens);
    const query2 = new parse.Query(nftTokens);
    query1.equalTo("Network",network);
    query2.equalTo("CurrentOwner",address);
    const myTokens = new parse.Query.and(query1,query2);
    myTokens.descending("Date");
    const mytokens = await myTokens.find()
        .then(function(results) {
            console.log(results);
            return results;
        })
        .catch(function(error) {
            console.log(error);
        });
    console.log("Results:",mytokens);
    return  mytokens;
};

export const fetchAllNFTs = async(network)=>{
    console.log("parse query",  network);
    const nftTokens = parse.Object.extend("NFTTokens");
    const allTokens = new parse.Query(nftTokens);
    allTokens.equalTo("Network",network);
    allTokens.descending("TokenID");
    const alltokens = await allTokens.find()
        .then(function(results) {
            console.log(results);
            return results;
        })
        .catch(function(error) {
            console.log(error);
        });
    console.log("Results:",alltokens);
    return  alltokens;
}
export const fetchListNFTs = async(network,trade,auction)=>{
    console.log("parse query",  network,trade,auction);

    const nftTokens = parse.Object.extend("NFTTokens");
    const queryTrade = new parse.Query(nftTokens);
    queryTrade.equalTo("CurrentOwner",trade.toLowerCase());
    const queryAuction = new parse.Query(nftTokens);
    queryAuction.equalTo("CurrentOwner",auction.toLowerCase());
    const allTokens = new parse.Query.or(queryTrade,queryAuction);
    allTokens.equalTo("Network",network);
    allTokens.descending("TokenID");
    const alltokens = await allTokens.find()
        .then(function(results) {
            console.log(results);
            return results;
        })
        .catch(function(error) {
            console.log(error);
        });
    console.log("Results:",alltokens);
    return  alltokens;
}
/**
 * fetch One Token from Parse
 **/
export const fetchOneToken = async(tokenId,network)=>{
    console.log("parse query", tokenId, network);
    const nftTokens = parse.Object.extend("NFTTokens");
    const query1 = new parse.Query(nftTokens);
    const query2 = new parse.Query(nftTokens);
    query1.equalTo("Network",network);
    query2.equalTo("TokenID",parseInt(tokenId));
    const myTokens = new parse.Query.and(query1,query2);
    myTokens.descending("ID");
    const onetoken = await myTokens.find()
        .then(function(results) {
            console.log(results);
            return results;
        })
        .catch(function(error) {
            console.log(error);
        });
    console.log("Results:",onetoken);
    return  onetoken;
};

export const fetchOrders = async (wallet,network) => { //TODO: implement
    let transEvents=[];
    var nftTokens = parse.Object.extend("NFTTokens");
    var querytok1 = new parse.Query(nftTokens);
    var querytok2 = new parse.Query(nftTokens);

    var mumEvents = parse.Object.extend("NFTTrades");
      var query1 = new parse.Query(mumEvents);
      var query2 = new parse.Query(mumEvents);
      console.log("currentWallet:",wallet,network);
      query1.equalTo("From",wallet);
      query2.equalTo("To",wallet);
      var query = new parse.Query.or(query1,query2);
      query.limit(200);
      query.descending("Date");
      query.equalTo("Network", network);
    await query.find().then(async function(results){
       for (let i = 0; i < results.length; i++) {
         const object = results[i];
         const event=object.attributes["Event"]==="AuctionStatusChange"?"Auction":"Trade";
         const id = object.attributes["TokenID"];
 //       console.log(id);
         querytok1.equalTo("ID",id);
         querytok2.equalTo("Network",network);
         var querytok = new parse.Query.and(querytok1,querytok2);
        await querytok.first().then(function(result){
//     console.log("querytok:",id,result);

        const rowData={
            "id":object.attributes["ID"],
            "event":event,
            "status":object.attributes["Status"],
            "price":object.attributes["Price"],
            "from":object.attributes["From"],
            "to":object.attributes["To"],
            "tokenID": object.attributes["TokenID"],
            "createdAt":object.attributes["Date"],
            "txHash":object.attributes["TxHash"],
            "url":result.attributes["Image"],
            "name":result.attributes["Name"],
            "type":result.attributes["Type"],
            "description":result.attributes["Description"]
           };
//          console.log(rowData);
          transEvents.push(rowData);

    })
       }
     })
      console.log("Trans:",transEvents);
      return transEvents;
 };

export const fetchLists = async (wallet,network) => { //TODO: implement
    let transEvents=[];
    var nftTokens = parse.Object.extend("NFTTokens");
    var querytok1 = new parse.Query(nftTokens);
    var querytok2 = new parse.Query(nftTokens);

    var mumEvents = parse.Object.extend("NFTTrades");
      var query1 = new parse.Query(mumEvents);
      var query2 = new parse.Query(mumEvents);
      console.log("currentWallet:",wallet,network);
      query1.equalTo("From",wallet);
      query2.equalTo("Network",network);
      var query = new parse.Query.and(query1,query2);
      query.limit(200);
      query.descending("Date");
      //query.equalTo("Network", network);
    await query.find().then(async function(results){
       for (let i = 0; i < results.length; i++) {
         const object = results[i];
         const event=object.attributes["Event"]==="AuctionStatusChange"?"Auction":"Trade";
         const id = object.attributes["TokenID"];
 //       console.log(id);
         querytok1.equalTo("ID",id);
         querytok2.equalTo("Network",network);
         var querytok = new parse.Query.and(querytok1,querytok2);
        // querytok.equalTo("CurrentOwner");
        await querytok.first().then(function(result){
//     console.log("querytok:",id,result);

        const rowData={
            "id":object.attributes["ID"],
            "event":event,
            "status":object.attributes["Status"],
            "price":object.attributes["Price"],
            "from":object.attributes["From"],
            "to":object.attributes["To"],
            "tokenID": object.attributes["TokenID"],
            "createdAt":object.attributes["Date"],
            "txHash":object.attributes["TxHash"],
            "url":result.attributes["Image"],
            "name":result.attributes["Name"],
            "type":result.attributes["Type"],
            "description":result.attributes["Description"],
            "currowner":result.attributes["CurrentOwner"]
           };
//          console.log(rowData);
          transEvents.push(rowData);

    })
       }
     })
      console.log("Trans:",transEvents);
      return transEvents;
 };

