import React from 'react';
import PropTypes from 'prop-types';
import { get, isEqual } from 'lodash-es';
import differ from 'deep-diff';

export default (paths, debug) => {
    if(!Array.isArray(paths))
        paths = [paths];

    return WrappedComponent => {
        return class EnhancedComponent extends React.Component {
            static propTypes = {
                dispatch: PropTypes.func,
            }

            shouldComponentUpdate (props) {
                const { dispatch } = this.props;
                const previousProps = this.props;
                const nextProps = props;

                for(let path of paths) {
                    const previousValue = get(previousProps, path);
                    const nextValue = get(nextProps, path);
                    const fireUpdate = !isEqual(previousValue, nextValue);
                    const diffs = previousValue !== undefined && nextValue !== undefined ? differ(previousValue, nextValue) : undefined;

                    if(fireUpdate) {
                        if(debug)
                            console.warn('@update.shouldComponentUpdate', path, diffs);
                        return true;
                    }
                }

                return false;
            }

            render () {
                return <WrappedComponent {...this.props} />;
            }
        }
    }
}