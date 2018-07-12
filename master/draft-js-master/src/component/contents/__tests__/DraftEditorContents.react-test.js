/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails oncall+ui_infra
 * @format
 */

'use strict';

jest.disableAutomock();

jest.mock('generateRandomKey');

const Editor = require('DraftEditor.react');
const EditorState = require('EditorState');
const RichUtils = require('RichTextEditorUtil');

const React = require('react');
const ReactTestRenderer = require('react-test-renderer');

test('defaults to "unstyled" block type for unknown block types', () => {
  const CUSTOM_BLOCK_TYPE = 'CUSTOM_BLOCK_TYPE';

  function CustomText(props) {
    // contrived example
    return (
      <p>
        <b>{props.children}</b>
      </p>
    );
  }

  class Container extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        editorState: EditorState.createEmpty(),
      };
    }
    toggleCustomBlock = () => {
      this.setState(
        {
          editorState: RichUtils.toggleBlockType(
            this.state.editorState,
            CUSTOM_BLOCK_TYPE,
          ),
        },
        () => {
          setTimeout(() => this.focus(), 0);
        },
      );
    };
    blockRenderFn(block) {
      if (block.getType() === CUSTOM_BLOCK_TYPE) {
        return {
          component: CustomText,
          editable: true,
        };
      }
      return null;
    }
    render() {
      return (
        <div className="container-root">
          <div>
            <button onClick={this.toggleCustomBlock}>CenterAlign</button>
          </div>
          <Editor
            placeholder="Type away :)"
            editorState={this.state.editorState}
            blockRendererFn={this.blockRenderFn}
            onChange={this._handleChange}
          />
        </div>
      );
    }
    _handleChange = editorState => {
      this.setState({editorState});
    };
  }

  const block = ReactTestRenderer.create(<Container />);
  const editorInstace = block.getInstance();

  expect(() => {
    editorInstace.toggleCustomBlock(
      editorInstace.state.editorState,
      CUSTOM_BLOCK_TYPE,
    );
  }).not.toThrow();
});
