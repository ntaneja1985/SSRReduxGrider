// const express = require('express');
// const React = require('react');
// const renderToString = require('react-dom/server').renderToString;
// const HomePage = require('./client/components/home').default;

import 'babel-polyfill';
import express from 'express';
import renderer from "./helpers/renderer";
import createStore from "./helpers/createStore";
import Routes from "./client/Routes";
import proxy from 'express-http-proxy'
import {matchRoutes} from "react-router-config";

const app = express();

//middleware
app.use('/api', proxy('http://react-ssr-api.herokuapp.com', {
    proxyReqOptDecorator(opts){
        opts.headers['x-forwarded-host'] = "localhost:3000";
        return opts;
    }
}));

//Make the root directory public
app.use(express.static('public'));
app.get('*', (req, res) => {
// We are using JSX inside node.js code
// Some logic to initialize and load data into the store.
    const store = createStore(req);
    //return an array of components which will be rendered.

    //Returns an array of promises
    const promises = matchRoutes(Routes,req.path).map(({route})=>{
        return route.loadData ? route.loadData(store) : null;
    }).map(promise => {
        if(promise){
            return new Promise((resolve,reject)=>{
                promise.then(resolve).catch(resolve);
            })
        }
    })

    Promise.all(promises).then(() => {
        const context = {};
        const content = renderer(req,store,context);

        console.log(context);
        if(context.url){
            return res.redirect(301,context.url);
        }
        if(context.notFound)
        {
            res.status(404);
        }
        res.send(content);
    })
})

app.listen(3000,()=>{
    console.log("Server running on port 3000");
});
