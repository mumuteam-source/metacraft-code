// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";



/**
 * @title NFTMarketTrade
 * @notice Implements the Trade of NFT Market. The market will be governed
 * by an ERC20 token as currency, and an ERC721 token that represents the
 * ownership of the items being traded. Only ads for selling items are
 * implemented. The item tokenization is responsibility of the ERC721 contract
 * which should encode any item details.
 */
contract NFTStoreTrade {
    using SafeMath for uint256;
     string public name;
      
    //optimize event on Jul. 5th.
    event TradeStatusChange(
       uint256 tokenID, 
	   bytes32 status,
	   address poster,
	   uint256 price,
	   address buyer
	   );

    IERC20 currencyToken; //Do not use currency Token just now
    IERC721 itemToken;

    uint256 public platformFee = 5;
    uint256 constant feeBase = 100;
     
   address payable public withdrawAddress;
   address private owner;

    struct Trade {
        address payable poster;
        uint256 item;
        uint256 price;
        bytes32 status; // Open, Executed, Cancelled
    }

    mapping(uint256 => Trade) public trades;

    uint256 tradeCounter;

    constructor ()
         
    {
        //currencyToken = IERC20(_currencyTokenAddress);
        //itemToken = IERC721(_itemTokenAddress);
        //tradeCounter = 0;
	name = "NFTStoreTrade";
	owner = msg.sender;
    }
    
    function setItemToken(address itemTokenAddress_) external {
        require(msg.sender==owner,"Only Owner Function!");
        itemToken = IERC721(itemTokenAddress_);
    }
    function setCurrToken(address currTokenAddress_) external {
        require(msg.sender==owner,"Only Owner Function!");
        currencyToken = IERC20(currTokenAddress_);
    }
    function setWithDraw (address withDrawTo_) external{
        require(msg.sender==owner,"Only Owner Function!");
        withdrawAddress = payable(withDrawTo_);
    }

     function setPlatformFee (uint256 platformFee_) external{
        require(msg.sender==owner,"Only Owner Function!");
        platformFee = platformFee_;
    }
    /**
     * @dev Returns the details for a trade.
     * @param _item The id for the item trade.
     */
    function getTrade(uint256 _item)
        public
        virtual
        view
        returns(address, uint256, uint256, bytes32)
    {
        Trade memory trade = trades[_item];
        return (trade.poster, trade.item, trade.price, trade.status);
    }

    /**
     * @dev Opens a new trade. Puts _item in escrow.
     * @param _item The id for the item to trade.
     * @param _price The amount of currency for which to trade the item.
     */
    function openTrade(uint256 _item, uint256 _price)
        public
        virtual
	    payable
    {
        itemToken.transferFrom(msg.sender, address(this), _item);
        trades[_item] = Trade({
            poster: payable(msg.sender),
            item: _item,
            price: _price,
            status: "Open"
        });
        //tradeCounter += 1;
        emit TradeStatusChange(_item, "Open",msg.sender,_price,address(this));
	
    }

    /**
     * @dev Executes a trade. Must have approved this contract to transfer the
     * amount of currency specified to the poster. Transfers ownership of the
     * item to the filler.
     * @param _item The id of an existing item
     */
    function executeTrade(uint256 _item)
        public
        virtual
	payable
    {
        Trade memory trade = trades[_item];
        require(trade.status == "Open", "Trade is not Open.");
	    require(msg.value>= trade.price,"Can't Lower than Sell Price");
        require(msg.sender != trade.poster,"Owner can't buy");
        itemToken.transferFrom(address(this), msg.sender, trade.item);
	uint256 perf = (msg.value).mul(platformFee).div(feeBase);
	payable(withdrawAddress).transfer(perf);
	payable(trade.poster).transfer(msg.value-perf);
	//currencyToken.transferFrom(msg.sender, trade.poster, perf);
	//currencyToken.transferFrom(msg.sender, withdrawAddress, price-perf);

        trades[_item].status = "Executed";
        emit TradeStatusChange(_item, "Executed",trade.poster,msg.value,msg.sender);
    }

    /**
     * @dev Cancels a trade by the poster.
     * @param _item The trade to be cancelled.
     */
    function cancelTrade(uint256 _item)
        public
        virtual
	payable
    {
        Trade memory trade = trades[_item];
        require(
            msg.sender == trade.poster,
            "Trade can be cancelled only by poster."
        );
        require(trade.status == "Open", "Trade is not Open.");
        itemToken.transferFrom(address(this), trade.poster, trade.item);
        trades[_item].status = "Cancelled";
        emit TradeStatusChange(_item, "Cancelled", address(this),0,msg.sender);
    }

    /**
    **withdraw
    **
    **
    **/
    function totalBalance() external view returns(uint) {
     //return currencyToken.balanceOf(address(this));
      return payable(address(this)).balance;
   }

   function withdrawFunds() external withdrawAddressOnly() {
     //currencyToken.transferFrom(address(this),msg.sender, currencyToken.balanceOf(address(this)));
       payable(msg.sender).transfer(this.totalBalance());
   }

   modifier withdrawAddressOnly() {
     require(msg.sender == withdrawAddress, 'only withdrawer can call this');
   _;
   }

   function destroy() virtual public {
	require(msg.sender == owner,"Only the owner of this Contract could destroy It!");
        if (msg.sender == owner) selfdestruct(payable(owner));
    }
   
}