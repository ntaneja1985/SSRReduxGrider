// Startup point for the client side application
import 'babel-polyfill';
import React from "react";
import ReactDOM from "react-dom";
// import HomePage from "./components/HomePage";
import {BrowserRouter} from "react-router-dom";
import {createStore,applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import RenderRoutes from "react-router-config/renderRoutes";
import Routes from "./Routes";
import reducers from "./reducers";
import {renderRoutes} from "react-router-config";

const store = createStore(reducers,window.INITIAL_STATE,applyMiddleware(thunk));
ReactDOM.hydrate(
    <Provider store={store}>
        <BrowserRouter>
            <div>{renderRoutes(Routes)}</div>
        </BrowserRouter>
    </Provider>
    , document.getElementById("root"));
