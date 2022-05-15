pragma solidity ^0.5.0;

import './Token.sol';

contract EthSwap {
	string public name = "EthSwap Instant Exchange";
	Token public token;
	uint public rate = 100; // Redemption rate

	event TokensPurchased (
		address account,
		address token,
		uint amount,
		uint rate
	);

	event TokensSold (
		address account,
		address token,
		uint amount,
		uint rate
	);

	constructor(Token _token) public {
		token = _token;
	}

	function buyTokens() public payable{
		// number of tokens to be bought
		uint tokenAmount = rate * msg.value;

		require(token.balanceOf(address(this)) >= tokenAmount );

		token.transfer(msg.sender, tokenAmount);

		// Emit an event to blockchain
		emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
	}

	function sellTokens(uint _amount) public {
		require(token.balanceOf(msg.sender) >= _amount);
		// Ether amount to be refunded to the investor
		uint etherAmount = _amount/rate;
		
		// Check Ethswap has enough ether
		require(address(this).balance >= etherAmount ); 
		// Perform Sale transaction
		token.transferFrom(msg.sender, address(this), _amount);
		msg.sender.transfer(etherAmount);

		emit TokensSold(msg.sender, address(token), _amount, rate);
	}
}
