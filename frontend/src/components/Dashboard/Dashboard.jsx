import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_user_routes } from "../../redux/routes";
import { get_route_addresses } from "../../redux/addresses";
import "./Dashboard.css";

function Dashboard() {
    const sessionUser = useSelector((state) => state.session.user);
    const userRoutes = useSelector((state) => state.routes.Routes);
    const routeAddresses = useSelector((state) => state.addresses.Addresses);
    const [expandedRouteId, setExpandedRouteId] = useState(null);
    const [loadingRouteId, setLoadingRouteId] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!sessionUser) return; // don't run until we have a sessionUser
        dispatch(get_user_routes(sessionUser.id));
    }, [dispatch, sessionUser]);

    const handleRouteClick = async (routeId) => {
        // toggle collapse if already expanded
        if (expandedRouteId === routeId) {
            setExpandedRouteId(null);
            return;
        }

        // If we already have addresses for this route, just expand immediately
        if (routeAddresses && routeAddresses[routeId]) {
            setExpandedRouteId(routeId);
            return;
        }

        // otherwise fetch addresses then expand
        try {
            setLoadingRouteId(routeId);
            await dispatch(get_route_addresses(routeId));
            setExpandedRouteId(routeId);
        } finally {
            setLoadingRouteId(null);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-title">
                <h1>Dashboard</h1>
            </div>
            <div className="dashboard-content">
                {Object.values(userRoutes).map((route, index) => (
                    <div key={index} className="dashboard-route">
                        <div
                            onClick={() => handleRouteClick(route.id)}
                            style={{ cursor: "pointer", display: "inline-block" }}
                            title="Click to show addresses"
                            className="dashboard-route-card"
                        >
                            <h2 className="dashboard-route-name">{route.name}</h2>
                        </div>

                        {/* addresses expanded area */}
                        {expandedRouteId === route.id && (
                            <div className="dashboard-address-list">
                                {loadingRouteId === route.id ? (
                                    <div className="dashboard-address-loading">Loading addresses...</div>
                                ) : routeAddresses &&
                                    routeAddresses[route.id] &&
                                    routeAddresses[route.id].length > 0 ? (
                                    routeAddresses[route.id].map((address) => (
                                        <div key={address.id} className="dashboard-address-item">
                                            {/* <p className="dashboard-address-stop-order">{address.stop_order}</p> */}
                                            <p className="dashboard-address-label">{address.stop_order}. {address.label}</p>
                                            <p className="dashboard-address-formatted">{address.formatted_address}</p>
                                            <p className="dashboard-address-note">{address.note}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="dashboard-address-empty">No addresses found for this route.</div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
