import React from 'react';
import Home from './components/Home';
// import User, {loadData} from './components/UsersList';
// import UsersList from "./components/UsersList";
import UserList, {loadData} from "./components/UsersList";

export default [
    {
        path: '/',
        component: Home,
        exact: true
    },
    {
        loadData:loadData,
        path: '/users',
        component: UserList
    }
];

