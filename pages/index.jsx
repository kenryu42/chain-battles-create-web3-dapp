import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { Section } from "../layout/section";
import { MintNFT } from "../components/mintNFT";
import { TrainNFT } from "../components/trainNFT";
import { NFTGallery } from "../components/nftGallery";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
    const { address, isConnected } = useAccount();
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        setConnected(isConnected);
    }, [isConnected]);

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
                    {connected ? (
                        <>
                            <MintNFT address={address} />
                            <TrainNFT address={address} />
                            <p>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://mumbaifaucet.com/"
                                    className={styles.link}
                                >
                                    Click here to get Mumbai Faucet if you
                                    don&apos;t have one.
                                </a>
                            </p>
                        </>
                    ) : (
                        <h4>
                            Connect wallet to Mumbai Testnet (Polygon) to mint.
                        </h4>
                    )}
                </Section>
                <Section title={"Most recently received NFTs by Owner"}>
                    <NFTGallery address={address}></NFTGallery>
                </Section>
            </main>
        </div>
    );
}
