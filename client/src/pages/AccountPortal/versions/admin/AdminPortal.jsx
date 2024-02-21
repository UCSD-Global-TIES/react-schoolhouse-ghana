// React and Hooks
import React, { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { NavLink, Redirect, Switch } from "react-router-dom";
// import AccountManager from "../../../../components/AccountManager/AccountManager";

// Material-UI Components and Styles
import {
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

// FontAwesome Icons
import {
  faBullhorn,
  faChalkboardTeacher,
  faCheckCircle,
  faFile,
  faShapes,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

// Local Components
import AccountsForm from "../../../../components/AccountsForm";
import AnnouncementsForm from "../../../../components/AnnouncementsForm";
import AssessmentForm from "../../../../components/AssessmentForm";
import Button from "../../../../components/Button/Button";
import DocumentEditor from "../../../../components/DocumentEditor";
import FilesForm from "../../../../components/FilesForm";
import GradesForm from "../../../../components/GradesForm";
import NameCard from "../../../../components/NameCard/NameCard";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import SubjectsForm from "../../../../components/SubjectsForm";
import UploadQueue from "../../../../components/UploadQueue";
import SearchBar from "../../../../components/SearchBar/SearchBar.js";

// Utils and Context
import SocketIOFileUpload from "socketio-file-upload";
import SocketContext from "../../../../socket-context";
import API from "../../../../utils/API";

// Styles and Assets
import "../../../../App.css";
import "../../../../utils/flowHeaders.min.css";
import "./main.css";
// import { ReactComponent as BullhornIcon } from "../../../../assets/bullhorn.svg";
// import { ReactComponent as BookIcon } from "../../../../assets/books.svg";
// import { ReactComponent as AccountIcon } from "../../../../assets/account-icon.svg";

import AccountIcon from "../../../../assets/account-icon.svg";
import BookIcon from "../../../../assets/books.svg";
import BullhornIcon from "../../../../assets/bullhorn.svg";


const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
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
    background: "var(--background-color)",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
  buttonLink: {
    color: "inherit",
    textDecoration: "none",
  },
  navLink: {
    '&&': {
      marginBottom: theme.spacing(2), // Adjust the number for desired spacing
    },
    textDecoration: 'none',
    color: 'inherit', // To keep the same color as the ListItemText
  },
}));

