import { useState, useEffect } from "react";
import styles from "../styles/NFTGallery.module.css";
import { NFTCard } from "./nftCard";
export const NFTGallery = ({ alchemy, address, minted }) => {
	const [NFTs, setNFTs] = useState();
	useEffect(() => {
		(async () => {
			if (address) {
				console.log("looking for nfts");
				const nfts = await alchemy.nft
					.getNftsForOwner(address)
					.then((data) => data.ownedNfts);
				setNFTs(nfts);
			} else {
				setNFTs();
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address, minted]);

	return (
		<>
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
		</>
	);
};
