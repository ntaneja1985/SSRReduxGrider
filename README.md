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
- Create a simple HomePage component like this
```js
import React from 'react';
const HomePage = () => {
  return <div> I am the home component</div>
};
export default HomePage;
```
- Note that in index.js we are using CommonJS modules syntax whereas inside the HomePage component we are using ES6 Modules syntax.
- ![img_12.png](img_12.png)
- To turn our HomePage HTML component to send it down to the user, we need to use React DOM library 
- It has 2 functions: render() and renderToString()
- We will ReactDOM.renderToString() function
- We can use our react component inside our node.js express application like this 
```js
const express = require('express');
const React = require('react');
const renderToString = require('react-dom/server').renderToString;
const HomePage = require('./client/components/home').default;
const app = express();

app.get('/', (req, res) => {
// We are using JSX inside node.js code.
    const content = renderToString(<HomePage/>);
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
// const HomePage = require('./client/components/home').default;

import express from 'express';
import React  from "react";
import {renderToString} from 'react-dom/server';
import HomePage from './client/components/home';
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
    const content = renderToString(<HomePage/>);
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
- So whenever we go to the root path of our application, we are serving up a html page that has our content from the HomePage component inside it.
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
    const content = renderToString(<HomePage/>);
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
- Now we will make changes to Client.js file and make sure the HomePage component gets rendered inside this root div like this 
```js
// Startup point for the client side application
import React from "react";
import ReactDOM from "react-dom";
import HomePage from "./components/HomePage";


