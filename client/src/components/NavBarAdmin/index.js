import React from "react";
import { Link } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles';
import {  AppBar, Toolbar, Typography, IconButton, Button, ButtonGroup } from "@material-ui/core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faHome, faSchool } from '@fortawesome/free-solid-svg-icons'
import MenuIcon from "@material-ui/icons/Menu"
import "./main.css"

const useStyles = makeStyles(theme => ({
    root: {
        // flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
    navIcon: {
        margin: "0 5px"
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
    }

}));

function NavBarAdmin(props) {
    const classes = useStyles();
   
    return (
        <div className={classes.root} >

        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar variant="dense">
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={props.handleDrawerToggle}
                    className={classes.menuButton}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="overline" className={classes.title}>
                    Schoolhouse Ghana&nbsp;&nbsp;<FontAwesomeIcon icon={faSchool} /> 
                </Typography>
                    <ButtonGroup variant="text" color="inherit">
                        <Button >
                            <Link to="/" className={classes.buttonLink} >
                                <FontAwesomeIcon className={classes.navIcon} icon={faHome} size="lg" />
                            </Link>
                        </Button>
                        <Button onClick={props.logout}>
                            <FontAwesomeIcon className={classes.navIcon} icon={faSignOutAlt} size="lg" />
                        </Button>
                    </ButtonGroup>
                    
            </Toolbar>
            </AppBar>

        </div>
    )


};

export default NavBarAdmin;