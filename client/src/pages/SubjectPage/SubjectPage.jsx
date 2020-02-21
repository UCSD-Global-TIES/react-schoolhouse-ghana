import React, { useEffect, useState } from "react";
import { NavLink, Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute"
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText, CssBaseline } from "@material-ui/core"
// import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { useMediaQuery } from 'react-responsive';
import "../../utils/flowHeaders.min.css";
import API from "../../utils/API";

import "./main.css";
import NavBarAdmin from "../../components/NavBarAdmin";
import AccessDenied from "../../components/AccessDenied";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn, faFile } from "@fortawesome/free-solid-svg-icons";
import SimpleListView from "../../components/SimpleListView";
import PageSpinner from "../../components/PageSpinner";
import FileViewer from "../../components/FileViewer";
import AnnouncementViewer from "../../components/AnnouncementViewer";

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
    marginTop: "4rem",
    padding: theme.spacing(2),
  },
  buttonLink: {
    color: "inherit",
    textDecoration: "none"
  }
}));

function SubjectPage(props) {

  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isSmallDevice = useMediaQuery({
    query: '(max-width: 600px)'
  })
  const subject_id = props.match.params.id;

  const [subjectInfo, setSubjectInfo] = useState({});
  const [loading, setLoading] = useState(true);

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
      label: "Resources",
      icon: faFile,
      path: `${props.match.url}/resources`
    }
  ]

  const drawer = (
    <div
      onClick={isSmallDevice ? handleDrawerToggle : () => { }}
    >
      <div className={classes.toolbar} />
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
    </div>
  );

  const pagesInfo = [
    {
      component: (props) => (
        <SimpleListView
          title={"Announcements"}
          items={subjectInfo.announcements || []}
          pageMax={5}
          icon={faBullhorn}
          labelField={"title"}
          viewer={AnnouncementViewer}
          searchbar
          {...props}
        />
      ),
      path: `${props.match.path}/announcements`
    },
    {
      component: (props) => (
        <SimpleListView
          title={"Resources"}
          items={subjectInfo.files || []}
          pageMax={5}
          icon={faFile}
          labelField={"nickname"}
          viewer={FileViewer}
          searchbar
          {...props}
        />
      ),
      path: `${props.match.path}/resources`
    }
  ]

  // SET DEFAULT MENU
  const defaultRoute = `${props.match.path}/announcements`;

  useEffect(() => {
    // Retrieve 'Subject' document
    API
      .getSubject(subject_id, props.user.key)
      .then((subjectDoc) => {
        setSubjectInfo(subjectDoc.data);
        setLoading(false);
      })

  }, []);

  if (props.user.type === "Student" || props.user.type === "Teacher") {
    if (!props.user.profile.grade !== subjectInfo.grade) { return <AccessDenied /> }
  }

  if (loading) {
    return <PageSpinner />
  }

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
        {/* <div className={classes.toolbar} /> */}

        {/* <TransitionGroup>
          <CSSTransition
            key={props.location.key}
            timeout={300}
            classNames='fade'
          > */}
        <Switch location={props.location}>
          {
            pagesInfo.map((page, idx) => (
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

export default SubjectPage;
