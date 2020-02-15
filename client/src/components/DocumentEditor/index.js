import React, { useEffect, useState } from "react";
import { getQueries, parseTime } from "../../utils/misc";
import clsx from "clsx";
import { Alert, Skeleton, Pagination } from '@material-ui/lab'
import { FormControl, Input, InputLabel, InputAdornment, Snackbar, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Checkbox, Typography } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import EnhancedListToolbar from "../EnhancedListToolbar";
import FullScreenDialog from "../FullScreenDialog";
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
        maxWidth: "700px"
    },
    skeleton: {
        width: "100%",
        margin: "1rem 0rem",
        height: "40px"
    },
    paginationContainer: {
        margin: "auto",
        padding: "1rem"
    },
    searchbar: {
        margin: "0.5rem 0rem",
        width: "100%"
    }
}));

// Can be non-specific for all document editors
// PROPS:
// collection - used for dialog editor, alerts
// API - specifies create, get, update, delete actions
// icon - used for no documents message and for list
// Form - component used for document dialog
function DocumentEditor(props) {
    const MAX_ITEMS = 5;

    const { API, FormComponent, icon, collection, primary } = props;
    const classes = useStyles();
    // DOCUMENTS EDITOR
    const [selected, setSelected] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [viewableDocuments, setViewableDocuments] = useState([]);
    const [page, setPage] = React.useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    // ALERTS
    const [currentAlert, setCurrentAlert] = useState({ isOpen: false, severity: "", message: "" });
    const [confirmOpen, setConfirmOpen] = useState(false);

    // DOCUMENT DIALOG
    const [dialogOpen, setDialogOpen] = useState(false);
    const [documentAction, setDocumentAction] = useState({ text: "", function: () => { } });
    const [currentDocument, setCurrentDocument] = useState({});

    // COMPONENT STATUS
    const [loading, setLoading] = useState(true);

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
    const handleDelete = (id) => {
        console.log(`Deleting ${collection.toLowerCase()}(s): `, selected.join(" "));
        handleConfirm(false);
        setCurrentAlert({ isOpen: true, severity: "success", message: `The ${collection.toLowerCase()}(s) have been successfully deleted!` });
    }

    // Handle opening/closing of confirmation
    const handleConfirm = (isOpen) => {
        setConfirmOpen(isOpen);
    }

    // Handle creation of document
    const handleCreate = () => {
        console.log(`Creating ${collection}(s) `);
        setDialogOpen(false);
        setCurrentAlert({ isOpen: true, severity: "success", message: `The ${collection.toLowerCase()} has been successfully created!` });
    }

    // Handle saving of document
    const handleSave = () => {
        console.log(`Updating ${collection.toLowerCase()}: `, currentDocument._id);
        setDialogOpen(false);
        setCurrentAlert({ isOpen: true, severity: "success", message: `The ${collection.toLowerCase()} has been successfully updated!` });

    }

    // Handle opening/closing of document 
    const handleDocument = (isOpen, document) => {
        // Redirect to previous page in history if redirect param is true
        if (props.location.search) {
            if (getQueries(props.location.search).redirect && !isOpen) props.history.goBack()
        }

        setDialogOpen(isOpen);

        if (document) {
            setCurrentDocument(document);
            // If the document is empty (passed when creating a document)
            if (!Object.keys(document).length) {
                setDocumentAction({ text: "Create", function: handleCreate });
            } else {
                setDocumentAction({ text: "Update", function: handleSave });
            }
        }
    }

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        let tmp = { ...currentDocument };
        tmp[name] = value;

        setCurrentDocument({ ...tmp });
    }

    const handleRouteChange = (destination, _id) => {
        // Replace the current history item as the current path with the open document
        // you are navigating away from
        let route;
        // If the current path does not have an document query, append one
        if (!props.match.url.includes("_id")) {
            if (props.match.url.includes("?")) {
                route = `${props.match.url}&_id=${currentDocument._id}`;
            }
            else {
                route = `${props.match.url}?_id=${currentDocument._id}`;
            }
            props.history.replace(route);
        }

        // Travel to the new specified route with the redirect param as true
        props.history.push(`${destination}?_id=${_id}&redirect=true`);
    }

    useEffect(() => {
        // API.getSchoolAnnouncements(props.user.key)
        //     .then((result) => {
        //         setAnnouncements(result.data);
        //         setLoading(false);
        //     })
        setTimeout(() => {
            const testDocuments = [
                {
                    _id: "1",
                    private: false,
                    title: "Title 0",
                    content: "Content 0",
                    date_created: new Date(1581452252),
                    last_updated: new Date(1581527252)
                },
                {
                    _id: "2",
                    title: "Title 1",
                    content: "Content 1",
                    date_created: new Date(1481452252)
                },
                {
                    _id: "2",
                    title: "Title 1",
                    content: "Content 1",
                    date_created: new Date(1481452252)
                },
                {
                    _id: "2",
                    title: "Title 1",
                    content: "Content 1",
                    date_created: new Date(1481452252)
                },
                {
                    _id: "2",
                    title: "Title 1",
                    content: "Content 1",
                    date_created: new Date(1481452252)
                },

                {
                    _id: "2",
                    title: "Title 1",
                    content: "Content 1",
                    date_created: new Date(1481452252)
                },
                {
                    _id: "2",
                    title: "Title 1",
                    content: "Content 1",
                    date_created: new Date(1481452252)
                },
                {
                    _id: "2",
                    title: "Title 1",
                    content: "Content 1",
                    date_created: new Date(1481452252)
                },
            ];
            setLoading(false);

            // Initialize documents
            setDocuments(testDocuments);
            setFilteredDocuments(testDocuments);
            setViewableDocuments(testDocuments.slice(0, MAX_ITEMS));

            // If the user has requested a document in the route, set the document
            // with that _id in the editor
            if (props.location.search) {
                const _id = getQueries(props.location.search)._id;

                let isDocument = false;
                for (const document of testDocuments) {
                    if (document._id == _id) {
                        handleDocument(true, document);
                        isDocument = true;
                    }
                }

                // ADD CONDITIONS TO HANDLE CREATE FLAGS AND PRESET VALUES FROM DocumentEditorLink

                if (!isDocument) setCurrentAlert({ isOpen: true, severity: "error", message: `A ${collection.toLowerCase()} with ID ${_id} could not be found.` });
            }
        }, 1000);

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

            {/* UPDATE DOCUMENT DIALOG */}
            <FullScreenDialog
                open={dialogOpen}
                handleClose={() => handleDocument(false)}
                type={`${collection} Editor`}
                action={documentAction}
            >
                <FormComponent history={props.history} match={props.match} isCreate={documentAction.text === "Create"} document={currentDocument} handleRouteChange={handleRouteChange} handleChange={handleFormChange} />
            </FullScreenDialog>

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
                            handleCreate={() => handleDocument(true, {})}
                            handleUpdate={() => handleDocument(true, documents[selected[0]])}
                            handleDelete={() => handleConfirm(true)}
                        />

                        <FormControl fullWidth className={classes.searchbar}>
                            <InputLabel htmlFor="standard-adornment-amount">Search {collection.toLowerCase()}</InputLabel>
                            <Input
                                value={searchQuery}
                                onChange={handleQueryChange}
                                startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
                            />
                        </FormControl>
                        {/* </div> */}

                        {
                            loading ?
                                [0, 1, 2, 3, 4, 5].map((item, idx) => (
                                    <Skeleton key={`skeleton-document-${idx}`} animation="wave" variant="rect" className={classes.skeleton} />
                                ))
                                :
                                // MAPPING ALL DOCUMENTS
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
                                                        <ListItem key={labelId} role={undefined} dense button onClick={() => handleSelect(document._id)}>
                                                            <ListItemIcon>
                                                                <Checkbox
                                                                    edge="start"
                                                                    checked={selected.indexOf(document._id) !== -1}
                                                                    tabIndex={-1}
                                                                    disableRipple
                                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText id={labelId} primary={document[primary]} secondary={document.last_updated ? `Updated: ${parseTime(document.last_updated, true)}` : `Created: ${parseTime(document.date_created, true)}`} />
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

export default DocumentEditor;