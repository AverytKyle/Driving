import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_user_routes } from "../../redux/routes";
import { get_route_addresses, reorder_route_addresses } from "../../redux/addresses";
import "./ManageRoutes.css";

function ManageRoutes() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const userRoutes = useSelector((state) => state.routes.Routes);
    const routeAddresses = useSelector((state) => state.addresses.Addresses);
    const [expandedRouteId, setExpandedRouteId] = useState(null);
    const [loadingRouteId, setLoadingRouteId] = useState(null);
    const [localAddresses, setLocalAddresses] = useState([]);
    const [dragIndex, setDragIndex] = useState(null);
    const [isSavingOrder, setIsSavingOrder] = useState(false);

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
            const sorted = [...routeAddresses[routeId]].sort((a, b) => a.stop_order - b.stop_order);
            setLocalAddresses(sorted);
            setExpandedRouteId(routeId);
            return;
        }

        // otherwise fetch addresses then expand
        try {
            setLoadingRouteId(routeId);
            const data = await dispatch(get_route_addresses(routeId)); // thunk returns data array
            const sorted = data ? [...data].sort((a, b) => a.stop_order - b.stop_order) : [];
            setLocalAddresses(sorted);
            setExpandedRouteId(routeId);
        } finally {
            setLoadingRouteId(null);
        }
    };

    return (
        <div className="manage-routes-container">
            <div className="manage-routes-title">
                <h1>Manage Your Routes</h1>
            </div>
            <div className="manage-routes-content">
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
                                ) : localAddresses && localAddresses.length > 0 ? (
                                    localAddresses.map((address, index) => {
                                        // route_address_id is provided by get_addresses_by_route
                                        const routeAddressId = address.route_address_id ?? address.route_address_id; // fallback if needed
                                        return (
                                            <div
                                                key={address.id + "-" + (routeAddressId || index)} // unique key; address.id still used
                                                className="dashboard-address-item"
                                                draggable={!isSavingOrder}
                                                onDragStart={(e) => {
                                                    setDragIndex(index);
                                                    e.dataTransfer.effectAllowed = "move";
                                                    e.dataTransfer.setData("text/plain", String(index));
                                                }}
                                                onDragOver={(e) => {
                                                    e.preventDefault();
                                                    e.dataTransfer.dropEffect = "move";
                                                }}
                                                onDrop={async (e) => {
                                                    e.preventDefault();
                                                    const fromIndex = dragIndex !== null ? dragIndex : Number(e.dataTransfer.getData("text/plain"));
                                                    const toIndex = index;
                                                    if (fromIndex === toIndex) {
                                                        setDragIndex(null);
                                                        return;
                                                    }

                                                    // local reorder
                                                    const newList = [...localAddresses];
                                                    const [moved] = newList.splice(fromIndex, 1);
                                                    newList.splice(toIndex, 0, moved);

                                                    // renumber stop_order (1-based)
                                                    const renumbered = newList.map((addr, i) => ({ ...addr, stop_order: i + 1 }));

                                                    // optimistic UI update
                                                    setLocalAddresses(renumbered);
                                                    setDragIndex(null);

                                                    // prepare route_address_id array expected by backend
                                                    const orderedIds = renumbered.map((a) => a.route_address_id);

                                                    // dispatch thunk to persist server-side and refresh Redux
                                                    try {
                                                        setIsSavingOrder(true);
                                                        const data = await dispatch(reorder_route_addresses(route.id, orderedIds));
                                                        // thunk returns updated addresses (and also dispatches LOAD into redux).
                                                        // Use returned data to ensure UI matches server canonical order.
                                                        if (Array.isArray(data)) {
                                                            setLocalAddresses(data.slice().sort((a, b) => a.stop_order - b.stop_order));
                                                        }
                                                    } catch (err) {
                                                        console.error("Failed to save new order:", err);
                                                        // rollback by refetching server state
                                                        const fresh = await dispatch(get_route_addresses(route.id));
                                                        setLocalAddresses(fresh ? [...fresh].sort((a, b) => a.stop_order - b.stop_order) : []);
                                                    } finally {
                                                        setIsSavingOrder(false);
                                                    }
                                                }}
                                                onDragEnd={() => setDragIndex(null)}
                                                style={{ opacity: isSavingOrder ? 0.6 : 1, cursor: isSavingOrder ? "wait" : "grab" }}
                                            >
                                                <p className="dashboard-address-label">{address.stop_order}. {address.label}</p>
                                                <p className="dashboard-address-formatted">{address.formatted_address}</p>
                                                <p className="dashboard-address-note">{address.note}</p>
                                            </div>
                                        );
                                    })
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

export default ManageRoutes;
