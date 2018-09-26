import React from 'react';

class Flashline extends React.Component {
    render() {
        return (
            <div className="flashline">{ this.props.message }</div>
        )
    }
}

export default Flashline;