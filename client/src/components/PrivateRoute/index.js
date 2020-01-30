import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { useAuth0 } from "../../react-auth0-spa";

const PrivateRoute = ({ component: Component, path, user, ...rest }) => {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (loading || isAuthenticated) {
      return;
    }
    const fn = async () => {
      await loginWithRedirect({
        appState: { targetUrl: path }//,
        //redirect_uri: `${window.location.protocol}//${window.location.host}/profile`
      });
    };
    fn();
  }, [loading, isAuthenticated, loginWithRedirect, path]);

  const render = props => isAuthenticated === true ? <Component {...props} user={user}/> : null;

  return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;