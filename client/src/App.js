import React, {
  useEffect,
  useState
} from "react";

import {
  Route,
  Switch
} from "react-router-dom";

import "./App.css";
import API from "./utils/API";


// COMPONENTS
// -----------------------------------------------------------
// Component that ensures people are logged in and have proper permissions
// Using Redirect https://reacttraining.com/react-router/web/api/Redirect
import ProtectedRoute from "./components/ProtectedRoute";
// import Loading from "./components/Loading";

// PAGES
import NoMatch from "./pages/NoMatch/index";
import LoginPortal from "./pages/LoginPortal/index";
import AccountPortal from "./pages/AccountPortal/index";
import ClassPage from "./pages/ClassPage/index";
import NavBar from "./components/NavBar";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import AdminPortal from "./pages/AccountPortal/versions/admin/AdminPortal";

function App() {
  // const testUser = null;
  const [userInfo, setUserInfo] = useState(null);
  const [IsErrorVisible, showLoginError] = useState(false);

  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    API.destroySession()
      .then((nullUser) => {
        setUserInfo(nullUser.data)
      })
  }

  const handleLogin = (username, password) => {
    if (username.length && password.length) {
      API.verifyAccount(username, password)
        .then((user) => {

          if (user.data) {
            setUserInfo(user.data);
            showLoginError(false);
          }

          // Login failed, show error message
          else {
            showLoginError(true);
          }
        })
    }
  }

  useEffect(() => {
    API.verifySession()
      .then((user) => {
        if (user.data) setUserInfo(user.data);
        setLoading(false);
      })

  }, []);

  return (
    <div className="App">
      <header>
        {/* Place navigation bar here */}
        <NavBar user={userInfo} logout={handleLogout} />
      </header>

      {
        loading ?
          <div style={{ display: "flex", width: "100vw", height: "100vh"  }}>
            <div style={{ margin: "auto" }}>
              <FontAwesomeIcon icon={faSpinner} size="2x" spin />
            </div>

          </div>
          :
          <Switch>
            {/* Portal component should check account type and render the correct component */}
            <ProtectedRoute exact path="/" component={AccountPortal} user={userInfo} />
            {/* Class component should check account type and render the correct component */}
            <ProtectedRoute exact path="/class/:id" component={ClassPage} user={userInfo} />
            <ProtectedRoute path="/edit" component={AdminPortal} logout={handleLogout} user={userInfo} />
            <Route exact path="/login" component={props => <LoginPortal {...props} user={userInfo} hasError={IsErrorVisible} login={handleLogin} />} />
            <Route component={NoMatch} />
          </Switch>
      }
    </div>
  );
}

export default App;