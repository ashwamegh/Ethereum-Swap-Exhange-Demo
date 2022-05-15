import React, { useState } from 'react';
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'

function BuyForm({ ethBalance = '0', tokenBalance = '0', buyTokens }) {
	const [output, setOutput] = useState(0)
	const [inputValue, setInputValue] = useState(0);

	return (
		<form
			className="mb-3"
			onSubmit={(event) => {
				event.preventDefault();
				console.log("Purchasing Tokens")
				let etherAmount = inputValue.value.toString();
				etherAmount = window.web3.utils.toWei(etherAmount, 'Ether');
				buyTokens(etherAmount)
			}}
		>
			<div>
				<label className="float-left"><b>Input</b></label>
				<span className="float-right text-muted">
					Balance: {window.web3.utils.fromWei(ethBalance, 'Ether')}
				</span>
			</div>
			<div className="input-group mb-4">
				<input
					type="text"
					className="form-control form-control-lg"
					onChange={(event) => {
						const etherAmount = inputValue.value.toString();
						setOutput(etherAmount * 100)
					}}
					ref={(_input) => setInputValue(_input)}
					placeholder="0"
					required />
				<div className="input-group-append">
					<div className="input-group-text">
						<img src={ethLogo} height='32' alt="" />
						&nbsp;&nbsp;&nbsp; ETH
					</div>
				</div>
			</div>
			<div>
				<label className="float-left"><b>Output</b></label>
				<span className="float-right text-muted">
					Balance: {tokenBalance && window.web3.utils.fromWei(tokenBalance, 'Ether')}
				</span>
			</div>
			<div className="input-group mb-2">
				<input
					type="text"
					className="form-control form-control-lg"
					placeholder="0"
					value={output}
					disabled
				/>
				<div className="input-group-append">
					<div className="input-group-text">
						<img src={tokenLogo} height='32' alt="" />
						&nbsp; DApp
					</div>
				</div>
			</div>
			<div className="mb-5">
				<span className="float-left text-muted">Exchange Rate</span>
				<span className="float-right text-muted">1 ETH = 100 DApp</span>
			</div>
			<button type="submit" className="btn btn-primary btn-block btn-lg">SWAP!</button>
		</form>
	);
}

export default BuyForm;
