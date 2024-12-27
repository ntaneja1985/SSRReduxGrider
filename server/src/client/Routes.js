import React from 'react';
import HomePage from './pages/HomePage';
// import User, {loadData} from './components/UsersList';
// import UsersList from "./components/UsersList";
import UserListPage from "./pages/UsersListPage";
import App from "./App";
import NotFoundPage from "./pages/NotFoundPage";
import AdminsListPage from "./pages/AdminsListPage";

export default [
    {
        ...App,
        routes:[
            {
                ...HomePage,
                path: '/',
                exact: true
            },
            {
                ...UserListPage,
                path: '/users'
            },
            {
                ...AdminsListPage,
                path: '/admins'
            },
            {
                ...NotFoundPage
            }
        ]
    },

];

