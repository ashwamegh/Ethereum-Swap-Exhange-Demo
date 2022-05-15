import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

import Navbar from './Navbar';
import './App.css';

function App() {

	const [ account, setAccount ] = useState('');

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
		const [activeAccount] = accounts
		setAccount(activeAccount)
		const ethBalance = await web3.eth.getBalance(activeAccount);
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
			<Navbar account={account}/>
			<div className="container-fluid mt-5">
				<div className="row">
					<main role="main" className="col-lg-12 d-flex text-center">
						<div className="content mr-auto ml-auto">
							<h1>hello, Shashank</h1>
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}

export default App;
