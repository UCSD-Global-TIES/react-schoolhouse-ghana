import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//i want to develop to do list feature but i want to implement it after logging in. i dont know what to do
// import ToDoList from './components/ToDoList';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

import ToDoList from './components/ToDoList';
import Login from './components/Login';


const App = () => (
    <Router>
        <Switch>
            <Route exact path="/login" component={Login} />
            <ProtectedRoute exact path="/todos" component={ToDoList} isAuthenticated={isAuthenticated} />
        </Switch>
    </Router>
);
