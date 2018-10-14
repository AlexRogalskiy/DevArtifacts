import React from 'react';
import PropTypes from 'prop-types';

import MuiMenu, { MenuItem as MuiMenuItem } from 'material-ui/Menu';

export default class Menu extends React.PureComponent {
    static propTypes = {
        children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired,
        anchorId: PropTypes.string.isRequired,
    }

    state = {
        anchor: null,
        open: false,
    };

    componentDidUpdate () {
        const { anchorId } = this.props;
        const { anchor } = this.state;

        if(anchor)
            return;

        const newAnchor = document.getElementById(anchorId);
        newAnchor.addEventListener('click', this.open, false);
        this.setState({ anchor: newAnchor });
    }

    componentWillUnmount () {
        const { anchor } = this.state;
        if(anchor)
            anchor.removeEventListener('click', this.open);
    }

    open = () => {
        this.setState({ open: true })
    }

    close = () => {
        this.setState({ open: false });
    }

    render () {
        const { children } = this.props;
        const { anchor, open } = this.state;

        return (
            <MuiMenu anchorEl={anchor} open={open} onClose={this.close}>
                { React.Children.map(children, (child, index) => (
                <MuiMenuItem key={index} onClick={this.close}>
                    {child}
                </MuiMenuItem>
                )) }
            </MuiMenu>
        );
    }
}