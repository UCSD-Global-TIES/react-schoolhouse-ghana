import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import NameCard from '../NameCard/NameCard';

const useStyles = makeStyles({
  header: {
    color: "#4B4B4B",
    fontFamily: "Asap Condensed",
    fontSize: "2.5rem",
    fontStyle: "normal",
    fontWeight: "bold",
    lineHeight: "4rem" /* 160% */
  }
})

const UserList = ({userCategory, users}) => {
  const classes = useStyles();

  return(
    <div>
      <h2 className={classes.header}>{userCategory}</h2>
      {users.map((user) => {
        return <NameCard name={user}/>
      })}
    </div>
  )
}
export default UserList;