ReactDOM.render(<HomePage />, document.getElementById("root"));
```
- Post React 17, ReactDOM.render() will not work, we need to use ReactDOM.hydrate()
```js
ReactDOM.hydrate(<HomePage />, document.getElementById("root"));
```
- If we go to the browser and click on the button we get the desired result and javascript starts working.
- ![img_24.png](img_24.png)

## Merging the Webpack config files
- We will use a npm package webpack-merge
- It takes both these 2 config files and produces a single config file
- It used object prototype inheritance used in javascript
- ![img_25.png](img_25.png)
- We will create a webpack.base.js which will contain the common configuration of module from both client and server webpack config files.
- webpack.base.js will look like this:
```js
module.exports = {
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
- webpack.server.js will look like this 
```js
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

const config = {
    //  Inform webpack that we are building a bundle for node.js rather than for the browser.
    target: 'node',
    // Tell webpack the root file of our server application
    entry: './src/index.js',
    // Tell webpack where to put the output file that is generated
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
    }
};

module.exports = merge(baseConfig, config);
```
-webpack.client.js will look like this
```js
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

var config = {
    // Tell webpack the root file of our server application
    entry: './src/client/client.js',
    // Tell webpack where to put the output file that is generated
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
    }
};

module.exports = merge(baseConfig, config);
```
- Currently in package.json we have 3 scripts that we need to run which is cumbersome
```js
"scripts": {
    "dev:server": "nodemon --watch build --exec node build/bundle.js",
    "dev:build:server": "webpack --config webpack.server.js --watch",
    "dev:build:client": "webpack --config webpack.client.js --watch"
  },
```
- To fix it we will use a npm package npm-run-all
- We can use it like this 
```js
"scripts": {
    "dev": "npm-run-all --parallel dev:*",
    "dev:server": "nodemon --watch build --exec node build/bundle.js",
    "dev:build-server": "webpack --config webpack.server.js --watch",
    "dev:build-client": "webpack --config webpack.client.js --watch"
  },
```
## Ignoring files with Webpack
- ![img_26.png](img_26.png)
- We are not super concerned with size of the server bundle file
- Currently what happens is any library that is inside require() is automatically fetched and put inside the bundle.js file
- However, We do need a faster webpack process.
- We will make use of another npm package: webpack-node-externals
- We will use it like this 
```js
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const webpackNodeExternals = require('webpack-node-externals');



const config = {
    //  Inform webpack that we are building a bundle for node.js rather than for the browser.
    target: 'node',
    // Tell webpack the root file of our server application
    entry: './src/index.js',
    // Tell webpack where to put the output file that is generated
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
    },
    externals: [webpackNodeExternals()]
};

module.exports = merge(baseConfig, config);
```
- webpack-node-externals will tell webpack not to put any file inside the bundle.js that exists inside the node_modules folder.
- Earlier bundle.js file used to be 757kb now it is 4.68kb
- ![img_27.png](img_27.png)
- We will create a separate helpers folder and create a renderer function that will contain the logic of encapsulating the html for the React App
- Then we can make our index.js file even smaller like this
```js
import express from 'express';
import renderer from "./helpers/renderer";

const app = express();

//Make the root directory public
app.use(express.static('public'));
app.get('/', (req, res) => {
// We are using JSX inside node.js code
res.send(renderer());
})

app.listen(3000,()=>{
    console.log("Server running on port 3000");
});
```
## Implementing React Router Support
- ![img_28.png](img_28.png)
- We will have 2 tiers of routing in our application: one tier is for Express Router Handler and other is for React Router
- Express will not enforce any routing rules on the incoming requests.
- Express will pass the routing decision to react router.
- We can always add rules to express route handler. 

## BrowserRouter vs StaticRouter
- How React Router works in a normal vanilla React App with a Browser Router can be shown in the following diagram:
- ![img_29.png](img_29.png)
- ![img_30.png](img_30.png)
- BrowserRouter is harcoded to look at the address in the address bar.
- However on the server side, no address bar is present.
- To solve this problem, we need 2 different routers
- ![img_31.png](img_31.png)
- StaticRouter is specifically made for use with SSR.
- **StaticRouter will run on the server and Browser Router will run on the browser.**
- To use both of these routers, we will do the following:
- ![img_32.png](img_32.png)
- First, we will create a file Routes.js which will contain all different route mappings of our application, only route mappings only
- Then we will import that routes file inside in the renderer.js file for the server and client.js file for the client(browser).
- In renderer.js we will make use of StaticRouter and inside the client.js we will use BrowserRouter.
- Routes.js file will look like this 
```js
import React from 'react';
import {Route} from 'react-router-dom';
import HomePage from './components/HomePage';

export default ()=>{
    return (
        <div>
            <Route exact path="/" component={HomePage}/>
        </div>
    )
}
```
- Using this Route Mapping file inside client.js can be done like this:
- Note that in client.js we make use of the Browser Router.
```js
// Startup point for the client side application
import React from "react";
import ReactDOM from "react-dom";
// import HomePage from "./components/HomePage";
import {BrowserRouter} from "react-router-dom";
import Routes from "./Routes";


ReactDOM.hydrate(
    <BrowserRouter>
        <Routes />
    </BrowserRouter>
    , document.getElementById("root"));
```
- Sometimes we may see an error message like this
- ![img_33.png](img_33.png)
- This error message is because there is a mismatch in the html being rendered by the server and the html that is being hydrated from the client
- React expects both of them to have the same HTML output
- For the server side changes, we will pass the Routes.js file to the renderer.js file also
```js
import React from "react";
import {renderToString} from "react-dom/server";
import {StaticRouter} from "react-router-dom";
import Routes from "../client/Routes"
// import HomePage from "../client/components/HomePage";

export default (req) =>{
    const content = renderToString(
        <StaticRouter location={req.path} context={{}}>
            <Routes />
        </StaticRouter>
    );
    return `
<html lang="en">
<head>
<title>React App</title>
</head>
<body>
    <div id="root">${content}</div>
    <script src="bundle.js"></script>
</body>
</html>
`;
};
```
- Please note that Static router has a required props of context which is an empty object and a location which is set to the current path of the user's request.
- This req is passed from the request parameter in index.js to renderer.js 
```js
//Make the root directory public
app.use(express.static('public'));
app.get('/', (req, res) => {
// We are using JSX inside node.js code
    res.send(renderer(req));
})
```
- To configure Express to allow all incoming requests and pass them to the react router, we need to do this(use * instead of /):
```js
//Make the root directory public
app.use(express.static('public'));
app.get('*', (req, res) => {
// We are using JSX inside node.js code
    res.send(renderer(req));
})
```
- For the app we are building we will use this API
- https://react-ssr-api.herokuapp.com/
- ![img_34.png](img_34.png)
- Redux is incharge of all data management for our app
- However, Redux will work differently on server versus the client
- ![img_35.png](img_35.png)
- ![img_36.png](img_36.png)
- On the client side, we have access to the cookie data used in cookie based authentication, but how do we get that cookie data on the server side. That's a significant challenge.

## Redux Refresher
- create Store: The createStore function in Redux is used to create a Redux store that holds the state of your application. The store's state can only be changed by dispatching actions.
```js
import { createStore } from 'redux';
import rootReducer from './reducers';

const store = createStore(rootReducer);

```
- In this example, rootReducer is a function that takes the current state and an action, and returns the new state.
- applyMiddleware: Middleware in Redux provides a third-party extension point between dispatching an action and the moment it reaches the reducer. applyMiddleware is used to apply middleware to the store.
```js
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import logger from 'redux-logger'; // Example middleware

const store = createStore(rootReducer, applyMiddleware(logger));

```
- Here, logger is a middleware that logs actions and state changes to the console.
- thunk: Redux Thunk is middleware that allows you to write action creators that return a function instead of an action. 
- This is useful for handling asynchronous operations.
```js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const store = createStore(rootReducer, applyMiddleware(thunk));

// An example of an action creator that returns a function
const fetchData = () => {
    return (dispatch) => {
        fetch('/api/data')
            .then(response => response.json())
            .then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
            .catch(error => dispatch({ type: 'FETCH_ERROR', error }));
    };
};

```
- In this example, fetchData is an action creator that performs an asynchronous fetch operation and dispatches different actions based on the result.

- Provider: The Provider component from react-redux makes the Redux store available to the rest of your app. By wrapping your app in the Provider, you can use the connect function to connect your components to the Redux store.
```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

```
## Redux Browser Store Creation
- We will first create a store for the client side in client.js like this 
```js
// Startup point for the client side application
import 'babel-polyfill';
import React from "react";
import ReactDOM from "react-dom";
// import HomePage from "./components/HomePage";
import {BrowserRouter} from "react-router-dom";
import {createStore,applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import Routes from "./Routes";
import reducers from "./reducers";

const store = createStore(reducers,{},applyMiddleware(thunk));
ReactDOM.hydrate(
    <Provider store={store}>
        <BrowserRouter>
            <Routes />
        </BrowserRouter>
    </Provider>
    , document.getElementById("root"));
```
- On the server side we will create a helper method to create a store on the server
```js
import {createStore,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../client/reducers';

export default () =>{
    const store = createStore(reducers, {}, applyMiddleware(thunk));
    return store;
}
```
- Then we will import that store inside the index.js and pass it to the renderer function which will then have a provider to provide it to all components:
```js
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

```
- Then we will create an action creator called fetch users like this :
```js
import axios from "axios";

export const FETCH_USERS = 'fetch_users';
export const fetchUsers = () => async dispatch => {
    const res = await axios.get('https://react-ssr-api.herokuapp.com/users');
    dispatch({
        type: FETCH_USERS,
        payload: res
    });

};
```
- Now to use this action creator we will need to create a usersReducer like this:
```js
import {FETCH_USERS} from "../actions";

export default (state = [], action) => {
    switch(action.type) {
        case FETCH_USERS:
            return action.payload.data;
            default:
                return state;
    }
}
```
- Finally once we have the stores defined at both the client and server, and the action creator and reducer defined, we can use it inside a new component called UsersListComponent:
```js
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchUsers} from "../actions";

class UserList extends Component {
    componentDidMount() {
        this.props.fetchUsers();
    }

    renderUsers(){
        return this.props.users.map(user => {
            return <li key={user.id}>{user.name}</li>
        })
    }
    render() {
        return (
            <div>
                Here is a big list of users:
                <ul>{this.renderUsers()}</ul>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        users: state.users,
    };
}

export default connect(mapStateToProps,{fetchUsers})(UserList);
```
- Here we are making use of the connect function of react-redux
- The connect function in react-redux is a powerful utility that connects React components to the Redux store. 
- It provides a way to access state and dispatch actions from within your components, making it easier to manage state and keep your UI in sync with the data.
- How connect Works
  1. Mapping State to Props: The connect function allows you to specify how the Redux state should be transformed into props for your component. This is done using the mapStateToProps function.
  2. Mapping Dispatch to Props: You can also specify how action creators should be transformed into props using the mapDispatchToProps function.
  3. HOC (Higher-Order Component): connect returns a higher-order component (HOC) that wraps your component, providing it with the specified props.
```js
import React from 'react';
import { connect } from 'react-redux';
import { increment, decrement } from './actions';

const Counter = ({ count, increment, decrement }) => (
  <div>
    <p>{count}</p>
    <button onClick={increment}>Increment</button>
    <button onClick={decrement}>Decrement</button>
  </div>
);

const mapStateToProps = (state) => ({
  count: state.counter
});

const mapDispatchToProps = {
  increment,
  decrement
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);

```
- The connect function is a cornerstone of integrating Redux with React. It allows you to:
- Access specific pieces of Redux state as props in your components.
- Dispatch actions from within your components as props.
- Keep your components decoupled from the Redux store, promoting a clear separation of concerns.


### Please note uptil now, all the data from redux store is being fetched from the client side, not from the server side. We still have to do some work to fetch data from the server side
- ![img_37.png](img_37.png)

## Now we need to focus on the second problem: How we are going to detect when all initial data load action creators are completed on the server
- How data loading works on the browser
- ![img_38.png](img_38.png)
- ![img_39.png](img_39.png)
- ![img_40.png](img_40.png)
- On the server side inside renderer.js we render our application using renderToString() function and instantly send our response back to the browser
- There is no time to allow the app to fetch the users data from the API
```js
const content = renderToString(
        <Provider store={store}>
          <StaticRouter location={req.path} context={{}}>
            <Routes />
          </StaticRouter>
        </Provider>
);
return `
<html lang="en">
<head>
<title>React App</title>
</head>
<body>
    <div id="root">${content}</div>
    <script src="bundle.js"></script>
</body>
</html>
`;
```
- So our timeline on server side looks like this 
- ![img_41.png](img_41.png)
- With server side rendering component lifecycle methods like componentDidMount donot even work on the server.
- On the server, traditional data loading techniques donot work.
- One way to solve this problem would be to try to load the application 2 times: 
- ![img_42.png](img_42.png)
- ![img_43.png](img_43.png)
- ![img_44.png](img_44.png)
- ![img_45.png](img_45.png)
- This approach of loading the application 2 times doesn't work very well.

## Alternative solution for server side data loading
- ![img_46.png](img_46.png)
- Even Next.js uses the same approach for its server side rendering.
- We will attach a function to all of our components called loadData().
- This function will initiate the data loading process.
- Once this function is complete, we will render the app with collected data.
- ![img_47.png](img_47.png)

## Trying the above solution step by step

### Figure out what components would have rendered based on URL
- We will make use of a library called React Router Config 
- This library is a sub-package of the overall react router project, so it is an officially maintained solution
- This library is mostly used to help with server side rendering. 
- Good thing about this library is that it helps to figure out which set of components we want to show without rendering the application
- Bad thing is that in order to use it we have to mangle our route definitions
- We need to structure our routes in an array of objects like this:
- ![img_48.png](img_48.png)
- We have to change our Routes.js to this:

```js
export default [
  {
    path: '/',
    component: HomePage,
    exact: true
  },
  {
    path: '/users',
    component: UserList
  }
];
```
- We also need to make changes in renderer.js 
- We will use the function renderRoutes() from react-router-config library
- Since now our routes is an array of object, this function takes an array of route objects and converts them to normal Routes that can be used by React Application
```js
import {renderRoutes} from "react-router-config";
import Routes from "../client/Routes"
import {Provider} from "react-redux";
// import HomePage from "../client/components/HomePage";

export default (req,store) =>{
    const content = renderToString(
        <Provider store={store}>
            <StaticRouter location={req.path} context={{}}>
                <div>{renderRoutes(Routes)}</div>
            </StaticRouter>
        </Provider>
    );
```
- We would have to make same changes in client.js as well.
```js
import {BrowserRouter} from "react-router-dom";
import {createStore,applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import RenderRoutes from "react-router-config/renderRoutes";
import Routes from "./Routes";
import reducers from "./reducers";
import {renderRoutes} from "react-router-config";

const store = createStore(reducers,{},applyMiddleware(thunk));
ReactDOM.hydrate(
    <Provider store={store}>
        <BrowserRouter>
            <div>{renderRoutes(Routes)}</div>
        </BrowserRouter>
    </Provider>
    , document.getElementById("root"));
```
- Now to figure what set of components will need to be rendered based on the requested URL, we will use matchRoutes function of react-router-config 
- Please note this will be done without the application being rendered as of now.
- We will make these changes inside the index.js file of the server, since there we will not only have our list of routes but also the incoming path 
```js
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
    matchRoutes(Routes,req.path);
    res.send(renderer(req,store));
})
```

### Now we can define some functions that will load data based on the list of components that need to be rendered.
- Goal is to load data into our application without actually having to render it.
- Please note we cannot use component lifecycle methods.
- We need to do the following steps:
- ![img_49.png](img_49.png)
- First we will define a loadData function inside of our UserList component like this 
```js
function loadData(){
    console.log('Trying to load some data');

}

```
- Now we will include that load data function in Routes.js like this

```js
export default [
  {
    path: '/',
    component: HomePage,
    exact: true
  },
  {
    loadData: loadData,
    path: '/users',
    component: UserList
  }
];
```
- Next we will call that function from our index.js file on the server
- We know that matchRoutes gives us a list of route objects which will now also have the loadData function
- We will map over it and call the loadData() if it exists 
```js
app.get('*', (req, res) => {
// We are using JSX inside node.js code
// Some logic to initialize and load data into the store.
  const store = createStore();
  //return an array of components which will be rendered.
  matchRoutes(Routes,req.path).map(({route})=>{
    return route.loadData ? route.loadData() : null;
  });
  res.send(renderer(req,store));
})
```

### Now we need to add data fetching requests inside our loadData function and wait for the response somehow
- ![img_50.png](img_50.png)
- ![img_51.png](img_51.png)
- We will pass the redux store to our component's load data function
- Inside the loadData() function inside of component, we will dispatch an action creator and return a promise back.
- In the index.js file for the server, for all the matched routes, we will wait for the promises to resolve before rendering the app
- This will somehow give us a signal as to when data loading is complete and we are ready to render our application 
- Changes to loadData function inside the component:
```js
//Returns a promise
function loadData(store){
  // console.log('Trying to load some data');
  return store.dispatch(fetchUsers());

}

```
- Changes to index.js file on server
````js
 //Returns an array of promises
const promises = matchRoutes(Routes,req.path).map(({route})=>{
  return route.loadData ? route.loadData(store) : null;
});

console.log(promises)
````
### Wait for data loading to complete
- Now we have an array of promises that will be returned 
- We can use Promise.All() which takes in an array of promises and returns a single new promise.
- As soon as the array of promises have resolved, that single promise will be resolved as well.
- ![img_52.png](img_52.png)
- We can change index.js file for the server like this 
```js
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
```
- If we go to the browser and check we can see that list of users is now being rendered from the server side
- ![img_53.png](img_53.png)


- Why did we not use the connect function for handling the action creator?
- The connect function works in a normal application by communicating with the Provider tag which is at the top level of the app
- Provider tag contains a reference to the Redux store, so when we call the mapStatetoProps function or mapDispatchToProps function, we are working with the Provider tag.
- Remember we want to render our application only one time, so no connect tag for us, no props or anything like that with loadData because we have not yet rendered our application.
- So we cannot use connect tag 
-![img_54.png](img_54.png)

- Why are we using store.dispatch()?
- How does redux action creator work?
- When we call an action creator, it dispatches an action, through various middlewares and finally it reaches a reducer.
- ![img_55.png](img_55.png)
- Since we cannot use connect tag, we are working with Redux manually by calling the action creator ourselves to produce an action and then using the dispatch function to pipe that action through various middlewares and eventually onto the reducers.
- All data is loaded and is eventually sent to the reducer where we assemble our state object 
- ![img_56.png](img_56.png)
- ![img_57.png](img_57.png)
- When we call res.send(renderer(req,store)), our store is full of data. 
- It then works like a normal react-redux app. 
- During the render phase, all of our mapStatetoProps() functions will run and pull data out of the store and map it to props inside the component and component UI is rendered.
- Only difference now is that in server side rendering, we are doing action creator and dispatch manually

## Organization with Page Components
- We have more components in our application
- ![img_58.png](img_58.png)
- Only root level components may have loadData() defined in them
- ![img_59.png](img_59.png)
- Each paged component may have loadData() function associated with them.
- We will create a folder called pages, rename Home to HomePage and UserList to UserListPage component and move it inside pages directory.
- Also we will refactor the exports from both the components to be an object with the component itself and the load data function like this 

```js
export default {
  component: Home,
};

export default{
  component: connect(mapStateToProps,{fetchUsers})(UserListPage),
  loadData: loadData,
};

```
- Now we can use spread operator inside the Routes.js file like this:
- This way we dont have to export any loadData function as well, we will just import the HomePage or UserList page and apply spread operator over the incoming object
```js
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
```

- Till now, we have solved 2/4 challenges here:
- ![img_60.png](img_60.png)
- For different configurations on browser vs server, we created separate stores for both of them
- To detect when initial data load action creators are completed, we used loadData() function and Promise.all() function.
- Now we need to think in terms of Client State Rehydration

### Client State Rehydration on the browser
- Now we are seeing this error again: 
- ![img_61.png](img_61.png)
- This is because now the data we are getting from the user contains the list of users.
- When the browser has to rehydrate, it doesnot expect to see any list of users from the server, so ,therefore, it gives that error.
- ![img_62.png](img_62.png)
- At the client side, it thinks that redux store is empty, so it temporarily blanks out the page and then fetches the data again to fill in the redux store.
- We want to somehow preserve the state that we have prefetched from the server and somehow communicate this state down to the browser or client.
- **_const store = Redux.createStore(reducer_name,initial_state)_**
- ![img_63.png](img_63.png)
- We will use the initial state argument inside createStore function to solve our problem
- Solution will be something like this 
- ![img_64.png](img_64.png)
- It looks like putting data inside a hidden field like we do in ASP.NET MVC application to preserve state across controller calls.
- Go to renderer.js and populate window.INITIAL_STATE variable with the state of the store like this 
```js
export default (req,store) =>{
  const content = renderToString(
          <Provider store={store}>
            <StaticRouter location={req.path} context={{}}>
              <div>{renderRoutes(Routes)}</div>
            </StaticRouter>
          </Provider>
  );
  return `
<html lang="en">
<head>
<title>React App</title>
</head>
<body>
    <div id="root">${content}</div>
    <script>
    window.INITIAL_STATE = ${JSON.stringify(store.getState())};
    </script>
    <script src="bundle.js"></script>
</body>
</html>
`;
};
```
- Now go to client.js and populate the initial state of the store with the data dumped in window.INITIAL_STATE like this 
```js
import {Provider} from "react-redux";
import RenderRoutes from "react-router-config/renderRoutes";
import Routes from "./Routes";
import reducers from "./reducers";
import {renderRoutes} from "react-router-config";

const store = createStore(reducers,window.INITIAL_STATE,applyMiddleware(thunk));
ReactDOM.hydrate(
    <Provider store={store}>
        <BrowserRouter>
            <div>{renderRoutes(Routes)}</div>
        </BrowserRouter>
    </Provider>
    , document.getElementById("root"));
```
- Now the error will disappear, and we will see this and loading of page is also fast.
- ![img_65.png](img_65.png)

## Preventing XSS attacks
- The above approach has a security flaw:
- What if the initial data that we fetch from the server side and store it inside window.initial_state has some kind of script tag executing a script inside of it.
- ![img_66.png](img_66.png)
- This is called an XSS attack or cross-site scripting attack.
- By default, React protects us against XSS attacks but only on the content that React specifically renders.
- In the above case, we just dumped the data into our browser, and we are vulnerable to XSS attacks.
- To fix this, we will utilize a function called serialize() from a package called serialize-javascript
- Serialize function takes a string and will escape any characters in there that are involved in setting up script tags.
```js
import React from "react";
import {renderToString} from "react-dom/server";
import {StaticRouter} from "react-router-dom";
import {renderRoutes} from "react-router-config";
import serialize from 'serialize-javascript';
import Routes from "../client/Routes"
import {Provider} from "react-redux";
// import HomePage from "../client/components/HomePage";

export default (req,store) =>{
    const content = renderToString(
        <Provider store={store}>
            <StaticRouter location={req.path} context={{}}>
                <div>{renderRoutes(Routes)}</div>
            </StaticRouter>
        </Provider>
    );
    return `
<html lang="en">
<head>
<title>React App</title>
</head>
<body>
    <div id="root">${content}</div>
    <script>
    window.INITIAL_STATE = ${serialize(store.getState())};
    </script>
    <script src="bundle.js"></script>
</body>
</html>
`;
};
```
- Our result will look like this 
- ![img_67.png](img_67.png)


## Authentication during server side rendering process
- We have now wrapped up 3/4 challenges
- ![img_68.png](img_68.png)
- For different configurations on browser vs server, we created separate stores for both of them
- To detect when initial data load action creators are completed, we used loadData() function and Promise.all() function.
- For client state rehydration, we are passing the state in the redux store generated in server side rendering to an HTML template.
- Then we are fetching the initial state of the store from this HTML template and initializing the client side redux store.
- Now we need to think in terms on authentication on the server side.
- Authentication in webapp can be considered like a contract between a browser and a server. 
- Every request browser makes to the server, it includes an identifying piece of information either inside a cookie or JWT
-![img_69.png](img_69.png)
- ![img_70.png](img_70.png)
- Rendering server needs to fool the API that it is the browser that is making the request
- ![img_71.png](img_71.png)
- OAuth Process with google attaches an identifier to the user's cookie.
- ![img_72.png](img_72.png)
- If there is a cookie set between the browser and say api.ourapp.com, it is not going to send cookie to the rendering server hosted at ourapp.com 
- So renderer server will not be able to fetch data from the API server on behalf of the browser.
- Is there a solution? Yes :)

