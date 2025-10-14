const LOAD_USER_ROUTES = 'routes/LOAD_USER_ROUTES';
const LOAD_ROUTE = 'routes/LOAD_ROUTE';
const ADD_ROUTE = 'routes/ADD_ROUTE';
const EDIT_ROUTE = 'routes/EDIT_ROUTE';
const DELETE_ROUTE = 'routes/DELETE_ROUTE';

const loadUserRoutes = (routes) => ({
  type: LOAD_USER_ROUTES,
  payload: routes,
});

const loadRoute = (route) => ({
  type: LOAD_ROUTE,
  payload: route,
});

const addRoute = (route) => ({
  type: ADD_ROUTE,
  payload: route,
});

const editRoute = (route) => ({
  type: EDIT_ROUTE,
  payload: route,
});

const deleteRoute = (routeId) => ({
  type: DELETE_ROUTE,
  payload: routeId,
});

export const get_user_routes = (userId) => async (dispatch) => {
    const response = await fetch(`/api/routes/user/${userId}/routes/`, {
        credentials: 'include',
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(loadUserRoutes(data));
        return data;
    } 
};

export const get_route = (routeId) => async (dispatch) => {
    const response = await fetch(`/api/routes/${routeId}/`)
    if (response.ok) {
        const data = await response.json();
        dispatch(loadRoute(data));
        return data;
    }
};

export const create_route = (route) => async (dispatch) => {
    const response = await fetch('/api/routes/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(route),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(addRoute(data));
        return data;
    }
};

export const update_route = (route) => async (dispatch) => {
    const response = await fetch(`/api/routes/update/${route.id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(route),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(editRoute(data));
        return data;
    }
};

export const remove_route = (routeId) => async (dispatch) => {
    const response = await fetch(`/api/routes/delete/${routeId}/`, {
        method: 'DELETE',
    });

    if (response.ok) {
        dispatch(deleteRoute(routeId));
    }
};

const initialState = { 
    Routes: {},
};

const routesReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_USER_ROUTES:
            return { ...state, Routes: action.payload };
        case LOAD_ROUTE:
            return { ...state, singleRoute: action.payload };
        case ADD_ROUTE:
            return { ...state, Routes: { ...state.Routes, [action.payload.id]: action.payload } };
        case EDIT_ROUTE:
            return { ...state, Routes: { ...state.Routes, [action.payload.id]: action.payload } };
        case DELETE_ROUTE:
            const { [action.payload]: removed, ...remainingRoutes } = state.Routes;
            return { ...state, Routes: remainingRoutes };
        default:
            return state;
    }
};

export default routesReducer;