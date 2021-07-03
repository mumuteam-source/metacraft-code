import React from 'react';
import {
	  BrowserRouter as Router,
	  Switch,
	  Route,
	  Link
} from "react-router-dom";
import Album from './Album';
import Minter from './Minter';
import Galary from './Galary';
import Fetcher from './Fetcher';
import Transer from './Transer';
import Buyer from './Buyer';
import Sales from './Sales';
import Tokens from './Tokens';
import Wither from './Wither';
import Auctions from './Auctions';
const Pages = () => {
	    return(
	   <Router>
		<Route exact path ="/" component = {Album} />
                <Route path = "/minter" component = {Minter} />
                <Route path = "/galary" component = {Galary} />
                <Route path = "/fetch" component = {Fetcher} />
                <Route path = "/sales" component = {Sales} />
		        <Route path = "/transer" component = {Transer}/>
		        <Route path = "/buy" component = {Buyer} />
		        <Route path = "/tokens" component = {Tokens} />
		        <Route path = "/withdraw" component = {Wither} />
		        <Route path = "/auctions" component = {Auctions} />
            </Router>
        );
};
export default Pages;
