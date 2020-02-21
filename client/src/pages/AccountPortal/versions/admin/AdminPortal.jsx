import React, { useEffect } from "react";
import { NavLink, Switch, Redirect } from "react-router-dom";
import AnnouncementsForm from "../../../../components/AnnouncementsForm";
import GradesForm from "../../../../components/GradesForm";
import ClassesForm from "../../../../components/ClassesForm";
import AccountsForm from "../../../../components/AccountsForm";
import ServerDash from "../../../../components/ServerDash"
import ProtectedRoute from "../../../../components/ProtectedRoute"
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Drawer, Hidden, Divider, List, ListItem, ListItemIcon, ListItemText, CssBaseline, TextField } from "@material-ui/core"
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { useMediaQuery } from 'react-responsive';
import "../../../../utils/flowHeaders.min.css";
import "./main.css";
import NavBarAdmin from "../../../../components/NavBarAdmin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faBullhorn, faChalkboardTeacher, faShapes, faServer, faFile } from "@fortawesome/free-solid-svg-icons";
import DocumentEditor from '../../../../components/DocumentEditor'
import FilesForm from "../../../../components/FilesForm";

const drawerWidth = 220;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    toolbar: theme.mixins.toolbar,
    // drawer: {
    //     [theme.breakpoints.up('sm')]: {
    //         width: drawerWidth,
    //         flexShrink: 0,
    //     },
    // },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(1),
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
    const isSmallDevice = useMediaQuery({
        query: '(max-width: 600px)'
    })


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // menu items
    const documentMenuItems = [
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

    const otherMenuItems = [
        {
            label: "Accounts",
            icon: faUsers,
            path: `${props.match.url}/accounts`
        },
        {
            label: "Files",
            icon: faFile,
            path: `${props.match.url}/files`
        },
        {
            label: "Server",
            icon: faServer,
            path: `${props.match.url}/server`
        },
    ]

    const drawer = (
        <div
            onClick={isSmallDevice ? handleDrawerToggle : () => { }}
        >
            <div className={classes.toolbar} />
            {/* <Divider /> */}
            <List>
                {documentMenuItems.map((item, index) => (
                    <NavLink to={item.path} key={index} className={classes.buttonLink}>
                        <ListItem selected={props.location.pathname.includes(item.path)} button>
                            <ListItemIcon>{<FontAwesomeIcon icon={item.icon} />}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItem>
                    </NavLink>
                ))}
            </List>
            <Divider />
            <List>
                {otherMenuItems.map((item, index) => (

                    <NavLink to={item.path} key={index} className={classes.buttonLink}>
                        <ListItem button selected={props.location.pathname.includes(item.path)} >
                            <ListItemIcon>{<FontAwesomeIcon icon={item.icon} />}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItem>
                    </NavLink>
                ))}
            </List>
        </div>
    );

    const pagesInfo = [
        {
            collection: "Announcements",
            icon: faBullhorn,
            FormComponent: AnnouncementsForm,
            primary: "title",
            path: `${props.match.path}/announcements`
        },
        {
            collection: "Grades",
            icon: faShapes,
            FormComponent: GradesForm,
            primary: "title",
            path: `${props.match.path}/grades`
        },
        {
            collection: "Classes",
            icon: faChalkboardTeacher,
            FormComponent: ClassesForm,
            primary: "title",
            path: `${props.match.path}/classes`
        },
        {
            collection: "Accounts",
            icon: faUsers,
            FormComponent: AccountsForm,
            primary: "title",
            path: `${props.match.path}/accounts`
        },
        {
            collection: "Files",
            icon: faFile,
            FormComponent: FilesForm,
            primary: "nickname",
            path: `${props.match.path}/files`
        }
    ]

    let pages = [];

    pagesInfo.map((page, idx) => {
        pages.push({
            path: page.path,
            component: (props) =>
                <DocumentEditor
                    primary={page.primary}
                    collection={page.collection}
                    icon={page.icon}
                    FormComponent={page.FormComponent}
                    {...props} />
        })
    })

    // ADD SERVER MANAGEMENT PAGE
    pages.push({ path: `${props.match.path}/server`, component: ServerDash })

    // SET DEFAULT MENU
    const defaultRoute = `${props.match.path}/announcements`;

    useEffect(() => {
    }, [])

    return (
        <div className={classes.root}>
            <CssBaseline />
            <NavBarAdmin logout={props.logout} handleDrawerToggle={handleDrawerToggle} />
            <nav className={classes.drawer}>
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
            <main className={classes.content} style={{ marginLeft: !isSmallDevice ? drawerWidth : 0, }}>
                <div className={classes.toolbar} />

                {/* <TransitionGroup>
                    <CSSTransition
                        key={props.location.key}
                        timeout={300}
                        classNames='fade'
                    > */}
                        <Switch location={props.location}>
                            {
                                pages.map((page, idx) => (
                                    <ProtectedRoute key={`page-${idx}`} exact path={page.path} component={page.component} user={props.user} />

                                ))
                            }
                            <Redirect to={defaultRoute} />
                        </Switch>
                    {/* </CSSTransition>
                </TransitionGroup> */}
            </main>
        </div>

        // </div>    
    );
}

export default AdminPortal;
