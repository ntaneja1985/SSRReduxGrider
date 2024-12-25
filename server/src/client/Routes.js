import React from 'react';
import HomePage from './pages/HomePage';
// import User, {loadData} from './components/UsersList';
// import UsersList from "./components/UsersList";
import UserListPage from "./pages/UsersListPage";

export default [
    {
        ...HomePage,
        path: '/',
        exact: true
    },
    {
        ...UserListPage,
        path: '/users'
    }
];

