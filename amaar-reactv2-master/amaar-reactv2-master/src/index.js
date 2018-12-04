import "@babel/polyfill";

import React            from "react";
import ReactDOM         from "react-dom";
import {
    BrowserRouter,
    Route
}                       from "react-router-dom";
import { AppContainer } from "react-hot-loader";

import Router from "./Router";

const render = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <BrowserRouter>
                <Route path="/" component={ Component } />
            </BrowserRouter>
        </AppContainer>,
        document.getElementById("root")
    );
};

render(Router);