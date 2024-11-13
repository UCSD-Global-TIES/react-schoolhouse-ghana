// React and Hooks
import React, { useEffect, useState } from "react";

// Router
import { Route, Switch } from "react-router-dom";

// Material-UI Components and Styles
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

// Font and Icons
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "typeface-roboto";

// Socket
import * as io from "socket.io-client";
import SocketContext from "./socket-context";

// Utils
import API from "./utils/API";

// Style
import "./App.css";

import Cookies from 'js-cookie';

// Components
// -----------------------------------------------------------
// Component that ensures people are logged in and have proper permissions
// Using Redirect https://reacttraining.com/react-router/web/api/Redirect
import ProtectedRoute from "./components/ProtectedRoute";
// import Loading from "./components/Loading"; // Commented out but kept for future reference

// Pages
import AccountPortal from "./pages/AccountPortal/index";
import AdminPortal from "./pages/AccountPortal/versions/admin/AdminPortal";
import AssessmentPage from "./pages/AssessmentPage/index";
import LoginPortal from "./pages/LoginPortal/index";
import NoMatch from "./pages/NoMatch/index";
import SubjectPage from "./pages/SubjectPage/index";

const socket = io();

// Create a theme instance.
// Global Stylings should be changed/added here
const appTheme = createMuiTheme({
  typography: {
    fontFamily: ["Asap Condensed", "Nunito", "sans-serif"].join(","),
    h1: {
      fontFamily: "Asap Condensed",
      fontSize: "3.75rem",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: "normal",
      color: "#4B4B4B",
    },
    h2: {
      fontFamily: "Asap Condensed",
      fontSize: "2.5rem",
      fontStyle: "normal",
      fontWeight: "600",
      lineHeight: "4rem",
      color: "#4B4B4B",
      textTransform: "uppercase",
    }
  },
  palette: {
    background: {
      default: "var(--background-color)",
    },
  },
  overrides: {
    MuiButton: {
      root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "0.625rem",
        height: "3.00rem",
        flexShrink: "0",
        fontSize: "1.75rem",
        lineHeight: "2.375rem",
        fontFamily: "Nunito",
        borderRadius: "1.5rem", // Rounded corners
        borderTop: "1px solid #005FD9",
        borderRight: "1px solid #005FD9",
        borderBottom: "4px solid #005FD9",
        borderLeft: "1px solid #005FD9",
        color: "#1976d2", // Blue text
        backgroundColor: "#fff", // White background
        textTransform: "none", // Keeps the text's original casing
        border: "1px solid #f0f0f0", // Blue border
        boxShadow:
          "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)", // Shadow for the 3D effect
        "&:hover": {
          backgroundColor: "#f0f0f0", // Light grey background on hover
          boxShadow: "none", // No shadow on hover to give a pressed effect
        },
        "&:active": {
          backgroundColor: "#e0e0e0", // Even lighter grey background to simulate being pressed
        },
      },
      startIcon: {
        color: "#1976d2", // Blue icon to match the text
      },
    },
  },
});

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    API.destroySession().then(() => {
      setUserInfo(null); // Clear user info
      Cookies.remove('user_sid'); // Remove session cookie
      window.location.href = "/login"; // Redirect to login page
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
