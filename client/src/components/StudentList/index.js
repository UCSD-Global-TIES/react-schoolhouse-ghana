import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import API from "../../utils/API"

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    }
}));

function StudentList(props) {
    const classes = useStyles();
    const [PROPS, setProps] = useState(props.props);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        API.getUserGrade(PROPS.user.profile._id, PROPS.user.key)
            .then((result) => {
                setStudents(result.data.students);
            });
    }, []);

    const renderStudentView = () => {
        return students.map((val, index) => 
            <p key={index}>{val}</p>
        );
    };

    return (
        <div>
            {renderStudentView()}
        </div>
    )
};

export default StudentList;