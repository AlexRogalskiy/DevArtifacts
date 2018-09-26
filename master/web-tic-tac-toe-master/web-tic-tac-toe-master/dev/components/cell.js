import React from 'react';

class Cell extends React.Component {
    render() {
        return (
            <div onClick={this.props.onPress} className="cell">{ this.props.state }</div>
        )
    }
}

export default Cell;