import React from 'react';
import { Typography } from "@material-ui/core";
import { parseTime } from "../../utils/misc";
import SimpleListView from "../../components/SimpleListView";
import { faFile } from "@fortawesome/free-solid-svg-icons"

function AnnouncementViewer(props) {
    const { document } = props;
    return (<>
        {/* Replace with user portal skeleton */}
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
            <div style={{ margin: "auto" }}>
                <Typography align="center" variant="overline" display="block" gutterBottom>
                    {parseTime(document.updatedAt, true)}
                </Typography>
                <Typography style={{ marginTop: "2em" }} variant="body2" gutterBottom>
                    {document.content}
                </Typography>
                <div style={{ marginTop: "2em" }}>
                    {
                        document.files.length ?
                            <SimpleListView
                                title={"Attached Files"}
                                items={document.files || []}
                                pageMax={5}
                                icon={faFile}
                                labelField={"nickname"}
                                link={"path"}
                                {...props}
                            />
                            : ""
                    }
                </div>

            </div>

        </div>
    </>)
}

export default AnnouncementViewer;