### Authentication via Proxy
- ![img_73.png](img_73.png)
- ![img_74.png](img_74.png)

### Why JWT doesnt work? or why are we using cookies?
- JWTs and cookies are not exclusive. We can put a JWT inside a cookie also.
- ![img_75.png](img_75.png)
- ![img_76.png](img_76.png)
- With JWT, we cannot send HTML rendered content, instead we need to request for a JWT
- Only thing we can send to a domain are the cookies attached to that domain.
- HTTP-only cookies are recommended because they are not accessible via JavaScript, reducing the risk of XSS (Cross-Site Scripting) attacks.

### Checked on ChatGPT that it is possible to use JWTs with server side rendering but there are some challenges
- Token Secure Storage: On the client side, JWTs are typically stored in local storage or cookies. For SSR, you must ensure tokens are securely stored and accessible during the server-side render process. 
- HTTP-only cookies are recommended because they are not accessible via JavaScript, reducing the risk of XSS (Cross-Site Scripting) attacks.
- Server-Side Verification: When rendering on the server, you need to verify the JWT to ensure the request is authenticated. This involves decoding the token and validating its signature, which requires the server to have access to the secret key or public key (for asymmetric encryption).
- Server-Side Data Fetching: For SSR, the server needs to fetch data based on the authenticated user's information before rendering the HTML. This can introduce additional complexity and latency compared to client-side rendering.
- Hydration Consistency: The server-rendered HTML must match the client-side application once it rehydrates. This includes ensuring that user-specific data fetched and rendered on the server is properly reflected on the client.
- Security Considerations CSRF (Cross-Site Request Forgery): When using cookies to store JWTs, you must implement CSRF protection. This typically involves using a separate CSRF token.
```js
const express = require('express');
const jwt = require('jsonwebtoken');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const App = require('./src/App').default;

const app = express();

app.get('*', (req, res) => {
  const token = req.cookies.jwt; // Read the JWT from cookies
  let userData;

  if (token) {
    try {
      userData = jwt.verify(token, 'your-secret-key'); // Verify the JWT
    } catch (err) {
      return res.status(401).send('Unauthorized');
    }
  }

  const appHtml = ReactDOMServer.renderToString(<App userData={userData} />);
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>SSR with JWT</title>
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script src="/client.bundle.js"></script>
      </body>
    </html>
  `;

  res.send(html);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

