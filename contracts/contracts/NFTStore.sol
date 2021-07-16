// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
/**
 * @title NFTStore
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 */
contract NFTStore is Context, ERC20 {

    address private owner;
    struct Mints {
        address minter;
	//uint256 tokenId,
	uint256 amount;
    }

    mapping(uint256 => Mints) public tokenToMint;
    mapping(uint256 => uint256) private tokenAmounts;
    /**
     * @dev Constructor that gives _msgSender() all of existing tokens.
     */
    constructor (uint256 tokenNum) public ERC20("NFTStore", "NFC") {
        owner = msg.sender;
        _mint(_msgSender(), tokenNum * (10 ** uint256(decimals())));
    }

   function mint(
        address _to,
        uint256 amount,
	uint256 tokenId
    )
    public
    {
     _mint( _to, amount) ;
     tokenAmounts[tokenId] = amount;
     Mints memory mintted = Mints({
            minter: _to,
            amount: amount
        });
     tokenToMint[tokenId]=mintted;
    }

    function getTokenAmount (
    uint256 tokenId 
    )public
    view
    returns (uint256) {
    return tokenAmounts[tokenId];
    }
    function getTokenAmount1 (
    uint256 tokenId 
    )public
    view
    returns (uint256) {
    return tokenAmounts[tokenId];
    }
    function gettokenMints(
     uint256 tokenId
    )
    public
    view
    returns ( address, uint256){
    Mints memory mintted = tokenToMint[tokenId]; 
    return (mintted.minter,mintted.amount);
    }
    
    function destroy() virtual public {
	require(msg.sender == owner,"Only the owner of this Contract could destroy It!");
        selfdestruct(payable(owner));
    }
   

}
