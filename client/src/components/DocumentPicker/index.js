import React, { useEffect, useState } from "react";
import { parseTime } from "../../utils/misc";
import { Pagination } from '@material-ui/lab'
import clsx from "clsx"
import { Tooltip, Switch, Toolbar, FormControl, Input, InputLabel, IconButton, InputAdornment, Snackbar, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Checkbox, Typography } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchIcon from '@material-ui/icons/Search';
import { lighten, makeStyles } from '@material-ui/core/styles';
import "../../utils/flowHeaders.min.css";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    // styles the list of files when editing or creating an announcement
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
    // styles the search bar box for files when creating/editing an announcement 
    content: {
        width: "90%",
        maxWidth: "700px",
    },
    skeleton: {
        width: "100%",
        margin: "1rem 0rem",
        height: "40px",
    },
    //styles the page number counter
    paginationContainer: {
        margin: "auto",
        padding: "1rem",
    },
    searchbar: {
        margin: "0.5rem 0rem",
        width: "100%"
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
                paddingLeft: theme.spacing(2),

            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
                paddingLeft: theme.spacing(2),

            },
    title: {
        flex: '1 1 100%',
    },
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
function DocumentSelector(props) {
    const { icon, collection, primary } = props;
    const classes = useStyles();
    // DOCUMENTS EDITOR
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [viewableDocuments, setViewableDocuments] = useState([]);
    const [page, setPage] = React.useState(1);
    const [PROPS, setProps] = useState(props)
    const [searchQuery, setSearchQuery] = useState("");
    const [state, setState] = React.useState({
        selectedToggle: false
    });

    // HANDLE PAGE CHANGE
    const handlePageChange = (event, value) => {
        setPage(value);

        if (props.pageMax * value >= filteredDocuments.length)
            setViewableDocuments(filteredDocuments.slice((value - 1) * props.pageMax));
        else
            setViewableDocuments(
                filteredDocuments.slice((value - 1) * props.pageMax, value * props.pageMax)
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
            const filteredDocuments = documents.filter(document => primary(document).toLowerCase().includes(value.toLowerCase()));
            setFilteredDocuments(filteredDocuments);
            setViewableDocuments(filteredDocuments.slice(0, props.pageMax));

        } else {
            // Reset the filtered documents to ALL documents
            setFilteredDocuments(documents);
            setViewableDocuments(documents.slice(0, props.pageMax));
        }
    }

    // Handle checkbox selection
    const handleSelect = value => {
        const currentIndex = props.selected.indexOf(value);
        const newSelected = [...props.selected];

        if (currentIndex === -1) {
            newSelected.push(value);
        } else {
            newSelected.splice(currentIndex, 1);
        }

        props.handleChange(newSelected);
    };

    const handleFilterSelectedToggle = name => event => {
        setState({ ...state, [name]: event.target.checked });

        // Reset page 
        setPage(0)

        if (event.target.checked) {

            const currentViewableDocs = filteredDocuments.filter(document => props.selected.includes(document._id));
            setFilteredDocuments(currentViewableDocs);
            setViewableDocuments(currentViewableDocs.slice(0, props.pageMax));
        } else {
            const currentViewableDocs = documents.filter(document => primary(document).toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredDocuments(currentViewableDocs);
            setViewableDocuments(currentViewableDocs.slice(0, props.pageMax));
        }
    };

    useEffect(() => {
        // DOCUMENTS NOT PROPERLY BEING SET (TODO)
        setDocuments(props.docs);
        setFilteredDocuments(props.docs);
        setViewableDocuments(props.docs.slice(0, props.pageMax))
        setProps(props);
    }, [props]);

    return (
        <>

            {/* DOCUMENTS */}
            <div style={{ display: "flex", width: "100%", height: "100%" }}>
                <div style={{ margin: "auto" }} className={classes.content}>
                    <>
                        <Toolbar
                            className={clsx(classes.root, {
                                [classes.highlight]: props.selected.length > 0,
                            })}
                            disableGutters
                        >
                            {PROPS.selected.length > 0 ? (
                                <>
                                    <Typography className={classes.title} color="inherit" variant="subtitle1">
                                        {props.selected.length} selected
                                    </Typography>
                                    <Tooltip title={`Show ONLY Selected `}>
                                        <Switch
                                            checked={state.selectedToggle}
                                            onChange={handleFilterSelectedToggle('selectedToggle')}
                                            value="selectFilter"
                                        />
                                    </Tooltip>
                                </>
                            ) :


                                <Typography className={classes.title} variant="h6" id="tableTitle">
                                    {props.title}
                                </Typography>

                            }

                        </Toolbar>

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
                                                count={Math.ceil(filteredDocuments.length / props.pageMax)}
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
                                                                checked={props.selected.indexOf(document._id) !== -1}
                                                                tabIndex={-1}
                                                                disableRipple
                                                                inputProps={{ 'aria-labelledby': labelId }}
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText style={{ overflowWrap: "break-word" }} id={labelId} primary={primary(document)} secondary={props.secondary ? document[props.secondary] : `Created: ${parseTime(document.createdAt, true)}`} />
                                                        <ListItemSecondaryAction>
                                                            {
                                                                PROPS.link ?
                                                                    <a target="_blank" href={props.link(document)} style={{ textDecoration: "none", fontSize: "1rem" }}>
                                                                        <IconButton aria-label="create" >
                                                                            <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                                                                        </IconButton>
                                                                    </a>
                                                                    :
                                                                    <FontAwesomeIcon icon={icon} />

                                                            }
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

export default DocumentSelector;