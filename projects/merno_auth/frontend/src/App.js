import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/nav";
import Login from "./components/login"
import Register from "./components/register"
import Home from "./components/home"

const App = () => {
	return (
		<>
			<Navbar />
			<Routes>
				<Route exact path="/navbar" element={<Navbar />} />
				<Route exact path="/" element={<Login />} />
				<Route exact path="/home" element={<Home />} />
				<Route exact path="/reg" element={<Register />} />
			</Routes>
		</>
	);
};
 export default App;