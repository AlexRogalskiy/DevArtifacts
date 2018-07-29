/* eslint no-console: ["error", { allow: ["warn", "error", "info"] }] */
/* eslint-disable import/no-extraneous-dependencies */

/**
 * External dependencies
 */
import compression from 'compression';
import express from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import { match, RouterContext } from 'react-router';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

/**
 * Internal dependencies
 */
import config from '../config';
import routes from '../lib/routes';
import webpackConfig from '../webpack.config.babel';

/**
 * Local variables
 */
const PATHS = {
  public: path.join(__dirname, '../public'),
};

const app = express();

const compiler = webpack(webpackConfig);

/**
 * Enable webpack in development
 */
if (config.env === 'development') {
  app.use(webpackDevMiddleware(compiler, {
    hot: true,
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }));

  app.use(webpackHotMiddleware(compiler));
}

/**
 * Enable compression in production
 */
if (config.env === 'production') {
  app.use(compression());
}

/**
 * Serve static files
 */
app.use(express.static(PATHS.public));

/**
 * Request handler
 */
app.use((req, res) => {
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      const renderedBody = renderToString(<RouterContext {...renderProps} />);

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
              <link href="/bundle.css?v=${config.version}" rel="stylesheet" type="text/css">
            </head>
            <body>
              <div id="app">${renderedBody}</div>
              <script src="/bundle.js?v=${config.version}"></script>
            </body>
        </html>
      `;

      res.status(200).send(html);
    } else {
      res.status(404).send('Not found');
    }
  });
});

/**
 * Start app on {port}
 */
app.listen(config.port, (err) => {
  if (err) {
    console.error(err);
  }

  console.info('Listening on port %s. Open up http://localhost:%s/ in your browser.', config.port, config.port);
});
