import { jss } from 'react-jss';
import reset from 'jss-reset';
import createMuiTheme from 'material-ui/styles/createMuiTheme';

import roboto400 from 'typeface-roboto/files/roboto-latin-400.woff';
import roboto700 from 'typeface-roboto/files/roboto-latin-700.woff';

jss.createStyleSheet(reset).attach();

jss.createStyleSheet({
    '@global html, body': {
        fontFamily: 'Roboto, Verdana',
    },
    '@font-face': [{
        fontFamily: 'Roboto',
        fontWeight: 'normal',
        fontStyle: 'normal',
        src: `url(${roboto400}) format('woff')`,
    },{
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        fontStyle: 'normal',
        src: `url(${roboto700}) format('woff')`,
    }],
}).attach();

const overrides = {
    MuiGrid: {
        'spacing-xs-8': {
            width: '100%',
            margin: 0,
            padding: '4px',
        },
        'spacing-xs-16': {
            width: '100%',
            margin: 0,
            padding: '8px',
        },
        'spacing-xs-24': {
            width: '100%',
            margin: 0,
            padding: '12px',
        },
        'spacing-xs-40': {
            width: '100%',
            margin: 0,
            padding: '20px',
        },
    }
};

export const colors = {};

const customVariables = {
    colors,
};

const theme = createMuiTheme({ overrides, ...customVariables });

export default theme;
