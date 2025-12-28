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
import { faBullhorn, faCheck, faFile, faSpinner, faUsers, } from "@fortawesome/free-solid-svg-icons";
import SimpleListView from "../../components/SimpleListView";
import PageSpinner from "../../components/PageSpinner";
import FileViewer from "../../components/FileViewer";
import MarksViewer from "../../components/MarksViewer";
import MarksForm from "../../components/MarksForm";


import DocumentEditor from "../../components/DocumentEditor";
import AnnouncementViewer from "../../components/AnnouncementViewer";
import SubjectAnnouncementsForm from "../../components/SubjectAnnouncementsForm";
import SubjectFilesForm from "../../components/SubjectFilesForm";
import SocketContext from "../../socket-context"
import clsx from "clsx"
import eduTies from "../../logos/eduTIES_logo.png"
import sas from "../../logos/sas_logo.png"  
// import AccountIcon from "../../../../assets/account-icon.svg";
// import BookIcon from "../../../../assets/books.svg";
import BullhornIcon from "../../assets/bullhorn.svg";
import OpenBookIcon from "../../assets/open-book.svg";
import HomeIcon from "../../assets/icons8-home.svg";
import HelpIcon from "../../assets/help.svg";


import BookIcon from "../../assets/books.svg";
import SubjectHome from "../../components/SubjectHome";
import AnnouncementCard from "../../components/AnnouncementCard/AnnouncementCard";
import SubjectTasksForm from "../../components/SubjectTasksForm";
import TaskList from "../../components/TaskList";
import LogoutIcon from "../../assets/LogoutIcon.svg";
import GradebookIcon from "../../assets/gradebookIcon.svg";
const drawerWidth = "9.375rem";


const useStyles = makeStyles(theme => ({
  root: {
    // display: "flex",
    alignItems: "flex-start",
  },
  toolbar: theme.mixins.toolbar,
  sidebar: {
    display: "flex",
    width: "9.375rem",
    padding: "3.5rem 0",
    flexDirection: "column",
    alignItems: "flex-start",
    flexShrink: "0",
    alignSelf: "stretch",
  },
  drawerPaper: {
    background: "var(--primary-color)",
    color: "var(--background-color)",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
  buttonLink: {
    color: "inherit",
    textDecoration: "none",
  },
  sidebarLinks: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flexStart",
    alignSelf: "stretch",
    width: "100%",
  },
  navLink: {
    textDecoration: "none",
    color: "inherit", // To keep the same color as the ListItemText
    display: "flex",
    height: "5rem",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.9375rem",
    alignSelf: "stretch",
  },
  linkBox: {
    display: "flex",
    flexDirection: "column",
  },
  justifyIcon: {
    display: "flex",
    justifyContent: "center",
  },
  header: {
    padding: "2.5rem 4.375rem 0 4.375rem",
  },
  subjectTitle: {
    fontFamily: "Asap Condensed",
    fontSize: "3rem",
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: "2.5rem",
    color: "#005FD9;",
    textTransform: "uppercase",
  },
  sectionContainer: {
    padding: "2.5rem 4.375rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.63rem",
  },


}));


