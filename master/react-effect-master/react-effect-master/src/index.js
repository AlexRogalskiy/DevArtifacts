import React from 'react';
import PropTypes from 'prop-types';
import { get, isEqual } from 'lodash-es';
import differ from 'deep-diff';

export default (effects, debug) => {
    if(!Array.isArray(effects))
        effects = [effects];

    const fireEffect = ({ instance, dispatch, previousProps, nextProps, effect: { path, when, then }}) => {
        if(!Array.isArray(path)) {
            const previousValue = get(previousProps, path);
            const nextValue = get(nextProps, path);
            const fireEffect = when ? when(previousValue, nextValue) : !isEqual(previousValue, nextValue);
            const diffs = previousValue !== undefined && nextValue !== undefined ? differ(previousValue, nextValue) : undefined;

            if(fireEffect) {
                if(debug)
                    console.warn('@effect.componentWillReceiveProps', path, diffs);
                then.call(instance, dispatch, previousValue, nextValue, previousProps, nextProps);
            }
        }
        else {
            const paths = path;

            let doNotFireEffect = true;
            for(let path of paths) {
                const previousValue = get(previousProps, path);
                const nextValue = get(nextProps, path);
                doNotFireEffect = doNotFireEffect && isEqual(previousValue, nextValue);
            }

            let whenResult = when ? when(previousProps, nextProps) : true;

            if(!doNotFireEffect && whenResult) {
                if(debug)
                    console.warn('@effect.componentWillReceiveProps', path);
                then.call(instance, dispatch, previousProps, nextProps);
            }
        }
    };

    return WrappedComponent => {
        return class EnhancedComponent extends React.Component {
            static propTypes = {
                dispatch: PropTypes.func,
            }

            componentWillReceiveProps (props) {
                const { dispatch } = this.props;
                const previousProps = this.props;
                const nextProps = props;

                for(let effect of effects.filter(effect => !effect.afterUpdate))
                    fireEffect({ instance: this.instance, dispatch, previousProps, nextProps, effect });
            }

            componentDidUpdate (props) {
                const { dispatch } = this.props;
                const previousProps = this.props;
                const nextProps = props;

                for(let effect of effects.filter(effect => effect.afterUpdate))
                    fireEffect({ instance: this.instance, dispatch, previousProps, nextProps, effect });
            }

            render () {
                return <WrappedComponent {...this.props} ref={instance => this.instance = instance} />;
            }
        }
    }
}