import commonjs from 'rollup-plugin-commonjs';
import npm from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import * as packageJson from './package.json';

const info = `/*
 * ${packageJson.library}
 * Version ${packageJson.version}
 * ${packageJson.homepage}
 */
`;

export default {
  input: 'src/index.js',
  external: [
    'react',
    'react-proptypes'
  ],
  output: {
    name: 'ReactSidebarJS',
    file: 'dist/react-sidebarjs.js',
    format: 'cjs',
    exports: 'named',
    banner: info,
    globals: {
      'react': 'React',
      'react-proptypes': 'PropTypes',
    }
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    npm(),
    commonjs({
      namedExports: {
        'node_modules/sidebarjs/index.js': ['SidebarService', 'SidebarElement'],
      }
    }),
  ],
};