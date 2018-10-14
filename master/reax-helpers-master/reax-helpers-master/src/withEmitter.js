import React from 'react';
import PropTypes from 'prop-types';

export default () => {
    return WrappedComponent => {
        return class withEmitter extends React.Component {
            static contextTypes = {
                emitter: PropTypes.object.isRequired,
            };

            render = () => {
                const { emitter } = this.context;
                const { props } = this;

                if(props.emitter !== undefined)
                    console.warn('@withEmitter detected a collision on \'emitter\' prop');

                return <WrappedComponent {...this.props} emitter={emitter} />;
            };
        }
    };
}