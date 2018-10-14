import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { pick } from 'lodash-es';

import cx from 'classnames';
import { withStyles } from 'material-ui/styles';

import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import { CircularProgress } from 'material-ui/Progress';
import Markdown from 'react-markdown';
import breaks from 'remark-breaks';
import autosizeHandler from 'autosize';

import EyeIcon from 'muicons/Eye';
import ClearIcon from 'muicons/Close';

import { propTypes } from './propTypes';

@withStyles(theme => ({
    markdownContainer: {
        padding: 16,
    },
    markdown: {
        '& *': {
            marginBottom: 10,
        },
        '& h1': {
            fontSize: '1.4rem',
            lineHeight: '1.4rem',
            fontWeight: 500,
        },
        '& h2': {
            fontSize: '1.3rem',
            lineHeight: '1.3rem',
            fontWeight: 'bold',
        },
        '& p': {
            fontSize: '1rem',
            lineHeight: '1.2rem',
        },
        '& ul': {
            listStyleType: 'disc',
            listStylePosition: 'inside',
        },
        '& ol': {
            listStyleType: 'decimal',
            listStylePosition: 'inside',
        },
    },
}))
export default class Text extends React.Component {
    static propTypes = {
        ...propTypes,
        type: PropTypes.string,
    };

    static defaultProps = {
        type: 'text',
    };

    state = {
        showPreviewDialog: false,
    };

    componentDidMount = () => {
        const { multiline, autosize } = this.props;

        if(multiline && autosize) {
            const element = ReactDOM.findDOMNode(this); //eslint-disable-line
            const textArea = element.querySelector('textarea');
            this.autosizeTimeout = window.setTimeout(() => autosizeHandler(element), 200);
        }
    };

    componentWillUnmount = () => {
        window.clearTimeout(this.autosizeTimeout);
    };

    clear = () => {
        const { onChange } = this.props;
        onChange(null);
    };

    showPreviewDialog = showPreviewDialog => () => {
        this.setState({ showPreviewDialog });
    };

    render = () => {
        const { classes } = this.props;
        const { name, value, onFocus, onChange, onBlur } = this.props;
        const { label = name, required, readOnly, disabled, placeholder, helper, computing, clearable, errorRender } = this.props;
        const { type, markdown, multiline, rows, rowsMax, autosize } = this.props;
        const { controlProps, labelProps, helperProps } = this.props;
        const { showPreviewDialog } = this.state;

        const inputProps = pick(this.props, ['id', 'name', 'autoComplete', 'noValidate', 'required', 'pattern', 'minLength', 'maxLength', 'step', 'min', 'max' ]);

        const errors = errorRender(this.props);

        const computingAdornment = () => (
            <InputAdornment position={'end'} style={{ height: '24px', width: '24px', top: '6px' }}>
                <CircularProgress />
            </InputAdornment>
        );

        const markdownAdornment = () => (
            <InputAdornment position={'end'}>
                <IconButton onClick={this.showPreviewDialog(true)} disabled={!value || !value.length} style={{ height: '24px', width: '24px', top: '6px' }}>
                    <EyeIcon />
                </IconButton>
            </InputAdornment>
        );

        const clearAdornment = () => (
            <InputAdornment position={'end'}>
                <IconButton onClick={this.clear} style={{ height: '24px', width: '24px', top: '6px' }}>
                    <ClearIcon />
                </IconButton>
            </InputAdornment>
        );

        const endAdornment = ((computing, clearable) => {
            if(computing)
                return computingAdornment();
            else if(markdown)
                return markdownAdornment();
            else if(clearable)
                return clearAdornment();
            else
                return null;
        })(computing, clearable);

        return (
            <FormControl fullWidth={true} required={!!required} error={!!errors} {...controlProps}>
                { label &&
                <InputLabel htmlFor={name} {...labelProps}>{label}</InputLabel>
                }
                <Input
                    type={type}
                    name={name}
                    value={value || ''}
                    onFocus={onFocus}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled || readOnly}
                    placeholder={placeholder}
                    endAdornment={endAdornment}
                    fullWidth={true}
                    multiline={multiline}
                    rows={rows}
                    rowsMax={rowsMax}
                    inputProps={inputProps}
                />
                { !errors && helper &&
                <FormHelperText {...helperProps}>{helper}</FormHelperText>
                }
                { errors &&
                <FormHelperText {...helperProps}>{errors}</FormHelperText>
                }
                { markdown &&
                <Dialog open={showPreviewDialog} fullWidth={true} onClose={this.showPreviewDialog(false)} onEscapeKeyUp={this.showPreviewDialog(false)} onBackdropClick={this.showPreviewDialog(false)}>
                    <Paper className={classes.markdownContainer}>
                        <Markdown className={classes.markdown} source={value || ''} plugins={[breaks]} />
                    </Paper>
                </Dialog>
                }
            </FormControl>
        );
    };
}