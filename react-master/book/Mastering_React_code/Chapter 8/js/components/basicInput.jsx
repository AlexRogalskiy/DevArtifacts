"use strict";

import React      from 'react';
import update     from 'react-addons-update';
import ClassNames from 'classnames';

let Types = React.PropTypes;

export default React.createClass({
	// this is how you enforce property types in React
	propTypes: {
		helpText:  Types.string,
		error:     Types.string
	},
	render: function () {
		return (
			<div className={ClassNames({'basic-input': true, 'error': this.props.error})} {...this.props} >
				<input 
					className={this.props.error ? 'error' : ''} 
					{...update(this.props, {children: {$set: null}})} />
				{this.props.children}
				<aside>{this.props.helptext || this.props.error || ' '}</aside>
			</div>  
		);
	}
});

