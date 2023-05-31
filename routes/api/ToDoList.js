import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import ToDoList from './components/ToDoList';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
    <Router>
        <Switch>
            <Route exact path="/login" component={Login} />
            <ProtectedRoute exact path="/todos" component={ToDoList} isAuthenticated={isAuthenticated} />
        </Switch>
    </Router>
);
