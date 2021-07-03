import React, { useEffect, useState } from "react";
import { connectWallet,mintNFT,transNFT, fetchNFT } from "../utils/interact.js";
//import { fetchNFT } from "../utils/collection.js";
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
  cardContent: {
      flexGrow: 1,
    },
  footer: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(6),
    },
}));


const Transer = (props) => {
const classes = useStyles();  
//State variables
  const [isConnected, setConnectedStatus] = useState(false);
  const [walletAddress, setWallet] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [url, setURL] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
useEffect(async () => {
  if (window.ethereum) { //if Metamask installed
      try {
       const accounts = await window.ethereum.request({ method: "eth_accounts" }) //get Metamask wallet
       if (accounts.length) { //if a Metamask account is connected
            setConnectedStatus(true);
            setWallet(accounts[0]);
       } else {
          setConnectedStatus(false);
          setStatus("点击右上角按钮连接Metamask.");
       }
     } catch {
        setConnectedStatus(false);
       setStatus(
        "点击右上角按钮连接Metamask. " +
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


 const onFetchPressed = async()=> { //TODO: implement
        const {tokuri} = await fetchNFT(tokenId);

        const tokenjson = await fetch(tokuri).then((response)=>response.json())
        //console.log(tokenjson['name']);
        setURL(tokenjson['image']);
        setName(tokenjson['name']);
        setDescription(tokenjson['description']);
        };
  const onTransPressed = async () => { //TODO: implement
      const {status} = await transNFT(walletAddress,to, tokenId);
  };
  const history= useHistory();
  const goHome= ()=>window.location.replace("http://47.117.135.250:4000");
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
    <div className="Minter">
      <Button startIcon={<LoginIcon />} variant="contained" color="primary" id="walletButton"  onClick={connectWalletPressed}>
        {isConnected ? (
          "关联账号: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>请关联钱包</span>
        )}
      </Button>

      <br></br>
      <h1 id="title">转让NFT通证</h1>
      <p>
       请确认相关信息是否正确 
      </p>
      <form>
        <h2>转让通证账号: </h2>
        <p>
	 {walletAddress}
        </p>
        <h2>受让方地址</h2>
        <input
          type="text"
          placeholder="0x******************************"
          onChange={(event) => setTo(event.target.value)}
        />
        <h2>Please input the TokenId </h2>
        <input
	  type="text"
	  placeholder="e.g. 1"
	  onChange={(event)=>setTokenId(event.target.value)}
	 />
	</form>
      <button id="transButton" onClick={onTransPressed}>
        转发NFT
      </button>
     
      <button id="fetchButton" onClick={onFetchPressed}>
       获取通证
      </button>
      <p id="status">
        {status}
      </p>
     <div>
       <Card className={classes.card}>
            <CardMedia
             className={classes.cardMedia}
              image={url}
              title={name}
          />
            <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="h5" component="h2">
           {name}
           </Typography>
          <Typography>
           {description}
           </Typography>
          </CardContent>
       </Card>
    </div>
    </div>





    {/* Footer */}
        <footer className={classes.footer}>
          <Typography variant="h6" align="center" gutterBottom>
          NFTMarket
	  </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
           
          </Typography>
          <Copyright />
       </footer>
   {/* End footer */}
  </React.Fragment>
  );
};

export default Transer;
