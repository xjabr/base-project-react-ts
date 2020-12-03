import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

const Home = () => { 
	return (
		<h1>Ciao</h1>
	)
}

const Dashboard = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={Home} />
			</Switch>
		</BrowserRouter>
	)
}

export default Dashboard;