import React, { useState, useEffect } from "react";
import "../../utils/flowHeaders.min.css";
import "./main.css";
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import { FormControl, InputLabel, Input, InputAdornment, Fab, Typography } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Key from "@material-ui/icons/VpnKey";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons'
import FullScreenDialog from "../../components/FullScreenDialog";

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
    }

}));

function LoginPortal(props) {
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [seedDialogOpen, setSeedDialogOpen] = useState(false);

    const set = {
        username: setUsername,
        password: setPassword
    }

    const handleChange = (e) => {
        set[e.target.name](e.target.value);
    }

    const handleCloseSeedDialog = () => {
        setSeedDialogOpen(false);
    }

    const handleSeedDatabase = () => {
        setTimeout(() => {
            // Send alert
            console.log("Documents seeded!");
            handleCloseSeedDialog();
        }, 1500);
    }

    useEffect(() => {
        // Check if database is empty
        setTimeout(() => {
            // Set information for account created

            // Open dialog
            setSeedDialogOpen(true);
        }, 1500);
    }, [])

    if (props.user) { return <Redirect to="/" /> }

    return (
        <>
        <FullScreenDialog
            open={seedDialogOpen}
            handleClose={handleCloseSeedDialog}
            type={"Welcome to Schoolhouse Ghana!"}
            action={{ text: "Seed", function: handleSeedDatabase}}
        >

        </FullScreenDialog>
        <div style={{ display: "flex", width: "100%", height: "100vh" }}>
            <div style={{ margin: "auto" }}>
                <div className={classes.portal}>

                <Typography align='center' variant="h6" className={classes.title}>
                    login <FontAwesomeIcon icon={faChalkboardTeacher} size="lg" />
                </Typography>
                {props.hasError ?
                <div style={{ display: "flex", width: "100%", margin: "10px 0" }}>
                    <Typography align='center' color="error" variant="overline" style={{width: "100%"}}>
                        Account not found :(
                    </Typography>
                </div>
                    : ""
                }
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
                            onChange={handleChange}

                        />
                    </FormControl>
                </div>
                <div style={{ display: "flex", width: "100%", margin: "10px 0" }}>

                    <div style={{ margin: "auto" }}>
                        <Fab color="primary" aria-label="login" onClick={() => props.login(username, password)}>
                            <FontAwesomeIcon icon={faSignInAlt} size="lg" />
                        </Fab>
                    </div>
                </div>


                </div>

            </div>
        </div>
        </>

    );
}

export default LoginPortal;