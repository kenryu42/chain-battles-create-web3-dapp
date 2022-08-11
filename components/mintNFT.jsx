import { useState, useEffect } from "react";
import styles from "../styles/Mint.module.css";
import {
	usePrepareContractWrite,
	useContractWrite,
	useWaitForTransaction,
} from "wagmi";
import abi from "../utils/ChainBattles.json";

export const MintNFT = ({ minted, setMinted, isConnected }) => {
	const [mintedMessage, setMintedMessage] = useState("");
	const contractAddress = "0xd40cbA702a485d09E7a055F4C190A696451007Ab";
	const { config } = usePrepareContractWrite({
		addressOrName: contractAddress,
		contractInterface: abi.abi,
		functionName: "mint",
		overrides: {
			gasLimit: 1e7,
		},
	});
	const { data, write, isLoading } = useContractWrite(config);
	const [connected, setConnected] = useState(false);
	const { isFetching } = useWaitForTransaction({
		wait: data?.wait,
		hash: data?.hash,
		onSuccess(data) {
			console.log("NFT minted!");
			console.log(`https://mumbai.polygonscan.com/tx/${data.transactionHash}`);
			setMintedMessage("Minted successfully! 💙");
			setMinted(!minted);
		},
	});
	const mint = async () => {
		try {
			console.log("minting...");
			write?.();
		} catch (error) {
			console.log("Mint Failed: ", error);
		}
	};

	useEffect(() => {
		setConnected(isConnected);
	}, [isConnected]);

	return (
		<>
			{connected ? (
				<>
					<button
						className={styles.button}
						disabled={!write || isLoading || isFetching}
						onClick={() => mint()}
					>
						{isLoading || isFetching ? "Minting..." : "Mint Token"}
					</button>
					<h3>{mintedMessage}</h3>
				</>
			) : (
				<h4>Connect wallet to Mumbai Testnet (Polygon) to mint.</h4>
			)}
		</>
	);
};
