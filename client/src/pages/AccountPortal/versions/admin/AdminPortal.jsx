import React from "react";
import { Route, NavLink, Switch, Redirect } from "react-router-dom";
import AnnouncementsForm from "../../../../components/AnnouncementsForm";
import GradesForm from "../../../../components/GradesForm";
import ClassesForm from "../../../../components/ClassesForm";
import AccountsForm from "../../../../components/AccountsForm";
import NoMatch from "../../../NoMatch/index";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Drawer, Hidden, Divider, List, ListItem, ListItemIcon, ListItemText, CssBaseline} from "@material-ui/core"
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import "../../../../utils/flowHeaders.min.css";
import "./main.css";
import NavBarAdmin from "../../../../components/NavBarAdmin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faBullhorn, faChalkboardTeacher, faShapes } from "@fortawesome/free-solid-svg-icons";

const drawerWidth = 220;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    toolbar: theme.mixins.toolbar,
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    buttonLink: {
        color: "inherit",
        textDecoration: "none"
    }
}));

function AdminPortal(props) {

    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [selectedIdx, setSelectedIdx] = React.useState(0);


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleListItemClick = (index) => {
        setSelectedIdx(index);
    };

    const menuItems = [
        {
            label: "Announcements",
            icon: faBullhorn,
            path: `${props.match.url}/announcements`
        },
        {
            label: "Grades",
            icon: faShapes,
            path: `${props.match.url}/grades`
        },
        {
            label: "Classes",
            icon: faChalkboardTeacher,
            path: `${props.match.url}/classes`
        },

    ]


    const drawer = (
        <div>
            <div className={classes.toolbar} />
            {/* <Divider /> */}
            <List>
                {menuItems.map((item, index) => (
                    <NavLink to={item.path} key={index} className={classes.buttonLink}>
                        <ListItem selected={selectedIdx === index} onClick={() => handleListItemClick(index)} button>
                            <ListItemIcon>{<FontAwesomeIcon icon={item.icon}/>}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItem>
                    </NavLink>
                ))}
            </List>
            <Divider />
            <List>
                <NavLink to={`${props.match.url}/accounts`} className={classes.buttonLink}>
                    <ListItem button selected={selectedIdx === menuItems.length} onClick={() => handleListItemClick(menuItems.length)}>
                    <ListItemIcon>{<FontAwesomeIcon icon={faUsers} />}</ListItemIcon>
                        <ListItemText primary={"Accounts"} />
                    </ListItem>
                    </NavLink>
            </List>
        </div>
    );


    return (
        <div className={classes.root}>
            <CssBaseline />
            <NavBarAdmin logout={props.logout} handleDrawerToggle={handleDrawerToggle}/>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar} />
    
        {/* <div style={{ display: "flex", width: "100%", height: "100vh" }}>   */}
            
            
            {/* <div style={{ margin: "auto" }}> ADMIN PORTAL </div> */}
            {/* Add, Delete, Update Classes */}
            {/* Add, Delete Student/Teacher accounts to classes */}
            {/* Get, Add, Delete, Update School Announcements */}
            {/* Get all grades */}
            {/* Get, Add, Delete grade */}
            {/* Add, delete accounts */}

            {/* General Layout (menu in side panel, MUI Responsive Drawer) */}
            {/* https://www.w3schools.com/howto/howto_css_custom_scrollbar.asp */}
            {/* https://material-ui.com/components/drawers/#responsive-drawer */}
            
            {/* Render all school / with CRUD buttons */}
            {/* Render all grades (w/CRUD dialog) with associated classes (w/CRUD dialog) */}
            {/* Render all accounts (w/ CRUD dialog) */}

            {/*  */}
                <TransitionGroup>
                    <CSSTransition
                        key={props.location.key}
                        timeout={300}
                        classNames='fade'
                    >
                        <Switch location={props.location}>
                <Route exact path={`${props.match.path}/announcements`} component={AnnouncementsForm} user={props.user} />
                <Route exact path={`${props.match.path}/grades`} component={GradesForm} user={props.user} />
                <Route exact path={`${props.match.path}/classes`} component={ClassesForm} user={props.user} />
                <Route exact path={`${props.match.path}/accounts`} component={AccountsForm} user={props.user} />
                <Route component={() => <Redirect to={`${props.match.path}/announcements`} />} />
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
            </main>
        </div>

        // </div>    
    );
}

export default AdminPortal;
