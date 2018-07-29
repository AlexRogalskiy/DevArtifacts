/**
 * External dependencies
 */
import path from 'path';
import hook from 'css-modules-require-hook';
import sass from 'node-sass';

hook({
  extensions: ['.scss'],
  preprocessCss(css, filepath) {
    const result = sass.renderSync({
      data: css,
      includePaths: [path.resolve(filepath, '..')],
    });

    return result.css;
  },
});
