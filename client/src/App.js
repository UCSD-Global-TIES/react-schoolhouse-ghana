import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { useAuth0 } from "./react-auth0-spa";
import PrivateRoute from "./components/PrivateRoute";
import API from './utils/API';
import "./App.css";

import Loading from "./components/Loading";
import Landing from "./pages/Landing/index";
import NoMatch from "./components/NoMatch";

function App() {
  // const user = {
  //   name: "Matt Chen",
  //   email: "matt@email.com",
  //   picture: "https://link.com"
  // }
  const { loading, user, isAuthenticated } = useAuth0();
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    updateUser();
  }, [loading]);

  // Retrieve/create userInfo document after Auth0 login
  const updateUser = () => {
    if(isAuthenticated && user && !loading){
      setUserInfo(user);
    }
  };

  if (loading) {
    return (
      <div className="App text-center">
        <div className="mt-5">
          <Loading />
        </div>
      </div>
    );
  }

  return (
      <div className="App">
        <header>
          {/* Place navigation bar here */}
        </header>
        <Switch>
          <Route exact path="/" component={Landing} />
          <PrivateRoute exact path="/private-page" component={PrivatePage} user={userInfo}/>
          <Route component={NoMatch} />
        </Switch>
      </div>
  );
}

export default App;
