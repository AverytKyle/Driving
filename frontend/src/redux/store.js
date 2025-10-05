import { 
    legacy_createStore as createStore, 
    combineReducers,
    applyMiddleware 
} from 'redux'; 
import sessionReducer from './session';

const rootReducer = combineReducers({
    session: sessionReducer,
});

let enhancer;
if (process.env.NODE_ENV === 'production') {
    enhancer = applyMiddleware();
} else {
    const logger = require('redux-logger').default;
    // Use the browser extension compose if available, otherwise fallback to identity.
    const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || ((f) => f);
    enhancer = composeEnhancers(applyMiddleware(logger));
}

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
}
export default configureStore;
