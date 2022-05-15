import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

import Navbar from './Navbar';
import './App.css';

import EthSwap from './../abis/EthSwap.json'
import Token from './../abis/Token.json'
import Main from './Main';

function App() {
	const [loading, setLoading] = useState(true);
	const [account, setAccount] = useState('');
	const [token, setToken] = useState({});
	const [ethSwap, setEthSwap] = useState({});
	const [tokenBalance, setTokenBalance] = useState(0);
	const [ethBalance, setEthBalance] = useState(0);

	async function loadWeb3() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			await window.ethereum.enable();
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
		} else {
			window.alert('Non-ethereum browser detected, You should consider trying MetaMask!');
		}
	}

	async function loadBlockchainData() {
		const web3 = window.web3;
		const accounts = await web3.eth.getAccounts();
		const [_account] = accounts

		setAccount(_account)
		const _ethBalance = await web3.eth.getBalance(_account);
		setEthBalance(_ethBalance)

		// Load Token
		const networkId = await web3.eth.net.getId();
		const tokenData = Token.networks[networkId]

		if (tokenData) {
			const _token = new web3.eth.Contract(Token.abi, tokenData.address);
			console.log("Token contract", _token)
			setToken(_token)

			const _tokenBalance = await _token.methods.balanceOf(_account).call();
			setTokenBalance(_tokenBalance.toString())
			console.log("Token balance: ", _tokenBalance.toString())
		} else window.alert("Token contract not deployed on detected network")


		//  Load EthSwap
		const ethSwapData = EthSwap.networks[networkId]

		if (ethSwapData) {
			const _ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
			console.log("EthSwap contract", _ethSwap)
			setEthSwap(_ethSwap)

		} else window.alert("EthSwap contract not deployed on detected network")

		setLoading(false)

	}


	function buyTokens(etherAmount) {
		setLoading(true);
		ethSwap.methods.buyTokens().send({
			from: account,
			value: etherAmount
		}).on('transactionHash',
			(hash) => {
				setLoading(false);
			},
			(err) => {
				console.error(err);
			})
	}

	function sellTokens(tokenAmount) {
		setLoading(true);
		token
			.methods
			.approve(ethSwap.address, tokenAmount)
			.send({ from: account })
			.on('transactionHash',
				(hash) => {
					ethSwap
						.methods
						.sellTokens(tokenAmount)
						.send({ from: account })
						.on('transactionHash',
							(hash) => setLoading(false));
				},
				(err) => {
					console.error(err);
				})
	}

	const runEffect = async () => {
		await loadWeb3();
		await loadBlockchainData();
	};


	useEffect(() => {
		runEffect();
	}, [])

	return (
		<div>
			<Navbar account={account} />

			<div className="container-fluid mt-5">
				<div className="row">
					{
						loading ?
							<p id='loader' className='text-center' > Loading...</p> :
							<Main
								ethBalance={ethBalance}
								tokenBalance={tokenBalance}
								buyTokens={buyTokens}
								sellTokens={sellTokens}
							/>
					}

				</div>
			</div>
		</div>
	);
}

export default App;
