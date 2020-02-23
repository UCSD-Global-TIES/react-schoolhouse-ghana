import React from 'react';
import { Button, Typography } from "@material-ui/core";
import { parseTime } from "../../utils/misc";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function FileViewer(props) {
    const { document } = props;
    return (<>
        {/* Replace with user portal skeleton */}
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
            <div style={{ margin: "auto" }}>
                <Typography align="center" variant="overline" display="block" gutterBottom>
                    {parseTime(document.updatedAt, true)}
                </Typography>

                <div style={{ textAlign: "center", marginTop: "1em" }}>
                    <div style={{ margin: "1rem 0" }}>
                        <strong>Filename</strong>
                        <Typography color="textSecondary" display="block" variant="subtitle1" gutterBottom>
                            {document.filename}
                        </Typography>
                    </div>
                    <div style={{ margin: "1rem 0" }}>
                        <strong>Type</strong>
                        <Typography color="textSecondary" display="block" variant="subtitle1" gutterBottom>
                            {document.type}
                        </Typography>
                    </div>
                </div>
                <div style={{ marginTop: "1rem", display: "flex" }}>
                    <div style={{ margin: "auto" }}>
                        <a target="_blank" href={document.path} style={{textDecoration: "none"}}> 
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<FontAwesomeIcon icon={faExternalLinkAlt} />}
                        >
                            Open
                        </Button>
                        </a>
                    </div>
                </div>

            </div>

        </div>
    </>)
}

export default FileViewer;