```

### Proxy Setup
- For proxy setup we are going to use express-http-proxy package
- An Express HTTP proxy is a middleware for the Express.js framework that allows you to forward HTTP requests from your server to another server and then pass the response back to the original client
- We can set it up as follows in code in our server index.js like this 
```js
import proxy from 'express-http-proxy'
import {matchRoutes} from "react-router-config";

const app = express();

//middleware
app.use('/api', proxy('http://react-ssr-api.herokuapp.com', {
    proxyReqOptDecorator(opts){
        opts.header['x-forwarded-host'] = "localhost:3000";
        return opts;
    }
}));
```

### Next step is that during page load process, the server should communicate directly with API
- ![img_77.png](img_77.png)
- The browser has a cookie, when we run the fetchUsers action creator which simply executes an axios get request to the API, we need to make sure to attach the cookie that came from the browser to that axios get request.
- ![img_78.png](img_78.png)
- We want axios to behave slightly differently depending on whether it is running on the client or the server.
- ![img_79.png](img_79.png)
- We don't want to put this customization into every single action creator. Need to do something generic.
- We will use axios and redux thunk to solve this.
- ![img_80.png](img_80.png)
- We can create a custom instance of axios and set some options.
- We can look at source code of redux thunk:
- ![img_81.png](img_81.png)
- We can use the extraArgument property of redux thunk.
- Using this we can attach an extra 3rd argument to our action creators.
- ![img_82.png](img_82.png)
- Similar to how we have different copies of redux store, we also need 2 separate instances of axios for both server and client.
- We will pass that custom axios instance into redux thunk as an extra 3rd argument.
- Then in action creators we will receive customized axios instance.

### Custom Axios Instance on the Client
- ![img_83.png](img_83.png)
- Custom axios instance will prepend "/api" to any axios request like say axiosInstance.get('/users') will become /api/users 
- Now inside our client.js we will create a custom axiosInstance and pass it as an extra third argument to the thunk like this 
```js
const axiosInstance = axios.create({
  baseURL: '/api',
});
const store = createStore(reducers,window.INITIAL_STATE,applyMiddleware(thunk.withExtraArgument(axiosInstance)));
```
- Now inside our action creators, we will utilize this custom axios instance as follows:
- We will call this custom Axios instance as api. 
```js
export const FETCH_USERS = 'fetch_users';
export const fetchUsers = () => async (dispatch,getState,api) => {
    const res = await api.get('/users');
    dispatch({
        type: FETCH_USERS,
        payload: res
    });

};
```
### Server Axios Instance 
- This is little more complex, since we want the cookie coming from the incoming request, be stripped from that request and attached to the api.
- We will first go to the helpers-> create store file and modify as follows:
- Here we will pass in the request object from the incoming request and use it to extract the cookie and attach it to the custom axios Instance.
- Then we will use that extra argument feature of redux thunk and pass it along to the action creator.
```js
import {createStore,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import reducers from '../client/reducers';

export default (req) =>{

    const axiosInstance = axios.create({
        baseURL: 'http://react-ssr-api.herokuapp.com',
        headers: {cookie: req.get('cookie') || ''}
    })
    const store = createStore(reducers, {}, applyMiddleware(thunk.withExtraArgument(axiosInstance)));
    return store;
}
```
- Changes to be made in server index.js file
```js
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
    });

    Promise.all(promises).then(() => {
        res.send(renderer(req,store));
    })
})
```
- Now if we go and test, everything works as expected.

## Header Component
- We will make a change in our app and introduce an App Component or root component
- ![img_84.png](img_84.png)
- This root component will in turn render all the other component inside of it.
- To implement this, first we need to create an empty App Component and then modify our Routes.js file as follows:
```js
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
      }
    ]
  },

];
```
- As you can see from above, App component nests all the other components as a child within it.
- Now we will introduce some more react-router-config code inside our app component like this 
```js
import React from 'react';
import {renderRoutes} from "react-router-config";

