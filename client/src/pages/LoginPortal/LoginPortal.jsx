// React and Hooks
import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";

// Material-UI Components and Styles
import { makeStyles } from "@material-ui/core/styles";
import {
  Snackbar,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Fab,
  Typography,
  Button,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Key from "@material-ui/icons/VpnKey";
import { Alert } from "@material-ui/lab";

// FontAwesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faChalkboardTeacher,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

// Local Components and Utils
import FullScreenDialog from "../../components/FullScreenDialog";
import SocketContext from "../../socket-context";
import API from "../../utils/API";

// Styles
import "../../utils/flowHeaders.min.css";
import "./main.css";

const useStyles = makeStyles((theme) => ({
  formInput: {
    margin: "1em 0em",
    width: "100%",
  },
  formContainer: {
    width: "100%",
  },
  title: {
    width: "100%",
    display: "block",
    margin: "20px 0",
  },
  portal: {
    width: "75vw",
    maxWidth: "300px",
  },
  navIcon: {
    margin: "0 5px",
  },
}));

// const socket = window.socket;
const errorSeverity = "error";
const successSeverity = "success";
const loginError = "Your username or password was incorrect.";
const seedError = "Database seeding failed.";
const seedSuccess = "Database seeding succeeded!";

function LoginPortal(props) {
  const socket = useContext(SocketContext);

  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [seedDialogOpen, setSeedDialogOpen] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);
  const [createdUser, setCreatedUser] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState(loginError);

  const set = {
    username: setUsername,
    password: setPassword,
  };

  const handleSendAlert = (severity, message) => {
    setAlertSeverity(severity);
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const handleChange = (e) => {
    set[e.target.name](e.target.value);
  };

  const handleCloseSeedDialog = () => {
    setSeedDialogOpen(false);
  };

  const handleSeedDatabase = () => {
    setSeedLoading(true);
    API.seedDatabase().then((result) => {
      if (result) {
        // Send alert
        handleCloseSeedDialog();
        handleSendAlert(successSeverity, seedSuccess);
      } else {
        handleSendAlert(errorSeverity, seedError);
      }
    });
  };

  const handleLogin = (username, password) => {
    if (username.length && password.length) {
      API.verifyAccount(username, password).then((user) => {
        if (user.data) {
          props.setUser(user.data);
          setAlertOpen(false);
          socket.emit(
            "authentication",
            `${user.data.profile.first_name} has connected!`
          );
        }

        // Login failed, show error message
        // Clear password
        else {
          handleSendAlert(errorSeverity, loginError);
          setPassword("");
        }
      });
    }
  };

  const handleKeyPress = (event, username, password) => {
    if (event.key === "Enter") {
      handleLogin(username, password);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  useEffect(() => {
    // Check if database is empty
    API.verifyInitialization().then((userAccount) => {
      if (userAccount.data) {
        // Set information for account created
        setCreatedUser(userAccount.data);
        // Open dialog
        setSeedDialogOpen(true);
      }
    });
  }, []);

  if (props.user) {
    return <Redirect to="/" />;
  }

  return (
    <>
      {/* ALERTS FOR ERRORS */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
  
      {/* MAIN CONTAINER */}
      <div style={{ display: "flex", width: "100%", height: "100vh" }}>
        {/* LEFT SECTION: IMAGE */}
        <div
          style={{
            width: "50%",
            backgroundImage: `url(${require("../../assets/LogIn.png")})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
  
        {/* RIGHT SECTION: LOGIN FORM */}
        <div
          style={{
            width: "60%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            padding: "40px",
            boxSizing: "border-box",
          }}
        >
          <div
            className={classes.portal}
            style={{
              width: "100%", 
              maxWidth: "500px",
            }}
          >
            {/* TITLE */}
            <Typography
              align="center"
              variant="h3" 
              className={classes.title}
              style={{
                fontSize: "36px",
                marginBottom: "30px",
              }}
            >
              Login
            </Typography>

            {/* USERNAME FIELD */}
            <div className={classes.formContainer} style={{ marginBottom: "20px" }}>
              <FormControl
                className={classes.formInput}
                style={{
                  width: "100%", border: "2px solid black", borderRadius: "30px",padding: "10px 15px",boxSizing: "border-box",}}
              >
                <Input
                  placeholder="Enter your username"
                  disableUnderline
                  startAdornment={
                    <InputAdornment position="start">
                      <AccountCircle style={{ fontSize: "30px" }} />
                    </InputAdornment>
                  }
                  name="username"
                  value={username}
                  onChange={handleChange}
                  style={{
                    fontSize: "25px",
                    color: "black",
                  }}
                  inputProps={{
                    style: {
                      color: "gray", 
                    },
                  }}
                />
              </FormControl>
            </div>

            {/* PASSWORD FIELD */}
            <div className={classes.formContainer} style={{ marginBottom: "20px" }}>
              <FormControl
                className={classes.formInput}
                style={{width: "100%", border: "2px solid black", borderRadius: "30px", padding: "10px 15px", boxSizing: "border-box",}}
              >
                <Input
                  type="password"
                  placeholder="Enter your password"
                  disableUnderline
                  startAdornment={
                    <InputAdornment position="start">
                      <Key style={{ fontSize: "30px" }} />
                    </InputAdornment>
                  }
                  name="password"
                  value={password}
                  onKeyPress={(e) => handleKeyPress(e, username, password)}
                  onChange={handleChange}
                  style={{
                    fontSize: "25px",
                    color: "black",
                  }}
                  inputProps={{
                    style: {
                      color: "gray", 
                    },
                  }}
                />
              </FormControl>
            </div>

            {/* SIGN-IN BUTTON */}
            <div style={{ display: "flex", width: "100%", margin: "20px 0" }}>
              <div style={{ margin: "auto", width: "100%" }}>
                <Button
                  style={{
                    backgroundColor: "#2584FF",
                    color: "white",
                    width: "100%",
                    padding: "15px 0", 
                    fontSize: "25px",
                    borderRadius: "30px",
                  }}
                  aria-label="login"
                  onClick={() => handleLogin(username, password)}
                >
                  <div>Log In</div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPortal;
