import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Button, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';


import DocumentPicker from "../DocumentPicker"

import "../../utils/flowHeaders.min.css";
import API from "../../utils/API";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import SaveIcon from '@material-ui/icons/Save';
import SocketContext from "../../socket-context"

const useStyles = makeStyles(theme => ({
    root: {
        padding: "3rem 0rem",
        display: "flex"
    },
    field: {
        margin: "1rem 0px"
    },
    vc: {
        maxWidth: "600px",
        width: "90%",
        margin: "auto"
    },
}));

// Private field is special use case

function SubjectFilesForm(props) {
    const socket = React.useContext(SocketContext)
    const classes = useStyles();
    const [fileOptions, setFileOptions] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState(props.document.files || []);
    const [PROPS, setProps] = useState(props);

    // ALERTS
    const [currentAlert, setCurrentAlert] = useState({ isOpen: false, severity: "", message: "" });


    const notifyServer = () => {
        // Send message on web-socket
        socket.emit('documents-changed', `subject-files-${props.document._id}`)
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

    const handlePickChange = (selectedDocs) => {
        setSelectedFiles(selectedDocs);
    }

    const handleSave = () => {
        API.updateSubject({
            _id: PROPS.document._id,
            files: selectedFiles
        }, PROPS.user.key)
            .then(() => {
                setCurrentAlert({ isOpen: true, severity: "success", message: `The subject files were successfully saved!` });
                notifyServer();
            })
    }

    useEffect(() => {
        API.getFiles(PROPS.user.key)
            .then((result) => {
                const selected = [];
                if (props.document.files) {
                    for (const file of props.document.files) {
                        selected.push(file._id)
                    }
                }
                setSelectedFiles(selected);

                // Set options and loading flag to false
                setFileOptions([...result.data]);

            })


    }, []);

    useEffect(() => {
        setProps(props);

    }, [props])

    return (
        <div className={classes.root}>
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
            <div className={classes.vc}>
                <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        disabled={JSON.stringify(selectedFiles) === JSON.stringify(props.document.files.map((file) => file._id))}
                    >
                        Save
                        </Button>

                </div>
                <DocumentPicker
                    link={(doc) => doc.path}
                    title={"Attached Files"}
                    docs={fileOptions}
                    pageMax={5}
                    selected={selectedFiles}
                    icon={faFile}
                    collection={"Files"}
                    primary={doc => doc.nickname}
                    handleChange={(docs) => handlePickChange(docs)}
                />




            </div>
        </div>
    )
};

export default SubjectFilesForm;