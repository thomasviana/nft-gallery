// SPDX-License-Identifier: MIT

pragma solidity ^0.8.14;

// Import ERC1155 token contract from Openzeppelin

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTContract is ERC1155, Ownable {
    string private _baseUri;
    string private _baseExtension = ".json";

    mapping(uint256 => string) private _uris;

    constructor(string memory _initBaseURI) ERC1155(_initBaseURI) {
        _baseUri = _initBaseURI;
    }

    function uri(uint256 tokenId) override public view returns (string memory) {
        return(string(abi.encodePacked(_baseUri, Strings.toString(tokenId),_baseExtension))
        );
    }

    function mint(address to, uint256 id, uint256 amount) public onlyOwner {
        _mint(to, id, amount, "");
    }

    function burn(address account, uint256 id, uint256 amount) public {
        require(msg.sender == account);
        _burn(account, id, amount);
    }
}