function SubjectPage(props) {
  const socket = React.useContext(SocketContext)
  const classes = useStyles();
  const theme = useTheme();

  const { subjects } = props; 

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isSmallDevice = useMediaQuery({
    query: '(max-width: 600px)'
  })
  const subject_id_param = props.match.params.id;
  
  // Extract actual subject ID from composite ID (format: subjectId_gradeId)
  const subject_id = subject_id_param.includes('_') ? subject_id_param.split('_')[0] : subject_id_param;
  const gradeIdFromUrl = subject_id_param.includes('_') ? subject_id_param.split('_')[1] : null;
  
  // Extract grade level and section from URL query parameters
  const urlParams = new URLSearchParams(props.location.search);
  const gradeLevel = urlParams.get('gradeLevel');
  const gradeSection = urlParams.get('gradeSection');


  const [subjectInfo, setSubjectInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  const { logout } = props


  // derive portal base path (so Home/Classes go back to the portal)
  const portalBase = props.user && props.user.type === 'Teacher' ? '/teacher' : (props.user && props.user.type === 'Admin' ? '/edit' : '/user');

  // Only include a Home link in the subject drawer if the current location
  // is not already under the portal base (prevents duplicate Home entries
  // when subject is rendered inside a portal nested route).
  const includeHome = !props.location.pathname.startsWith(portalBase);

  // menu items
  const documentMenuItems = [
    ...(includeHome ? [{
      label: "Home",
      iconPath: HomeIcon,
      path: portalBase,
    }] : []),
    {
      label: "Classes",
      iconPath: BookIcon,
      // link back to portal classes list so users exit subject context
      path: `${portalBase}/classes`,
    },
    {
      label: "Subject",
      iconPath: OpenBookIcon,
      // point the main sidebar entry to the composite resources view
      path: `${props.match.url}/resources`,
    },
    {
      label: "Gradebook",
      iconPath: GradebookIcon,
      path: (gradeLevel && gradeSection) 
        ? `/gradebook/${subject_id_param}?gradeLevel=${gradeLevel}&gradeSection=${gradeSection}`
        : `/gradebook/${subject_id_param}`,
    },
    {
      label: "Log Out",
      iconPath: LogoutIcon,
      clickHandler: logout,
    }
  ];


  const drawer = (
    <div onClick={isSmallDevice ? handleDrawerToggle : () => {}}>
      <List className={classes.sidebar}>
        <div
          style={{
            textAlign: "center",
            margin: "0 auto",
            marginBottom: "10px",
            color: "var(--background-color)",
          }}
        >
          <h1 style={{ fontSize: "1.75rem" }}>Semanhyia</h1>
          <h2 style={{ fontSize: "1.125rem" }}>American School</h2>
        </div>
        <div className={classes.sidebarLinks}>
                  {documentMenuItems.map((item, index) => (
                    item.clickHandler ? (
                      <ListItem
                        key={index}
                        button
                        onClick={item.clickHandler}
                        className={classes.linkBox}
                      >
                        <ListItemIcon className={classes.justifyIcon}>
                          <img
                            src={item.iconPath}
                            alt={`${item.label} icon`}
                            style={{ width: 24, height: 24 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          style={{ overflowWrap: "break-word" }}
                          primary={item.label}
                        />
                      </ListItem>
                    ) : (
                      <NavLink
                        to={item.path}
                        key={index}
                        className={`${classes.buttonLink} ${classes.navLink}`}
                      >
                        <ListItem
                          selected={props.location.pathname.includes(item.path)}
                          button
                          className={classes.linkBox}
                        >
                          <ListItemIcon className={classes.justifyIcon}>
                            <img
                              src={item.iconPath}
                              alt={`${item.label} icon`}
                              style={{ width: 24, height: 24 }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            style={{ overflowWrap: "break-word" }}
                            primary={item.label}
                          />
                        </ListItem>
                      </NavLink>
                    )
                  ))}
                </div>
      </List>
    </div>
  );


  const pagesInfo = [
    {
      component: (props) => (
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
          {...props}
        />
      ),
      path: `${props.match.path}/announcements`
    },
    
    {
      component: (props) => (
        <>
          <DocumentEditor
            primary={doc => doc.title}
            isSubComponent={"true"}
            collection={"Announcements"}
            icon={faBullhorn}
            FormComponent={(p) =>
              <SubjectAnnouncementsForm user={props.user} {...p} />
            }
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
            {...props}
          />
          
          <DocumentEditor
            primary={doc => doc.title}
            isSubComponent={"true"}
            collection={"Upcoming Tasks"}
            icon={faBullhorn}
            FormComponent={(p) =>
              <SubjectTasksForm user={props.user} {...p} />
            }
            get={(key) => API.getTasks(subject_id, key)}
            post={(doc, key, user) => {
              let newA = doc;
              newA.subject = subject_id;
              newA.private = true;
              return API.addTask(newA, key, user)
            }}
            put={API.updateTask}
            delete={API.deleteTask}
            validation={{
              title: {
                validate: value => new Promise((resolve, reject) => {
                  resolve(value)
                }),
                message: "You must enter a task title."
              },
              description: {
                validate: value => new Promise((resolve, reject) => {
                  resolve(value)
                }),
                message: "You must enter some task content."
              },
            }}
            {...props}
          />
    
          <Typography variant="h2" className={classes.header}>Resources</Typography>
          
          <SubjectFilesForm
            document={subjectInfo}
            {...props}
          />
        </>
      ),
      path: `${props.match.path}/resources`
    },
    {
      component: (props) => (
        props.user.type === "Student" ?
          <MarksViewer {...props}/> :
          <MarksForm subject_id={subject_id}/>
      ),
      path: `${props.match.path}/studentGrades`
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




  // SET DEFAULT MENU (open the composite Resources view by default)
  const defaultRoute = `${props.match.path}/resources`;


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


        {/* <Typography style={{ padding: "1rem" }} align='center' className={clsx(classes.textGlow, "flow-text")} variant="h3"> {subjectInfo.name} </Typography> */}
        <Typography variant="h1" className={classes.header}>{props.user.type}'s Class</Typography>
        <Typography className={clsx(classes.header,classes.subjectTitle)}>{subjectInfo.name}</Typography>


        {/* Gradebook is available in the sidebar menu (see documentMenuItems) */}

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