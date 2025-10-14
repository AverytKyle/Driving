const SET_USER = 'session/setUser'
const REMOVE_USER = 'session/removeUser'

const setUser = (user) => ({
  type: SET_USER,
  payload: user,
})

const removeUser = () => ({
  type: REMOVE_USER,
})

export const authenticate = () => async (dispatch) => {
    const response = await fetch('/api/session/', {
        credentials: 'include',
    });
    if (response.ok) {
        const data = await response.json();
        if (data.errors) return;
        const user = data.user || data;
        dispatch(setUser(user));
    }
}

export const login = (credentials) => async (dispatch) => {
    const response = await fetch('/api/session/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
    });

    if (response.ok) {
        const data = await response.json();
        const user = data.user || data;
        dispatch(setUser(user));
    } else if (response.status < 500) {
        const errors = await response.json();
        return errors;
    } else {
        return ['An error occurred. Please try again.'];
    }
}

export const logout = () => async (dispatch) => {
    const response = await fetch('/api/session/', {
        method: 'DELETE',
        credentials: 'include',
    });
    if (response.ok) {
        dispatch(removeUser());
    }
}

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload };
        case REMOVE_USER:
            return { ...state, user: null };
        default:
            return state;
    }
}

export default sessionReducer;