import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash-es';
import { connect } from 'react-redux';

import ImageTools from '../utils/ImageTools';
import triggerUpload from 'trigger-upload';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';

import AddIcon from 'muicons/Plus';
import RemoveIcon from 'muicons/Close';

export default class Gallery extends React.Component {
    static propTypes = {
        multiple: PropTypes.bool,
        accept: PropTypes.array,
        minWidth: PropTypes.number,
        minHeight: PropTypes.number,
        maxSize: PropTypes.number,
        resolutions: PropTypes.array,
        shape: PropTypes.oneOf(['round', 'square']),
        upload: PropTypes.func.isRequired,
        medias: PropTypes.array,
        onAdd: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
    };

    static defaultProps = {
        accept: ['image/*'],
        maxSize: 0,
        multiple: false,
        shape: 'square',
    };

    state = {
        medias: [],
    };

    componentWillMount = () => {
        const { upload, medias } = this.props;
        upload(this.upload);

        this.setState({ medias })
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

        for(const file of processedFiles)
            await this.add(file);
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

    add = async media => {
        const { medias } = this.state;
        const { onAdd } = this.props;

        const processedMedia = await onAdd(media);

        const newMedias = medias.concat(processedMedia);
        this.setState({ medias: newMedias });
    };

    remove = media => async () => {
        const { medias } = this.state;
        const { onRemove } = this.props;

        const processedMedia = await onRemove(media);

        const newMedias = medias.filter(m => media !== m);
        this.setState({ medias: newMedias });
    };

    render = () => {
        const { medias } = this.state;

        return (
            <Grid container={true} wrap={'wrap'}>
                { map(medias, (media, index) => (
                <Grid key={index} item={true} xs={12} sm={4} md={4} lg={3} xl={3}>
                    <Paper style={{ textAlign: 'center' }}>
                        <img style={{ width: '100%', height: 'auto' }} src={media.content} />
                        <IconButton onClick={this.remove(media)}>
                            <RemoveIcon />
                        </IconButton>
                    </Paper>
                </Grid>
                )) }
            </Grid>
        );
    };
}