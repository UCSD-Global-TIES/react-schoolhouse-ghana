// src/index.js

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from 'react-router-dom';
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "./react-auth0-spa";
import config from "./auth_config.json";
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
    <Auth0Provider
        domain={config.domain}
        client_id={config.clientId}
        redirect_uri={window.location.origin}
        onRedirectCallback={onRedirectCallback}
    >
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Auth0Provider>,
    document.getElementById("root")
);

serviceWorker.unregister();
