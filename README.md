NFT-Store has deployed in [polygon](https://polygon.technology)  mumbai network. 
with  ERC20 Tokens to sell/buy, auction/bid, transfer ERC721 tokens,trade history

# NFTStore -  Everything Can be turned into NFT

NFTStore.Top is a world leading multi-ecosystem, cross-chain one-stop service and trading platform
NFTStore has Multiple NFT Data source and Creation Tools. include Video/Music/Picture Creation Tool,URL/Webpage Creation Tool,Browser Plugins,etc

## Basic ERC721, ERC20 contracts and  frontend scripts

What's included:

### Sample ERC721/ERC20 Contracts

This includes basic ERC721 / ERC20 for the purposes of demonstrating integration with the NFTStore marketplace. We include a frontend script for minting and listing the items in Nftstore.

### frontend scripts

In addition to these template 721/20 contracts, we provide sample nftstore frontend script code.

## Requirements

### Node version

Either make sure you're running a version of node compliant with the `engines` requirement in `package.json`, or install Node Version Manager [`nvm`](https://github.com/creationix/nvm) and run `nvm use` to use the correct version of node.

## Installation

Run

```bash
yarn
```

If you run into an error while building the dependencies and you're on a Mac, run the code below, remove your `node_modules` folder, and do a fresh `yarn install`:

```bash
xcode-select --install # Install Command Line Tools if you haven't already.
sudo xcode-select --switch /Library/Developer/CommandLineTools # Enable command line tools
sudo npm explore npm -g -- npm install node-gyp@latest # Update node-gyp
```

## Deploying

### Deploying to the Rinkeby network.

1. To access a Rinkeby testnet node, you'll need to sign up for [Alchemy] and get a free API key. Click "View Key" and then copy the part of the URL after `v2/`.
   a. You can use [Infura](https://infura.io) if you want as well. Just change `ALCHEMY_KEY` below to `INFURA_KEY`.
2. Using your API key and the mnemonic for your Metamask wallet (make sure you're using a Metamask seed phrase that you're comfortable using for testing purposes), run:

```
export ALCHEMY_KEY="<your_alchemy_project_id>"
export MNEMONIC="<metmask_mnemonic>"
DEPLOY_CREATURES_SALE=1 yarn truffle deploy --network rinkeby
```

### Minting tokens.

After deploying to the Rinkeby network, there will be a contract on Rinkeby that will be viewable on [Rinkeby Etherscan]. You should set this contract address and the address of your Metamask account as environment variables when running the minting script. 

```
export OWNER_ADDRESS="<my_address>"
export NFT_CONTRACT_ADDRESS="<deployed_contract_address>"
export NETWORK="rinkeby"
node src/pages/minter.js
```

