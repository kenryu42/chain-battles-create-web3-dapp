// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

// Returns the Ethers balance of a given address
async function getBalance(address) {
    const balanceBigInt = await hre.ethers.provider.getBalance(address);

    return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balance for a list of addresses
async function printBalances(addresses) {
    let idx = 0;

    for (const address of addresses) {
        const balance = await getBalance(address);
        console.log(`Address ${idx} balance: ${balance}`);
        idx++;
    }
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos) {
    for (const memo of memos) {
        console.log(
            `At ${memo.timestamp}, ${memo.name} (${memo.from}) said: "${memo.message}"`
        );
    }
}

async function main() {
    // Get example accouts.
    const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

    // Get the contract to deploy & deploy it.
    const ChainBattles = await hre.ethers.getContractFactory("ChainBattles");
    const chainBattles = await ChainBattles.deploy();

    await chainBattles.deployed();

    console.log(`ChainBattles address: ${chainBattles.address}`);

    // Check balances before the coffee purchase.
    let tx = await chainBattles.mint();
    tx.wait(1);
    console.log("== token uri ==");
    let tokenUri = await chainBattles.getTokenURI(1);
    console.log(tokenUri);
    console.log("== image uri ==");
    let imageUri = await chainBattles.generateCharacter(1);
    console.log(imageUri);
    console.log("== after training for 7 times ==");
    await chainBattles.train(1);
    await chainBattles.train(1);
    await chainBattles.train(1);
    await chainBattles.train(1);
    await chainBattles.train(1);
    await chainBattles.train(1);
    await chainBattles.train(1);
    imageUri = await chainBattles.generateCharacter(1);
    console.log(imageUri);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
