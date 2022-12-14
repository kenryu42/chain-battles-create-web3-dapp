const main = async () => {
    try {
        const nftContractFactory = await hre.ethers.getContractFactory(
            "ChainBattles"
        );
        const nftContract = await nftContractFactory.deploy();
        await nftContract.deployed();

        console.log(`Deployed NFT contract at ${nftContract.address}`);
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

main();
