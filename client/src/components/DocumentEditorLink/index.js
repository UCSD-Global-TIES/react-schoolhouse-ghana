import React, { useEffect, useState } from "react";
import { getQueries, parseTime } from "../../utils/misc";
import { Alert, Skeleton, Pagination } from '@material-ui/lab'
import { FormControl, Input, InputLabel, InputAdornment, Snackbar, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Checkbox, Typography } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import EnhancedListToolbar from "../EnhancedListToolbar";
import ConfirmDialog from "../ConfirmDialog";
import "../../utils/flowHeaders.min.css";


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    list: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    buttonLink: {
        color: "inherit",
        textDecoration: "none"
    },
    actionButton: {
        margin: theme.spacing(1)
    },
    content: {
        width: "90%",
        maxWidth: "700px",
    },
    skeleton: {
        width: "100%",
        margin: "1rem 0rem",
        height: "40px"
    },
    paginationContainer: {
        margin: "auto",
        padding: "1rem",
    },
    searchbar: {
        margin: "0.5rem 0rem",
        width: "100%"
    }
}));

// _id of document that is being updated
// docId = { props.document['_id'] }

// Name of field that will be used as primary text
// primary = { 'name'}

// Name of collection you are displaying
// collection = { 'Classes'}

// Icon to display for documents
// icon = { faChalkboardTeacher }

