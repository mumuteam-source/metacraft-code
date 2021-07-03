import React, { useEffect, useState } from "react";
import { connectWallet,fetchNFT, transNFT, listNFT, fetchOneNFT, fetchAllNFT, fetchSellStatus} from "../utils/interact.js";
import LoginIcon from '@material-ui/icons/AccountCircle';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {BrowserRouter as Router, Switch, Route,useHistory } from 'react-router-dom';
function Copyright() {
  return (
      <Typography variant="body2" color="textSecondary" align="center">
       {'Copyright © '}
       <Link color="inherit" href="#">
         NFTMarket
       </Link>{' '}
       {new Date().getFullYear()}
       {'.'}
      </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
  icon: {
      marginRight: theme.spacing(2),
    },
  heroContent: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(8, 0, 6),
    },
  heroButtons: {
      marginTop: theme.spacing(4),
    },
  cardGrid: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
    },
  card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
  cardMedia: {
      paddingTop: '56.25%', // 16:9
    },

  cardListMedia: {
      paddingTop: '100%',
    },
  cardContent: {
      flexGrow: 1,
    },
  footer: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(6),
    },
}));

//const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Tokens = (props) => {
const classes = useStyles();
//State variables
  const [isConnected, setConnectedStatus] = useState(false);
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus,tokuri] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");
  const [id, setId] = useState("");
  const [cards, setCards] = useState([]);
  const [tokenId,setTokenId]=useState("");
  //const [currentAddress, setCurrentAddress] = useState("");
