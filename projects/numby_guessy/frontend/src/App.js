import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/nav";
import Game from "./components/game";
import ScoreTable from "./components/scoreScrn";
import Landing from "./components/landing";

const App = () => {
	return (
		<>
			<Navbar />
			<Routes>
				<Route exact path="/" element={<Landing />} />
				<Route path="/game" element={<Game />} />
				<Route path="/score" element={<ScoreTable />} />
			</Routes>
		</>
	);
};
 export default App;