// Link to redirect to for editing and creating documents
// link = { "/edit/classes/"}
function DocumentEditorLink(props) {
    const MAX_ITEMS = 5;

    // REDIRECT
    const { preset, delete: deleteDocuments, link, docs, icon, collection, primary, match, docId, history } = props;
    const classes = useStyles();
    // DOCUMENTS EDITOR
    const [selected, setSelected] = useState([]);
    const [documents, setDocuments] = useState(docs);
    const [filteredDocuments, setFilteredDocuments] = useState(docs);
    const [viewableDocuments, setViewableDocuments] = useState(docs.slice(0, MAX_ITEMS));
    const [page, setPage] = React.useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    // ALERTS
    const [currentAlert, setCurrentAlert] = useState({ isOpen: false, severity: "", message: "" });
    const [confirmOpen, setConfirmOpen] = useState(false);


    // HANDLE PAGE CHANGE
    const handlePageChange = (event, value) => {
        setPage(value);

        if (MAX_ITEMS * value >= filteredDocuments.length)
            setViewableDocuments(filteredDocuments.slice((value - 1) * MAX_ITEMS));
        else
            setViewableDocuments(
                filteredDocuments.slice((value - 1) * MAX_ITEMS, value * MAX_ITEMS)
            );
    };

    // HANDLE QUERY CHANGE
    const handleQueryChange = (event) => {
        const { value } = event.target;
        // Set search query
        setSearchQuery(value);

        // Reset page 
        setPage(0)

        // Filter documents
        if (value.length) {
            const filteredDocuments = documents.filter(document => document[primary].toLowerCase().includes(value.toLowerCase()));
            setFilteredDocuments(filteredDocuments);
            setViewableDocuments(filteredDocuments.slice(0, MAX_ITEMS));

        } else {
            // Reset the filtered documents to ALL documents
            setFilteredDocuments(documents);
            setViewableDocuments(documents.slice(0, MAX_ITEMS));
        }
    }

    // Closing snackbar alerts
    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        let tmp = currentAlert;

        tmp.isOpen = false;

        setCurrentAlert({ ...tmp });
    };

    // Handle checkbox selection
    const handleSelect = value => {
        const currentIndex = selected.indexOf(value);
        const newSelected = [...selected];

        if (currentIndex === -1) {
            newSelected.push(value);
        } else {
            newSelected.splice(currentIndex, 1);
        }

        setSelected(newSelected);
    };

    // Handle deletion of document
    const handleDelete = () => {
        deleteDocuments(selected, props.user.key)
            .then(() => {
                handleConfirm(false);
                setCurrentAlert({ isOpen: true, severity: "success", message: `The ${collection.toLowerCase()}(s) have been successfully deleted!` });

                // Remove deleted documents
                const remainingDocuments = documents.filter(document => !selected.includes(document._id));
                setDocuments(remainingDocuments);
                const filteredDocuments = remainingDocuments.filter(document => document[primary].toLowerCase().includes(searchQuery.toLowerCase()));
                setFilteredDocuments(filteredDocuments);
                setViewableDocuments(filteredDocuments.slice(0, MAX_ITEMS));

                // Reset selected
                setSelected([]);
            })


    }

    const handleCreate = () => {
        // Redirect to specified link with create params
        handleRouteChange(link, true)
    }

    const handleUpdate = () => {
        // Redirect to specified link with update params
        handleRouteChange(link, false, selected[0])
    }

    // Handle opening/closing of confirmation
    const handleConfirm = (isOpen) => {
        setConfirmOpen(isOpen);
    }

    const handleRouteChange = (destination, isCreate, _id) => {
        // Replace the current history item as the current path with the open document
        // you are navigating away from
        let route;
        // If the current path does not have an document query, append one
        if (!match.url.includes("_id")) {
            if (match.url.includes("?")) {
                route = `${match.url}&_id=${docId}`;
            }
            else {
                route = `${match.url}?_id=${docId}`;
            }
            history.replace(route);
        }

        // Travel to the new specified route with the redirect param as true
        // Inform user of redirect
        if (isCreate) {
            // Travel to the specified destination with the create flag, intial values, and redirect flag
            const presetDoc = preset({ _id: docId })
            history.push(`${destination}?preset=${JSON.stringify(presetDoc)}&redirect=true`);
        } else {
            // Travel to the specified destination with the document _id to update and redirect flag
            history.push(`${destination}?_id=${_id}&redirect=true`);

        }

    }

    useEffect(() => {

    }, []);

    return (
        <>
            {/* ALERTS FOR API ACTIONS */}
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={currentAlert.isOpen}
                autoHideDuration={6000}
                onClose={handleAlertClose}
            >
                <Alert onClose={handleAlertClose} severity={currentAlert.severity}>
                    {currentAlert.message}
                </Alert>
            </Snackbar>

            {/* DELETE DOCUMENT(S) DIALOG */}
            <ConfirmDialog
                open={confirmOpen}
                handleClose={() => handleConfirm(false)}
                handleAction={handleDelete}>
                Are you sure you would like to delete all selected {selected.length} {collection.toLowerCase()}(s)?
            </ConfirmDialog>

            {/* DOCUMENTS */}
            <div style={{ display: "flex", width: "100%", height: "100%" }}>
                <div style={{ margin: "auto" }} className={classes.content}>
                    <>
                        <EnhancedListToolbar
                            title={collection}
                            numSelected={selected.length}
                            // Link to specified link with create params
                            handleCreate={handleCreate}
                            // Link to specified link with update params
                            handleUpdate={handleUpdate}
                            handleDelete={() => handleConfirm(true)}
                        />

                        <FormControl className={classes.searchbar}>
                            <InputLabel htmlFor="standard-adornment-amount">Search {collection.toLowerCase()}</InputLabel>
                            <Input
                                value={searchQuery}
                                onChange={handleQueryChange}
                                startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
                            />
                        </FormControl>
                        {/* </div> */}

                        {
                            filteredDocuments.length ?
                                <>
                                    <div style={{ display: "flex" }}>
                                        <div className={classes.paginationContainer}>
                                            <Pagination
                                                size="small"
                                                color={"primary"}
                                                count={Math.ceil(filteredDocuments.length / MAX_ITEMS)}
                                                page={page}
                                                onChange={handlePageChange}
                                            />

                                        </div>
                                    </div>
                                    <List className={classes.list}>

                                        {
                                            viewableDocuments.map((document, idx) => {
                                                const labelId = `${collection.toLowerCase()}-${idx}`;

                                                return (
                                                    <ListItem alignItems="flex-start" key={labelId} role={undefined} dense button onClick={() => handleSelect(document._id)}>
                                                        <ListItemIcon>
                                                            <Checkbox
                                                                edge="start"
                                                                checked={selected.indexOf(document._id) !== -1}
                                                                tabIndex={-1}
                                                                disableRipple
                                                                inputProps={{ 'aria-labelledby': labelId }}
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText style={{ overflowWrap: "break-word" }} id={labelId} primary={document[primary]} secondary={`Created: ${parseTime(document.createdAt, true)}`} />
                                                        <ListItemSecondaryAction>
                                                            <FontAwesomeIcon icon={icon} />
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                );
                                            })
                                        }
                                    </List>

                                </>

                                :
                                <div style={{ display: "flex", marginTop: "2rem" }}>
                                    <div style={{ margin: "auto", padding: "3rem" }}>
                                        <Typography className="flow-text" style={{ color: "grey" }} variant="h5">No {collection.toLowerCase()} were found.</Typography>
                                        <p style={{ textAlign: "center", color: "grey" }}><FontAwesomeIcon icon={icon} size="5x" /></p>
                                    </div>
                                </div>
                        }
                    </>



                </div>
            </div>
        </>
    )
};

export default DocumentEditorLink;