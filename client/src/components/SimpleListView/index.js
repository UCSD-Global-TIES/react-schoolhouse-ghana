import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';

import { Dialog, DialogContent, DialogTitle, Slide, DialogActions, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Button, ButtonGroup, InputAdornment, FormControl, InputLabel, Input, Typography } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import "../../utils/flowHeaders.min.css";

import { faChevronLeft, faChevronRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { set } from "mongoose";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    searchbar: {
        margin: "0.5rem 0rem",
        width: "100%"
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


function SimpleListView(props) {
    const classes = useStyles();

    // HOOKS 
    const [pageIdx, setPageIdx] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentDocument, setCurrentDocument] = useState({});
    const [filteredDocuments, setFilteredDocuments] = useState(props.items);
    const [searchQuery, setSearchQuery] = useState("");
    const [PROPS, setProps] = useState(props);

    const handleItemClick = (doc) => {
        if (PROPS.link) {
            return;
        }
        else {
            setCurrentDocument(doc);
            setDialogOpen(true);
        }

    }

    // HANDLE QUERY CHANGE
    const handleQueryChange = (event) => {
        const { value } = event.target;
        // Set search query
        setSearchQuery(value);

        // Reset page 
        setPageIdx(0)

        // Filter documents
        if (value.length) {
            const filteredDocuments = PROPS.items.filter(document => document[PROPS.labelField].toLowerCase().includes(value.toLowerCase()));
            setFilteredDocuments(filteredDocuments);

        } else {
            // Reset the filtered documents to ALL documents
            setFilteredDocuments(PROPS.items);
        }
    }

    const handleCloseDocument = () => {
        setDialogOpen(false);
    }

    const handlePageChange = (direction) => {
        setPageIdx(pageIdx + direction)

    }

    useEffect(() => {
        // Reset page 
        setPageIdx(0)

        // Filter documents
        const filteredDocuments = props.items.filter(document => document[PROPS.labelField]?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setProps(props);
    }, [props.items])

    const DocumentViewer = PROPS.viewer;

    return (
        <div style={{ ...PROPS.style }}>
            {currentDocument[PROPS.labelField] && DocumentViewer &&
                <Dialog

                    open={dialogOpen}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleCloseDocument}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle style={{ padding: "10px 24px" }}
                        align="center" id="alert-dialog-slide-title">{currentDocument[PROPS.labelField]}</DialogTitle>


                    <DialogContent style={{ width: "70vw", maxWidth: "500px", padding: "0px 24px" }}>

                        <DocumentViewer document={currentDocument} />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDocument} color="primary">
                            Close
                        </Button>

                    </DialogActions>
                </Dialog>

            }

            {
                PROPS.searchbar &&
                <FormControl className={classes.searchbar}>
                    <InputLabel htmlFor="standard-adornment-amount">Search {PROPS.title.toLowerCase()}</InputLabel>
                    <Input
                        value={searchQuery}
                        onChange={handleQueryChange}
                        startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
                    />
                </FormControl>
            }
            <List
                className={classes.root}
                subheader={
                    <ListSubheader component="div" style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{PROPS.title}</span>
                        <ButtonGroup size="small" aria-label="small outlined button group" style={{
                            paddingTop: "9px",
                            height: "2rem"
                        }}>
                            <Button size="small" disabled={pageIdx === 0} onClick={() => handlePageChange(-1)}><FontAwesomeIcon icon={faChevronLeft} /></Button>
                            <Button size="small" disabled={pageIdx === Math.ceil(PROPS.items.length / PROPS.pageMax) - 1 || PROPS.items.length === 0} onClick={() => handlePageChange(1)}><FontAwesomeIcon icon={faChevronRight} /></Button>
                        </ButtonGroup>
                    </ListSubheader>}
            >
                {
                    filteredDocuments.length ?

                        filteredDocuments.slice(pageIdx * PROPS.pageMax, (pageIdx + 1) * PROPS.pageMax).map((item, idx) => (

                            <a target="_blank" style={{ textDecoration: "none" }} key={`${PROPS.title.toLowerCase()}-${idx}`} href={PROPS.link ? item[PROPS.link] : null}>
                                <ListItem button onClick={() => handleItemClick(item)} alignItems="flex-start">
                                    <ListItemIcon>
                                        <FontAwesomeIcon icon={PROPS.icon} />
                                    </ListItemIcon>
                                    <ListItemText
                                        style={{ overflowWrap: "break-word" }}
                                        primary={
                                            item[PROPS.labelField]
                                        }
                                        secondary={
                                            moment(item.createdAt).format('MMMM Do YYYY, h:mm a')
                                        }
                                    />
                                </ListItem>

                            </a>

                        ))

                        :

                        <div style={{ display: "flex", marginTop: "2rem" }}>
                            <div style={{ margin: "auto", padding: "3rem" }}>
                                <Typography className="flow-text" style={{ color: "grey" }} variant="h5">No {PROPS.title.toLowerCase()} were found.</Typography>
                                <p style={{ textAlign: "center", color: "grey" }}><FontAwesomeIcon icon={PROPS.icon} size="5x" /></p>
                            </div>
                        </div>

                }


            </List>

        </div>

    );
}

export default SimpleListView;
