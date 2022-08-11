import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { NFTGallery } from "../components/nftGallery";
import { MintNFT } from "../components/mintNFT";
import { TrainNFT } from "../components/trainNFT";
import { Section } from "../layout/section";
import { alchemy } from "../utils/alchemySetup";

export default function Home() {
	const { address, isConnected } = useAccount();
	const [minted, setMinted] = useState(false);

	return (
		<div>
			<header className={styles.header_container}>
				<div className={styles.navbar}>
					<ConnectButton></ConnectButton>
				</div>
				<div className={styles.logo_container}>
					<Image
						src={"/logo.svg"}
						width="150"
						height="150"
						alt="Alchemy logo"
					></Image>
					<h1>Alchemy Road to Web3 Week 3</h1>
				</div>
			</header>
			<main className={styles.main}>
				<Section title={"Chain Battles! 🥷"}>
					<MintNFT
						minted={minted}
						setMinted={setMinted}
						isConnected={isConnected}
					/>
					<TrainNFT
						minted={minted}
						setMinted={setMinted}
						isConnected={isConnected}
					/>
					<a
						target="_blank"
						rel="noopener noreferrer"
						href="https://mumbaifaucet.com/"
						className={styles.link}
					>
						Click here to get Mumbai Faucet if you don&apos;t have one.
					</a>
				</Section>
				<Section title={"Most recently received NFTs by Owner"}>
					<NFTGallery
						alchemy={alchemy}
						address={address}
						minted={minted}
					></NFTGallery>
				</Section>
			</main>
		</div>
	);
}
