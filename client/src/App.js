// React and Hooks
import React, { useEffect, useState } from "react";

// Router
import { Route, Switch } from "react-router-dom";

// Material-UI Components and Styles
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";

// Font and Icons
import "typeface-roboto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

// Socket
import * as io from "socket.io-client";
import SocketContext from "./socket-context";

// Utils
import API from "./utils/API";

// Style
import "./App.css";

// Components
// -----------------------------------------------------------
// Component that ensures people are logged in and have proper permissions
// Using Redirect https://reacttraining.com/react-router/web/api/Redirect
import ProtectedRoute from "./components/ProtectedRoute";
// import Loading from "./components/Loading"; // Commented out but kept for future reference
import NavBar from "./components/NavBar";

// Pages
import NoMatch from "./pages/NoMatch/index";
import LoginPortal from "./pages/LoginPortal/index";
import AccountPortal from "./pages/AccountPortal/index";
import SubjectPage from "./pages/SubjectPage/index";
import AssessmentPage from "./pages/AssessmentPage/index";
import AdminPortal from "./pages/AccountPortal/versions/admin/AdminPortal";

const socket = io();

// Create a theme instance.
// Global Stylings should be changed/added here
const appTheme = createMuiTheme({
  typography: {
    fontFamily: ["Asap Condensed", "Nunito", "sans-serif"].join(","),
  },
  palette: {
    background: {
      default: "var(--background-color)",
    },
  },
});

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    API.destroySession().then((nullUser) => {
      setUserInfo(nullUser.data);
    });
  };

  const setUser = (user) => {
    setUserInfo(user);
  };

  useEffect(() => {
    API.verifySession().then((user) => {
      if (user.data) setUserInfo(user.data);
      setLoading(false);
    });
  }, []);

  return (
    <ThemeProvider theme={appTheme}>
      <SocketContext.Provider value={socket}>
        <div className="App">
          {loading ? (
            <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
              <div style={{ margin: "auto" }}>
                <FontAwesomeIcon icon={faSpinner} size="2x" spin />
              </div>
            </div>
          ) : (
            <Switch>
              {/* Portal component should check account type and render the correct component */}
              <ProtectedRoute
                exact
                path="/"
                component={AccountPortal}
                user={userInfo}
              />
              {/* Class component should check account type and render the correct component */}
              <ProtectedRoute
                path="/subject/:id"
                component={SubjectPage}
                logout={handleLogout}
                user={userInfo}
              />
              <ProtectedRoute
                path="/edit"
                component={AdminPortal}
                logout={handleLogout}
                user={userInfo}
              />
              <Route
                exact
                path="/login"
                component={(props) => (
                  <LoginPortal {...props} user={userInfo} setUser={setUser} />
                )}
              />
              <Route
                path="/assessment/:id"
                component={AssessmentPage}
                logout={handleLogout}
                user={userInfo}
              />
              <Route component={NoMatch} />
            </Switch>
          )}
        </div>
      </SocketContext.Provider>
    </ThemeProvider>
  );
}

export default App;
