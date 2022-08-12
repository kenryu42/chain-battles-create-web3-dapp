import { alchemy } from "../../../utils/alchemySetup";

export default async function handler(req, res) {
    const { address } = req.query;
    console.log("looking for nfts");
    const nfts = await alchemy.nft
        .getNftsForOwner(address)
        .then((data) => data.ownedNfts);

    res.status(200).json(nfts);
}
