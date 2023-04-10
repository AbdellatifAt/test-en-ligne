import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";

import routeReducer from "./root-reducer";

const middleWares = [logger];

const store = createStore(routeReducer, applyMiddleware(...middleWares));

export default store;
