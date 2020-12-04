import React from "react";
import { Link } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles';
import {  AppBar, Toolbar, Typography, IconButton, Button, ButtonGroup } from "@material-ui/core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faHome, faSchool } from '@fortawesome/free-solid-svg-icons'
import MenuIcon from "@material-ui/icons/Menu"
import Tooltip from '@material-ui/core/Tooltip';
import "./main.css"

const useStyles = makeStyles(theme => ({
root: {
    //flexGrow: 1
},
    title: {
    flexGrow: 1,
},
    navIcon: {
    margin: "0 5px",
    color: "white"
},
menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
    display: 'none',
    },
},
appBar: {
    [theme.breakpoints.up('sm')]: {
    // width: `calc(100% - ${drawerWidth}px)`,
    // marginLeft: drawerWidth,
    zIndex: 1300
    },
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

function NavBarAdmin(props) {
const classes = useStyles();

return (
<div className={classes.root} >

<AppBar position="fixed" className={classes.appBar}>
<Toolbar variant="dense">
    {/* <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={props.handleDrawerToggle}
        className={classes.menuButton}
    >
        <MenuIcon />
    </IconButton> */}
    <Typography variant="overline" className={classes.title}>
        <ButtonGroup variant="text" color="inherit">
            <Tooltip title="Home page" interactive>
                <Link to="/" className={classes.buttonLink} >
                    <Button border="white" color="white" disableElevation>
                        <div className={classes.hoveringText}>Semanhyia American School</div> &nbsp;    
                        {/* TODO: change logo here                    */}
                        <FontAwesomeIcon className={classes.navIcon} icon={faSchool} />      
                    </Button> </Link>
            </Tooltip>
        </ButtonGroup>
    </Typography>
        <ButtonGroup variant="contained" color="inherit">
            <Tooltip title="Sign out" interactive>
            <Button onClick={props.logout} variant="outlined" border="white" color="white" disableElevation>
                <div className={classes.hoveringText}>Sign out</div>
                <FontAwesomeIcon className={classes.navIcon} icon={faSignOutAlt} size="lg" />
            </Button>
            </Tooltip>
        </ButtonGroup>
        
</Toolbar>
</AppBar>

</div>
)

};

export default NavBarAdmin;