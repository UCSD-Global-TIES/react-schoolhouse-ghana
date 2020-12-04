import React from "react";
import { Link } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button, ButtonGroup } from "@material-ui/core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt, faHome, faSchool } from '@fortawesome/free-solid-svg-icons'
import Tooltip from '@material-ui/core/Tooltip';
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
    margin: "0 5px",
    color: "white"
},
buttonLink: {
    color: "inherit",
    textDecoration: "none"
},
hoveringText: { 
    flexGrow: 1,
    color: "white",
}

}));

function NavBar(props) {
const classes = useStyles();


return (
    <AppBar position="fixed">
        <Toolbar variant="dense">
            <Typography variant="overline" className={classes.title}>
                <ButtonGroup variant="text" color="inherit">
                    <Tooltip title="Home page" interactive>
                        <Link to="/" className={classes.buttonLink} >
                            <Button border="white" color="white" disableElevation>
                                <div className={classes.hoveringText}>Semanhyia American School</div> &nbsp;                        
                                <FontAwesomeIcon className={classes.navIcon} icon={faSchool} />      
                            </Button> 
                        </Link>
                    </Tooltip>
                </ButtonGroup>            
            </Typography>

            {props.user ?
                <ButtonGroup variant="contained" color="inherit">
                    <Tooltip title="Sign out" interactive>
                        <Button onClick={props.logout} variant="outlined" border="white" color="white" disableElevation>
                            <div className={classes.hoveringText}>Sign out</div>
                            <FontAwesomeIcon className={classes.navIcon} icon={faSignOutAlt} size="lg" />
                        </Button>
                    </Tooltip>
                </ButtonGroup>
                 :
                 <div> </div>
            }
        </Toolbar>
    </AppBar>
)

};

export default NavBar;