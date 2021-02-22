import React, { useEffect, useState } from "react";
import { NavLink, Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute"
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab'
import { Typography, Snackbar, Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText, CssBaseline } from "@material-ui/core"
// import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { useMediaQuery } from 'react-responsive';
import "../../utils/flowHeaders.min.css";
import API from "../../utils/API";

import "./main.css";
import NavBarAdmin from "../../components/NavBarAdmin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn, faFile, faSpinner } from "@fortawesome/free-solid-svg-icons";
import SimpleListView from "../../components/SimpleListView";
import PageSpinner from "../../components/PageSpinner";
import FileViewer from "../../components/FileViewer";
import DocumentEditor from "../../components/DocumentEditor";
import AnnouncementViewer from "../../components/AnnouncementViewer";
import SubjectAnnouncementsForm from "../../components/SubjectAnnouncementsForm";
import SubjectFilesForm from "../../components/SubjectFilesForm";
import SocketContext from "../../socket-context"
import clsx from "clsx"
import eduTies from "../../logos/eduTIES_logo.png"
import sas from "../../logos/sas_logo.png"  

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
    backgroundColor: "#f7ee9a",
  },
  content: {
    flexGrow: 1,
    marginTop: "4rem",
    padding: theme.spacing(2),
  },
  buttonLink: {
    color: "inherit",
    textDecoration: "none"
  },
  textGlow: {
    color: "black",
    // textShadow: "2px 2px 7px #787676"
  },
}));

function SubjectPage(props) {
  const socket = React.useContext(SocketContext)
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isSmallDevice = useMediaQuery({
    query: '(max-width: 600px)'
  })
  const subject_id = props.match.params.id;

  const [subjectInfo, setSubjectInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
  ];

  const drawer = (
    <div
      onClick={isSmallDevice ? handleDrawerToggle : () => { }}
    >
      <div className={classes.toolbar} />
      <List>
      <div style={{textAlign: "center"}}> <img src={sas} alt="sas logo" height={150} width={150}/></div>
      <div style={{marginTop: "10px"}}> </div>
        {documentMenuItems.map((item, index) => (
          <NavLink to={item.path} key={index} className={classes.buttonLink}>
            <ListItem selected={props.location.pathname.includes(item.path)} button>
              <ListItemIcon>{<FontAwesomeIcon icon={item.icon} />}</ListItemIcon>
              <ListItemText style={{ overflowWrap: "break-word" }} primary={item.label} />
            </ListItem>
          </NavLink>
        ))}
      </List>
    <img src={eduTies} alt="eduTies_logo" height={200} width={200} style={{position: "absolute", top: 680}}/>
    </div>
  );

  const pagesInfo = [
    {
      component:
        props.user.type === "Student" ?
          (props) => (
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
          )
          :
          (p) => (
            <DocumentEditor
              primary={doc => doc.title}
              collection={"Subject Announcements"}
              icon={faBullhorn}
              FormComponent={(p) =>
                <SubjectAnnouncementsForm user={props.user} {...p} />}
              get={(key) => API.getAnnouncements(key, subject_id)}
              post={(doc, key, user) => {
                let newA = doc;
                newA.subject = subject_id;
                newA.private = true;
                return API.addAnnouncement(newA, key, user)
              }}
              put={API.updateAnnouncement}
              delete={API.deleteAnnouncements}
              validation={{
                title: {
                  validate: value => new Promise((resolve, reject) => {
                    resolve(value)
                  }),
                  message: "You must enter an announcement title."
                },
                content: {
                  validate: value => new Promise((resolve, reject) => {
                    resolve(value)
                  }),
                  message: "You must enter some announcement content."
                },
              }}
              {...p}
            />
          )
      ,
      path: `${props.match.path}/announcements`
    },
    {
      component:
        props.user.type === "Student" ?
          (props) => (
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
          )
          :
          (props) => (
            <SubjectFilesForm
              document={subjectInfo}
              {...props}
            />

          )
      ,
      path: `${props.match.path}/resources`
    }
  ]

  const handleRefresh = () => {
    setRefreshing(true);

    API
      .getSubject(subject_id, props.user.key)
      .then((subjectDoc) => {
        setRefreshing(false);
        setSubjectInfo(subjectDoc.data);
      })
  }


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

    // LISTEN FOR MODIFIED SUBJECT (INCOMPLETE)
    const collections = ['subjects', 'announcements', 'subject announcements', `subject-files-${subject_id}`];
    for (const collection of collections) {
      socket.on(`refresh-${collection}`, function () {
        handleRefresh();
      })
    }

  }, []);

  // if (props.user.type === "Student" || props.user.type === "Teacher") {
  //   if (!props.user.profile.grade !== subjectInfo.grade) { return <AccessDenied /> }
  // }

  if (loading) {
    return <PageSpinner />
  }

  return (
    <div className={classes.root}>
      {/* ALERTS FOR API ACTIONS */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={refreshing}
      >
        <Alert severity={'info'}>
          Refreshing...
        </Alert>
      </Snackbar>

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

        <Typography style={{ padding: "1rem" }} align='center' className={clsx(classes.textGlow, "flow-text")} variant="h3"> {subjectInfo.name} </Typography>


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
