import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { ListItemAvatar, Avatar, LinearProgress, Badge, Dialog, DialogTitle, Fab, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Button, ButtonGroup, InputAdornment, FormControl, InputLabel, Input, Typography } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Beforeunload } from 'react-beforeunload';
import moment from "moment"

import "../../utils/flowHeaders.min.css";
import { faCloudUploadAlt, faUpload, faChevronLeft, faChevronRight, faSpinner, faFilePdf, faFileAudio, faFileCode, faFileCsv, faFileImage, faFileArchive, faFileAlt, faFileUpload, faFileVideo, faFileWord, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import SocketContext from "../../socket-context"

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: "700px",
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    fab: {
        position: 'fixed',
        bottom: "3rem",
        right: "3rem",
    },
    field: {
        margin: "1rem 0px"
    },
    vc: {
        maxWidth: "700px",
        width: "90%",
        margin: "auto"
    },
    searchbar: {
        margin: "0.5rem 0rem",
        width: "100%"
    },
    content: {
        width: "90%",
        maxWidth: "700px"
    },
}));

function UploadQueue(props) {
    const pageMax = 5;
    const socket = React.useContext(SocketContext)
    const classes = useStyles();
    const [pageIdx, setPageIdx] = useState(0);
    const [uploads, setUploads] = useState([]);
    const [filteredUploads, setFilteredUploads] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [PROPS, setProps] = useState(props);

    const handleClose = () => {
        setModalShow(false);
    };

    const handleOpen = () => {
        setModalShow(true);
    };

    // HANDLE QUERY CHANGE
    const handleQueryChange = (event) => {
        const { value } = event.target;
        // Set search query
        setSearchQuery(value);

        // Reset page 
        setPageIdx(0)

        // Filter documents
        if (value.length) {
            const filteredDocuments = uploads.filter(document => document['name'].toLowerCase().includes(value.toLowerCase()));
            setFilteredUploads(filteredDocuments);

        } else {
            // Reset the filtered documents to ALL documents
            setFilteredUploads(uploads);
        }
    }

    const handlePageChange = (direction) => {
        setPageIdx(pageIdx + direction)

    }

    function convertFileSize(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    const handleQueueUpdate = (fileData) => {
        // Locate file in uploads
        const isFile = file => file.name === fileData.name;
        const idx = uploads.findIndex(isFile);

        const tmp = uploads;
        // If it does, update
        if (idx !== -1) {
            tmp.splice(idx, 1, fileData)
        }
        // If it doesn't exist, push into array
        else {
            const tmp = uploads;
            tmp.push(fileData)
        }

        // Set uploads to new array
        setUploads(JSON.parse(JSON.stringify(tmp)))
        // Set filtered uploads based on new uploads and searchQuery
        setFilteredUploads(JSON.parse(JSON.stringify(tmp.filter(document => document['name'].toLowerCase().includes(searchQuery.toLowerCase())))))

    }

    const getFileIcon = (type) => {
        // Return proper icon for specified file type
        let icon;

        if (type === "txt") icon = faFileAlt;
        else if (type === "doc" || type === "docx") icon = faFileWord
        else if (type === "mp3" || type === "wav" || type === "flac" || type === "aac") icon = faFileAudio;
        else if (type === "html" || type === "js" || type === "c" || type === "cpp" || type === "jsx" || type === "java" || type === "json" || type === "css") icon = faFileCode;
        else if (type === "pdf") icon = faFilePdf;
        else if (type === "mov" || type === "flv" || type === "avi" || type === "qt" || type === "mp4" || type === "mpg" || type === "mpeg" || type === "m4v") icon = faFileVideo;
        else if (type === "csv") icon = faFileCsv;
        else if (type === "xls" || type === "xlsx") icon = faFileExcel;
        else if (type === "gif" || type === "jpeg" || type === "jpg" || type === "tiff" || type === "png" || type === "svg") icon = faFileImage;
        else if (type === "zip" || type === "gzip" || type === "tar" || type === "rar" || type === "iso" || type === "7z" || type === "dmg" || type === "jar") icon = faFileArchive;
        else icon = faFileUpload;

        return icon;
    }


    useEffect(() => {

        const events = ['download-progress', 'download-end', 'download-error']

        for (const event of events) {
            socket.on(event, data => handleQueueUpdate(data))
        }

    }, []);

    useEffect(() => {
        setProps(props);

    }, [props])

    return (
        <div className={classes.root}>

            <div className={classes.vc} >

                <Fab aria-label={"View Uploads"} onClick={handleOpen} className={classes.fab} color={'primary'}>
                    <Badge color="secondary" badgeContent={uploads.filter((item) => item.status === "Pending").length} children={<FontAwesomeIcon size="lg" icon={faCloudUploadAlt} />} />

                </Fab>

                <Beforeunload onBeforeunload={uploads.filter((item) => item.status === "Pending").length ? () => "You have pending uploads, are you sure you want to leave this page? (uploads will be deleted)" : (e) => e} />

                <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={modalShow} >
                    <DialogTitle id="simple-dialog-title">Uploads ({uploads.filter((item) => item.status === "Pending").length} pending)</DialogTitle>
                    <div style={{ padding: "2rem", width: "85vw", maxWidth: "500px" }}>


                        <FormControl className={classes.searchbar}>
                            <InputLabel htmlFor="standard-adornment-amount">Search uploads</InputLabel>
                            <Input
                                value={searchQuery}
                                onChange={handleQueryChange}
                                startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
                            />
                        </FormControl>

                        <List
                            className={classes.root}
                            subheader={
                                <ListSubheader component="div" style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>Files</span>
                                    <ButtonGroup size="small" aria-label="small outlined button group" style={{
                                        paddingTop: "9px",
                                        height: "2rem"
                                    }}>
                                        <Button size="small" disabled={pageIdx === 0} onClick={() => handlePageChange(-1)}><FontAwesomeIcon icon={faChevronLeft} /></Button>
                                        <Button size="small" disabled={pageIdx === Math.ceil(uploads.length / pageMax) - 1 || uploads.length === 0} onClick={() => handlePageChange(1)}><FontAwesomeIcon icon={faChevronRight} /></Button>
                                    </ButtonGroup>
                                </ListSubheader>}
                        >
                            {
                                filteredUploads.length ?

                                    filteredUploads.slice(pageIdx * pageMax, (pageIdx + 1) * pageMax).map((file, idx) => (

                                        <ListItem alignItems="flex-start" key={file.name + idx}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <FontAwesomeIcon icon={getFileIcon(file.type)} />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                style={{ overflowWrap: "break-word" }}
                                                primary={file.name}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            className={classes.inline}
                                                            style={{
                                                                color:
                                                                    file.status === "Pending" ? "orange"
                                                                        : file.status === "Complete" ? "green"
                                                                            : "red"
                                                            }}
                                                            color="textPrimary"
                                                        >
                                                            {file.status}
                                                        </Typography>
                                                        <span style={{ display: "block" }}>
                                                            {file.percent} % | {convertFileSize(file.bytesLoaded)} of {convertFileSize(file.size)}
                                                            <LinearProgress color={file.status === "Error" ? "secondary" : "primary"} variant="determinate" value={parseFloat(file.percent)} />
                                                        </span>
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>


                                    ))

                                    :

                                    <div style={{ display: "flex", marginTop: "2rem" }}>
                                        <div style={{ margin: "auto", padding: "3rem" }}>
                                            <Typography className="flow-text" style={{ color: "grey" }} variant="h5">There are currently no uploads.</Typography>
                                            <p style={{ textAlign: "center", color: "grey" }}><FontAwesomeIcon icon={faUpload} size="5x" /></p>
                                        </div>
                                    </div>

                            }


                        </List>
                    </div>
                </Dialog>



            </div>
        </div>
    )
};

export default UploadQueue;