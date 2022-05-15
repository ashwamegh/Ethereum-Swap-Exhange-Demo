import React, { useState } from 'react';
import BuyForm from './BuyForm';
import SellForm from './SellForm';

function Main({ ethBalance = '0', tokenBalance = '0', buyTokens, sellTokens }) {

	const [currentForm, setCurrentForm] = useState('buy');

	return (
		<main id="content" className='ml-auto mr-auto lg-12' style={{ width: 600, paddingTop: '3rem' }}>
			<div className="d-flex justify-content-between mb-3">
				<button
					className="btn btn-light"
					onClick={(event) => {
						setCurrentForm('buy')
					}}
				>
					Buy
				</button>
				<span className="text-muted">&lt; &nbsp; &gt;</span>
				<button
					className="btn btn-light"
					onClick={(event) => {
						setCurrentForm('sell')
					}}
				>
					Sell
				</button>
			</div>

			<div className="card mb-4" >

				<div className="card-body">

					{currentForm === 'buy' ?
						<BuyForm
							ethBalance={ethBalance}
							tokenBalance={tokenBalance}
							buyTokens={buyTokens}
						/> :
						<SellForm
							ethBalance={ethBalance}
							tokenBalance={tokenBalance}
							sellTokens={sellTokens}
						/>}

				</div>

			</div>

		</main>
	);
}

export default Main;
