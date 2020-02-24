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
import SocketContext from "../../socket-context"

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
    const socket = React.useContext(SocketContext)
    const MAX_ITEMS = 5;

    const { FormComponent, icon, collection, primary } = props;
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
    const [isCreate, setCreateFlag] = useState(true);
    const [initialDocument, setInitialDocument] = useState({});
    const [currentDocument, setCurrentDocument] = useState({});
    const [redirectOnExit, setRedirectOnExit] = useState(false);

    // COMPONENT STATUS
    const [loading, setLoading] = useState(true);

    const handleRefresh = () => {
        setLoading(true);
        setSelected([]);

        props.get(props.user.key)
            .then((docData) => {
                const docList = docData.data;

                // Initialize documents
                setDocuments(docList);

                setPage(0)

                if (searchQuery.length) {
                    const filteredDocuments = docList.filter(document => document[primary].toLowerCase().includes(searchQuery.toLowerCase()));
                    setFilteredDocuments(filteredDocuments);
                    setViewableDocuments(filteredDocuments.slice(0, MAX_ITEMS));

                } else {
                    // Reset the filtered documents to ALL documents
                    setFilteredDocuments(docList);
                    setViewableDocuments(docList.slice(0, MAX_ITEMS));
                }

                setLoading(false);
            })
    }

    const notifyServer = () => {
        // Send message on web-socket
        socket.emit('documents-changed', collection.toLowerCase())
    }

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

        props.delete(selected, props.user.key)
            .then(() => {
                handleConfirm(false);
                setCurrentAlert({ isOpen: true, severity: "success", message: `The ${collection.toLowerCase()}(s) have been successfully deleted!` });

                notifyServer();

            })
    }

    // Handle opening/closing of confirmation
    const handleConfirm = (isOpen) => {
        setConfirmOpen(isOpen);
    }

    // Handle creation of document
    const handleCreate = (doc) => {

        props.post(doc, props.user.key, props.user.profile)
            .then(() => {
                setDialogOpen(false);
                setCurrentAlert({ isOpen: true, severity: "success", message: `The ${collection.toLowerCase()} has been successfully created!` });

                notifyServer();

                if (redirectOnExit) {
                    // Inform user of redirect to previous document (inform user -> wait 1 sec. -> redirect)
                    setTimeout(() => props.history.goBack(), 1000);
                }
            })
    }

    // Handle saving of document
    const handleSave = (doc) => {
        props.put(doc, props.user.key)
            .then(() => {
                setDialogOpen(false);
                setCurrentAlert({ isOpen: true, severity: "success", message: `The ${collection.toLowerCase()} has been successfully updated!` });

                notifyServer();

                if (redirectOnExit) {
                    // Inform user of redirect to previous document (inform user -> wait 1 sec. -> redirect)
                    setTimeout(() => props.history.goBack(), 1000);
                }
            })
    }

    // Handle opening/closing of document 
    const handleDocument = (isOpen, document, isPreset) => {
        // Redirect to previous page in history if redirect param is true
        if (redirectOnExit) {
            // Inform user of redirect to previous document (inform user -> wait 1 sec. -> redirect)
            setTimeout(() => props.history.goBack(), 1000);
        }

        if (document) {
            setInitialDocument(document);
            setCurrentDocument(document);
            // If the document is empty (passed when creating a document)
            if (!Object.keys(document).length || isPreset) {
                setCreateFlag(true);
            } else {
                setCreateFlag(false);
            }
        }

        setDialogOpen(isOpen);
    }

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        let tmp = { ...currentDocument };

        if (!value.length) {
            tmp[name] = undefined;
        } else {
            tmp[name] = value;
        }

        setCurrentDocument(JSON.parse(JSON.stringify(tmp)));
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
        props.get(props.user.key)
            .then((docData) => {
                const docList = docData.data;

                // Initialize documents
                setDocuments(docList);
                setFilteredDocuments(docList);
                setViewableDocuments(docList.slice(0, MAX_ITEMS));
                setLoading(false);

                // If the user has requested a document in the route, set the document
                // with that _id in the editor; or if they wish to create a document with 
                // preset values
                if (props.location.search) {
                    const _id = getQueries(props.location.search)._id;
                    const presetStr = getQueries(props.location.search).preset;
                    const redirect = getQueries(props.location.search).redirect;

                    // Check if the specified document exists 
                    if (_id) {

                        let isDocument = false;
                        for (const document of docList) {
                            if (document._id == _id) {
                                handleDocument(true, document);
                                isDocument = true;
                            }
                        }

                        if (!isDocument) setCurrentAlert({ isOpen: true, severity: "error", message: `A ${collection.toLowerCase()} with ID ${_id} could not be found.` });
                    }

                    // Check if the presetStr exists, and if so parse and open the document with the preset values
                    if (presetStr !== undefined) handleDocument(true, JSON.parse(presetStr), true);
                    // Check if the redirect flag exists, set the variable
                    if (redirect !== undefined) setRedirectOnExit(redirect);
                }
            });

        socket.on(`refresh-${collection.toLowerCase()}`, function () {
            handleRefresh();
        })
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
                buttonDisabled={JSON.stringify(initialDocument) == JSON.stringify(currentDocument)}
                buttonText={isCreate ? "Create" : "Update"}
                action={isCreate ? () => handleCreate(currentDocument) : () => handleSave(currentDocument)}
            >
                <FormComponent history={props.history} match={props.match} isCreate={isCreate} document={currentDocument} handleRouteChange={handleRouteChange} handleChange={handleFormChange} />
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
                            handleUpdate={() => handleDocument(true, documents.find((doc) => doc._id === selected[0]))}
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
                                                            <ListItemText id={labelId} primary={document[primary]} secondary={`Created: ${parseTime(document.createdAt, true)}`} />
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