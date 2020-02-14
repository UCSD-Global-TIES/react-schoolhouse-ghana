import React, { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import FilesForm from "../FilesForm";
import DocumentEditor from "../DocumentEditor";
import { makeStyles } from '@material-ui/core/styles';

import "../../utils/flowHeaders.min.css";
import { faFile } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    }
}));


function ServerDash(props) {

    useEffect(() => {

    }, []);

    return (
        <>
            <DocumentEditor
                primary={'title'}
                collection={'Files'}
                icon={faFile}
                FormComponent={FilesForm}
                {...props} />
        </>
    )
};

export default ServerDash;