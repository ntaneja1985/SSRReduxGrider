import React from "react";
import {renderToString} from "react-dom/server";
import {StaticRouter} from "react-router-dom";
import {renderRoutes} from "react-router-config";
import serialize from 'serialize-javascript';
import Routes from "../client/Routes"
import {Provider} from "react-redux";
import {Helmet} from "react-helmet";
// import HomePage from "../client/components/HomePage";

export default (req,store,context) =>{
    const content = renderToString(
        <Provider store={store}>
            <StaticRouter location={req.path} context={context}>
                <div>{renderRoutes(Routes)}</div>
            </StaticRouter>
        </Provider>
    );


const helmet = Helmet.renderStatic();
    return `
<html lang="en">
<head>
${helmet.title.toString()}
${helmet.meta.toString()}
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
<!--<title>React App</title>-->
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