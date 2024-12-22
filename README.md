# Server Side Rendering with React Redux by Stephen Grider

## Why we need SSR and what problems it solves 
- To get some content on the screen we do this 
- ![img.png](img.png)
- ![img_1.png](img_1.png)
- Not the most efficient solution in the world to get useful information in front of the user.
- Loading a page as fast as possible improves the revenue of the company.
- So we need SSR to solve this.
- Goal of SSR is to make content visible on the user's screen as quickly as possible and we dont want to make so many round trips before any content appears in front of the user.
- We just want to make one request.
- SSR dramatically decreases the time it takes to load content for the user.
- When we create a traditional React App, the first HTML document that is sent by the server has very sparse content inside of it.
- But when we use SSR, the HTML document sent by the server has a lot of content inside of it.
- The initial request in case of SSR gets all the information we need to render information on the screen.
- ![img_2.png](img_2.png)
- ![img_3.png](img_3.png)

## Sample App to visualize server side rendering
- We will have 2 backend servers 
- ![img_4.png](img_4.png)
- API server handles all business logic, will give list of users, list of admins and handling authentication
- Rendering Server is responsible for rendering application and serving it to the user
- ![img_5.png](img_5.png)
- All the API server really needs to do is to produce JSON
- Rendering Server takes the data as JSON and produces HTML
- Rendering Server has customized react logic that goes inside it.
- By splitting our application into these 2 tiers or server, we can easily scale our application also.
- ![img_6.png](img_6.png)
- ![img_7.png](img_7.png)
- ![img_8.png](img_8.png)
- ![img_9.png](img_9.png)
- Server side rendering is not perfect
- It is not the fastest thing in the world.
- By having a different rendering server, we can easily scale it up and allocate more resources to it to mitigate its poor performance. 
- React Server Side Rendering is computationally slow and time-consuming.
- Walmart Labs build electrode which is a react/node.js application platform that powers walmart.com and improves performance of its server side rendering.

## Building the application
- ![img_10.png](img_10.png)
- ![img_11.png](img_11.png)
- Create an express server like this 
```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {

})

app.listen(3000,()=>{
    console.log("Server running on port 3000");
});
```
- Create a simple Home component like this
```js
import React from 'react';
const Home = () => {
  return <div> I am the home component</div>
};
export default Home;
```
- Note that in index.js we are using CommonJS modules syntax whereas inside the Home component we are using ES6 Modules syntax.
- ![img_12.png](img_12.png)
- To turn our Home HTML component to send it down to the user, we need to use React DOM library 
- It has 2 functions: render() and renderToString()
- We will ReactDOM.renderToString() function
- We can use our react component inside our node.js express application like this 
```js
const express = require('express');
const React = require('react');
const renderToString = require('react-dom/server').renderToString;
const Home = require('./client/components/home').default;
const app = express();

app.get('/', (req, res) => {
// We are using JSX inside node.js code.
    const content = renderToString(<Home/>);
    res.send(content);
})

app.listen(3000,()=>{
    console.log("Server running on port 3000");
});

```
- But this is not going to run. This is because node.js doesnot know how to run JSX code.
- If we execute this using node src/index.js inside our terminal it will display an error

## How does client side React Code work?
- All of our files with JSX are imported into a single index.js
- Babel compiles these files and converts it into normal javascript es6 code
- We end up with bundle.js file which contains the transpiled code 
- ![img_13.png](img_13.png)
- We have to somehow think of integrating Webpack and Babel to convert all our JSX into normal es6 code.
- We should use webpack and babel to convert our code into es6 code into index.js and use node to run index.js file.
- We need to create webpack.config file and add a couple of options to it to inspect our index.js file and run Babel over it.

