import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, map, without, uniq, difference } from 'lodash-es';
import cx from 'classnames';
import keyCode from 'keycode';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import Avatar from 'material-ui/Avatar';

import ImageTools from '../utils/ImageTools';
import triggerUpload from 'trigger-upload';

import PersonIcon from 'muicons/SocialPerson';

import propTypes from './propTypes';

const errors = validations => map(validations, (value, key) => !value ? key : null).filter(value => value).join(',');

@withStyles(theme => ({
    pointer: {
        cursor: 'pointer',
    },
}))
export default class Image extends React.Component {
    static propTypes = {
        ...propTypes,
        accept: PropTypes.array,
        minWidth: PropTypes.number,
        minHeight: PropTypes.number,
        maxSize: PropTypes.number,
        multiple: PropTypes.bool,
        resolutions: PropTypes.array,
        shape: PropTypes.oneOf(['round', 'square']),
    };

    static defaultProps = {
        accept: ['image/*'],
        maxSize: 0,
        multiple: false,
        shape: 'square',
    };

    upload = async () => {
        const { onChange, resolutions, multiple, accept, minWidth, minHeight, noMetadata } = this.props;

        let files = await triggerUpload({ multiple, accept });

        if(!multiple)
            files = [files];

        const processedFiles = [];

        for(const file of files) {
            if(minWidth || minHeight) {
                const minDimensionsAreOK = await this.checkMinDimensions(file, minWidth, minHeight);
                if(!minDimensionsAreOK) {
                    console.warn(`Min dimensions check failed ${minWidth}x${minHeight}`, file);
                    continue;
                }
            }

            if(!resolutions) {
                const base64 = await this.fileToBase64(file);
                const processedFile = {
                    name: file.name,
                    type: 'image/jpg',
                    size: parseInt((base64.length * 4 / 3) + (base64.length / 96) + 6),
                    content: base64,
                };
                processedFiles.push(processedFile);
            }
            else {
                for(const { width, height } of resolutions) {
                    try {
                        const processedBlob = await this.resize(file, width, height);
                        const base64 = await this.fileToBase64(processedBlob);
                        const processedFile = {
                            name: file.name,
                            type: 'image/jpg',
                            size: parseInt((base64.length * 4 / 3) + (base64.length / 96) + 6),
                            content: base64,
                        };
                        processedFiles.push(processedFile);
                    }
                    catch(error) {
                        console.warn(`Resize ${width}x${height} failed`, file, error);
                    }
                }
            }
        }

        console.log(processedFiles);
        if(processedFiles.length)
            onChange(processedFiles);
    };

    checkMinDimensions = async (file, minWidth, minHeight) => {
        try {
            const dimensions = await this.getDimensions(file);
            return (!minWidth || dimensions.width >= minWidth) && (!minHeight || dimensions.height >= minHeight);
        }
        catch(error) {
            return false;
        }
    };

    getDimensions = file => {
        return new Promise((resolve, reject) => {
            const image = new window.Image();
            image.onload = event => {
                const { width, height } = event.target;
                window.URL.revokeObjectURL(image.src);
                resolve({ width, height });
            };
            image.onerror = error => reject(error);
            image.src = window.URL.createObjectURL(file);
        });
    };

    fileToBase64 = file => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = error => reject(error);
        });
    };

    resize = (file, width, height) => {
        return new Promise((resolve, reject) => {
            ImageTools.resize(file, { width, height }, (blob, didItResize) => {
                return didItResize ? resolve(blob) : reject(didItResize);
            });
        });
    };

    render = () => {
        const { classes, elementRef, onChange, onBlur, name, value, values, disabled, valid, validations, pristine, blurred, required, readOnly, pattern, minLength, maxLength, placeholder, description } = this.props;
        const { className, displayName, clearAction, errorRender, disableLabel, disableUnderline, shape } = this.props;

        const src = value ? (Array.isArray(value) ? value[0].content : value.content) : null;

        const errors = errorRender(this.props);

        return (
            <Grid container={true} spacing={0} align={'center'} justify={'center'} className={classes.pointer}>
                <Avatar src={src} onClick={this.upload} className={cx({ [classes.square]: shape !== 'round' })}>
                    { !value && <PersonIcon />}
                </Avatar>
                { !errors && description &&
                <FormHelperText>{description}</FormHelperText>
                }
                { errors &&
                <FormHelperText>{errors}</FormHelperText>
                }
            </Grid>
        );
    }
}