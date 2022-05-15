pragma solidity ^0.5.0;

import './Token.sol';

contract EthSwap {
	string public name = "EthSwap Instant Exchange";
	Token public token;
	uint public rate = 100; // Redemption rate
	event TokenPurchased(
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
		emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
	}
}