## Webpack and Babel 
- Webpack and Babel are essential tools in the development workflow for React applications. They help streamline and enhance the process of building, bundling, and transforming your code.
- Webpack is a powerful module bundler that packages your JavaScript and other assets (like CSS, images) into bundles that can be efficiently loaded by the browser. It transforms your source code into a format suitable for deployment.
- Has the following features:
- Bundling: Combines multiple JavaScript files into a single bundle or multiple chunks for efficient loading.
- Loaders: Transforms files into modules that can be included in your dependency graph. For example, you can use loaders to convert JSX (React's syntax) into plain JavaScript.
- Plugins: Extends Webpack's capabilities with additional functionalities like minification, HMR (Hot Module Replacement), and more.
- Code Splitting: Splits your code into smaller chunks to load parts of your application only when needed, improving performance.
- **Babel** is a JavaScript compiler that transforms modern JavaScript (ES6+) and JSX syntax into backwards-compatible JavaScript that can run in older browsers. It ensures that you can use the latest features of JavaScript without worrying about browser compatibility.
- Has the following features:
- Transpiling: Converts ES6+ syntax to ES5 syntax.
- Plugins and Presets: Modular transformations for various JavaScript features, such as transforming JSX, async/await, and more.
- Polyfills: Adds support for newer JavaScript features that aren't natively supported by older environments.
- In a React development environment, Webpack and Babel work in harmony to streamline the build process:
- Webpack handles bundling and asset management.
- Babel transforms your modern JavaScript and JSX code into browser-compatible JavaScript using Webpack loaders.
- Write your React components using JSX and modern JavaScript syntax.
- Webpack processes your files and uses Babel to transpile the code.
- Webpack bundles the transpiled code and assets into a format ready for deployment.
- By using Webpack and Babel, you can take full advantage of modern JavaScript features and build efficient, optimized React applications.
- In our code to process our jsx we will create webpack.server.js
```js
const path = require('path');

module.exports = {
    //  Inform webpack that we are building a bundle for node.js rather than for the browser.
    target: 'node',
    // Tell webpack the root file of our server application
    entry: './src/index.js',
    // Tell webpack where to put the output file that is generated
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
    },

    //Tell webpack to run babel on every file it runs through
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [
                        'react',
                        'stage-0',
                        //env is a master preset and runs all transpiled rules for the last 2 versions of the browser
                        ['env',{targets:{browsers: ['last 2 versions']}}]
                    ],
                }
            }
        ]
    }
};
```
- To run this configuration using webpack we need to add some scripts in package.json
- so we will include the following code:
```js
"scripts": {
    "dev:build:server": "webpack --config webpack.server.js"
  },
```
- Once we run npm run dev:build:server, we can see a build folder being generated with bundle.js file inside of it.
- This file has all the code for express, react, react dom and in the very end it has our react code also but now represented in plain javascript. 
- Now this file can safely be executed by node.
- Run node build/bundle.js 
- It will fire up the express server and we see the following
- ![img_14.png](img_14.png)
- ![img_15.png](img_15.png)
- With server side all the client side code and server side code gets compiled into a single application that contains both of our client and server logic.

## Server Configuration
- Currently, if we make changes to home component and save it and refresh our browser, nothing gets reflected.
- ![img_16.png](img_16.png)
- We need to edit our package.json file.
- Webpack needs to watch all the files for changes and if it changes generate a new bundle.js
- nodemon just needs to look at changes in the build folder and execute it if a new bundle.js file is generated
```js
 "scripts": {
    "dev:server": "nodemon --watch build --exec node build/bundle.js",
        "dev:build:server": "webpack --config webpack.server.js --watch"
},
```
- Now if we open 2 terminals and run these scripts then any changes to the home component are automatically reflected
- Eventually we will combine both of these scripts to one single command.

## Server Side Rendering, Universal Javascript and Isomorphic Javascript
- ![img_17.png](img_17.png)
- We can do server side rendering even without react, also called server side templating.
- We should use the same coding styles both on client side and server side.
- Since we are using webpack and babel on our server side code, we can use ES2015 modules on server side.
- We can refactor our index.js code like this
```js
// const express = require('express');
// const React = require('react');
// const renderToString = require('react-dom/server').renderToString;
// const Home = require('./client/components/home').default;

import express from 'express';
import React  from "react";
import {renderToString} from 'react-dom/server';
import Home from './client/components/home';
```
## Client Side JS 
- ![img_18.png](img_18.png)
- In a regular react app, using babel and webpack we have compiled javascript code which is loaded into the browser.
- This code also attaches event handlers to various components of the DOM
- But in the current server side rendering setup, when we use renderToString() function of react, it just sends raw HTML from the component.
- Even if we define event handlers inside the component, they are not sent. 
- ![img_19.png](img_19.png)
- We somehow need to ship all our javascript code along with html code. 
- Earlier we had the challenge to render our HTML code from react component to render from the server onto the browser.
- Our next challenge is to somehow send our javascript code along with HTML code from component at server side into the browser.
- To solve this we will create 2 bundles using webpack
- ![img_20.png](img_20.png)
- We will setup a second webpack pipeline which will run alongside the first one.
- For this we will create webpack.client.js which will watch a file called client.js for changes
- Note that it will output all the transpiled code into a public folder.
- So now we have 2 bundles, one for the server side and other for the client side.
```js
const path = require('path');

module.exports = {
    // Tell webpack the root file of our server application
    entry: './src/client/client.js',
    // Tell webpack where to put the output file that is generated
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
    },

    //Tell webpack to run babel on every file it runs through
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [
                        'react',
                        'stage-0',
                        //env is a master preset and runs all transpiled rules for the last 2 versions of the browser
                        ['env',{targets:{browsers: ['last 2 versions']}}]
                    ],
                }
            }
        ]
    }
};
```
- We want to make sure that once the browser has got all the server side, it comes back and fetches the client side code as well.
- For this we will need to make some changes to index.js file of express like this
```js
app.use(express.static('public'));
app.get('/', (req, res) => {
// We are using JSX inside node.js code.
    const content = renderToString(<Home/>);
    const html = `
<html>
<head></head>
<body>
    <div>${content}</div>
    <script src="bundle.js"></script>
</body>
</html>
`;
    res.send(html);
})
```
- So whenever we go to the root path of our application, we are serving up a html page that has our content from the Home component inside it.
- It also has a script tag with bundle.js. 
- It will automatically fetch this file from the public folder which is now accessible to all 
- So now we will see something like this 
- ![img_21.png](img_21.png)

## Why we need a separate Client.js file ?
- ![img_22.png](img_22.png)
- We must do separation of concerns. The client code should never make call to some code that should only run on the server like an API key or any other sensitive information.
- Client.Js is the startup file for our application specifically in the browser. 
- Index.JS will have code that is exclusively for the server whereas client.JS will have code specifically for the browser.
- Having these 2 files allows us to run different configurations of react-router and redux
- ![img_23.png](img_23.png)
- First the server side rendered app is loaded, then client side bundle is run and React takes over and binds the event handlers.
- Client side bundles breathes life into the server-side rendered skeleton.
- This process of putting functionality back into the DOM that was already rendered or all the HTML is already rendered is called **hydration**.
- For this first in the index.js we need to make sure that our content is rendered into a div with id of root like this 
```js
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
```
- Now we will make changes to Client.js file and make sure the Home component gets rendered inside this root div like this 
```js
// Startup point for the client side application
import React from "react";
import ReactDOM from "react-dom";
import Home from "./components/Home";


ReactDOM.render(<Home />, document.getElementById("root"));
```
- Post React 17, ReactDOM.render() will not work, we need to use ReactDOM.hydrate()
```js
ReactDOM.hydrate(<Home />, document.getElementById("root"));
```
- If we go to the browser and click on the button we get the desired result and javascript starts working.
- ![img_24.png](img_24.png)
