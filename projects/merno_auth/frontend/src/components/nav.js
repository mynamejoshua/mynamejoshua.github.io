import React from "react";

// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";
 // Here, we display our Navbar


// https://www.bitdegree.org/learn/html-tab
export default function Navbar() {
    return (
        <nav style={{display: "flex"}}>
                <NavLink to="/">Login</NavLink><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <NavLink to="/reg">Register</NavLink><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                {/* <NavLink to="/score">Score</NavLink> */}
        </nav>
    )
}