useEffect(async () => {
  if (window.ethereum) { //if Metamask installed
      try {
       const accounts = await window.ethereum.request({ method: "eth_accounts" }) //get Metamask wallet
       if (accounts.length) { //if a Metamask account is connected
            setConnectedStatus(true);
            setWallet(accounts[0]);
       } else {
          setConnectedStatus(false);
          setStatus("Connect to Metamask using the top right button.");
       }
     } catch {
        setConnectedStatus(false);
       setStatus(
        "Connect to Metamask using the top right button. " +
         walletAddress
      );
     }
   }
});
  const connectWalletPressed = async () => { //TODO: implement
	 const walletResponse = await connectWallet();
	      setConnectedStatus(walletResponse.connectedStatus);
	      setStatus(walletResponse.status);
	      if (isConnected) {
	            setWallet(walletAddress);
          }

  };

  const fetchAllTokens = async () => { //TODO: implement
      const {tokuri,tokenIds} = await fetchAllNFT();
      console.log("tokId:",tokenIds);
      let cards=[];

     //let cards =Object.keys( tokuri );
     //status = tokuri;

     //console.log(Array.isArray(tokuri),"cards:",cards);
    for (var i=0;i<tokuri.length;i++){
     let tokenjson = await fetch(tokuri[i]).then((response)=>response.json());
	 tokenjson["tokenId"] = tokenIds[i];
     //console.log(i,tokenjson['name']);
     setStatus(tokenjson['image']);
     setName(tokenjson['name']);
     setDescription(tokenjson['description']);
     setTokenId(tokenjson['tokenId']);
     cards.push(tokenjson);

    }
    setCards(cards);

    console.log(cards);
  };
  //fetchTokens();
  const history= useHistory();
  const goHome= ()=>history.push('/');
  //transferTokens();
  //const transToken = async() =>{
  //    const {transRst} =  await transNFT()
  //}
  const [open, setOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [listSaleOpen, setListSaleOpen] = useState(false);
  const [tokId, setTokId] =useState("");
  const [to, setTo]=useState("");
  const [price, setPrice]=useState("");
  const [title, setTitle] =useState("");
  const [imageURL, setImageURL] = useState("");
  const [listName, setListName] = useState("");
  const [listDesc, setListDesc] = useState("");
  const [desc, setDesc] = useState("");
  const [poster, setPoster] = useState("");
  const [sellPrice,setSellPrice] = useState("");
  const [tradeStatus,setTradeStatus] = useState("");
  const [tokenOwner,setTokenOwner] = useState("");
  const openTransferDialog = (e) => {
	      setTokId(e.currentTarget.value)
	      setOpen(true);
  };


  const openListDialog = async (e) => {
      setTokId(e.currentTarget.value);

      const tokenId =  e.currentTarget.value;
      console.log("TokenID:",tokenId);
      const {tokURI,owner} = await fetchOneNFT(tokenId);
      console.log("tokURI",tokURI,"owner:",owner);//['tokenURI']);
      const listToken = await fetch(tokURI).then((response)=>response.json());
      console.log("TokenDes:",listToken);
      setImageURL(listToken['image']);
      setListName(listToken['name']);
      setListDesc(listToken['description']);

       const tradesStatus = await fetchSellStatus(tokenId);
       const saleStatus = tradesStatus['tradeStatus'];
       console.log("DAPP_sellStatus:",saleStatus);
       setPoster(saleStatus['poster']);
       setSellPrice(saleStatus['price']);
       setTradeStatus(saleStatus['status']);
       setTokenOwner(owner);
      // console.log("Status:",tradeStatus);
      if(saleStatus['status']=="Open")
      {console.log("Open:",tradeStatus);}
       setListOpen(true);

  };
  const handleClose =() => {
            setOpen(false);
  };
  const handleListClose =() => {
            setListOpen(false);
  };
  const onTransPressed = async () => {
	const {transToken} = await transNFT(walletAddress,to,tokId);
	setOpen(false);
  };
  const onListPressed = async () => {
	const {listSign} = await listNFT(walletAddress,tokId,price);
	setStatus(listSign);
	setListOpen(false);
  };
  return (
   <React.Fragment>
     <CssBaseline />
       <AppBar position="relative">
         <Toolbar>
         <HomeIcon className={classes.icon} onClick={goHome}/>
         <Typography variant="h6" color="inherit" noWrap>
           NFTMarket
         </Typography>
         </Toolbar>
       </AppBar>
    <div className="Fetcher">
      <Button startIcon={<LoginIcon />} variant="contained" color="primary" id="walletButton"  onClick={connectWalletPressed}>
        {isConnected ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </Button>
      <Button variant="contained" color="primary" id="fetchTockens" onClick={fetchAllTokens}>获取NFTs</Button>
      <br></br>
      <h1 id="title">NFTs</h1>
      <p>
       当前账号:  {walletAddress}
      </p>


   <Container className={classes.cardGrid} maxWidth="md">
    <Grid container spacing={4}>
  {cards.map((card,i)=>(
      <Grid item key={i} xs={12} sm={6} md={4}>
      <Card className={classes.card}>
	  <CardMedia
	    className={classes.cardMedia}
	     image={card.image}
	     title={card.name}
	   />
	   <CardContent className={classes.cardContent}>
	   <Typography gutterBottom variant="h5" component="h2">
	  {card.name}
	  </Typography>
	 <Typography>
	  {card.description}
	  </Typography>
	 </CardContent>
	 <CardActions>
	 <Button size="small" color="primary" onClick={openListDialog} value={card.tokenId}>
	DETAIL
	 </Button>
	 </CardActions>
       </Card>
    </Grid>
  ))}
</Grid>
</Container>
  <p id = "status">{status}</p>
    </div>
     <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
         <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
             <p>TokenId:{tokId}</p>
             <p>Your Address:{walletAddress}</p>
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="受让方地址"
              type="text"
              fullWidth
	      onChange={(event)=>setTo(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
           取消
            </Button>
            <Button onClick={onTransPressed} color="primary">
           转让
         </Button>
      </DialogActions>
    </Dialog>

     <Dialog open={listOpen} onClose={handleListClose} aria-labelledby="list-for-sale">
         <DialogTitle id="list-for-sale">Details of {listName} </DialogTitle>
          <DialogContent>
            <DialogContentText>
             <p>TokenId:{tokId}</p>
             <p>归属账号:{tokenOwner}</p>

	  <CardMedia
	    className={classes.cardListMedia}
	     image={imageURL}
	     title={listName}
	   />
        </DialogContentText>
	     <p>NFT名称:</p>
	     <input
	      type="text"
	      placeholder = {listName}
	      onChange={(event)=>setTitle(event.target.value)}
            />
	    <p>描述</p>
	    <input
	      type="text"
	      placeholder = {listDesc}
	      onChange={(event => setDesc(event.target.value))}
	    />
           <p>出售者账号:{poster}</p>
           <p>挂牌价格:{sellPrice} ETH</p>
           <p>出售状态:{tradeStatus}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleListClose} color="primary">
           取消
            </Button>
      </DialogActions>
      {/*in Sales here diag*/}
      <Dialog open={listSellOpen} onClose={handleListSellClose} aria-labelledby="list-for-sales">
          <DialogTitle id="list-for-sales">list {listName} For Sale</DialogTitle>
              <DialogContent>
              <DialogContentText>
              <p>TokenId:{tokId}</p>
              <p>Your Address:{walletAddress}</p>

          <CardMedia
            className={classes.cardListMedia}
             image={imageURL}
             title={listName}
           />
             </DialogContentText>
             <p>NFT名称:</p>
             <input
              type="text"
              placeholder = {listName}
              onChange={(event)=>setTitle(event.target.value)}
              />
            <p>描述</p>
            <input
              type="text"
              placeholder = {listDesc}
              onChange={(event => setDesc(event.target.value))}
            />
               <p>出售者账号:{poster}</p>
               <p>挂牌价格:{sellPrice} ETH</p>
               <p>出售状态:{tradeStatus}</p>
             <p>购买价格(ETH):</p>
             <input
              type="price"
              placeholder = "请以以太币位单位购买:例如:0.005"
              onChange={(event) => setPrice(event.target.value)}
              />
              </DialogContent>
               <DialogActions>
                <Button onClick={handleListClose} color="primary">
                 取消
                </Button>
                <Button onClick={onBidPressed} color="primary">
                 下单
               </Button>
            </DialogActions>
      {/* in Sales end diag */}
    </Dialog>
    {/* Footer */}
        <footer className={classes.footer}>
          <Typography variant="h6" align="center" gutterBottom>
          NFTMarket
	  </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
           NFTMarket
          </Typography>
          <Copyright />
       </footer>
   {/* End footer */}
  </React.Fragment>
  );
};
export default Tokens;
