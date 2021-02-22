import React, { useState, useEffect, useContext } from "react";
import "../../utils/flowHeaders.min.css";
import "./main.css";
import API from "../../utils/API"
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import { Alert } from "@material-ui/lab";
import { Snackbar, FormControl, InputLabel, Input, InputAdornment, Fab, Typography, Button } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Key from "@material-ui/icons/VpnKey";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faChalkboardTeacher, faSpinner } from '@fortawesome/free-solid-svg-icons'
import FullScreenDialog from "../../components/FullScreenDialog";
import SocketContext from '../../socket-context'


const useStyles = makeStyles(theme => ({
    formInput: {
        margin: "1em 0em",
        width: "100%"
    },
    formContainer: {
        width: "100%"
    },
    title: {
        width: "100%",
        display: "block",
        margin: "20px 0"
    },
    portal: {
        width: "75vw",
        maxWidth: "300px"
    },
    navIcon: {
        margin: "0 5px",
    }

}));

// const socket = window.socket;
const errorSeverity = "error";
const successSeverity = "success";
const loginError = "Your username or password was incorrect."
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
        password: setPassword
    }

    const handleSendAlert = (severity, message) => {
        setAlertSeverity(severity);
        setAlertMessage(message);
        setAlertOpen(true);
    }

    const handleChange = (e) => {
        set[e.target.name](e.target.value);
    }

    const handleCloseSeedDialog = () => {
        setSeedDialogOpen(false);
    }

    const handleSeedDatabase = () => {
        setSeedLoading(true);
        API.seedDatabase()
            .then((result) => {
                if (result) {
                    // Send alert
                    handleCloseSeedDialog();
                    handleSendAlert(successSeverity, seedSuccess);
                } else {
                    handleSendAlert(errorSeverity, seedError);
                }
            })
    }

    const handleLogin = (username, password) => {
        if (username.length && password.length) {
            API.verifyAccount(username, password)
                .then((user) => {

                    if (user.data) {
                        props.setUser(user.data);
                        setAlertOpen(false);
                        socket.emit('authentication', `${user.data.profile.first_name} has connected!`)
                    }

                    // Login failed, show error message
                    // Clear password
                    else {
                        handleSendAlert(errorSeverity, loginError);
                        setPassword("");
                    }
                })
        }
    }

    const handleKeyPress = (event, username, password) => {
        if(event.key === 'Enter') {
            handleLogin(username, password);
        } 
    }

    const handleAlertClose = () => {
        setAlertOpen(false);
    }

    useEffect(() => {
        // Check if database is empty
        API.verifyInitialization()
            .then((userAccount) => {
                if (userAccount.data) {
                    // Set information for account created
                    setCreatedUser(userAccount.data);
                    // Open dialog
                    setSeedDialogOpen(true);
                }
            })

    }, [])

    if (props.user) { return <Redirect to="/" /> }


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
            <FullScreenDialog
                open={seedDialogOpen}
                handleClose={handleCloseSeedDialog}
                type={"Welcome to Semanhyia American School!"}
                action={handleSeedDatabase}
                buttonText={seedLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Seed"}
            >
                <div style={{ height: "100%", width: "100%", display: "flex" }}>
                    <div style={{ margin: "auto", maxWidth: "400px", width: "70%" }}>
                        <Typography
                            align='center'
                            variant="h2"
                            color="textSecondary"
                            className={"flow-text"}
                            gutterBottom>
                            welcome 🥳
                        </Typography>
                        <Typography
                            align='center'
                            variant="subtitle2"
                            color="textSecondary"
                            gutterBottom>
                            Below are the credentials for the server's master account. Feel free to initialize the database with some example documents just to get going by clicking 'Seed'.
                        </Typography>
                        <div className={classes.formContainer}>
                            <FormControl className={classes.formInput}>
                                <InputLabel htmlFor="input-with-icon-adornment">Username</InputLabel>
                                <Input
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    }
                                    name='username'
                                    defaultValue={createdUser.username}
                                    readOnly

                                />
                            </FormControl>
                        </div>
                        <div className={classes.formContainer}>
                            <FormControl className={classes.formInput}>
                                <InputLabel htmlFor="input-with-icon-adornment">Password</InputLabel>
                                <Input
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Key />
                                        </InputAdornment>
                                    }

                                    name='password'
                                    defaultValue={createdUser.password}
                                    readOnly

                                />
                            </FormControl>
                        </div>
                    </div>
                </div>
            </FullScreenDialog>
            <div style={{ display: "flex", width: "100%", height: "100vh" }}>
                <div style={{ margin: "auto" }}>
                    <div className={classes.portal}>

                        <Typography align='center' variant="h4" className={classes.title}>
                            login <FontAwesomeIcon icon={faChalkboardTeacher} size="lg" />
                        </Typography>

                        <div className={classes.formContainer}>
                            <FormControl className={classes.formInput}>
                                <InputLabel htmlFor="input-with-icon-adornment">Username</InputLabel>
                                <Input
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    }
                                    name='username'
                                    value={username}
                                    onChange={handleChange}

                                />
                            </FormControl>
                        </div>
                        <div className={classes.formContainer}>
                            <FormControl className={classes.formInput}>
                                <InputLabel htmlFor="input-with-icon-adornment">Password</InputLabel>
                                <Input
                                    type='password'
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Key />
                                        </InputAdornment>
                                    }

                                    name='password'
                                    value={password}
                                    onKeyPress={(e) => handleKeyPress(e, username,password)}
                                    onChange={handleChange}

                                />
                            </FormControl>
                        </div>
                        <div style={{ display: "flex", width: "100%", margin: "10px 0" }}>

                            <div style={{ margin: "auto" }}>
                                <Button style={{ backgroundColor: "#fe951d", color: "white" }} aria-label="login" onClick={() => handleLogin(username, password)} >
                                    <div> Sign in </div>
                                    <FontAwesomeIcon className={classes.navIcon} icon={faSignInAlt} size="lg" color="white"/>
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