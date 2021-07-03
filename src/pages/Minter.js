import React, { useEffect, useState } from "react";
import { connectWallet,mintNFT } from "../utils/interact.js";
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

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Minter = (props) => {
const classes = useStyles();  
//State variables
  const [isConnected, setConnectedStatus] = useState(false);
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");
 
useEffect(async () => {
  if (window.ethereum) { //if Metamask installed
      try {
       const accounts = await window.ethereum.request({ method: "eth_accounts" }) //get Metamask wallet
       if (accounts.length) { //if a Metamask account is connected
            setConnectedStatus(true);
            setWallet(accounts[0]);
       } else {
          setConnectedStatus(false);
          setStatus("点击右上角按钮链接MetaMask钱包.");
       }
     } catch {
        setConnectedStatus(false);
       setStatus(
        "点击右上角按钮连接钱包. " +
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

  const onMintPressed = async () => { //TODO: implement
      const {status} = await mintNFT(url,name,description);
  };
  const history= useHistory();
  //const goHome= "http://47.117.135.250:4000";//i)=>history.push('');
  return (
   <React.Fragment>
     <CssBaseline />
       <AppBar position="relative">
         <Toolbar>
         <HomeIcon className={classes.icon} onClick={()=>window.location.replace("http://47.117.135.250:4000")}/>
         <Typography variant="h6" color="inherit" noWrap>
           NFTMarket
         </Typography>
         </Toolbar>
       </AppBar>
    <div className="Minter">
      <Button startIcon={<LoginIcon />} variant="contained" color="primary" id="walletButton"  onClick={connectWalletPressed}>
        {isConnected ? (
          "关联钱包地址: " +
          String(walletAddress).substring(0, 8) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>👛 Connect Wallet</span>
        )}
      </Button>

      <br></br>
      <h1 id="title">创建NFT</h1>
      <p>
       请添加相关信息，创建NFT 
      </p>
      <form>
        <h2>到NFT实体的链接: </h2>
        <input
          type="text"
          placeholder="例如: https://gateway.pinata.cloud/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />
        <h2>名字: </h2>
        <input
          type="text"
          placeholder="例如: 我的第一个NFT!"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>描述: </h2>
        <input
          type="text"
          placeholder="例如:这可比加密猫优秀多了 ;)"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        创建NFT
      </button>
      <p id="status">
        {status}
      </p>
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

export default Minter;
