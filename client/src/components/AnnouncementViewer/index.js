import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { parseTime } from "../../utils/misc";
import SimpleListView from "../../components/SimpleListView";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        position: 'relative',
        width: '90%',
        maxWidth: 1200,
        maxHeight: '90vh',
        overflow: 'auto'
    },
    closeButton: {
        position: 'absolute',
        right: 20,
        top: 20,
        color: '#4B4B4B',
        zIndex: 1,
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
        }
    },
    root: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    vc: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    container: {
        width: '100%',
        height: '100%',
        paddingLeft: 70,
        paddingRight: 70,
        paddingTop: 56,
        paddingBottom: 56,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 36,
        display: 'inline-flex'
    },
    titleContainer: {
        alignSelf: 'stretch',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 12,
        display: 'inline-flex'
    },
    title: {
        color: '#4B4B4B',
        fontSize: 60,
        fontFamily: 'Asap Condensed',
        fontWeight: '700',
        wordWrap: 'break-word'
    },
    dateContainer: {
        alignSelf: 'stretch',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 8,
        display: 'inline-flex'
    },
    dateWrapper: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 8,
        display: 'flex'
    },
    dateLabel: {
        color: '#AFAFAF',
        fontSize: 18,
        fontFamily: 'Nunito',
        fontWeight: '700',
        wordWrap: 'break-word'
    },
    dateValue: {
        color: '#AFAFAF',
        fontSize: 18,
        fontFamily: 'Nunito',
        fontWeight: '700',
        wordWrap: 'break-word'
    },
    contentContainer: {
        alignSelf: 'stretch',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        gap: 32,
        display: 'flex'
    },
    content: {
        alignSelf: 'stretch',
        color: '#4B4B4B',
        fontSize: 24,
        fontFamily: 'Nunito',
        fontWeight: '400',
        wordWrap: 'break-word'
    },
    filesContainer: {
        marginTop: '2em'
    }
}));

function AnnouncementViewer(props) {
    const classes = useStyles();
    const { document, onClose } = props;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Check if there are any files to display
    const hasFiles = document.files && document.files.length > 0;

    return (
        <div className={classes.modal} onClick={handleBackdropClick}>
            <div className={classes.modalContent}>
                <IconButton 
                    className={classes.closeButton}
                    onClick={onClose}
                    aria-label="close"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                    </svg>
                </IconButton>
                <div className={classes.root}>
                    <div className={classes.vc}>
                        <div className={classes.container}>
                            <div className={classes.titleContainer}>
                                <div className={classes.title}>
                                    {document.title}
                                </div>
                            </div>
                            
                            <div className={classes.dateContainer}>
                                <div className={classes.dateWrapper}>
                                    <div className={classes.dateLabel}>CREATED ON:</div>
                                    <div className={classes.dateValue}>
                                        {parseTime(document.createdAt)}
                                    </div>
                                </div>
                            </div>
                            
                            <div className={classes.contentContainer}>
                                <div className={classes.content}>
                                    {document.content}
                                </div>
                            </div>

                            {hasFiles && (
                                <div className={classes.filesContainer}>
                                    <SimpleListView
                                        title={"Attached Files"}
                                        items={document.files}
                                        pageMax={5}
                                        icon={faFile}
                                        labelField={"nickname"}
                                        link={"path"}
                                        {...props}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnnouncementViewer;