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
  Typography,
  Button,
  Select,
  MenuItem,
  Box,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "react-responsive";

import GradebookNavbar from "../../components/Gradebook/GradebookNavbar";
import GradebookTable from "../../components/Gradebook/GradebookTable";
import GradebookForm from "../../components/Gradebook/GradebookForm";
import API from "../../utils/API";

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
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflowY: "auto",
  },
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
  padding: theme.spacing(3),
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

const GradebookPage = ({ match, user, history, location, logout }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmallDevice = useMediaQuery({ query: "(max-width: 600px)" });

  const subjectId = match.params.subjectId;
  const [gradebookData, setGradebookData] = useState([]);
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
    { label: "Announcements", iconPath: BullhornIcon, path: `/subject/${subjectId}/announcements` },
    { label: "Classes", iconPath: BookIcon, path: `${portalBase}/classes` },
    { label: "Gradebook Testing", iconPath: GradebookIcon, path: `/gradebook/${subjectId}` },
    { label: "Help", iconPath: HelpIcon, path: `/subject/${subjectId}/studentGrades` },
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
    API.getGradebook(subjectId, user.key)
      .then(({ data }) => setGradebookData(data))
      .catch(console.error);
  }, [subjectId, user?.key]);

  const saveGradebook = () => {
    API.saveGradebook(subjectId, gradebookData, user.key)
      .then(() => alert("✅ Gradebook saved!"))
      .catch(console.error);
  };

  const gradeLevel = gradebookData[0]?.gradeId?.level ?? "–";
  const displayedData = isStudent
    ? gradebookData.filter((r) => r.studentId === user.id)
    : gradebookData;

  const drawer = (
    <div onClick={isSmallDevice ? handleDrawerToggle : () => {}}>
      <List className={classes.sidebar}>
        <div style={{ textAlign: "center", margin: "0 auto", marginBottom: "10px" }}>
          <h1 className={classes.schoolName}>Semanhyia</h1>
          <h2 className={classes.schoolSubtitle}>American School</h2>
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
        <GradebookNavbar subjectName={subjectInfo.name} teacherName={teacherName} gradeLevel={gradeLevel} />
        <div className={classes.headerSection}>
          <div>
            <Typography className={classes.breadcrumb}>Classes / Science 5A / Gradebook</Typography>
            <Typography className={classes.classTitle}>Ms. Mensah’s Class</Typography>
          </div>
          <Select defaultValue="" displayEmpty variant="outlined" size="small" style={{ minWidth: 140 }}>
            <MenuItem value="" disabled>
              Select Class
            </MenuItem>
            {/* Add options here if needed */}
          </Select>
        </div>
        <Typography variant="h6" gutterBottom>
          Gradebook
        </Typography>
        <Box className={classes.tableContainer}>
          <GradebookTable data={displayedData} updateData={setGradebookData} readOnly={isStudent} />
        </Box>
        {!isStudent && (
          <div className={classes.actionsRow}>
            <GradebookForm onSubmit={(newRow) => setGradebookData((prev) => [...prev, { ...newRow, subjectId, gradeId: newRow.gradeId || null, grades: [] }])} />
            <Button variant="contained" color="primary" onClick={saveGradebook}>
              Save Gradebook
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default GradebookPage;
