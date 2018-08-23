"use strict";

import React        from 'react';
import { History }  from 'react-router';
import update       from 'react-addons-update';
import Reflux       from 'reflux';
import Quill        from 'quill';
import Moment       from 'moment';
import Config       from 'appRoot/appConfig';
import Actions      from 'appRoot/actions';
import BasicInput   from 'appRoot/components/basicInput';
import Loader       from 'appRoot/components/loader';
import Session      from 'appRoot/stores/sessionContext';
import {formMixins} from 'appRoot/mixins/utility';

export default React.createClass({
	mixins: [
		Reflux.connect(Session, 'session'),
		History,
		formMixins
	],
	getInitialState: function () {
		return { loading: true, validity: {}, post: {} };
	},
	constraints: {
		title: {
			required: true,
			minlength: 5
		}
	},
	componentWillMount: function () {
		this.editMode   = this.props.params.hasOwnProperty('postId');
		this.createMode = !this.editMode;
		this.postId     = this.editMode ? this.props.params.postId : null;

		this.setState({ loading: this.editMode ? true : false });

		if (this.editMode) {
			Actions.getPost(this.postId)
				.then(function (post) {
					setTimeout(function () {
						//console.log("POST", post);
						this.setState({ post: post, loading: false });
						this.initQuill(post.body);
					}.bind(this), 2000);
				}.bind(this))
				['catch'](function (err) {
					this.setState({ error: err, loading: false });
				}.bind(this));
		}
	},
	componentDidMount: function () {
		var newPostTmpl = '<div>Hello World!</div><div><b>This</b> is my story...</div><div><br/></div>';
		!this.editMode && this.initQuill(newPostTmpl);
	},
	initQuill: function (html) {
		if (!this.quill) {
			this.quill = new Quill(this.refs.editor, { 
				theme: 'snow', 
				modules: {
					'link-tooltip': true,
					'image-tooltip': true,
					'toolbar': {
						container: this.refs.toolbar
					}
				}
			}); 
		}
		this.quill.setHTML(html);
	},
	submit: function (e) {
		var postBody = this.quill.getHTML().replace(/data-reactid="[^"]+"/g, '')
		,   fullText = this.quill.getText()
		,   summary  = fullText.slice(0, Config.postSummaryLength)
		,   errors   = this.validateField('title');
		;

		e.preventDefault();
		if(errors.length > 0) { 
			this.setState(update(this.state, { validity: { title: { $set: errors[0].msg } } }));
			this.getInputEle('title').focus();
		} else {
			Actions.modifyPost({
				title: this.getInputEle('title').value,
				body: postBody,
				user: this.state.session.id,
				date: Moment().valueOf(), // unix UTC milliseconds
				summary: summary
			}, this.postId)
			.then(function (result) {
				// go to newly created entry
				this.history.pushState('', `/posts/${result.body.id}`);
			}.bind(this))
			;
		}
	},
	titleChange: function (e) {
		this.setState(update(this.state, { 
			post: { 
				title: { $set: e.target.value }
			}
		}));
	},
	// form parts of component is always the same so render won't diff
	render: function () {
		return (
			<form 
				className="post-edit" 
				onSubmit={this.submit} 
			>
				{ this.state.loading ? <Loader /> : [] }
				<fieldset
					style={{ display: this.state.loading || this.state.error ? 'none' : 'block'}}
				>
					<BasicInput 
						type="text" 
						ref="title" 
						name="title" 
						value={this.state.post.title}
						error={this.state.validity.title}
						onChange={this.titleChange}
						placeholder="post title"  
					/>
					<hr/>
					<br/>
					<div className="rich-editor">
						<div ref="toolbar">
							<span className="ql-format-group">
								<select title="Font" className="ql-font" defaultValue="">
									<option value="sans-serif" >Sans Serif</option>
									<option value="serif">Serif</option>
									<option value="monospace">Monospace</option>
								</select>
								<select className="ql-size">
									<option value="10px">Small</option>
									<option value="13px">Normal</option>
									<option value="18px">Large</option>
									<option value="32px">Huge</option>
								</select>  
							</span>
							<span className="ql-format-group">
								<span className="ql-bold ql-format-button"></span>
								<span className="ql-format-separator"></span>
								<span className="ql-italic ql-format-button"></span>
								<span className="ql-format-separator"></span>
								<span className="ql-underline ql-format-button"></span>
								<span className="ql-format-separator"></span>
							</span>
							<span className="ql-format-group">
								<select title="Text Color" className="ql-color">
									<option value="rgb(0, 0, 0)" label="rgb(0, 0, 0)"></option>
									<option value="rgb(230, 0, 0)" label="rgb(230, 0, 0)"></option>
									<option value="rgb(255, 153, 0)" label="rgb(255, 153, 0)"></option>
									<option value="rgb(255, 255, 0)" label="rgb(255, 255, 0)"></option>
									<option value="rgb(0, 138, 0)" label="rgb(0, 138, 0)"></option>
									<option value="rgb(0, 102, 204)" label="rgb(0, 102, 204)"></option>
									<option value="rgb(153, 51, 255)" label="rgb(153, 51, 255)"></option>
									<option value="rgb(255, 255, 255)" label="rgb(255, 255, 255)"></option>
									<option value="rgb(250, 204, 204)" label="rgb(250, 204, 204)"></option>
									<option value="rgb(255, 235, 204)" label="rgb(255, 235, 204)"></option>
									<option value="rgb(255, 255, 204)" label="rgb(255, 255, 204)"></option>
									<option value="rgb(204, 232, 204)" label="rgb(204, 232, 204)"></option>
									<option value="rgb(204, 224, 245)" label="rgb(204, 224, 245)"></option>
									<option value="rgb(235, 214, 255)" label="rgb(235, 214, 255)"></option>
									<option value="rgb(187, 187, 187)" label="rgb(187, 187, 187)"></option>
									<option value="rgb(240, 102, 102)" label="rgb(240, 102, 102)"></option>
									<option value="rgb(255, 194, 102)" label="rgb(255, 194, 102)"></option>
									<option value="rgb(255, 255, 102)" label="rgb(255, 255, 102)"></option>
									<option value="rgb(102, 185, 102)" label="rgb(102, 185, 102)"></option>
									<option value="rgb(102, 163, 224)" label="rgb(102, 163, 224)"></option>
									<option value="rgb(194, 133, 255)" label="rgb(194, 133, 255)"></option>
									<option value="rgb(136, 136, 136)" label="rgb(136, 136, 136)"></option>
									<option value="rgb(161, 0, 0)" label="rgb(161, 0, 0)"></option>
									<option value="rgb(178, 107, 0)" label="rgb(178, 107, 0)"></option>
									<option value="rgb(178, 178, 0)" label="rgb(178, 178, 0)"></option>
									<option value="rgb(0, 97, 0)" label="rgb(0, 97, 0)"></option>
									<option value="rgb(0, 71, 178)" label="rgb(0, 71, 178)"></option>
									<option value="rgb(107, 36, 178)" label="rgb(107, 36, 178)"></option>
									<option value="rgb(68, 68, 68)" label="rgb(68, 68, 68)"></option>
									<option value="rgb(92, 0, 0)" label="rgb(92, 0, 0)"></option>
									<option value="rgb(102, 61, 0)" label="rgb(102, 61, 0)"></option>
									<option value="rgb(102, 102, 0)" label="rgb(102, 102, 0)"></option>
									<option value="rgb(0, 55, 0)" label="rgb(0, 55, 0)"></option>
									<option value="rgb(0, 41, 102)" label="rgb(0, 41, 102)"></option>
									<option value="rgb(61, 20, 102)" label="rgb(61, 20, 102)"></option>
								</select>
								<select title="Background Color" className="ql-background">
									<option value="rgb(0, 0, 0)" label="rgb(0, 0, 0)"></option>
									<option value="rgb(230, 0, 0)" label="rgb(230, 0, 0)"></option>
									<option value="rgb(255, 153, 0)" label="rgb(255, 153, 0)"></option>
									<option value="rgb(255, 255, 0)" label="rgb(255, 255, 0)"></option>
									<option value="rgb(0, 138, 0)" label="rgb(0, 138, 0)"></option>
									<option value="rgb(0, 102, 204)" label="rgb(0, 102, 204)"></option>
									<option value="rgb(153, 51, 255)" label="rgb(153, 51, 255)"></option>
									<option value="rgb(255, 255, 255)" label="rgb(255, 255, 255)"></option>
									<option value="rgb(250, 204, 204)" label="rgb(250, 204, 204)"></option>
									<option value="rgb(255, 235, 204)" label="rgb(255, 235, 204)"></option>
									<option value="rgb(255, 255, 204)" label="rgb(255, 255, 204)"></option>
									<option value="rgb(204, 232, 204)" label="rgb(204, 232, 204)"></option>
									<option value="rgb(204, 224, 245)" label="rgb(204, 224, 245)"></option>
									<option value="rgb(235, 214, 255)" label="rgb(235, 214, 255)"></option>
									<option value="rgb(187, 187, 187)" label="rgb(187, 187, 187)"></option>
									<option value="rgb(240, 102, 102)" label="rgb(240, 102, 102)"></option>
									<option value="rgb(255, 194, 102)" label="rgb(255, 194, 102)"></option>
									<option value="rgb(255, 255, 102)" label="rgb(255, 255, 102)"></option>
									<option value="rgb(102, 185, 102)" label="rgb(102, 185, 102)"></option>
									<option value="rgb(102, 163, 224)" label="rgb(102, 163, 224)"></option>
									<option value="rgb(194, 133, 255)" label="rgb(194, 133, 255)"></option>
									<option value="rgb(136, 136, 136)" label="rgb(136, 136, 136)"></option>
									<option value="rgb(161, 0, 0)" label="rgb(161, 0, 0)"></option>
									<option value="rgb(178, 107, 0)" label="rgb(178, 107, 0)"></option>
									<option value="rgb(178, 178, 0)" label="rgb(178, 178, 0)"></option>
									<option value="rgb(0, 97, 0)" label="rgb(0, 97, 0)"></option>
									<option value="rgb(0, 71, 178)" label="rgb(0, 71, 178)"></option>
									<option value="rgb(107, 36, 178)" label="rgb(107, 36, 178)"></option>
									<option value="rgb(68, 68, 68)" label="rgb(68, 68, 68)"></option>
									<option value="rgb(92, 0, 0)" label="rgb(92, 0, 0)"></option>
									<option value="rgb(102, 61, 0)" label="rgb(102, 61, 0)"></option>
									<option value="rgb(102, 102, 0)" label="rgb(102, 102, 0)"></option>
									<option value="rgb(0, 55, 0)" label="rgb(0, 55, 0)"></option>
									<option value="rgb(0, 41, 102)" label="rgb(0, 41, 102)"></option>
									<option value="rgb(61, 20, 102)" label="rgb(61, 20, 102)"></option>
								</select>
							</span>
							<span className="ql-format-group">
								<span title="List" className="ql-format-button ql-list"></span>
								<span className="ql-format-separator"></span>
								<span title="Bullet" className="ql-format-button ql-bullet"></span>
								<span className="ql-format-separator"></span>
								<select title="Text Alignment" className="ql-align">
									<option value="left" label="Left"></option>
									<option value="center" label="Center"></option>
									<option value="right" label="Right"></option>
									<option value="justify" label="Justify"></option>
								</select>
							</span>
							<span className="ql-format-group">
								<span className="ql-link ql-format-button"></span>
								<span className="ql-format-separator"></span>
								<span className="ql-image ql-format-button"></span>
							</span>
						</div>
						<div ref="editor">

						</div>
					</div>
					<button type="submit">{this.editMode ? 'Edit Post' : 'Create Post'}</button>
				</fieldset>
			</form>
		);
	}
});
 
