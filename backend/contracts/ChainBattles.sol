// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/// @title An on-chain metadata ERC721 token implementation
/// @author kenryu
/// @notice Alchemy Road to Web3 Week 3 project
/// @dev All function calls are currently implemented without proper testing, please use at your own risk.
/// @custom:experimental This is an experimental contract.
contract ChainBattles is ERC721URIStorage {
	// Custom Errors
	error NotOwner();
	error InvalidTokenId();

	// Events
	event NewMint(address indexed owner, uint256 tokenId, string tokenUri);
	event Trained(address indexed owner, uint256 tokenId, string tokenUri);

	using Strings for uint256;
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;

	// Character stats
	struct Stat {
		string class;
		uint256 level;
		uint256 hp;
		uint256 mp;
		uint256 str;
		uint256 mag;
		uint256 agi;
	}
	// Character classes
	string[] public classes = [
		"Swordman",
		"Mage",
		"Knight",
		"Thief",
		"Acolyte"
	];
	// Mapping of tokenId to character stats
	mapping(uint256 => Stat) public tokenIdtoStat;

	constructor() ERC721("Chain Battles", "CBTLS") {}

	/// @notice Mint a new tokenId
	function mint() external {
		_tokenIds.increment();
		uint256 newItemId = _tokenIds.current();
		_safeMint(msg.sender, newItemId);
		initializeStat(newItemId);
		string memory tokenuri = getTokenURI(newItemId);
		_setTokenURI(newItemId, tokenuri);
		emit NewMint(msg.sender, newItemId, tokenuri);
	}

	/// @notice Train a character and update its token URI
	/// @param tokenId The tokenId of the character to train
	function train(uint256 tokenId) external {
		if (!_exists(tokenId)) revert InvalidTokenId();
		if (ownerOf(tokenId) != msg.sender) revert NotOwner();

		levelUpStat(tokenId);
		string memory tokenUri = getTokenURI(tokenId);
		_setTokenURI(tokenId, tokenUri);
		emit Trained(msg.sender, tokenId, tokenUri);
	}

	/// @notice Generate a svg image of a character
	/// @param tokenId The tokenId of the character to generate an image of
	/// @return Base64 encoded svg image string
	function generateCharacter(uint256 tokenId)
		public
		view
		returns (string memory)
	{
		bytes memory svg = abi.encodePacked(
			'<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
			"<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>",
			'<rect width="100%" height="100%" fill="black" />',
			'<text x="50%" y="20%" class="base" dominant-baseline="middle" text-anchor="middle">',
			getStat(tokenId).class,
			"</text>",
			'<text x="50%" y="30%" class="base" dominant-baseline="middle" text-anchor="middle">',
			"Level: ",
			getStat(tokenId).level.toString(),
			"</text>",
			'<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">',
			"HP: ",
			getStat(tokenId).hp.toString(),
			"</text>",
			'<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">',
			"MP: ",
			getStat(tokenId).mp.toString(),
			"</text>",
			'<text x="50%" y="60%" class="base" dominant-baseline="middle" text-anchor="middle">',
			"STR: ",
			getStat(tokenId).str.toString(),
			"</text>",
			'<text x="50%" y="70%" class="base" dominant-baseline="middle" text-anchor="middle">',
			"INT: ",
			getStat(tokenId).mag.toString(),
			"</text>",
			'<text x="50%" y="80%" class="base" dominant-baseline="middle" text-anchor="middle">',
			"AGI: ",
			getStat(tokenId).agi.toString(),
			"</text>",
			"</svg>"
		);

		return
			string(
				abi.encodePacked(
					"data:image/svg+xml;base64,",
					Base64.encode(svg)
				)
			);
	}

	/// @notice Get the character stats of a tokenId
	/// @param tokenId The tokenId of the character to get the stats of
	/// @return The character stats of the tokenId
	function getStat(uint256 tokenId) public view returns (Stat memory) {
		return tokenIdtoStat[tokenId];
	}

	// prettier-ignore
	function getTokenURI(uint256 tokenId) public view returns (string memory){
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "Chain Battles #', tokenId.toString(), '",',
                '"description": "Battles on chain",',
                '"image": "', generateCharacter(tokenId), '",',
                '"attributes": [',
                    '{',
                        '"trait_type": "Class",',
                        '"value": "', getStat(tokenId).class, '"',
                    '},',
                    '{',
                        '"trait_type": "Level",',
                        '"value": "', getStat(tokenId).level.toString(), '"',
                    '},',
                    '{',
                        '"trait_type": "HP",',
                        '"value": "', getStat(tokenId).hp.toString(), '"',
                    '},',
                    '{',
                        '"trait_type": "MP",',
                        '"value": "', getStat(tokenId).mp.toString(), '"',
                    '},',
                    '{',
                        '"trait_type": "STR",',
                        '"value": "', getStat(tokenId).str.toString(), '"',
                    '},',
                    '{',
                        '"trait_type": "INT",',
                        '"value": "', getStat(tokenId).mag.toString(), '"',
                    '},',
                    '{',
                        '"trait_type": "AGI",',
                        '"value": "', getStat(tokenId).agi.toString(), '"',
                    '}',
                ']',
            '}'
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

	/// @notice Pseudo-random number generator
	/// @dev  Anyone who figures out how your contract produces randomness can anticipate its results.
	/// @return Pseudo-random uint256 number
	function rand() private view returns (uint256) {
		uint256 seed = uint256(
			keccak256(
				abi.encodePacked(
					block.timestamp +
						block.difficulty +
						((
							uint256(keccak256(abi.encodePacked(block.coinbase)))
						) / (block.timestamp)) +
						block.gaslimit +
						((uint256(keccak256(abi.encodePacked(msg.sender)))) /
							(block.timestamp)) +
						block.number
				)
			)
		);

		return (seed - ((seed / 1000) * 1000));
	}

	/// @notice Initialize the character stats of a tokenId with random values
	/// @param tokenId The tokenId of the character to initialize the stats of
	function initializeStat(uint256 tokenId) private {
		uint256 randSeed = rand();
		uint256 baseStat = (randSeed % 5) + 1;

		tokenIdtoStat[tokenId] = Stat({
			class: classes[randSeed % 5],
			level: 1,
			hp: baseStat % 2 == 0 ? baseStat + 0 : baseStat + 2,
			mp: baseStat % 2 == 0 ? baseStat + 1 : baseStat + 0,
			str: baseStat % 2 == 0 ? baseStat + 1 : baseStat + 0,
			mag: baseStat % 2 == 0 ? baseStat + 1 : baseStat + 2,
			agi: baseStat % 2 == 0 ? baseStat + 0 : baseStat + 1
		});
	}

	/// @notice Add stat bonus according to character class
	/// @param tokenId The tokenId of the character to add the stat bonus to
	function addClassBonus(uint256 tokenId) private {
		if (equal(tokenIdtoStat[tokenId].class, "Swordman")) {
			tokenIdtoStat[tokenId].str += 2;
		} else if (equal(tokenIdtoStat[tokenId].class, "Mage")) {
			tokenIdtoStat[tokenId].mag += 2;
		} else if (equal(tokenIdtoStat[tokenId].class, "Knight")) {
			tokenIdtoStat[tokenId].hp += 2;
		} else if (equal(tokenIdtoStat[tokenId].class, "Thief")) {
			tokenIdtoStat[tokenId].agi += 2;
		} else if (equal(tokenIdtoStat[tokenId].class, "Acolyte")) {
			tokenIdtoStat[tokenId].mp += 2;
		}
	}

	/// @notice Update a character stats of a tokenId
	/// @param tokenId The tokenId of the character to level up the stats of
	function levelUpStat(uint256 tokenId) private {
		++tokenIdtoStat[tokenId].level;

		uint256 randSeed = rand();
		uint256 levelUpPoints = (randSeed % 3) + 1;

		tokenIdtoStat[tokenId].hp += levelUpPoints;
		tokenIdtoStat[tokenId].mp += levelUpPoints;
		tokenIdtoStat[tokenId].str += levelUpPoints;
		tokenIdtoStat[tokenId].mag += levelUpPoints;
		tokenIdtoStat[tokenId].agi += levelUpPoints;
		addClassBonus(tokenId);
	}

	/// @notice Compare two strings
	/// @return Boolean value indicating whether the strings are equal
	function equal(string memory s1, string memory s2)
		private
		pure
		returns (bool)
	{
		return
			keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
	}
}
