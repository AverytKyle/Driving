const LOAD_ROUTE_ADDRESSES = 'addresses/LOAD_USER_ADDRESSES';
const ADD_ADDRESS = 'addresses/ADD_ADDRESS';
const EDIT_ADDRESS = 'addresses/EDIT_ADDRESS';
const DELETE_ADDRESS = 'addresses/DELETE_ADDRESS';

const loadRouteAddresses = (routeId, addresses) => ({
    type: LOAD_ROUTE_ADDRESSES,
    payload: { routeId, addresses },
});

const addAddress = (address) => ({
    type: ADD_ADDRESS,
    payload: address,
});

const editAddress = (address) => ({
    type: EDIT_ADDRESS,
    payload: address,
});

const deleteAddress = (addressId) => ({
    type: DELETE_ADDRESS,
    payload: addressId,
});

export const get_route_addresses = (routeId) => async (dispatch) => {
    const response = await fetch(`/api/addresses/route/${routeId}`, {
        credentials: 'include',
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(loadRouteAddresses(routeId, data));
        return data;
    }
};

export const create_address = (address) => async (dispatch) => {
    const response = await fetch('/api/addresses/create/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(addAddress(data));
        return data;
    }
};

export const update_address = (addressId, address) => async (dispatch) => {
    const response = await fetch(`/api/addresses/update/${addressId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(editAddress(data));
        return data;
    }
};

export const reorder_route_addresses = (routeId, orderedRouteAddressIds) => async (dispatch) => {
    const response = await fetch(`/api/addresses/route/${routeId}/reorder/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ordered_route_address_ids: orderedRouteAddressIds }),
    });

    if (response.ok) {
        const data = await response.json();
        // Reuse the existing action that stores addresses by route
        dispatch(loadRouteAddresses(routeId, data));
        return data;
    } else {
        const err = await response.json().catch(() => ({ detail: response.statusText }));
        throw err;
    }
};

export const remove_address = (addressId) => async (dispatch) => {
    const response = await fetch(`/api/addresses/delete/${addressId}/`, {
        method: 'DELETE',
    });
    if (response.ok) {
        dispatch(deleteAddress(addressId));
        return response;
    }
};

const initialState = { Addresses: {} };

const addressesReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ROUTE_ADDRESSES:
            return {
                ...state,
                Addresses: {
                    ...state.Addresses,
                    [action.payload.routeId]: action.payload.addresses,
                },
            };
        case ADD_ADDRESS:
            return {
                ...state,
                Addresses: {
                    ...state.Addresses,
                    [action.payload.routeId]: [
                        ...(state.Addresses[action.payload.routeId] || []),
                        action.payload,
                    ],
                },
            };
        case EDIT_ADDRESS:
            return {
                ...state,
                Addresses: {
                    ...state.Addresses,
                    [action.payload.routeId]: state.Addresses[action.payload.routeId].map((address) =>
                        address.id === action.payload.id ? action.payload : address
                    ),
                },
            };
        case DELETE_ADDRESS: {
            const idToRemove = action.payload; // payload is the numeric id
            const Addresses = Object.keys(state.Addresses).reduce((acc, routeId) => {
                acc[routeId] = (state.Addresses[routeId] || []).filter(a => a.id !== idToRemove);
                return acc;
            }, {});
            return { ...state, Addresses };
        }
        default:
            return state;
    }
};
export default addressesReducer;