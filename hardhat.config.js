require("@nomiclabs/hardhat-waffle")
require('dotenv').config();
const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  defaultNetwork: "polygon_mumbai",
  networks: {
    hardhat: {
    },
    polygon_mumbai: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
   }
//  unused configuration commented out for now
//  mumbai: {
//    url: "https://rpc-mumbai.maticvigil.com",
//    accounts: [process.env.privateKey]
//  }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}