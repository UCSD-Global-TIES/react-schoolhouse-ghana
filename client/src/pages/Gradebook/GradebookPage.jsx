import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  CssBaseline,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "react-responsive";
import API from "../../utils/API";
import Gradebook from "../../components/Gradebook/Gradebook";
import "../../components/Gradebook/Gradebook.css";

import BookIcon from "../../assets/books.svg";
import BullhornIcon from "../../assets/bullhorn.svg";
import HelpIcon from "../../assets/help.svg";
import LogoutIcon from "../../assets/LogoutIcon.svg";
import HomeIcon from "../../assets/icons8-home.svg";
import GradebookIcon from "../../assets/gradebookIcon.svg";

const drawerWidth = "9.375rem";

const useStyles = makeStyles((theme) => ({
  root: { alignItems: "flex-start" },
  toolbar: theme.mixins.toolbar,
  sidebar: {
    display: "flex",
    width: drawerWidth,
    padding: "4.5rem 0 2rem",
    flexDirection: "column",
    alignItems: "flex-start",
    flexShrink: 0,
    alignSelf: "stretch",
  },
  drawerPaper: {
    background: "var(--primary-color)",
    color: "var(--background-color)",
  },
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflowY: "auto",
    backgroundColor: theme.palette.background.default,
  },
  buttonLink: { color: "inherit", textDecoration: "none" },
  navLink: {
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    height: "5rem",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.9375rem",
  },
  linkBox: { display: "flex", flexDirection: "column" },
  justifyIcon: { display: "flex", justifyContent: "center" },
  schoolName: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "var(--background-color)",
    marginBottom: 4,
  },
  schoolSubtitle: {
    fontSize: "1rem",
    color: "var(--background-color)",
    marginTop: 0,
  },
  actionsRow: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: theme.spacing(2),
    margin: "20px auto 0",
    maxWidth: 1200,
  },
}));

const GradebookPage = ({ match, user, location, logout }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmallDevice = useMediaQuery({ query: "(max-width: 600px)" });

  const subjectId = match.params.subjectId;
  const [gradebookData, setGradebookData] = useState([]);
  const [subjectInfo, setSubjectInfo] = useState({ name: "" });
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const isStudent = user?.type === "Student";

  const portalBase =
    user?.type === "Teacher"
      ? "/teacher"
      : user?.type === "Admin"
      ? "/edit"
      : "/user";

  const documentMenuItems = [
    { label: "Home", iconPath: HomeIcon, path: `${portalBase}` },
    {
      label: "Announcements",
      iconPath: BullhornIcon,
      path: `/subject/${subjectId}/announcements`,
    },
    { label: "Classes", iconPath: BookIcon, path: `${portalBase}/classes` },
    { label: "Gradebook", iconPath: GradebookIcon, path: `/gradebook/${subjectId}` },
    {
      label: "Help",
      iconPath: HelpIcon,
      path: `/subject/${subjectId}/studentGrades`,
    },
    {
      label: "Log Out",
      iconPath: LogoutIcon,
      clickHandler: () => logout && logout(),
    },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // Fetch subject info
  useEffect(() => {
    if (!subjectId || !user?.key) return;
    API.getSubject(subjectId, user.key)
      .then(({ data }) => setSubjectInfo({ name: data.name }))
      .catch(console.error);
  }, [subjectId, user?.key]);

  // Fetch gradebook data (students + assignments)
  useEffect(() => {
    if (!subjectId || !user?.key) return;
    API.getGradebook(subjectId, user.key)
      .then(({ data }) => {
        setGradebookData(data);
        const uniqueStudents = [
          ...new Map(data.map((g) => [g.studentId, g.studentName])).entries(),
        ].map(([id, name]) => ({ id, name }));
        const uniqueAssignments = [
          ...new Map(data.map((g) => [g.assignmentId, g.assignmentTitle])).entries(),
        ].map(([id, title]) => ({ id, title }));
        setStudents(uniqueStudents);
        setAssignments(uniqueAssignments);
      })
      .catch(console.error);
  }, [subjectId, user?.key]);

  const saveGradebook = () => {
    API.saveGradebook(subjectId, gradebookData, user.key)
      .then(() => alert("✅ Gradebook saved!"))
      .catch(console.error);
  };

  const drawer = (
    <div onClick={isSmallDevice ? handleDrawerToggle : undefined}>
      <List className={classes.sidebar}>
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <h1 className={classes.schoolName}>Semanhyia</h1>
          <h2 className={classes.schoolSubtitle}>American School</h2>
        </div>
        {documentMenuItems.map((item, index) =>
          item.clickHandler ? (
            <ListItem
              key={index}
              button
              onClick={item.clickHandler}
              className={classes.linkBox}
            >
              <ListItemIcon className={classes.justifyIcon}>
                <img src={item.iconPath} alt={item.label} width={24} height={24} />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ) : (
            <NavLink
              to={item.path}
              key={index}
              className={`${classes.buttonLink} ${classes.navLink}`}
            >
              <ListItem
                selected={location.pathname.includes(item.path)}
                button
                className={classes.linkBox}
              >
                <ListItemIcon className={classes.justifyIcon}>
                  <img src={item.iconPath} alt={item.label} width={24} height={24} />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            </NavLink>
          )
        )}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <nav>
        <Hidden smUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{ paper: classes.drawerPaper }}
            ModalProps={{ keepMounted: true }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown>
          <Drawer classes={{ paper: classes.drawerPaper }} variant="permanent" open>
            {drawer}
          </Drawer>
        </Hidden>
      </nav>

      <main className={classes.content} style={{ marginLeft: !isSmallDevice ? drawerWidth : 0 }}>
        <div className="gradebook-layout">
          <div className="breadcrumbs">
            <span>Classes</span> / <span>{subjectInfo.name || "Class"}</span> /{" "}
            <strong>Gradebook</strong>
          </div>

          <h2 className="gradebook-class-title">{subjectInfo.name || "Class"}</h2>

          <div className="gradebook-header">
            <h1>Gradebook</h1>
            <div className="select-class">
              <span>SELECT CLASS</span>
              <div className="expand-icon">⌄</div>
            </div>
          </div>

          <div className="gradebook-scroll">
            <Gradebook students={students} assignments={assignments} data={gradebookData} />
          </div>

          {!isStudent && (
            <div className={classes.actionsRow}>
              <Button variant="contained" color="primary" onClick={saveGradebook}>
                Save Gradebook
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GradebookPage;