const App = ({route}) => {
  return (
          <div>
            <h1>I am a header</h1>
            {renderRoutes(route.routes)}
          </div>
  )
}

export default {
  component: App
};
```
- Now if we go to Homepage or UserList page, a header is always displayed

## Checking if the user is signed In
- ![img_85.png](img_85.png)
- To check if the user is signedIn, we need to fetch the current authentication status of the user
- This can be done inside an action creator like this 
- Note that this call is from the server side using the proxy.
```js
export const FETCH_CURRENT_USER = 'fetch_current_user';
export const fetchCurrentUser = () => async (dispatch,getState,api) => {
    const res = await api.get('/current_user');
    console.log(res.data);
    dispatch({
        type: FETCH_CURRENT_USER,
        payload: res
    });

};
```
- Now we need to create an authReducer to update the state based on the above action creator 
```js
import {FETCH_CURRENT_USER} from "../actions";

export default (state = null, action) => {
    switch(action.type) {
        case FETCH_CURRENT_USER:
            console.log(action.payload.data);
            return action.payload.data || false;
        default:
            return state;
    }
}
```
- Now inside the App Component we need to call this action creator
```js
import React from 'react';
import {renderRoutes} from "react-router-config";
import Header from "./components/Header";
import {fetchCurrentUser} from "./actions";

