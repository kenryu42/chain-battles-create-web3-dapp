import useSWR from "swr";
import { NFTCard } from "./nftCard";
import styles from "../styles/NFTGallery.module.css";

const fetcher = (url) => fetch(url).then((r) => r.json());

export const NFTGallery = ({ address }) => {
    const { data: NFTs } = useSWR(
        address ? `/api/getNfts/${address}` : null,
        fetcher
    );

    return (
        <div className={styles.nft_gallery}>
            {NFTs ? (
                NFTs.slice(Math.max(NFTs.length - 4, 0))
                    .reverse()
                    .map((NFT, idx) => {
                        return <NFTCard nft={NFT} key={idx} />;
                    })
            ) : (
                <p>Connect your wallet to see your NFTs</p>
            )}
        </div>
    );
};
