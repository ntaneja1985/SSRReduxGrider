// const express = require('express');
// const React = require('react');
// const renderToString = require('react-dom/server').renderToString;
// const Home = require('./client/components/home').default;

import 'babel-polyfill';
import express from 'express';
import renderer from "./helpers/renderer";
import createStore from "./helpers/createStore";

const app = express();

//Make the root directory public
app.use(express.static('public'));
app.get('*', (req, res) => {
// We are using JSX inside node.js code
    const store = createStore();
    //Some logic to initialize and load data into the store.
    res.send(renderer(req,store));
})

app.listen(3000,()=>{
    console.log("Server running on port 3000");
});