const App = ({route}) => {
  return (
          <div>
            <Header />
            {renderRoutes(route.routes)}
          </div>
  )
}

export default {
  component: App,
  loadData: ({dispatch})=> {
    console.log(dispatch)

    return dispatch(fetchCurrentUser())
  }
};
```
- Now based on auth state whether it contains data or whether it is false, we can display Login and Logout buttons in the Header component like this 
```js
import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
const Header =  ({auth})=>{
    console.log("Auth status is",auth);
    const authButton = auth ? (
        <a href="/api/logout">Logout</a>
    ): (
        <a href="/api/auth/google">Login</a>
    )
    return (
        <nav>
        <div className="nav-wrapper">
        <Link to="/" className="brand-logo">React SSR</Link>
            <ul className="right">
               <li> <Link to="/users">Users</Link></li>
                <li><Link to="/admins">Admins</Link></li>
                <li>{authButton}</li>
            </ul>
        </div>
        </nav>
    )
}
function mapStateToProps ({auth}) {
    return {auth: auth};
}

export default connect(mapStateToProps)(Header);
```

## Error Handling

### Handling unrecognized routes (404 not found page)
- ![img_86.png](img_86.png)
- Create a NotFoundPage:
```js
import React from 'react';

const NotFoundPage = () => {
    return <h1>Page Not Found</h1>;
}

export default {
    component: NotFoundPage
};

```
- Modify the Routes.js file to include the NotFoundPage for any unrecognized path like this
```js
import React from 'react';
import HomePage from './pages/HomePage';
// import User, {loadData} from './components/UsersList';
// import UsersList from "./components/UsersList";
import UserListPage from "./pages/UsersListPage";
import App from "./App";
import NotFoundPage from "./pages/NotFoundPage";

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
                ...NotFoundPage
            }
        ]
    },

];


```
- If user navigates to a page that doesn't exist, we want to make sure that we want to mark that response with a 404 status code, which will inform the browser that the page was not found.
- First we need to understand how we can mark a response as 404 in Express:
- ![img_87.png](img_87.png)
- ![img_88.png](img_88.png)
- StaticRouter has a context object. 
- We will pass the context object, then like in Routes.js if the page is not found, we will display the NotFoundPage.
- From the server index.js we will create a context object then pass it to the static router, which will pass it to the specific NotFoundPage.
- Inside the NotFound page, we will set the NotFound Property inside the context object to true.
- Then back inside server index.js we will inspect that NotFound property and accordingly we will set the response as 404
```js
app.use(express.static('public'));
app.get('*', (req, res) => {
// We are using JSX inside node.js code
// Some logic to initialize and load data into the store.
  const store = createStore(req);
  //return an array of components which will be rendered.

  //Returns an array of promises
  const promises = matchRoutes(Routes,req.path).map(({route})=>{
    return route.loadData ? route.loadData(store) : null;
  });

  Promise.all(promises).then(() => {
    const context = {};
    const content = renderer(req,store,context);
    if(context.notFound)
    {
      res.status(404);
    }
    res.send(content);
  })
})
```
- Changes inside renderer.js 
```js
export default (req,store,context) =>{
  const content = renderToString(
          <Provider store={store}>
            <StaticRouter location={req.path} context={context}>
              <div>{renderRoutes(Routes)}</div>
            </StaticRouter>
          </Provider>
  );
```
- Changes inside NotFoundPage component 
```js
import React from 'react';

const NotFoundPage = ({staticContext = {}}) => {
    staticContext.notFound = true;
    return <h1>Page Not Found</h1>;
}

export default {
    component: NotFoundPage
};
```
- Please note in browser router in case of client side rendering the staticContext object will be null so as to not generate any errors we will set its default to empty object.

## Creating the Admin Page
- ![img_89.png](img_89.png)
```js
//Adding the action creator
export const FETCH_ADMINS = 'fetch_admins';
export const fetchAdmins = () => async (dispatch,getState,api) => {
  const res = await api.get('/admins');
  dispatch({
    type: FETCH_ADMINS,
    payload: res
  });

};

//Adding the Reducer
import {FETCH_ADMINS} from "../actions";

export default (state = [], action) => {
  switch(action.type) {
    case FETCH_ADMINS:
      return action.payload.data;
    default:
      return state;
  }
}

//Adding the UI AdminsListPage
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchAdmins} from "../actions";

class AdminsListPage extends Component {
  componentDidMount() {
    this.props.fetchAdmins();
  }

