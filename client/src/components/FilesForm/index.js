import React, { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

import "../../utils/flowHeaders.min.css";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    }
}));


function FilesForm(props) {

    useEffect(() => {

    }, []);

    return (
        <>
            {
                [1, 2, 3].map((item) => (
                    <TextField
                        key={item}
                        label="Title"
                        style={{ margin: "8px 0px" }}
                        name="title"
                        value={props.document["title"] || ""}
                        helperText="An informative title for your announcement"
                        onChange={props.handleChange}
                        fullWidth
                        autoComplete={'off'}
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                    />))
            }
        </>
    )
};

export default FilesForm;