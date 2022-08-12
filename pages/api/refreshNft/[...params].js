import { alchemy } from "../../../utils/alchemySetup";

export default async function handler(req, res) {
    const { params } = req.query;
    const [contractAddress, tokenId] = params;

    console.log(`refreshing token id ${tokenId} metadata`);
    const result = await alchemy.nft.refreshNftMetadata(
        contractAddress,
        tokenId
    );
    console.log(typeof result);
    console.log(`result: ${result}`);

    res.status(200).json(result);
}