  renderAdmins(){
    return this.props.admins.map(admin => {
      return <li key={admin.id}>{admin.name}</li>
    })
  }
  render() {
    return (
            <div>
              <h3>Here is a protected list of admins:</h3>
              <ul>{this.renderAdmins()}</ul>
            </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    admins: state.admins,
  };
}

//Returns a promise
function loadData(store){
  // console.log('Trying to load some data');
  return store.dispatch(fetchAdmins());

}

export default{
  component: connect(mapStateToProps,{fetchAdmins})(AdminsListPage),
  loadData: loadData,
};


```
- If the user is authenticated, list of admins is displayed.
- If the user is not authenticated then we get a 401 unauthorized error at the server during server side rendering
- Also, we see unresolved promises
- **However, why is the server is hanging?**
- At the initial page load, we collect all the loadData() functions inside our routes.
- Then we call all those loadData() functions and wait for the promises to be resolved here:
```js
//Returns an array of promises
const promises = matchRoutes(Routes,req.path).map(({route})=>{
  return route.loadData ? route.loadData(store) : null;
});

Promise.all(promises).then(() => {
  const context = {};
  const content = renderer(req,store,context);
  if(context.notFound)
  {
    res.status(404);
  }
  res.send(content);
})
})
```
- However, even if one promise doesn't resolve, it causes everything to fail.
- We are not using a catch statement chained to the promises.
- Unhandled promise rejection means we are not catching errors in the promises.
- We have 2 ways of fixing this a bad way and a good way:
- **Bad way: Chain a catch statement**: This is a poor approach, the user can fix this. We gave up, and we didn't give an option to user to try again like 'Please login to access this page'
```js
Promise.all(promises).then(() => {
  const context = {};
  const content = renderer(req,store,context);
  if(context.notFound)
  {
    res.status(404);
  }
  res.send(content);
}).catch(()=>{
  res.send('Something went wrong');
})
})
```
- **Another way: still not the best approach**
- We put the display logic in a separate function.
- Then in the promises catch function, we still try to render like this
```js
const render = () => {
  const context = {};
  const content = renderer(req,store,context);
  if(context.notFound)
  {
    res.status(404);
  }
  res.send(content);
}

Promise.all(promises).then(render).catch(render);
```
- We still see our header but the list of admin users is missing
- ![img_90.png](img_90.png)
- ![img_91.png](img_91.png)
- In Promise.all(), whenever it encounters the first promise that has failed, it immediately calls the catch function without even calling other promises in the list
- So in this approach, we are rendering the app, even if other promises have not yet resolved.
- Even though we are showing some content here, it is not the best approach. We are attempting to render the application too soon, even if other promises have not yet resolved.


- **Best approach: Wait for all promises to be resolved or rejected before rendering the application**
- We are going to take all the promises from loadData() function and wrap them inside a new promise
- We will try to circumvent the short circuit behavior of promise.all()
- We know that the matchRoutes function gives us an array of promises
- We are going to map over the array of promises and then put each promise inside a new promise which will always resolve even if the inner promise is resolved or rejected
```js
const promises = matchRoutes(Routes,req.path).map(({route})=>{
  return route.loadData ? route.loadData(store) : null;
}).map(promise => {
  if(promise){
    return new Promise((resolve,reject)=>{
      promise.then(resolve).catch(resolve);
    })
  }
})
```
- This way when Promise.all() function runs, we have made sure all of our promises are either resolved or rejected.
- This will ensure all the loadData() functions of all our components have run.
- Now we need to figure out a way to communicate an error message to the user:
- If the user is not authenticated, we should redirect the user to a different route.
- ![img_92.png](img_92.png)
- We should introduce a new RequireAuth component.
- It will check the auth state and redirect the user to a different page.
- ![img_93.png](img_93.png)

## RequireAuth Component
- Require Auth component will be a higher order component
- A Higher-Order Component (HOC) is an advanced technique in React for reusing component logic. 
- HOCs are functions that take a component and return a new component with enhanced behavior or additional props. 
- They are a pattern derived from React’s compositional nature.
- Reusability: HOCs allow you to reuse logic across multiple components without repeating code.
- Abstraction: They help abstract complex logic and keep your components focused on their primary responsibility.
```js
import React from 'react';

// A simple HOC that adds additional props to a component
const withExtraProps = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      return <WrappedComponent extraProp="This is an extra prop" {...this.props} />;
    }
  };
};

export default withExtraProps;

//Usage
import React from 'react';
import withExtraProps from './withExtraProps';

const MyComponent = (props) => {
  return (
          <div>
            <p>{props.extraProp}</p>
            <p>{props.someProp}</p>
          </div>
  );
};

const EnhancedComponent = withExtraProps(MyComponent);

export default EnhancedComponent;


```
- Don’t Mutate the Original Component: Always create a new component.
- Wrap the Display Name: Enhance the display name for easier debugging.
- Avoid Overuse: Use HOCs judiciously to avoid overly complex hierarchies.
- ![img_94.png](img_94.png)
- HOCs are common around authentication and authorization.
- We will create a new requireAuthComponent which will take in a child component, and we will check if the user is authenticated or not and then either redirect the user or display the component like this
- Note that we have to attach the auth State from redux store to check if the user is authenticated.
- Also note, that any props passed to HOC requireAuth are also passed to the child component
```js
import React,{Component} from "react";
import {connect} from 'react-redux';
import {Redirect} from "react-router-dom";

export default (ChildComponent) => {
    class RequireAuth extends Component {
        render() {
           switch (this.props.auth) {
               case false:
                   return <Redirect to="/" />;
               case null:
                   return <div>Loading...</div>
               default:
                   return <ChildComponent {...this.props}/>
           }
        }
    }

    function mapStateToProps({auth}) {
        return {auth: auth};
    }
    return connect(mapStateToProps)(RequireAuth);
}
```
- We will call this HOC requireAuth inside the AdminsListPage like this 
```js
export default{
  component: connect(mapStateToProps,{fetchAdmins})(requireAuth(AdminsListPage)),
  loadData: loadData,
};
```
- Now if the user is not authenticated or auth State = false, the user is not getting redirected to the homepage.
- To fix this ,we need to inspect and log the context object
- ![img_95.png](img_95.png)
- We need to understand that we are using a static router.
- When we do a redirect, nothing changes on the browser, only the context object has changed.
- So we need to handle redirects as per the context object like this 
```js
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
```
- Now redirects will work fine. If the user is not logged in, he is redirected to the homepage.

## Implementing Better SEO support
- ![img_96.png](img_96.png)
- Here we can see that when we post a link on Twitter or facebook or linkedin, it automatically pulls up an image, title and description of the page.
- This is because this page was pre-rendered using server side rendering.
- ![img_97.png](img_97.png)
- ![img_98.png](img_98.png)
- We can setup meta tags inside our pages to provide more information about the page.
- We can use Open Graph Protocol.
- We can use open graph meta tags.
- Using it can dramatically improve SEO of our application.
- ![img_99.png](img_99.png)
- Search engines use bots that scrape our pages.
- We need to insert correct meta tags.
- To set these tags we will use a library called react-helmet.
- ![img_100.png](img_100.png)
- ![img_101.png](img_101.png)
- ![img_102.png](img_102.png)
- ![img_103.png](img_103.png)
- The Open Graph protocol enables any web page to become a rich object in a social graph. 
- For instance, this is used on Facebook to allow any web page to have the same functionality as any other object on Facebook.
- To turn your web pages into graph objects, you need to add basic metadata to your page. We've based the initial version of the protocol on RDFa which means that you'll place additional <meta> tags in the <head> of your web page. 
- The four required properties for every page are:
- og:title - The title of your object as it should appear within the graph, e.g., "The Rock".
- og:type - The type of your object, e.g., "video.movie". Depending on the type you specify, other properties may also be required.
- og:image - An image URL which should represent your object within the graph.
- og:url - The canonical URL of your object that will be used as its permanent ID in the graph, e.g., "https://www.imdb.com/title/tt0117500/".
- For example, we can use it like this:
```html
<html prefix="og: https://ogp.me/ns#">
<head>
  <title>The Rock (1996)</title>
  <meta property="og:title" content="The Rock" />
  <meta property="og:type" content="video.movie" />
  <meta property="og:url" content="https://www.imdb.com/title/tt0117500/" />
  <meta property="og:image" content="https://ia.media-imdb.com/images/rock.jpg" />
  ...
