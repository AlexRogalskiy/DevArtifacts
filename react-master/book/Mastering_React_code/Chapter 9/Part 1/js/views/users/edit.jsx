"use strict";

import React        from 'react';
import { History }  from 'react-router';
import Reflux       from 'reflux';
import update       from 'react-addons-update';
import BasicInput   from 'appRoot/components/basicInput';
import Actions      from 'appRoot/actions';
import UserStore    from 'appRoot/stores/users';
import {formMixins} from 'appRoot/mixins/utility';

export default React.createClass({
	mixins: [
		Reflux.connect(UserStore, 'users'),
		History,
		formMixins
	],
	getInitialState: function () {
		return { validity: {} };
	},
	componentWillMount: function () {
		this.setPlaceholderImage();
	}, 
	constraints: {
		'username': {
			required: true,
			minlength: 3
		},
		'password': {
			required: true,
			minlength: 5
		},
		'blogName': {
			required: true,
			minlength: 5
		}
	},
	createUser: function (e) {
		var detail = {}
		,   validationState = {}
		,   hasErrors = false
		;

		e.preventDefault();

		// node list isn't necessarily an array but can be iterable
		Array.prototype.forEach.call(
			this.refs.form.querySelectorAll('input'),
			function (v) {
				let fieldName = v.getAttribute('name')
				,   errors
				;

				detail[fieldName] = v.value;

				errors = fieldName === 'username' ? 
					this.validateField(fieldName, update(this.constraints.username, { 
						exclusive: { $set: this.state.users.map(function (v) { return v.username; }) }
					})) :
					this.validateField(fieldName);

				!hasErrors && errors.length && v.focus(); // first encountered error
				hasErrors = hasErrors || errors.length;
				validationState[fieldName] = { $set: errors.length ? errors[0].msg : null };
			}.bind(this));


		if (this.state.profileImageData) {
			detail.profileImageData = this.state.profileImageData;
		}

		this.setState(update(this.state, { validity: validationState }));
		if (!hasErrors) {
			Actions.createUser(detail)
				.then(function (result) {
					// go to newly created entry
					this.history.pushState('', `/users/${result.id}`);
				}.bind(this))
			; 
		}
	},
	imageLoadedHandler: function (e) {
		var imageSize = atob(decodeURI(e.target.result).replace(/^.*base64,/,'')).length;

		this.setState({sizeExceeded: imageSize > 1024*1000});
		if (this.state.sizeExceeded /* || bad image */) {
			this.setPlaceholderImage();
		} else {
			this.setState({profileImageData: e.target.result});
		}
	},
	userImageUpload: function (e) {
		var file = e.target.files[0]
		,   reader = new FileReader()
		;

		reader.onload = this.imageLoadedHandler;
		reader.readAsDataURL(file);
	},
	setPlaceholderImage: function (e) {
		var fileVal = this.getInputEle('profileImage');
		fileVal = fileVal ? fileVal.value : '';
		
		if (!typeof fileVal === 'string' || /^\s*$/.test(fileVal)) {
			this.setState({
				'profileImageData': 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogPCEtLSBDcmVhdGVkIHdpdGggTWV0aG9kIERyYXcgLSBodHRwOi8vZ2l0aHViLmNvbS9kdW9waXhlbC9NZXRob2QtRHJhdy8gLS0+CiA8Zz4KICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+CiAgPHJlY3QgZmlsbD0iIzAwZmZmZiIgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiBoZWlnaHQ9IjgyIiB3aWR0aD0iODIiIHk9Ii0xIiB4PSItMSIvPgogIDxnIGRpc3BsYXk9Im5vbmUiIG92ZXJmbG93PSJ2aXNpYmxlIiB5PSIwIiB4PSIwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIiBpZD0iY2FudmFzR3JpZCI+CiAgIDxyZWN0IGZpbGw9InVybCgjZ3JpZHBhdHRlcm4pIiBzdHJva2Utd2lkdGg9IjAiIHk9IjAiIHg9IjAiIGhlaWdodD0iMTAwJSIgd2lkdGg9IjEwMCUiLz4KICA8L2c+CiA8L2c+CiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPGVsbGlwc2Ugcnk9IjE1IiByeD0iMTUiIGlkPSJzdmdfMSIgY3k9IjMyLjUiIGN4PSI0MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IiMwMDAiIGZpbGw9IiNmZmYiLz4KICA8ZWxsaXBzZSBzdHJva2U9IiMwMDAiIHJ5PSI2MS41IiByeD0iMzguNDk5OTk4IiBpZD0ic3ZnXzIiIGN5PSIxMTIiIGN4PSIzOS41IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IiNmZmYiLz4KIDwvZz4KPC9zdmc+'
			});
		}
	},
	chooseFile: function () {
		this.getInputEle('profileImage').click();
	},
	render: function () {

		// noValidate disables native validation 
		// to avoid react collisions with native state
		return (
			<form ref="form" 
				className="user-edit" 
				name="useredit" 
				onSubmit={function (e) { e.preventDefault(); }} 
				noValidate>
			<fieldset>
				<legend>become an author</legend>

				<BasicInput 
					type="text"
					name="blogName" 
					placeholder="blog name" 
					error={this.state.validity.blogName}
					autoFocus />
				<hr/>
				<BasicInput 
					type="text" 
					name="username" 
					placeholder="username" 
					minLength="3"
					error={this.state.validity.username}
					/> 
				<BasicInput 
					type="password" 
					name="password" 
					minLength="6" 
					placeholder="password" 
					error={this.state.validity.password}
					required /> 
				<br/>

				<div className="profile-image-container">
					<label>profile image</label>
					<img className="profile-img" src={this.state.profileImageData}/>
					<BasicInput name="profileImage" type="file" ref="profileImage" onChange={this.userImageUpload} helptext={this.state.sizeExceeded ? 'less than 1MB' : ''}>
						<button onClick={this.chooseFile}>choose file</button>
					</BasicInput>
				</div>

				<BasicInput type="text"  name="firstName" placeholder="first name" />
				<BasicInput type="text"  name="lastName"  placeholder="last name" />
				<BasicInput type="email" name="email"     placeholder="email" />
   			
				<button type="submit" onClick={this.createUser}>I'm ready to write</button>
			</fieldset>
			</form>
		); 
	} 
});

