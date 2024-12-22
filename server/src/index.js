// const express = require('express');
// const React = require('react');
// const renderToString = require('react-dom/server').renderToString;
// const Home = require('./client/components/home').default;

import express from 'express';
import React  from "react";
import {renderToString} from 'react-dom/server';
import Home from './client/components/home';



const app = express();

//Make the root directory public
app.use(express.static('public'));
app.get('/', (req, res) => {
// We are using JSX inside node.js code.
const content = renderToString(<Home/>);
const html = `
<html>
<head></head>
<body>
    <div id="root">${content}</div>
    <script src="bundle.js"></script>
</body>
</html>
`;
res.send(html);
})



app.listen(3000,()=>{
    console.log("Server running on port 3000");
});
