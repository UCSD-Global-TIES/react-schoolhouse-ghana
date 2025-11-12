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
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "react-responsive";

import GradebookNavbar from "../../components/Gradebook/GradebookNavbar";
import GradebookTable from "../../components/Gradebook/GradebookTable";
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
    padding: "3.5rem 0",
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
  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  breadcrumb: {
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
  },
  classTitle: {
    fontWeight: 700,
    fontSize: "1.75rem",
    marginTop: theme.spacing(0.5),
  },
  tableContainer: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[1],
    padding: theme.spacing(4),
    border: '2px solid #4CAF50',
  },
  actionsRow: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: theme.spacing(2),
    maxWidth: 1200,
    marginLeft: "auto",
    marginRight: "auto",
  },
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
    { label: "Help", iconPath: HelpIcon, path: `/subject/${subjectId}/studentGrades` },
    { label: "Log Out", iconPath: LogoutIcon, clickHandler: () => { if (logout) logout(); } },
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
    
    console.log(`🔹 Student gradebook access - User Type: ${user?.type}, Subject: ${subjectId}`);
    
    API.getGradebook(subjectId, user.key)
      .then(({ data }) => {
        console.log(`✅ Received ${data.length} gradebook entries for user:`, data);
        setGradebookData(data);
      })
      .catch((error) => {
        console.error('❌ Error fetching gradebook:', error);
        console.error(error);
      });
  }, [subjectId, user?.key]);

  const saveGradebook = () => {
    API.saveGradebook(subjectId, gradebookData, user.key)
      .then(() => alert("✅ Gradebook saved!"))
      .catch(console.error);
  };

  const gradeLevel = gradebookData[0]?.gradeId?.level ?? "–";
  
  // Since the backend now filters student data, we can use the data directly
  // No need for frontend filtering anymore as students only get their own data from the server
  const displayedData = gradebookData;

  const drawer = (
    <div onClick={isSmallDevice ? handleDrawerToggle : undefined}>
      <List className={classes.sidebar}>
        <div style={{ textAlign: "center", margin: "0 auto", marginBottom: "10px", color: "var(--background-color)" }}>
          <h1 style={{ fontSize: "1.75rem" }}>Semanhyia</h1>
          <h2 style={{ fontSize: "1.125rem" }}>American School</h2>
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
        <GradebookNavbar subjectName={subjectInfo.name} teacherName={teacherName} gradeLevel={gradeLevel} />
        <GradebookTable data={displayedData} updateData={setGradebookData} readOnly={isStudent} />
        {!isStudent && (
          <>
            <div style={{ marginTop: "20px", textAlign: "center", color: "#666" }}>
              <p><span role="img" aria-label="books">📚</span> Students are automatically enrolled based on subject enrollment</p>
            </div>
            <button onClick={saveGradebook}>Save Gradebook</button>
          </>
        )}
      </main>
    </div>
  );
};

export default GradebookPage;