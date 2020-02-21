import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';

import { IconButton, Grid, Dialog, DialogContent, DialogContentText, DialogTitle, Slide, DialogActions, List, ListItem, ListItemIcon, ListItemText, Typography, ListSubheader, Button, ButtonGroup, CardActionArea, CardActions, CardContent, CardMedia, Card } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import "../../utils/flowHeaders.min.css";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos"
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos"

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


function SimpleListView(props) {
    const classes = useStyles();

    // HOOKS 
    const [pageIdx, setPageIdx] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentDocument, setCurrentDocument] = useState({});

    const handleOpenCurrentDocument = (doc) => {
        setCurrentDocument(doc);
        setDialogOpen(true);
    }

    const handleCloseDocument = () => {
        setDialogOpen(false);
    }

    const handlePageChange = (direction) => {
        setPageIdx(pageIdx + direction)

    }

    return (
        <div style={{ ...props.style }}>
            {currentDocument[props.labelField] &&
                <Dialog
                    open={dialogOpen}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleCloseDocument}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">{currentDocument[props.labelField]}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {currentDocument[props.contentField]}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDocument} color="primary">
                            Close
          </Button>

                    </DialogActions>
                </Dialog>

            }

            <List
                className={classes.root}
                subheader={
                    <ListSubheader component="div" style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{props.title}</span>
                        <ButtonGroup size="small" aria-label="small outlined button group">
                            <ButtonGroup size="small" aria-label="small outlined button group">
                                <IconButton size="small" disabled={pageIdx === 0} onClick={() => handlePageChange(-1)}><ArrowBackIosIcon /></IconButton>
                                <IconButton size="small" disabled={pageIdx === Math.ceil(props.items.length / props.pageMax) - 1} onClick={() => handlePageChange(1)}><ArrowForwardIosIcon /></IconButton>
                            </ButtonGroup>
                        </ButtonGroup>
                    </ListSubheader>}
            >
                {
                    props.items.slice(pageIdx * props.pageMax, (pageIdx + 1) * props.pageMax).map((item) => (


                        <ListItem button onClick={() => handleOpenCurrentDocument(item)} key={item} alignItems="flex-start">
                            <ListItemIcon>
                                <FontAwesomeIcon icon={props.icon} />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    item[props.labelField]
                                }
                                secondary={
                                    moment(item.createdAt).format('MMMM Do YYYY, h:mm a')
                                }
                            />
                        </ListItem>

                    ))

                }


            </List>

        </div>

    );
}

export default SimpleListView;
