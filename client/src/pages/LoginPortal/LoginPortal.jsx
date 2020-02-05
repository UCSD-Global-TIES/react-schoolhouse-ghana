import React, { useState } from "react";
import "../../utils/flowHeaders.min.css";
import "./main.css";
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import { FormControl, InputLabel, Input, InputAdornment, Fab, Typography } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Key from "@material-ui/icons/VpnKey";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons'

const useStyles = makeStyles(theme => ({
    formInput: {
        margin: "1em"
    },
    title: {
        width: "100%",
        display: "block",
        margin: "20px 0"
    }

}));

function LoginPortal(props) {
    const classes = useStyles();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const set = {
        username: setUsername,
        password: setPassword
    }

    const handleChange = (e) => {
        set[e.target.name](e.target.value);
    }


    if (props.user) { return <Redirect to="/" /> }

    return (
        <div style={{ display: "flex", width: "100%", height: "100vh" }}>
            <div style={{ margin: "auto" }}>
                <div>

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
                <div className={classes.formInput}>
                    <FormControl>
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
                <div className={classes.formInput}>
                    <FormControl>
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

    );
}

export default LoginPortal;