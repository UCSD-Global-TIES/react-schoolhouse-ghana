import React from "react";
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
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

function handleUpload() {
    const fs = require("fs");
    const readline = require("readline");
    const { google } = require("googleapis");

    // If modifying these scopes, delete token.json.
    const SCOPES = ["https://www.googleapis.com/auth/drive"];
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    const TOKEN_PATH = "token.json";

    // Load client secrets from a local file.
    //Specify location of credential file here
    fs.readFile("/../../../../credentials.json", (err, content) => {
      if (err) return console.log("Error loading client secret file:", err);
      // Authorize a client with credentials, then call the Google Drive API.
      //authorize(JSON.parse(content), listFiles);
      //console.log("checkFile is done");
      authorize(JSON.parse(content), upLoadFile);
    });

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
      });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getAccessToken(oAuth2Client, callback) {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES
      });
      console.log("Authorize this app by visiting this url:", authUrl);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question("Enter the code from that page here: ", code => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
          if (err) return console.error("Error retrieving access token", err);
          oAuth2Client.setCredentials(token);
          // Store the token to disk for later program executions
          fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
            if (err) return console.error(err);
            console.log("Token stored to", TOKEN_PATH);
          });
          callback(oAuth2Client);
        });
      });
    }

    /**
     * Lists the names and IDs of up to 10 files.
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    //function listFiles(auth) {
    //  const drive = google.drive({ version: "v3", auth });
    //  temp = drive;
    //  drive.files.list(
    //    {
    //      pageSize: 10,
    //      fields: "nextPageToken, files(id, name)"
    //   },
    //    (err, res) => {
    //      if (err) return console.log("The API returned an error: " + err);
    //      const files = res.data.files;
    //      if (files.length) {
    //        console.log("Files:");
    //        files.map(file => {
    //          console.log(`${file.name} (${file.id})`);
    //        });
    //      } else {
    //        console.log("No files found.");
    //      }
    //    }
    //  );
    //}

    /**
     * Upload file
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    function upLoadFile(auth) {
      const drive = google.drive({ version: "v3", auth: auth });
      var fileMetadata = {
        //name: "photo.jpg"
        name: "tmp.csv"
      };
      var media = {
        mimeType: "image/jpeg",
        // mimeType: 'text/csv',
        /*TODO: Specify csv filename here*/
        body: fs.createReadStream("./tmp/asdfafd.csv")
        //body: fs.createReadStream("./files/photo.jpg")
      };
      drive.files.create(
        {
          resource: fileMetadata,
          media: media,
          fields: "id"
        },
        function(err, file) {
          if (err) {
            // Handle error
            console.error(err);
          } else {
            console.log("File Id: ", file.id);
          }
        }
      );
    } 
}     
const EnhancedListToolbar = (props) => {
    const classes = useToolbarStyles();
    const { title, numSelected, handleCreate, handleDelete, handleUpdate } = props;

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

              {numSelected > 0 ? (
                <Tooltip title="Upload">
                    <IconButton onClick={handleUpload} aria-label="upload">
                        <CloudUploadIcon />
                    </IconButton>
                </Tooltip>
              ) : ""}
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