function AdminPortal(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isSmallDevice = useMediaQuery({
    query: "(max-width: 600px)",
  });
  const socket = useContext(SocketContext);
  const siofu = new SocketIOFileUpload(socket);

  // "Admin","Teachers", "Students" categories
  const [admins, setAdmins] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);

  // function to handle adding new admin
  const addAdmin = (adminName) => {
    setAdmins(prevAdmin => [...prevAdmin, adminName]);
  };
  // function to handle adding new teacher
  const addTeacher = (teacherName) => {
    setTeachers(prevTeachers => [...prevTeachers, teacherName]);
  };
  // function to handle adding new student
  const addStudent = (studentName) => {
    setStudents(prevStudents => [...prevStudents, studentName]);
  };

  // Render the NameCards for each category
  const renderNameCards = (list) => {
    return list.map((name, index) => (
      <NameCard key={index} name={name} />
    ));
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  // menu items
  const documentMenuItems = [
    {
      label: "Announcements",
    //   icon: BullhornIcon,
      iconPath: BullhornIcon,
      path: `${props.match.url}/announcements`,
    },
    {
      label: "Class Manager",
    //   Icon: BookIcon,
    //   icon: "../../../../assets/books.svg",
    iconPath: BookIcon,
      path: `${props.match.url}/grades`,
    },
    {
      label: "Account Manager",
      iconPath: AccountIcon,
    //   Icon: AccountIcon,
      // icon: "../../../../assets/buaccount-icon.svg",
      path: `${props.match.url}/accounts`,
    },
    // {
    //   label: "Subjects",
    //   icon: faChalkboardTeacher,
    //   path: `${props.match.url}/subjects`,
    // },
  ];

  // const otherMenuItems = [
  //   {
  //     label: "Accounts",
  //     icon: faUsers,
  //     path: `${props.match.url}/accounts`,
  //   },
  //   {
  //     label: "Files",
  //     icon: faFile,
  //     path: `${props.match.url}/files`,
  //   },
  //   {
  //     label: "Assessment",
  //     icon: faCheckCircle,
  //     path: `${props.match.url}/assessment`,
  //   },
  //   {
  //     label: "Accounts",
  //     icon: faUsers,
  //     path: `${props.match.url}/accounts`,
  //   },
  // ];

  const drawer = (
    <div onClick={isSmallDevice ? handleDrawerToggle : () => {}}>
      <List>
        <div
          id="heading-text"
          style={{ textAlign: "center", margin: "0 auto" }}
        >
          <h1>Semanhyia</h1>
          <h2>American School</h2>
        </div>
        <div style={{ marginTop: "10px" }}> </div>
        {documentMenuItems.map((item, index) => (
          <NavLink to={item.path} key={index} className={`${classes.buttonLink} ${classes.navLink}`}>
            <ListItem
              selected={props.location.pathname.includes(item.path)}
              button
            >
            {/* <ListItemIcon src={item.iconPath}></ListItemIcon> */}
            <ListItemIcon>
  <img src={item.iconPath} alt={`${item.label} icon`} style={{ width: 24, height: 24 }} />
</ListItemIcon>

              <ListItemText
                style={{ overflowWrap: "break-word" }}
                primary={item.label}
              />
            </ListItem>
          </NavLink>
        ))}
      </List>
      <Divider />
      {/* <List>
        {otherMenuItems.map((item, index) => (
          <NavLink to={item.path} key={index} className={classes.buttonLink}>
            <ListItem
              button
              selected={props.location.pathname.includes(item.path)}
            >
              <ListItemIcon>
                {<FontAwesomeIcon icon={item.icon} />}
              </ListItemIcon>
              <ListItemText
                style={{ overflowWrap: "break-word" }}
                primary={item.label}
              />
            </ListItem>
          </NavLink>
        ))}
      </List> */}

      {/* <img src={eduTies} alt="eduTies" height={200} width={200} style={{position: "absolute", top: 680}}/> */}
    </div>
  );

  const pagesInfo = [
    {
      collection: "Announcements",
      icon: faBullhorn,
      FormComponent: (p) => <AnnouncementsForm user={props.user} {...p} />,
      primary: (doc) => doc.title,
      path: `${props.match.path}/announcements`,
      api: {
        get: API.getAnnouncements,
        post: API.addAnnouncement,
        put: API.updateAnnouncement,
        delete: API.deleteAnnouncements,
      },
      validation: {
        title: {
          validate: (value) =>
            new Promise((resolve, reject) => {
              resolve(value);
            }),
          message: "You must enter an announcement title.",
        },
        content: {
          validate: (value) =>
            new Promise((resolve, reject) => {
              resolve(value);
            }),
          message: "You must enter some announcement content.",
        },
      },
    },
    {
      collection: "Grades",
      icon: faShapes,
      FormComponent: (p) => <GradesForm user={props.user} {...p} />,
      primary: (doc) => `Grade ${doc.level}`,
      path: `${props.match.path}/grades`,
      api: {
        get: API.getGrades,
        post: API.addGrade,
        put: API.updateGrade,
        delete: API.deleteGrades,
      },
      validation: {
        level: {
          validate: (value) =>
            new Promise((resolve, reject) => {
              API.getGrades(props.user.key).then((result) => {
                const grades = result.data;

                for (const grade of grades) {
                  if (grade.level === parseInt(value)) resolve(false);
                }
                resolve(true);
              });
            }),
          message: "You must enter a grade level that does not yet exist.",
        },
      },
    },
    {
      collection: "Subjects",
      link: (doc) => `/subject/${doc._id}`,
      icon: faChalkboardTeacher,
      FormComponent: (p) => <SubjectsForm user={props.user} {...p} />,
      primary: (doc) => doc.name,
      path: `${props.match.path}/subjects`,
      api: {
        get: API.getSubjects,
        post: API.addSubject,
        put: API.updateSubject,
        delete: API.deleteSubjects,
      },
      validation: {
        name: {
          validate: (value) =>
            new Promise((resolve, reject) => {
              if (!value) resolve(false);

              API.getSubjects(props.user.key).then((result) => {
                const subjects = result.data;

                for (const subject of subjects) {
                  if (subject.name === value) resolve(false);
                }
                resolve(true);
              });
            }),
          message:
            "You must enter a subject name, one that does not already exist",
        },
      },
    },
    {
      collection: "Accounts",
      icon: faUsers,
      FormComponent: (p) => <AccountsForm user={props.user} {...p} />,
      primary: (doc) => `${doc.first_name} ${doc.last_name} (${doc.type})`,
      path: `${props.match.path}/accounts`,
      api: {
        get: API.getAccounts,
        post: API.addAccount,
        put: API.updateAccount,
        delete: API.deleteAccounts,
      },
      validation: {
        first_name: {
          validate: (value) =>
            new Promise((resolve, reject) => {
              resolve(value);
            }),
          message: "You must enter the user's first name.",
        },
        last_name: {
          validate: (value) =>
            new Promise((resolve, reject) => {
              resolve(value);
            }),
          message: "You must enter the user's last name.",
        },
        type: {
          validate: (value) =>
            new Promise((resolve, reject) => {
              resolve(value);
            }),
          message: "You must select the user's account type.",
        },
        password: {
          validate: (value) =>
            new Promise((resolve, reject) => {
              if (!value) resolve(false);

              if (value.length >= 5) resolve(true);
              else resolve(false);
            }),
          message: "You must enter a password longer than five characters.",
        },
      },
    },
    {
      collection: "Files",
      link: (doc) => doc.path,
      icon: faFile,
      FormComponent: FilesForm,
      primary: (doc) => doc.nickname,
      path: `${props.match.path}/files`,
      api: {
        get: API.getFiles,
        put: API.updateFile,
        delete: API.deleteFiles,
        post: (doc) => {
          return new Promise((resolve, reject) => {
            siofu.submitFiles(doc.files);
            resolve({
              data: {},
            });
          });
        },
      },
      validation: {
        nickname: {
          updateOnly: true,
          validate: (value) =>
            new Promise((resolve, reject) => {
              resolve(value);
            }),
          message: "You must enter an informative file nickname",
        },
      },
    },
    {
      collection: "Assessment",
      link: (doc) => `/assessment/yolo`, // TODO: Set specific quiz ID into the URL once backend is finished
      icon: faCheckCircle,
      FormComponent: (p) => <AssessmentForm user={props.user} {...p} />,
      primary: (doc) => doc.title,
      path: `${props.match.path}/assessment`,
      api: {
        get: API.getAssessments,
        // TODO: Other API requests once we start implementing ability to create tests
      },
      validation: {},
    },
  ];

  let pages = [];

  pagesInfo
    .filter((obj) => obj.collection != "Files")
    .map((page, idx) => {
      console.log(page.path);
      pages.push({
        path: page.path,
        component: (props) => (
          <DocumentEditor
            link={page.link}
            primary={page.primary}
            collection={page.collection}
            icon={page.icon}
            FormComponent={page.FormComponent}
            get={page.api.get}
            post={page.api.post}
            put={page.api.put}
            delete={page.api.delete}
            validation={page.validation}
            {...props}
          />
        ),
      });
    });

  pagesInfo
    .filter((obj) => obj.collection == "Files")
    .map((page, idx) => {
      pages.push({
        path: page.path,
        component: (props) => (
          <>
            <DocumentEditor
              link={page.link}
              primary={page.primary}
              collection={page.collection}
              icon={page.icon}
              FormComponent={page.FormComponent}
              get={page.api.get}
              post={page.api.post}
              put={page.api.put}
              delete={page.api.delete}
              validation={page.validation}
              {...props}
            />
            <UploadQueue />
          </>
        ),
      });
    });

  // ADD SERVER MANAGEMENT PAGE
  // pages.push({ path: `${props.match.path}/server`, component: ServerDash })

  // SET DEFAULT MENU
  const defaultRoute = `${props.match.path}/announcements`;

  useEffect(() => {}, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
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
      <main
        className={classes.content}
        style={{ marginLeft: !isSmallDevice ? drawerWidth : 0 }}
      >
        <div className={classes.toolbar} />
        <section>
          <h2>Admin</h2>
          <Button text="Admin" icon="add" onClick={() => addAdmin('New Admin')}>+ Admin</Button>
          {renderNameCards(admins)}
        </section>

        <section>
          <h2>Teachers</h2>
          <Button text="Teacher" icon="add" onClick={() => addTeacher('New Teacher')}>+ Teacher</Button>
          {renderNameCards(teachers)}
        </section>

        <section>
          <h2>Students</h2>
          <Button text="Student" icon="add" onClick={() => addStudent('New Student')}>+ Student</Button>
          {renderNameCards(students)}
        </section>
        {/* <section>
          <h2>Admin</h2>
          <Button text="Admin" icon="add" buttonColor="blue" onClick={addAdmin} />
          {renderNameCards(admins)}
        </section>

        <section>
          <h2>Teachers</h2>
          <Button text="Teacher" icon="add" buttonColor="blue" onClick={() => addTeacher('New Teacher')} />
          {renderNameCards(teachers)}
        </section>

        <section>
          <h2>Students</h2>
          <Button text="Student" icon="add" buttonColor="blue" onClick={() => addStudent('New Student')} />
          {renderNameCards(students)}
        </section> */}

        {/* <TransitionGroup>
                    <CSSTransition
                        key={props.location.key}
                        timeout={300}
                        classNames='fade'
                    > */}
        <Switch location={props.location}>
          {pages.map((page, idx) => (
            <ProtectedRoute
              key={`page-${idx}`}
              exact
              path={page.path}
              component={page.component}
              user={props.user}
            />
          ))}
          <Redirect to={defaultRoute} />
        </Switch>
        {/* </CSSTransition>
                </TransitionGroup> */}
        {/* <Button text="Student" icon="add" buttonColor="blue"/> */}
      </main>
    </div>

    // </div>
  );
}

export default AdminPortal;
