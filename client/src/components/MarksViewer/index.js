import React from 'react';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@material-ui/core";
import { parseTime } from "../../utils/misc";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function MarksViewer(props) {
    
    // connect to database and pull data from there
    const assignments = [
        { name: 'Assignment 1', grade: 95 },
        { name: 'Assignment 2', grade: 80 },
        { name: 'Assignment 3', grade: 90 },
        // template assignments
    ];

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
                        {assignments.map((assignment, index) => (
                            <TableRow key={index}>
                                <TableCell>{assignment.name}</TableCell>
                                <TableCell>{assignment.grade}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default MarksViewer;
