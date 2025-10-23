import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./Navigation.css";

function Navigation() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);

    return (
        <nav className="nav-bar-container">
            <div className="nav-bar-dashboard-container">
                <h2
                    className="nav-bar-dashboard"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate("/dashboard")}
                >
                    Dashboard
                </h2>
            </div>
            <div className="nav-bar-search-container">
                <div className="nav-bar-search-input-container">
                    <input
                        type="search"
                        className="nav-bar-search-input"
                        placeholder="Search for addresses..."
                    />
                </div>
            </div>
            <div className="nav-bar-routes-container">
                <h3
                    className="nav-bar-routes"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate("/my-routes")}
                >
                    Manage Routes
                </h3>
            </div>
            {/* {sessionUser && (
                <div className="nav-bar-logout" onClick={() => dispatch(logout())}>
                    <h2>Log Out</h2>
                </div>
            )} */}
        </nav>
    );
}

export default Navigation;