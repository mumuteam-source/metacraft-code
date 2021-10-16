// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract NFTStoreAuction {
    string public name;
    IERC20 public currToken;
    IERC721 public itemToken;
    address private owner;
    struct Auction {
        address seller;
        uint128 price;
        uint256 tokenId;
        uint256 startTime;
        uint256 endTime;
        uint256 highestBid;
        address highestBidder;
        bool finished;
        bool active;
    }
    
     struct Bidder {
        address addr;
        uint256 amount;
        uint256 bidAt;
    }

    uint256 public totalHoldings = 0;
     
    uint256 public platformFee = 5;
    uint256 constant feePercentage = 100;
    Auction[] public auctions;
    Bidder[] public bidders;
    
    mapping(uint256 => Auction) public tokenIdToAuction;
    mapping(uint256 => uint256) public tokenIdToIndex;
    mapping(address => Auction[]) public auctionOwner;
    mapping(uint256 => Bidder[]) public tokenIdToBidder;
    
    constructor() {
       // currToken = IERC20(_currTokenAddress);
        //itemToken = IERC721(_itemTokenAddress);
	name = "NFTStoreAuction";
	owner = msg.sender;
    }
    function setItemToken(address itemTokenAddress_) external {
        require(msg.sender==owner,"Only Owner Function!");
        itemToken = IERC721(itemTokenAddress_);
    }
    function setCurrToken(address currTokenAddress_) external {
        require(msg.sender==owner,"Only Owner Function!");
        currToken = IERC20(currTokenAddress_);
    }
    function setWithDraw (address withDrawTo_) external{
        require(msg.sender==owner,"Only Owner Function!");
        withdrawAddress = withDrawTo_;
    }
    function setRecipAddr (address recipAddr_) external{
        require(msg.sender==owner,"Only Owner Function!");
        recipientAddr = recipAddr_;
    }

    function setPlatformFee (uint256 platformFee_) external{
        require(msg.sender==owner,"Only Owner Function!");
        platformFee = platformFee_;
    }
     event AuctionStatusChange(
	   uint256 tokenID, 
	   bytes32 status,
	   address indexed poster,
	   uint256 price,
	   address indexed buyer,
	   uint256 startTime,
	   uint256 endTime
	   
    );
     event AuctionCreated(
        uint256 _tokenId,
        address indexed _seller,
        uint256 _value
    );
    event AuctionCanceled(uint256 _tokenId);
    
    event AuctionBidden(
        uint256 _tokenId,
        address indexed _bidder,
        uint256 _amount
    );
    event AuctionFinished(
        uint256 _tokenId, 
        address indexed _awarder, 
        uint256 price
        );
    
    address public withdrawAddress;
    address public recipientAddr;
    
     
    function createAuction(
        uint256 _tokenId,
        uint128 _price,
        uint256 _startTime,
        uint256 _endTime
    ) public {
        require(
            msg.sender == itemToken.ownerOf(_tokenId),
            "Should be the owner of token"
        );
        require(_startTime >= block.timestamp);
        require(_endTime >= block.timestamp);
        require(_endTime > _startTime);

        itemToken.transferFrom(msg.sender, address(this), _tokenId);
        
        Auction memory auction =
            Auction({
                seller: msg.sender,
                price: _price,
                tokenId: _tokenId,
                startTime: _startTime,
                endTime: _endTime,
                highestBid: 0,
                highestBidder: address(0x0),
                finished:false,
                active:true
        });
        tokenIdToAuction[_tokenId] = auction;
        auctions.push(auction);
        
        auctionOwner[msg.sender].push(auction);
       //emit AuctionCreated(_tokenId,msg.sender,_price);
	emit AuctionStatusChange(_tokenId,"Create",msg.sender,_price,address(this),_startTime,_endTime);
    }
    
    function bidAuction(uint256 _tokenId) public payable {
        require(isBidValid(_tokenId, msg.value));
        Auction memory auction = tokenIdToAuction[_tokenId];
        if(block.timestamp> auction.endTime) revert();

	require(msg.sender != auction.seller, "Owner can't bid");
        
        uint256 highestBid = auction.highestBid;
	address highestBidder = auction.highestBidder;
        require(msg.value > auction.highestBid);
        //require(balanceOf(msg.sender) >=msg.value, "insufficient balance");
	require(payable(msg.sender).balance >=msg.value, "insufficient balance");
        if (msg.value > highestBid) {
            tokenIdToAuction[_tokenId].highestBid = msg.value;
            tokenIdToAuction[_tokenId].highestBidder = msg.sender;
	    //require(currToken.approve(address(this), price), "Approve has failed");
            //currToken.transferFrom(msg.sender,address(this),price);
             // refund the last bidder
            if( highestBid > 0 ) {
		//require(currToken.approve(address(this), highestBid), "Approve has failed");
		//currToken.transferFrom(address(this),highestBidder, highestBid);
		payable(highestBidder).transfer(highestBid);
            }

	    Bidder memory bidder =  
            Bidder({
                addr:msg.sender, 
                amount:msg.value, 
                bidAt:block.timestamp
            });
            
            tokenIdToBidder[_tokenId].push(bidder);
            //emit AuctionBidden(_tokenId, msg.sender, msg.value);
	    emit AuctionStatusChange(_tokenId,"Bid",address(this),msg.value,msg.sender,block.timestamp,block.timestamp);
        }
    }

    function finishAuction(uint256 _tokenId) public payable {
        Auction memory auction = tokenIdToAuction[_tokenId];
        require(
           msg.sender == auction.seller,
           "Should only be called by the seller"
        );
        require(block.timestamp >= auction.endTime);
        uint256 _bidAmount = auction.highestBid;
        address _bider = auction.highestBidder;
        
        if(_bidAmount == 0) {
            cancelAuction(_tokenId);
        } else {
	
            //require(currToken.approve(address(this), _bidAmount), "Approve has failed"); 
            uint256 receipientAmount =
                (_bidAmount * platformFee) / feePercentage;
            uint256 sellerAmount = _bidAmount - receipientAmount;
	    //currToken.transferFrom(address(this),recipientAddr, receipientAmount);
	    //currToken.transferFrom(address(this),auction.seller,sellerAmount);
	     payable(recipientAddr).transfer(receipientAmount);
         payable(auction.seller).transfer(sellerAmount);

            itemToken.transferFrom(address(this), _bider, _tokenId);
    	    tokenIdToAuction[_tokenId].finished = true;
    	    tokenIdToAuction[_tokenId].active = false;
	    delete tokenIdToBidder[_tokenId];
	    //emit AuctionFinished(_tokenId, _bider,_bidAmount);
	    emit AuctionStatusChange(_tokenId,"Finish",address(this),_bidAmount,_bider,block.timestamp,block.timestamp);
        }
    }
    
    
   

    function isBidValid(uint256 _tokenId, uint256 _bidAmount)
        internal
        view
        returns (bool)
    {
        Auction memory auction = tokenIdToAuction[_tokenId];
        uint256 startTime = auction.startTime;
        uint256 endTime = auction.endTime;
        address seller = auction.seller;
        uint128 price = auction.price;	
        
        bool withinTime =
            block.timestamp >= startTime && block.timestamp <= endTime;
        bool bidAmountValid = _bidAmount >= price;
        bool sellerValid = seller != address(0);
        return withinTime && bidAmountValid && sellerValid;
    }

    function getAuction(uint256 _tokenId)
    public
    view
    returns (address, 
        uint128,
        uint256,
        uint256,
        uint256,
        uint256,
        address,
	bool,
	bool)
	  {
	     Auction memory auction = tokenIdToAuction[_tokenId];
	     return (auction.seller,
	     auction.price,
	     auction.tokenId,
	     auction.startTime,
	     auction.endTime,
	     auction.highestBid,
	     auction.highestBidder,
	     auction.finished,
	     auction.active);
	  }
	  
    function getBidders(uint256 _tokenId)
    public
    view
    returns (
        Bidder[] memory 
       )
	  {
	     Bidder[] memory biddersOfToken = tokenIdToBidder[_tokenId];
	     return (biddersOfToken);
	  }
    
   
   function cancelAuction(uint256 _tokenId)
    public
    {
	Auction memory auction = tokenIdToAuction[_tokenId];
	require(
            msg.sender == auction.seller,
            "Auction can be cancelled only by seller."
        );
	uint256 amount = auction.highestBid;
	address bidder = auction.highestBidder;
       // require(block.timestamp <= auction.endTime, "Only be canceled before end");
       
        itemToken.transferFrom(address(this), msg.sender, _tokenId);
        
        //refund losers funds
        
        // if there are bids refund the last bid
        if( amount > 0 ) {
	    //require(currToken.approve(address(this), amount), "Approve has failed"); 
            //currToken.transferFrom(address(this),bidder,amount);
	     payable(bidder).transfer(amount);
  
        }
        
        tokenIdToAuction[_tokenId].active=false;
	delete tokenIdToBidder[_tokenId];
        //emit AuctionCanceled(_tokenId);
	emit AuctionStatusChange(_tokenId,"Cancel",address(this),0, auction.seller,block.timestamp,block.timestamp);
    }
    
    
     /**
    * @dev Gets an array of owned auctions
    * @param _tokenId uint of the Token
    * @return amount uint256, address of last bidder
    */
    function getCurrentBid(uint256 _tokenId) public view returns(address,uint256,uint256) {
        uint bidsLength = tokenIdToBidder[_tokenId].length;
        // if there are bids refund the last bid
        if( bidsLength > 0 ) {
            Bidder memory lastBid = tokenIdToBidder[_tokenId][bidsLength - 1];
            return (lastBid.addr,lastBid.amount,lastBid.bidAt);
        }
        return ( address(0),uint256(0),uint256(0));
    }
    
     /**
    * @dev Gets an array of owned auctions
    * @param _owner address of the auction owner
    */
    function getAuctionsOf(address _owner) public view returns(Auction[] memory) {
        Auction[] memory ownedAuctions = auctionOwner[_owner];
        return ownedAuctions;
    }
    
    
    /**
    * @dev Gets the total number of auctions owned by an address
    * @param _owner address of the owner
    * @return uint total number of auctions
    */
    function getAuctionsCountOfOwner(address _owner) public view returns(uint) {
        return auctionOwner[_owner].length;
    }
    
     /**
    * @dev Gets the length of auctions
    * @return uint representing the auction count
    */
    function getCount() public view returns(uint) {
        return auctions.length;
    }

    /**
    * @dev Gets the bid counts of a given auction
    * @param _tokenId uint ID of the auction
    */
    function getBidsCount(uint256 _tokenId) public view returns(uint) {
        return tokenIdToBidder[_tokenId].length;
    }

     /**
    **withdraw
    **
    **
    **/
    function totalBalance() external view returns(uint) {
     //return currToken.balanceOf(address(this));
     return payable(address(this)).balance;
     }

   function withdrawFunds() external withdrawAddressOnly() {
     //require(currToken.approve(address(this), this.totalBalance()), "Approve has failed"); 
     //currToken.transferFrom(address(this),msg.sender, this.totalBalance());
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