</head>
...
</html>
```
- Inside the UsersListPage, we will make use of React Helmet Library to set our meta tags like this 
```js
 render() {
  return (
          <div>
            <Helmet>
              <title>Users App</title>
              <meta property="og:title" content="Users App"/>
            </Helmet>
            Here is a big list of users:
            <ul>{this.renderUsers()}</ul>
          </div>
  )
}
```
- Now inside our renderer.js we will pull out these meta tags and put them inside our HTML template manually like this
```js
const helmet = Helmet.renderStatic();
    return `
<html lang="en">
<head>
${helmet.title.toString()}
${helmet.meta.toString()}
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
</head>
```
- This will then generate the meta tags and send it along to the browser along with all the server generated HTML
- ![img_105.png](img_105.png)

## Dynamic Title Tags based on Redux State
- We can do this like this 
- Notice the head() function which has title that is loaded dynamically based on redux state.
```js
class UserListPage extends Component {
  componentDidMount() {
    this.props.fetchUsers();
  }

  renderUsers(){
    return this.props.users.map(user => {
      return <li key={user.id}>{user.name}</li>
    })
  }

  head() {
    const headerTitle = `${this.props.users.length} users loaded`;
    return (
            <Helmet>
              <title>{headerTitle}</title>
              <meta property="og:title" content="Users App"/>
            </Helmet>
    )
  }
  render() {
    return (
            <div>
              {this.head()}
              Here is a big list of users:
              <ul>{this.renderUsers()}</ul>
            </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    users: state.users,
  };
}

//Returns a promise
function loadData(store){
  // console.log('Trying to load some data');
  return store.dispatch(fetchUsers());

}


export default{
  component: connect(mapStateToProps,{fetchUsers})(UserListPage),
  loadData: loadData,
};
```

## RenderToString() vs RenderToNodeStream()
- All the SSR that we have seen really hinged on the React DOM library.
- We have a renderer.js file which has a renderToString() function which loads our HTML template.
- renderToNodeStream is deprecated, we use renderToPipeableStream() function now.
- Call renderToPipeableStream to render your React tree as HTML into a Node.js Stream
- Use it like this 
```js
import { renderToPipeableStream } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```
- Along with the root component, you need to provide a list of bootstrap <script> paths. Your root component should return the entire document including the root <html> tag.
- For example, it might look like this:
```js
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```
- React will inject the doctype and your bootstrap <script> tags into the resulting HTML stream:
```html
<!DOCTYPE html>
<html>
  <!-- ... HTML from your components ... -->
</html>
<script src="/main.js" async=""></script>
```
- On the client, your bootstrap script should hydrate the entire document with a call to hydrateRoot:
```js
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```
- This will attach event listeners to the server-generated HTML and make it interactive.
- renderToNodeStream() is similar to renderToString() function that we used. 
- renderToString() returns a string which contains HTML whereas renderToNodeStream returns a readable stream that outputs an HTML string.
- The HTML output by this stram is exactly equal to what REACTDOMServer.renderToString() would return.
- The stream returned from this method will return a byte stream encoded in UTF-8. 

### What is a readable stream?
- How renderToString() works ?
- ![img_106.png](img_106.png)
- How renderToNodeStream works?
- ![img_107.png](img_107.png)
- renderToNodeStream is a method in the react-dom/server package that allows you to perform server-side rendering (SSR) of React components and stream the resulting HTML directly to the client. 
- This is particularly useful for improving the performance of SSR by allowing the server to start sending chunks of HTML to the client as soon as they are available, rather than waiting for the entire component tree to render.
- Faster Initial Load Time (Time to First Byte (TTFB)): Streaming HTML allows for faster initial load times, as the client can begin processing and rendering HTML before the entire component tree is fully rendered.
- Resource Efficiency: Reduces memory usage on the server because it streams HTML in chunks rather than generating the entire HTML content in memory first.
- Improved User Experience: Enhances perceived performance by providing immediate feedback to users, especially for complex pages.
- renderToNodeStream returns a readable stream of HTML that can be piped directly to the HTTP response.
```js
// src/App.js
import React from 'react';

const App = () => (
  <div>
    <h1>Hello, world!</h1>
  </div>
);

export default App;

// server.js
const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const App = require('./src/App').default;

const app = express();

app.get('*', (req, res) => {
  res.write('<!DOCTYPE html><html><head><title>SSR with Streaming</title></head><body><div id="root">');

  const stream = ReactDOMServer.renderToNodeStream(<App />);

  stream.pipe(res, { end: false });

  stream.on('end', () => {
    res.write('</div><script src="/bundle.js"></script></body></html>');
    res.end();
  });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});




```
- Initial HTML: The server starts by sending the initial parts of the HTML document.
- Streaming React Component: renderToNodeStream generates a stream of HTML for the React component, which is piped to the response.
- Final HTML: Once the streaming is complete, the server sends the closing tags and any necessary scripts.

### Big issue with renderToNodeStream
- When we start sending a stream of response using renderToNodeStream, at some point if we realize that the user is trying to access a protected route or some data is invalid, we cannot change the status code of the response.
- At that point of time, we are fully committed to sending the stream of data to the user albeit in chunks, but we are committed.
- This represents a big issue in using renderToNodeStream function.
- There are ways to deal with this but they all involve appending some HTML or running some Javascript code on the user's browser. Either of these approaches dont work well if the user doesnot use javascript.


### Using renderToNodeStream can significantly improve the performance of server-side rendering by streaming HTML content to the client in chunks, allowing for faster initial page loads and a better user experience.
- **_renderToPipeableStream_** is a more advanced method that provides a better API for working with both Node.jsstreams and the Web Streams API. It offers improved streaming capabilities, including support for Suspense on the server and finer control over streaming behavior.

- Going back to an application and adding server side rendering later on is really tough. Do it from the initial step.
- 