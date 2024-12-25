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