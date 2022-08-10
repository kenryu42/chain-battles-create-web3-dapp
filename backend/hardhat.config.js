require("dotenv").config({ path: __dirname + "/.env" });
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
const privateKey = process.env.PRIVATE_KEY;
const alchemyKey = process.env.ALCHEMY_API_KEY;

module.exports = {
	solidity: "0.8.9",
	networks: {
		hardhat: {},
		polygon: {
			accounts: [process.env.PRIVATE_KEY],
			url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
		},
		mumbai: {
			accounts: [process.env.PRIVATE_KEY],
			url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
		},
	},
	etherscan: {
		apiKey: process.env.POLYGONSCAN_API_KEY,
	},
};
