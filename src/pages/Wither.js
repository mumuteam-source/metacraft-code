import React, { useEffect, useState } from "react";
import { connectWallet,fetchNFT, transNFT, listNFT, fetchOneNFT, withDrawETH} from "../utils/interact.js";
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

const Wither = (props) => {
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

  const fetchTokens = async () => { //TODO: implement
      const {tokuri,tokenIds} = await fetchNFT();
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
  const [tokId, setTokId] =useState("");
  const [to, setTo]=useState("");
  const [price, setPrice]=useState("");
  const [title, setTitle] =useState("");
  const [imageURL, setImageURL] = useState("");
  const [listName, setListName] = useState("");
  const [listDesc, setListDesc] = useState("");
  const [desc, setDesc] = useState("");


  const withDraw = async () => {
	const withDrawResult = await withDrawETH();
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
      <Button variant="contained" color="primary" id="withdraw" onClick={withDraw}>提款</Button>
      <br></br>
      <h1 id="title">我的NFTs</h1>
      <p>
       当前账号:  {walletAddress}
      </p>
    </div>
</React.Fragment>
  );
};

export default Wither;
