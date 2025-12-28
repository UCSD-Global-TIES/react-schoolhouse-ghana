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

import BookIcon from "../../assets/books.svg";
import BullhornIcon from "../../assets/bullhorn.svg";
import OpenBookIcon from "../../assets/open-book.svg";
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
  content: { flexGrow: 1, padding: theme.spacing(1) },
  buttonLink: { color: "inherit", textDecoration: "none" },
  sidebarLinks: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flexStart",
    alignSelf: "stretch",
    width: "100%",
  },
  navLink: {
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    height: "5rem",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.9375rem",
    alignSelf: "stretch",
  },
  linkBox: { display: "flex", flexDirection: "column" },
  justifyIcon: { display: "flex", justifyContent: "center" },
}));

const GradebookPage = ({ match, user, history, location, logout }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmallDevice = useMediaQuery({ query: "(max-width: 600px)" });

  const subjectIdParam = match.params.subjectId;
  // Extract actual subject ID and gradeId from composite ID (format: subjectId_gradeId)
  const subjectId = subjectIdParam.includes('_') ? subjectIdParam.split('_')[0] : subjectIdParam;
  const gradeId = subjectIdParam.includes('_') ? subjectIdParam.split('_')[1] : null;
  
  const [gradebookData, setGradebookData] = useState([]);
  const [assignmentNames, setAssignmentNames] = useState([]);
  const [subjectInfo, setSubjectInfo] = useState({ name: "" });
  const isStudent = user?.type === "Student";
  


  // build teacherName…
  const { profile } = user || {};
  const teacherName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : user?.name;

  // derive portal base
  const portalBase = user && user.type === "Teacher" ? "/teacher" : (user && user.type === "Admin" ? "/edit" : "/user");

  const documentMenuItems = [
    { label: "Home", iconPath: HomeIcon, path: `${portalBase}` },
    { label: "Classes", iconPath: BookIcon, path: `${portalBase}/classes` },
    { label: "Subject", iconPath: OpenBookIcon, path: `/subject/${subjectId}/resources` },
    { label: "Gradebook", iconPath: GradebookIcon, path: `/gradebook/${subjectId}` },
    { label: "Log Out", iconPath: LogoutIcon, clickHandler: () => { if (logout) logout(); } },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  useEffect(() => {
    if (!subjectId || !user?.key) return;
    API.getSubject(subjectId, user.key)
      .then(({ data }) => setSubjectInfo({ name: data.name }))
      .catch(console.error);
  }, [subjectId, user?.key]);

  useEffect(() => {
    if (!subjectId || !user?.key) return;
    
    // Extract grade level and section from URL query parameters
    const urlParams = new URLSearchParams(location.search);
    const gradeLevel = urlParams.get('gradeLevel');
    const gradeSection = urlParams.get('gradeSection');
    
    console.log(`🔹 Gradebook access - User Type: ${user?.type}, Subject: ${subjectId}, GradeId: ${gradeId}`);
    console.log(`🔹 URL params - gradeLevel: ${gradeLevel}, gradeSection: ${gradeSection}`);
    console.log(`🔹 Full URL:`, window.location.href);
    
    // Use specific grade API if gradeId is available in composite ID, or use section-specific if available
    const gradebookPromise = gradeId
      ? API.getGradebook(subjectId, user.key, gradeId)
      : (gradeLevel && gradeSection)
        ? API.getGradebookBySection(subjectId, gradeLevel, gradeSection, user.key)
        : API.getGradebook(subjectId, user.key);
    
    console.log(`🔹 Using ${gradeId ? 'grade-specific' : (gradeLevel && gradeSection ? 'section-specific' : 'general')} gradebook API`);
    
    gradebookPromise
      .then(({ data }) => {
        console.log(`✅ Received ${data.length} gradebook entries:`, data.slice(0, 3));
        setGradebookData(data);
      })
      .catch((error) => {
        console.error('❌ Error fetching gradebook:', error);
        console.error(error);
      });
  }, [subjectId, user?.key, isStudent, location.search]);

  const saveGradebook = () => {
    API.saveGradebook(subjectId, gradebookData, user.key, assignmentNames)
      .then(() => alert("✅ Gradebook saved!"))
      .catch(console.error);
  };



  // Create display title with subject name and grade section
  const getGradebookTitle = () => {
    const subjectName = subjectInfo.name || "Subject";
    if (gradebookData.length > 0) {
      const gradeLevel = gradebookData[0]?.gradeInfo?.level ?? "–";
      const gradeSection = gradebookData[0]?.gradeInfo?.section ?? "A";
      return `${subjectName} Grade ${gradeLevel} Section ${gradeSection} Gradebook`;
    }
    return `${subjectName} Gradebook`;
  };
  
  const gradebookTitle = getGradebookTitle();
  
  // Since the backend now filters student data, we can use the data directly
  // No need for frontend filtering anymore as students only get their own data from the server
  const displayedData = gradebookData;

  const drawer = (
    <div onClick={isSmallDevice ? handleDrawerToggle : () => {}}>
      <List className={classes.sidebar}>
        <div style={{ textAlign: "center", margin: "0 auto", marginBottom: "10px", color: "var(--background-color)" }}>
          <h1 style={{ fontSize: "1.75rem" }}>Semanhyia</h1>
          <h2 style={{ fontSize: "1.125rem" }}>American School</h2>
        </div>
        <div className={classes.sidebarLinks}>
          {documentMenuItems.map((item, index) => (
            item.clickHandler ? (
              <ListItem key={index} button onClick={item.clickHandler} className={classes.linkBox}>
                <ListItemIcon className={classes.justifyIcon}>
                  <img src={item.iconPath} alt={`${item.label} icon`} style={{ width: 24, height: 24 }} />
                </ListItemIcon>
                <ListItemText style={{ overflowWrap: "break-word" }} primary={item.label} />
              </ListItem>
            ) : (
              <NavLink to={item.path} key={index} className={`${classes.buttonLink} ${classes.navLink}`}>
                <ListItem selected={location.pathname.includes(item.path)} button className={classes.linkBox}>
                  <ListItemIcon className={classes.justifyIcon}>
                    <img src={item.iconPath} alt={`${item.label} icon`} style={{ width: 24, height: 24 }} />
                  </ListItemIcon>
                  <ListItemText style={{ overflowWrap: "break-word" }} primary={item.label} />
                </ListItem>
              </NavLink>
            )
          ))}
        </div>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <nav className={classes.drawer}>
        <Hidden smUp implementation="css">
          <Drawer variant="temporary" anchor={theme.direction === "rtl" ? "right" : "left"} open={mobileOpen} onClose={handleDrawerToggle} classes={{ paper: classes.drawerPaper }} ModalProps={{ keepMounted: true }}>
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer classes={{ paper: classes.drawerPaper }} variant="permanent" open>
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content} style={{ marginLeft: !isSmallDevice ? drawerWidth : 0 }}>
        <GradebookNavbar subjectName={gradebookTitle} teacherName={teacherName} gradeLevel="" />
        
        {!isStudent && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "10px", marginTop: "-5px" }}>
            <button onClick={() => setGradebookData([...gradebookData])} style={{ padding: "8px 16px", cursor: "pointer", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px" }}>Add Assignment</button>
            <button onClick={saveGradebook} style={{ padding: "8px 16px", cursor: "pointer", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px" }}>Save Gradebook</button>
          </div>
        )}
        
        <GradebookTable 
          data={displayedData} 
          updateData={setGradebookData} 
          readOnly={isStudent}
          onAssignmentNamesChange={setAssignmentNames}
        />
      </main>
    </div>
  );
};

export default GradebookPage;
