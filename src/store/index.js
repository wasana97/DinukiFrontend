import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";

import createRootReducer from "./reducers";

export const history = createBrowserHistory();

export default function(initialState = {}, serviceManager) {
  const middleware = [
    thunk.withExtraArgument(serviceManager),
    routerMiddleware(history)
  ];

  const middlewareEnhancer = applyMiddleware(...middleware);
  const composedEnhancers = composeWithDevTools(middlewareEnhancer);

  const store = createStore(
    createRootReducer(history),
    initialState,
    composedEnhancers
  );

  return store;
}
