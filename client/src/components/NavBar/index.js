import React from "react";
import { Link } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button, ButtonGroup } from "@material-ui/core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt, faHome, faSchool } from '@fortawesome/free-solid-svg-icons'
import "./main.css"

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    navIcon: {
        margin: "0 5px"
    },
    buttonLink: {
        color: "inherit",
        textDecoration: "none"
    }

}));

function NavBar(props) {
    const classes = useStyles();

    return (
        <AppBar position="fixed">
            <Toolbar variant="dense">
                <Typography variant="overline" className={classes.title}>
                    Schoolhouse Ghana&nbsp;&nbsp;<FontAwesomeIcon icon={faSchool} />
                </Typography>
                {props.user ?
                    <ButtonGroup variant="text" color="inherit">
                        <Button >
                            <Link to="/" className={classes.buttonLink} >
                                <FontAwesomeIcon className={classes.navIcon} icon={faHome} size="lg" />
                            </Link>
                        </Button>
                        <Button onClick={props.logout}>
                            {/* <Link to="/login" className={classes.buttonLink} > */}
                                <FontAwesomeIcon className={classes.navIcon} icon={faSignOutAlt} size="lg" />
                            {/* </Link> */}
                        </Button>
                    </ButtonGroup>
                    :
                    <Button color="inherit" onClick={props.login}>
                        <FontAwesomeIcon icon={faSignInAlt} size="lg" />
                    </Button>


                }
            </Toolbar>
        </AppBar>
    )


};

export default NavBar;