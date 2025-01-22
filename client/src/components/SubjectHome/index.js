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
        //maxWidth: "600px",
        width: "90%",
        margin: "auto"
    },
}));

// Private field is special use case

function SubjectHome(props) {
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
            <h1>hello</h1>


          
        </div>
    )
};

export default SubjectHome;