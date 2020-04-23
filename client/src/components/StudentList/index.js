import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    }
}));

function StudentList(props) {
    const classes = useStyles();
    const [PROPS, setProps] = useState(props);

    return (
        <div style={{...PROPS.style}}>
            <h1>yeet</h1>
        </div>
    )
};

export default StudentList;