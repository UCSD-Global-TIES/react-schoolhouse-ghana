import React, { useEffect, useState, useContext } from "react";
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { parseTime } from '../../utils/misc';
import SocketContext from "../../socket-context";
import SocketIOFileUpload from "socketio-file-upload"

import "../../utils/flowHeaders.min.css";

const useStyles = makeStyles(theme => ({
    root: {
        padding: "3rem 0rem",
        display: "flex"
    },
    field: {
        margin: "1rem 0px"
    },
    vc: {
        maxWidth: "500px",
        width: "90%",
        margin: "auto"
    }
}));

const disabledMsg = `This field will be populated after file creation.`

const textFields = [
    {
        name: "nickname",
        label: "File Nickname",
        helper: "This is an informative nickname for this file."
    },
    {
        name: "filename",
        label: "File Name",
        disabled: true,
        helper: "This is the actual name of the file on the NAS."
    },
    {
        name: "path",
        label: "File Path",
        disabled: true,
        helper: "This is the path of this file on the NAS."
    },
    {
        name: "createdAt",
        label: "Created On",
        isDate: true,
        disabled: true,
        helper: "This is the date this grade was created."
    },
    {
        name: "updatedAt",
        label: "Last Updated",
        isDate: true,
        disabled: true,
        helper: "This is the date this grade was last updated."
    },

]

// Private field is special use case

function FilesForm(props) {
    const classes = useStyles();
    const socket = useContext(SocketContext);
    const siofu = new SocketIOFileUpload(socket);
    const [PROPS, setProps] = useState(props)
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files)
    }

    useEffect(() => {

        setProps(props);

    }, [props])

    return (
        <div className={classes.root}>
            <div className={classes.vc}>
                {/* Add field to upload file */}
                {/* for websites - upload folder but mark path to the index.html file */}

                {/* Add file preview */}
                {/* iFrame - websites */}
                {/* react-pdf - pdfs */}
                {/* react-file-viewer - images, csv, docx, mp4 */}
                <Button size="medium" onClick={() => siofu.submitFiles(selectedFiles)} >
                    Submit
                </Button>
                <input onChange={handleFileChange} type="file" multiple />
                {
                    textFields.map((item, idx) => (
                        <TextField
                            error={PROPS.error[item.name] ? PROPS.error[item.name].exists : null}
                            required={item.required}
                            key={`${item.name}-form-${idx}`}
                            className={classes.field}
                            label={item.label}
                            name={item.name}
                            placeholder={(item.disabled || (item.updateOnly && PROPS.isCreate)) ? disabledMsg : ""}
                            disabled={(item.disabled || (item.updateOnly && PROPS.isCreate))}
                            value={(item.isDate ? parseTime(PROPS.document[item.name]) : null) || PROPS.document[item.name] || ""}
                            helperText={PROPS.error[item.name] ? (PROPS.error[item.name].exists ? PROPS.error[item.name].message : item.helper) : item.helper}
                            onChange={PROPS.handleChange}
                            fullWidth
                            autoComplete={'off'}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            multiline={item.multiline}
                            rows={3}
                            variant="outlined"
                        />
                    ))}

            </div>
        </div>
    )
};

export default FilesForm;