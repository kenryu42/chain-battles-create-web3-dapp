import { useState, useEffect } from "react";
import styles from "../styles/Mint.module.css";
import {
	usePrepareContractWrite,
	useContractWrite,
	useWaitForTransaction,
} from "wagmi";
import abi from "../utils/ChainBattles.json";
import { alchemy } from "../utils/alchemySetup";

export const TrainNFT = ({ minted, setMinted, isConnected }) => {
	const [trainedMessage, setTrainedMessage] = useState("");
	const [metadataUpdate, setMetadataUpdate] = useState("");
	const [tokenId, setTokenId] = useState(0);
	const contractAddress = "0xd40cbA702a485d09E7a055F4C190A696451007Ab";
	const { config } = usePrepareContractWrite({
		addressOrName: contractAddress,
		contractInterface: abi.abi,
		functionName: "train(uint256)",
		args: [tokenId],
		overrrides: {
			value: tokenId,
			gasLimit: 1e7,
		},
		enabled: tokenId,
	});
	const { data, write, isLoading } = useContractWrite(config);
	const [connected, setConnected] = useState(false);
	const { isFetching, isFetched } = useWaitForTransaction({
		wait: data?.wait,
		hash: data?.hash,
		onSuccess(data) {
			console.log("NFT trained!");
			console.log(`https://mumbai.polygonscan.com/tx/${data.transactionHash}`);
			setTrainedMessage("Successfully Trained! 💪");
			setMinted(!minted);
		},
	});

	const train = async () => {
		try {
			console.log("training...");
			write?.();
		} catch (error) {
			console.log("Train Failed: ", error);
		}
	};

	useEffect(() => {
		setConnected(isConnected);
	}, [isConnected]);

	useEffect(() => {
		if (isFetched) {
			const refreshMetadata = async () => {
				await alchemy.nft.refreshNftMetadata(contractAddress, tokenId);

				setMetadataUpdate(
					"Wait a few seconds and refresh the page. Or refresh metadata on opensea testnet."
				);
				console.log(`refreshed metadata for token ${tokenId}`);
			};

			refreshMetadata().catch(console.error);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFetched]);

	return (
		<>
			{connected && (
				<>
					<h4>Enter token id that you own to train.</h4>
					<input
						type="number"
						onChange={(e) => setTokenId(e.target.value)}
						value={tokenId}
					/>
					<br />
					<button
						className={styles.button}
						disabled={!write || isLoading || isFetching}
						onClick={() => train()}
					>
						{isLoading || isFetching ? "Training..." : "Train Token"}
					</button>
					<h3>{trainedMessage}</h3>
					<h3>{metadataUpdate}</h3>
				</>
			)}
		</>
	);
};
