import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, path, user, ...rest }) => {
    if (!user) { return <Redirect to="/login" /> }
    
    const render = props => <Component {...props} user={user} {...rest}/>;

    return <Route path={path} render={render} />
};

export default ProtectedRoute;

