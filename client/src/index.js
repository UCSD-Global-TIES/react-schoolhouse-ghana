// src/index.js

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from 'react-router-dom';
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import History from "./utils/History";

// A function that routes the user to the right place after login
const onRedirectCallback = appState => {
    History.push(
        appState && appState.targetUrl
            ? appState.targetUrl
            : window.location.pathname
    );
};

ReactDOM.render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    ,
    document.getElementById("root")
);

serviceWorker.unregister();
