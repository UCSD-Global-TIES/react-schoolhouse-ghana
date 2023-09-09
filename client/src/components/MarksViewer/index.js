import React, { useState, useEffect } from 'react';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@material-ui/core";
import { parseTime } from "../../utils/misc";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function MarksViewer(props) {
    
    const [assignments, setAssignments] = useState([]);
    const [accountName, setAccountName] = useState("");

    console.log(props.match.params.id);
    const subject_id = props.match.params.id;
    useEffect(() => {
        const fetchAccountName = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/account/profile/${props.user.profile._id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAccountName(data.username);
                } else {
                    console.error("Failed to fetch account name.");
                }
            } catch (error) {
                console.error("Error fetching account name:", error);
            }
        };
        fetchAccountName();
    }, [props.user.profile._id]);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/mark/username/${accountName}`);
                if (response.ok) {
                    const data = await response.json();
                    setAssignments(data);
                } else {
                    console.error("Failed to fetch assignments.");
                }
            } catch (error) {
                console.error("Error fetching assignments:", error);
            }
        };

        if (accountName) {
            fetchAssignments();
        }
    }, [accountName]);

    return (
        <>
            <Typography variant="h4">Grades Viewer</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Assignment</TableCell>
                            <TableCell>Grade</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assignments
                            .filter(assignment => assignment.subject === subject_id)
                            .map((assignment, index) => (
                                <TableRow key={index}>
                                    <TableCell>{assignment.assignmentName}</TableCell>
                                    <TableCell>{assignment.grade}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default MarksViewer;
