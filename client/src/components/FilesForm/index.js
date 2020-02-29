import React, { useEffect, useState, useContext } from "react";
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { parseTime } from '../../utils/misc';
import DocumentPicker from "../DocumentPicker"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faFile } from "@fortawesome/free-solid-svg-icons"
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
        label: "File Path (relative)",
        disabled: true,
        helper: "This is the relative path of this file on the server."
    },
    {
        name: "absolutePath",
        label: "File Path (absolute)",
        disabled: true,
        helper: "This is the absolute path of this file on the NAS."
    },
    {
        name: "size",
        label: "File Size",
        disabled: true,
        helper: "This is the size of the file (in bytes)."
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
    const [PROPS, setProps] = useState(props);
    const [fileOptions, setFileOptions] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);


    function convertFileSize(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
    
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
        const i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    const handleFileChange = (e) => {
        const fileObjects = e.target.files;

        // Generate new file options to be rendered in list form
        const newFileOptions = [];
        for(let file of fileObjects) {
            const { name, size, lastModified, webkitRelativePath } = file;
            const _id = `${name}-${lastModified}`;
            let fileMeta = file;
            fileMeta.meta = {webkitRelativePath}
            
            if(!fileOptions.find((item) => item._id === _id )) {
                newFileOptions.push({
                    _id,
                    name, 
                    size: convertFileSize(size),
                    createdAt: lastModified,
                    file: fileMeta
                })
            }
        }

        setFileOptions(fileOptions.concat(newFileOptions));

        setSelectedFiles(selectedFiles.concat(newFileOptions.map(item => item._id)))

        const currentlySelected = selectedFiles.concat(newFileOptions.map(item => item._id));

        const selectedFileObjects = [];
        for(const option of fileOptions.concat(newFileOptions)) {
            if (currentlySelected.includes(option._id)) {
                selectedFileObjects.push(option.file);
            }
        }
        
        const event = {
            target: {
                value: selectedFileObjects,
                name: "files"
            }
        }

        PROPS.handleChange(event)
    }

    const handlePickChange = (selectedDocs) => {
        setSelectedFiles(selectedDocs);

        let selectedFileObjects = [];
        for(const option of fileOptions) {
            if (selectedDocs.includes(option._id)) {
            selectedFileObjects.push(option.file)
            }
        }

        if(!selectedFileObjects.length) {
            selectedFileObjects = undefined;
        }

        const event = {
            target: {
                value: selectedFileObjects,
                name: "files"
            }
        }

        PROPS.handleChange(event)
    }

    useEffect(() => {

        setProps(props);

    }, [props])

    useEffect(() => {

    }, [])

    return (
        <div className={classes.root}>
            <div className={classes.vc}>
                {/* Add field to upload file */}
                {/* for websites - upload folder but mark path to the index.html file */}

                {/* Add file preview */}
                {/* iFrame - websites */}
                {/* react-pdf - pdfs */}
                {/* react-file-viewer - images, csv, docx, mp4 */}

                {
                    PROPS.isCreate ?

                        <>
                            <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", marginBottom: "2rem" }}>
                                {/* <Button size="medium" onClick={() => siofu.submitFiles(selectedFiles)} >
                                        Submit
                                    </Button> */}
                                {/* <input onChange={handleFileChange} id="file-upload-button" type="file" webkitdirectory={""} directory={""} multiple style={{ display: "none" }} /> */}

                                <input onChange={handleFileChange} id="file-upload-button" type="file" multiple style={{ display: "none" }} />
                                <label htmlFor="file-upload-button">
                                    <Button
                                        variant="contained"
                                        style={{ bgColor: "#60bd59" }}
                                        color="primary"
                                        component="span"
                                        endIcon={<FontAwesomeIcon icon={faFile} size="xs" />}
                                    >
                                        Select Files
                                        </Button>
                                </label>
                            </div>
                            <DocumentPicker
                                title={"Files to Upload"}
                                docs={fileOptions}
                                pageMax={10}
                                selected={selectedFiles}
                                icon={faFile}
                                collection={"Files"}
                                primary={(doc) => doc.name}
                                secondary={"size"}
                                handleChange={(docs) => handlePickChange(docs)}
                            />
                        </>


                        :

                        <>
                            <div style={{ display: "flex", width: "100%", marginBottom: "2rem" }}>
                                <div style={{ margin: "auto" }}>
                                    <a target="_blank" href={PROPS.document.path} style={{ textDecoration: "none" }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            endIcon={<FontAwesomeIcon icon={faExternalLinkAlt} />}
                                        >
                                            Open File
                        </Button>
                                    </a>
                                </div>
                            </div>
                            {textFields.map((item, idx) => (
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

                        </>


                }

            </div>
        </div>
    )
};

export default FilesForm;