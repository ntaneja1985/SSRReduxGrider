// const express = require('express');
// const React = require('react');
// const renderToString = require('react-dom/server').renderToString;
// const HomePage = require('./client/components/home').default;

import 'babel-polyfill';
import express from 'express';
import renderer from "./helpers/renderer";
import createStore from "./helpers/createStore";
import Routes from "./client/Routes";
import {matchRoutes} from "react-router-config";

const app = express();

//Make the root directory public
app.use(express.static('public'));
app.get('*', (req, res) => {
// We are using JSX inside node.js code
// Some logic to initialize and load data into the store.
    const store = createStore();
    //return an array of components which will be rendered.

    //Returns an array of promises
    const promises = matchRoutes(Routes,req.path).map(({route})=>{
        return route.loadData ? route.loadData(store) : null;
    });

    Promise.all(promises).then(() => {
        res.send(renderer(req,store));
    })
})

app.listen(3000,()=>{
    console.log("Server running on port 3000");
});
