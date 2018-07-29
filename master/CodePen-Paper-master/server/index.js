/**
 * External dependencies
 */
import express from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { createStore } from 'redux';
import serialize from 'serialize-javascript';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

/**
 * Internal dependencies
 */
import {
  __DEVELOPMENT__,
  __PORT__,
  __PRODUCTION__,
  __VERSION__,
} from '../config';
import Application from '../lib/containers/Application';
import reducers from '../lib/reducers';
import webpackConfig from '../webpack.config.babel';

/**
 * Local variables
 */
const __PATHS__ = {
  public: path.join(__dirname, '../public'),
};


/**
 * Application
 */
const app = express();

/**
 * Express middleware
 */
app.use('/public', express.static(__PATHS__.public));

/**
 * Webpack middleware
 */
if (__DEVELOPMENT__) {
  const compiler = webpack(webpackConfig);

  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    serverSideRender: true,
  }));

  app.use(webpackHotMiddleware(compiler));
}

/**
 * Application request handler
 */
app.use((req, res) => {
  const context = {};

  const store = createStore(reducers);

  const preloadedState = store.getState();

  const renderedBody = renderToString(
    <Provider store={store}>
      <StaticRouter
        location={{ pathname: req.url }}
        context={context}
      >
        <Application />
      </StaticRouter>
    </Provider>,
  );

  const head = Helmet.rewind();

  const html = `
    <!doctype html>
    <html>
        <head>
          <meta charset="utf-8" />
          ${head.htmlAttributes}
          ${head.title}
          ${head.base}
          ${head.meta}
          ${head.link}
          ${head.script}
          <link href="/public/css/normalize.css?v=7.0.0" rel="stylesheet" type="text/css" />
          ${__PRODUCTION__ ? `<link href="/public/bundle.css?v=${__VERSION__}" rel="stylesheet" type="text/css" />` : ''}
        </head>
        <body>
          <div id="root">${renderedBody}</div>
          <script>
            window.__PRELOADED_STATE__ = ${serialize(preloadedState)};
          </script>
          <script src="/public/bundle.js?v=${__VERSION__}"></script>
        </body>
    </html>
  `;

  if (context.url) {
    res.writeHead(301, {
      Location: context.url,
    });
    res.end();
  } else {
    res.write(html);
    res.end();
  }
});

/**
 * Application listener
 */
app.listen(__PORT__, (err) => {
  if (err) {
    console.error(err);
  }
  if (__PRODUCTION__) {
    console.info('Listening on port %s. Open up https://localhost:%s/ in your browser.', __PORT__, __PORT__);
  } else {
    console.info('Listening on port %s. Open up http://localhost:%s/ in your browser.', __PORT__, __PORT__);
  }
});
