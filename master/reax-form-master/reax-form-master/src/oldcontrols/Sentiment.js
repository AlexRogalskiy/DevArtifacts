import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { cloneDeep, map, without, uniq, difference } from 'lodash-es';
import cx from 'classnames';
import keyCode from 'keycode';
import { withStyles } from 'material-ui/styles';

import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import Menu, { MenuList, MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import { CircularProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import MoreIcon from 'muicons/NavigationArrowDropDown';
import ClearIcon from 'muicons/ContentClear';
import rightActionStyles from './rightActionStyles';
import rightLoaderStyles from './rightLoaderStyles';

import HappyIcon from 'muicons/EmoticonHappy';
import NeutralIcon from 'muicons/EmoticonNeutral';
import SadIcon from 'muicons/EmoticonSad';

import propTypes from './propTypes';

@withStyles(theme => ({
    sentimentIconsContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        textAlign: 'center',
    },
    sentimentColor: {
        color: 'rgba(0, 0, 0, 0.54)',
    },
    sentimentSelectedColor: {
        color: '#3f51b5',
    },
    sentimentIcon: {
        zoom: '150%',
    },
}))
export default class Sentiment extends React.Component {
    static propTypes = {
        ...propTypes,
        classes: PropTypes.object.isRequired,
        name: PropTypes.string.isRequired,
        displayName: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string,
    };

    render () {
        const { onChange, value } = this.props;
        const { classes, name, displayName } = this.props;

        return (
            <Grid container={true} spacing={8} justify={'center'} align={'center'} wrap={'wrap'}>
                <Grid item={true} xs={12}>
                    <Typography className={classes.sentimentColor} type={'subheading'} align={'center'}>{displayName || name}</Typography>
                </Grid>
                <Grid item={true} xs={12} className={classes.sentimentIconsContainer}>
                    <Grid item={true} onClick={() => onChange('negative')}>
                        <IconButton className={cx(value !== 'negative' ? classes.sentimentColor : classes.sentimentSelectedColor)}>
                            <SadIcon className={classes.sentimentIcon} />
                        </IconButton>
                        <Typography className={cx(value !== 'negative' ? classes.sentimentColor : classes.sentimentSelectedColor)} type={'body1'} align={'center'}>nope</Typography>
                    </Grid>

                    <Grid item={true} onClick={() => onChange('neutral')}>
                        <IconButton className={cx(value !== 'neutral' ? classes.sentimentColor : classes.sentimentSelectedColor)}>
                            <NeutralIcon className={classes.sentimentIcon} />
                        </IconButton>
                        <Typography className={cx(value !== 'neutral' ? classes.sentimentColor : classes.sentimentSelectedColor)} type={'body1'} align={'center'}>bah</Typography>
                    </Grid>

                    <Grid item={true} onClick={() => onChange('positive')}>
                        <IconButton className={cx(value !== 'positive' ? classes.sentimentColor : classes.sentimentSelectedColor)}>
                            <HappyIcon className={classes.sentimentIcon} />
                        </IconButton>
                        <Typography className={cx(value !== 'positive' ? classes.sentimentColor : classes.sentimentSelectedColor)} type={'body1'} align={'center'}>yeah!</Typography>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}