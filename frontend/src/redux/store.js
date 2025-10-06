import { 
    legacy_createStore as createStore, 
    combineReducers,
    applyMiddleware 
} from 'redux'; 
import sessionReducer from './session';
import routesReducer from './routes';

// Minimal thunk middleware (works like redux-thunk) to allow dispatching functions
const thunk = ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') {
        return action(dispatch, getState);
    }
    return next(action);
};

const rootReducer = combineReducers({
    session: sessionReducer,
    routes: routesReducer,
});

let enhancer;
if (process.env.NODE_ENV === 'production') {
    enhancer = applyMiddleware(thunk);
} else {
    const logger = (await import('redux-logger')).default;
    // Use the browser extension compose if available, otherwise fallback to identity.
    const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || ((f) => f);
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
}
export default configureStore;
