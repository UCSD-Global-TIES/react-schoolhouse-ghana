import React from 'react'
import NameCard from '../NameCard/NameCard'

const UserList = ({userCategory, users}) => {
  return(
    <div>
      <h2>{userCategory}</h2>
      {users.map((user) => {
        return <NameCard name={user}/>
      })}
      {/* <NameCard name="SAS Admin"/>
      <NameCard name="admin1 lastName"/>
      <NameCard name="student1 lastName"/>
      <NameCard name="teacher1 lastName"/> */}
    </div>
  )
}
export default UserList;