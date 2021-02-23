import React, { useEffect, useContext } from "react";
import { NavLink, Switch, Redirect } from "react-router-dom";
import AnnouncementsForm from "../../../../components/AnnouncementsForm";
import GradesForm from "../../../../components/GradesForm";
import SubjectsForm from "../../../../components/SubjectsForm";
import AccountsForm from "../../../../components/AccountsForm";
import AssessmentForm from "../../../../components/AssessmentForm";
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
import { faUsers, faBullhorn, faChalkboardTeacher, faShapes, faCheckCircle, faFile } from "@fortawesome/free-solid-svg-icons";
import DocumentEditor from '../../../../components/DocumentEditor'
import FilesForm from "../../../../components/FilesForm";

import API from "../../../../utils/API";
import SocketContext from "../../../../socket-context";
import SocketIOFileUpload from "socketio-file-upload"
import UploadQueue from "../../../../components/UploadQueue";
import eduTies from "../../../../logos/eduTIES_logo.png"
import sas from "../../../../logos/sas_logo.png"  

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
        background: '#f7ee9a',
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
    });
    const socket = useContext(SocketContext);
    const siofu = new SocketIOFileUpload(socket);

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
            label: "Subjects",
            icon: faChalkboardTeacher,
            path: `${props.match.url}/subjects`
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
            label: "Assessment",
            icon: faCheckCircle,
            path:`${props.match.url}/assessment`
        }
        // {
        //     label: "Server",
        //     icon: faServer,
        //     path: `${props.match.url}/server`
        // },
    ]

    const drawer = (
        <div
            onClick={isSmallDevice ? handleDrawerToggle : () => { }}
        >
            <div className={classes.toolbar} />
            {/* <Divider /> */}
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
            <Divider />
            <List>
                {otherMenuItems.map((item, index) => (

                    <NavLink to={item.path} key={index} className={classes.buttonLink}>
                        <ListItem button selected={props.location.pathname.includes(item.path)} >
                            <ListItemIcon>{<FontAwesomeIcon icon={item.icon} />}</ListItemIcon>
                            <ListItemText style={{ overflowWrap: "break-word" }} primary={item.label} />
                        </ListItem>
                    </NavLink>
                ))}
            </List>
            
        <img src={eduTies} alt="eduTies" height={200} width={200} style={{position: "absolute", top: 680}}/>
     
        </div>
    );

    const pagesInfo = [
        {
            collection: "Announcements",
            icon: faBullhorn,
            FormComponent: (p) =>
                <AnnouncementsForm user={props.user} {...p} />,
            primary: (doc) => doc.title,
            path: `${props.match.path}/announcements`,
            api: {
                get: API.getAnnouncements,
                post: API.addAnnouncement,
                put: API.updateAnnouncement,
                delete: API.deleteAnnouncements
            },
            validation: {
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
            }
        },
        {
            collection: "Grades",
            icon: faShapes,
            FormComponent: (p) =>
                <GradesForm user={props.user} {...p} />,
            primary: (doc) => `Grade ${doc.level}`,
            path: `${props.match.path}/grades`,
            api: {
                get: API.getGrades,
                post: API.addGrade,
                put: API.updateGrade,
                delete: API.deleteGrades
            },
            validation: {
                level: {
                    validate: value => new Promise((resolve, reject) => {

                        API.getGrades(props.user.key)
                            .then((result) => {
                                const grades = result.data;

                                for (const grade of grades) {
                                    if (grade.level === parseInt(value)) resolve(false)
                                }
                                resolve(true)
                            })

                    }),
                    message: "You must enter a grade level that does not yet exist."
                }
            }
        },
        {
            collection: "Subjects",
            link: (doc) => `/subject/${doc._id}`,
            icon: faChalkboardTeacher,
            FormComponent: (p) =>
                <SubjectsForm user={props.user} {...p} />,
            primary: doc => doc.name,
            path: `${props.match.path}/subjects`,
            api: {
                get: API.getSubjects,
                post: API.addSubject,
                put: API.updateSubject,
                delete: API.deleteSubjects
            },
            validation: {
                name: {
                    validate: value => new Promise((resolve, reject) => {

                        if (!value) resolve(false);

                        API.getSubjects(props.user.key)
                            .then((result) => {
                                const subjects = result.data;

                                for (const subject of subjects) {
                                    if (subject.name === value) resolve(false)
                                }
                                resolve(true)
                            })

                    }),
                    message: "You must enter a subject name, one that does not already exist"
                }
            }
        },
        {
            collection: "Accounts",
            icon: faUsers,
            FormComponent: (p) =>
                <AccountsForm user={props.user} {...p} />,
            primary: (doc) => `${doc.first_name} ${doc.last_name} (${doc.type})`,
            path: `${props.match.path}/accounts`,
            api: {
                get: API.getAccounts,
                post: API.addAccount,
                put: API.updateAccount,
                delete: API.deleteAccounts
            },
            validation: {
                first_name: {
                    validate: value => new Promise((resolve, reject) => {
                        resolve(value);
                    }),
                    message: "You must enter the user's first name."
                },
                last_name: {
                    validate: value => new Promise((resolve, reject) => {
                        resolve(value);
                    }),
                    message: "You must enter the user's last name."
                },
                type: {
                    validate: value => new Promise((resolve, reject) => {
                        resolve(value);
                    }),
                    message: "You must select the user's account type."
                },
                password: {
                    validate: value => new Promise((resolve, reject) => {

                        if (!value) resolve(false);

                        if (value.length >= 5) resolve(true);
                        else resolve(false)
                    }),
                    message: "You must enter a password longer than five characters."
                }
            }
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
                            data: {}
                        })
                    })
                }
            },
            validation: {
                nickname: {
                    updateOnly: true,
                    validate: value => new Promise((resolve, reject) => {
                        resolve(value);
                    }),
                    message: "You must enter an informative file nickname"
                }
            }
        },
        {
            collection: "Assessment",
            link: (doc) => `/assessment/yolo`, // TODO: Set specific quiz ID into the URL once backend is finished 
            icon: faCheckCircle,
            FormComponent: (p) => <AssessmentForm user={props.user} {...p}/>,
            primary: (doc) => doc.title,
            path: `${props.match.path}/assessment`,
            api: {
                get: API.getAssessments 
                // TODO: Other API requests once we start implementing ability to create tests
            },
            validation: {}
        }
        
    ]

    let pages = [];

    pagesInfo.filter((obj) => obj.collection != "Files") .map((page, idx) => {
        console.log(page.path)
        pages.push({
            path: page.path,
            component: (props) =>
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
                    {...props} />
        })
    });

    pagesInfo.filter((obj) => obj.collection == "Files").map((page, idx) => {
        pages.push({
            path: page.path,
            component: (props) =>
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
                        {...props} />
                    <UploadQueue />
                </>
        })
    })

    // ADD SERVER MANAGEMENT PAGE
    // pages.push({ path: `${props.match.path}/server`, component: ServerDash })

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
