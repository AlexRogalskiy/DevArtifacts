import React from 'react';

class Button extends React.Component {
    render() {
        return (
            <div onClick={this.props.onPress} className="button">{ this.props.label }</div>
        )
    }
}

export default Button;