import React,{ useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {fade, makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import SearchIcon from '@material-ui/icons/Search';
import PrimarySearchAppBar from './PrimarySearchAppBar';
import { connectWallet,fetchNFT } from "../utils/interact.js";




function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        NFTStore
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
  grow:{
    flexGrow:1,
  },
  menuButton:{
      marginRight:theme.spacing(2),
  },
  title:{
    display: 'none',
    [theme.breakpoints.up('sm')]:{
      display: 'block',
    },
  },
  search: {
    position:'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
           backgroundColor: fade(theme.palette.common.white, 0.25),
        },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
        },
    },
   searchIcon: {
       padding: theme.spacing(0, 2),
       height: '100%',
       position: 'absolute',
       pointerEvents: 'none',
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'center',
     },
    inputRoot: {
      color: 'inherit',
     },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: '20ch',
          },
      },
      sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
           display: 'flex',
          },
      },
     sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
           display: 'none',
         },
    },
  
  
}));
{/*
 async function fetchTokens() { //TODO: implement
	  const {tokuri} = await fetchNFT(3);
	  const tokenjson = await fetch(tokuri).then((response)=>response.json())
	  //console.log(tokenjson['name']);
	  setStatus(tokenjson['image']);
	  setName(tokenjson['name']);
	  setDescription(tokenjson['description']);
	  };
*/}
const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Album() {
   const classes = useStyles();
   const [status, setStatus] = useState("");
   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
  
 async function fetchTokens(id) { //TODO: implement
	  const {tokuri} = await fetchNFT(id);
	  const tokenjson = await fetch(tokuri).then((response)=>response.json())
	  //console.log(tokenjson['name']);
	  setStatus(tokenjson['image']);
	  setName(tokenjson['name']);
	  setDescription(tokenjson['description']);
	  };
fetchTokens(1);
  return (
    <React.Fragment>
      <CssBaseline />
   <PrimarySearchAppBar>
   </PrimarySearchAppBar>
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
             NFTStore 
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
             NFTStore, NFT Everything  
	  </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary">
                    Main call to action
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary">
                    Secondary action
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={status}
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
                  <CardActions>
                    <Button size="small" color="primary">
                      View
                    </Button>
                    <Button size="small" color="primary">
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}
