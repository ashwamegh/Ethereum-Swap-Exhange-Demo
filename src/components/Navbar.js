import React from 'react';
import Identicon from 'identicon.js';
import './App.css';

function Navbar({ account }) {
	console.log(account)
	return (
		<>
			<nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
				<div
					className="navbar-brand col-sm-3 col-md-2 mr-0"
				>
					Eth Swap
				</div>
				<ul className='navbar-nav flex-md-row px-3'>
					<li className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
						<small className='text-secondary'>
							<small id='account'>{account}</small>
						</small>
					</li>
					{
						account ?
							<li>

								<img
									className='ml-2' src={`data:image/png;base64,${new Identicon(account, 30).toString()}`}
									width={30}
									height={30}
								></img>
							</li> :
							<span></span>
					}
				</ul>
			</nav>
		</>
	);
}

export default Navbar;
