import React from "react";
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import PostAddIcon from '@material-ui/icons/PostAdd';
import EditIcon from '@material-ui/icons/Edit';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';

const useToolbarStyles = makeStyles(theme => ({
    root: {
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

const EnhancedListToolbar = (props) => {
    const classes = useToolbarStyles();
    const { numSelected, handleCreate, handleDelete, handleUpdate } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
            disableGutters
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1">
                    {numSelected} selected
              </Typography>
            ) : (
                    <Typography className={classes.title} variant="h6" id="tableTitle">
                        {props.title}
                    </Typography>
                )}

            {numSelected === 1 ? (
                <Tooltip title="Edit">
                    <IconButton onClick={handleUpdate} aria-label="edit">
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            ) : ""}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton onClick={handleDelete} aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : ""}
            <Tooltip title="Create">
                <IconButton onClick={handleCreate} aria-label="create">
                    <PostAddIcon />
                </IconButton>
            </Tooltip>
        </Toolbar>
    );
};

export default EnhancedListToolbar;