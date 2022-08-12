/* eslint-disable @next/next/no-img-element */
import styles from "../styles/NFTCard.module.css";
import { useNetwork } from "wagmi";

export const NFTCard = ({ nft }) => {
    const chainName = {
        1: "ethereum",
        2: "ropsten",
        4: "rinkeby",
        5: "goerli",
        42: "kovan",
        137: "polygon",
        80001: "mumbai",
    };
    const { chain } = useNetwork();

    return (
        <div id={nft.id} className={styles.card_container}>
            <div className={styles.image_container}>
                <a
                    href={`https://testnets.opensea.io/assets/${
                        chainName[chain?.id]
                    }/${nft.contract.address}/${nft.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        alt="nft_image"
                        className={styles.image}
                        src={nft.media[0].gateway}
                    />
                </a>
            </div>

            <div className={styles.text_container}>
                <h4 className={styles.title}>{nft.title}</h4>
                <p className={styles.id}>{nft.id}</p>
                <p className={styles.description}>{nft.description}</p>
            </div>
        </div>
    );
};
