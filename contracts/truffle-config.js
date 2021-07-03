const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = "guilt sail mule grape enough estate trade panel snap asset carbon sauce";
const infuraProjectId = "cb0bceb7d1e44d089cfa70d1972ca633";
module.exports = {

  
  networks: {
   
	//rinkeby: {
    //  provider: function() {
    //    return new HDWalletProvider(
    //        "0x40ea8849ef395e83c7406c19ca88605e86d9bc1b4c8d1e48b876c435c0fe18f7", 
    //        "https://rinkeby.infura.io/v3/b7129dcc2da54454810a53dd5b6632ed"
     //   )
    //  },
   //   network_id: 4
   // }

   mumbai: {
       provider: () => new HDWalletProvider({
        mnemonic: {
          phrase: mnemonic
        },
        providerOrUrl:  `https://rpc-mumbai.matic.today`,
        chainId: 80001
      }),
      network_id: 80001,
      confirmations: 2,
	  networkCheckTimeout: 1000000,
      timeoutBlocks: 200,
      skipDryRun: true,
	  chainId: 80001
    },
   
	 mumbai_infura: {
        provider: () => new HDWalletProvider({
        mnemonic: {
          phrase: mnemonic
        },
        providerOrUrl:
         "https://polygon-mumbai.infura.io/v3/" + infuraProjectId
      }),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
	  chainId: 80001
    },
   
  },
 // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

 // Configure your compilers
  compilers: {
    solc: {
       version: "0.8.1",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },

  // Truffle DB is currently disabled by default; to enable it, change enabled: false to enabled: true
  //
  // Note: if you migrated your contracts prior to enabling this field in your Truffle project and want
  // those previously migrated contracts available in the .db directory, you will need to run the following:
  // $ truffle migrate --reset --compile-all

	  db: {
	   enabled: false
	   },
	  plugins: [
		'truffle-plugin-verify'
		 ],
	 api_keys: {
	 etherscan: 'XRYQIX9YG4GYP4DTYUTA894U33UX41XCQF'
	 }
};
