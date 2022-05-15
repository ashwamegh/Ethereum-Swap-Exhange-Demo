const { assert } = require('chai');

const Token = artifacts.require('Token');
const EthSwap = artifacts.require('EthSwap');

require('chai').use(require('chai-as-promised')).should()

function tokens(num) {
	return web3.utils.toWei(num, 'ether');
}

contract('EthSwap', ([deployer, investor]) => {
	let token, ethSwap;
	const totalSuppply = '1000000';

	before(async() => {
		token = await Token.new();
		ethSwap = await EthSwap.new(token.address);
		await token.transfer(ethSwap.address, tokens(totalSuppply));
	})

	describe('Token Deployment', () => {
		it('contract has a name', async () => {
		
		const name = await token.name();
			assert.equal(name, 'DApp Token')
		})
	})


	describe('EthSwap Deployment', () => {
		it('contract has a name', async () => {
			const name = await ethSwap.name();
			assert.equal(name, 'EthSwap Instant Exchange')
		})

		it('contract has tokens', async () => {
			const ethSwapBalance = await token.balanceOf(ethSwap.address);
			assert.equal(ethSwapBalance.toString(), tokens(totalSuppply))
		})
	})

	describe('Buy Tokens', () => {
		let result;
		before(async () => {
			// const investorBalance = await token.balanceOf(investor);
			// const ethSwapBalance = await token.balanceOf(ethSwap.address);
			// console.log("Before Purchase, Investor Balance: ", investorBalance.toString())
			// console.log("Before Purchase, EthSwap Balance: ", ethSwapBalance.toString())
			result = await ethSwap.buyTokens({ from : investor, value: tokens('1') });
		})
		it('Allows user to instantly purchase tokens from ethswap for a fixed price', async () => {
			const investorBalance = await token.balanceOf(investor);
			assert.equal(investorBalance.toString(), tokens('100'))

			let ethSwapBalance 
			ethSwapBalance = await token.balanceOf(ethSwap.address);
			// console.log("EthSwap Token balance check", ethSwapBalance.toString());
			assert.equal(ethSwapBalance.toString(), tokens('999900'))

			ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
			// console.log("EthSwap Ether balance check", ethSwapBalance.toString());
			assert.equal(ethSwapBalance.toString(), tokens('1'))
			// const deployerTokenBalance = await token.balanceOf('0x83D9F9E3498BE15aBd1240d2811715370A1B2f1a');
			// console.log("Deployer DappToken Token balance check", deployerTokenBalance.toString());
			// const deployerEtherBalance = await web3.eth.getBalance('0x83D9F9E3498BE15aBd1240d2811715370A1B2f1a');
			// console.log("Deployer DappToken Ether balance check", deployerEtherBalance.toString());
			
			const event = result.logs[0].args;
			assert.equal(event.account, investor);
			assert.equal(event.token, token.address);
			assert.equal(event.amount.toString(), tokens('100').toString());
			assert.equal(event.rate.toString(), '100');
		})
	})

	describe('Sell Tokens', () => {
		let result;
		before(async () => {
			await token.approve(ethSwap.address, tokens('100'), { from : investor })
			result = await ethSwap.sellTokens(tokens('100'), { from : investor });
		})
		it('Allows user to instantly sell tokens to ethswap for a fixed price', async () => {
			let investorBalance = await token.balanceOf(investor);
			assert.equal(investorBalance.toString(), tokens('0'));

			let ethSwapBalance 
			ethSwapBalance = await token.balanceOf(ethSwap.address);
			assert.equal(ethSwapBalance.toString(), tokens('1000000'))

			ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
			assert.equal(ethSwapBalance.toString(), tokens('0'))

			const event = result.logs[0].args;
			assert.equal(event.account, investor);
			assert.equal(event.token, token.address);
			assert.equal(event.amount.toString(), tokens('100').toString());
			assert.equal(event.rate.toString(), '100');

			// FAILURE: investor can't sell more tokens than they have
			await ethSwap.sellTokens(tokens('500'), { from: investor}).should.be.rejected;
		})
	})

})