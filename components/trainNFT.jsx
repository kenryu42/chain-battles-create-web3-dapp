import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import abi from "../utils/ChainBattles.json";
import styles from "../styles/Mint.module.css";
import {
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction,
} from "wagmi";

const fetcher = (url) => fetch(url).then((r) => r.json());

export const TrainNFT = ({ address }) => {
    const { mutate } = useSWRConfig();
    const [link, setLink] = useState("");
    const [tokenId, setTokenId] = useState(0);
    const [trainedMessage, setTrainedMessage] = useState("");
    const contractAddress = "0xd40cbA702a485d09E7a055F4C190A696451007Ab";

    const { config } = usePrepareContractWrite({
        addressOrName: contractAddress,
        contractInterface: abi.abi,
        functionName: "train(uint256)",
        args: [tokenId],
        overrides: {
            gasLimit: 1e7,
        },
        enabled: tokenId,
    });

    const { data, write, isLoading } = useContractWrite(config);

    const { isFetching, isFetched } = useWaitForTransaction({
        wait: data?.wait,
        hash: data?.hash,
        onSuccess(data) {
            console.log("NFT trained!");
            const txnLink = `https://mumbai.polygonscan.com/tx/${data.transactionHash}`;
            console.log(txnLink);
            setTrainedMessage(`Successfully Trained Token Id: ${tokenId} 💪`);
            setLink(txnLink);
            mutate(`/api/getNfts/${address}`);
        },
    });
    useSWR(
        isFetched ? `/api/refreshNft/${contractAddress}/${tokenId}` : null,
        fetcher
    );

    const train = async () => {
        try {
            console.log("training...");
            write?.();
        } catch (error) {
            console.log("Train Failed: ", error);
        }
    };

    return (
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
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
            >
                {link}
            </a>
            {isFetched && (
                <h3>
                    Refresh the metadata on the Opensea Testnet to see the
                    changes.
                </h3>
            )}
        </>
    );
};
