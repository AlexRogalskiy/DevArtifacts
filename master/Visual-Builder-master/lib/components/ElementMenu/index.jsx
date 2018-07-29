/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

/**
 * Internal dependencies
 */
import './style.scss';
import Button from '../Button';
import ButtonGroup from '../ButtonGroup';
import Menu from '../Menu';

/**
 * <ElementMenu />
 */
class ElementMenu extends Component {
  constructor() {
    super();

    this._renderBackButton = this._renderBackButton.bind(this);
  }

  _getMenuItems() {
    return [
      [
        {
          title: 'Layouts',
          items: [
            {
              action: () => console.log('Section'),
              name: 'Section',
            },
            {
              action: () => console.log('Row'),
              name: 'Row',
            },
            {
              action: () => console.log('Column'),
              name: 'Column',
            },
            {
              action: () => console.log('Header'),
              name: 'Header',
            },
            {
              action: () => console.log('Footer'),
              name: 'Footer',
            },
          ],
        },
        {
          title: 'Modules',
          items: [
            {
              action: () => console.log('Block'),
              name: 'Block',
              to: 1,
            },
            {
              action: () => console.log('Form'),
              name: 'Form',
              to: 2,
            },
            {
              action: () => console.log('Text'),
              name: 'Text',
              to: 3,
            },
          ],
        },
      ],
      [
        {
          title: 'Block',
          items: [
            {
              action: () => console.log('Block'),
              name: 'Block',
            },
            {
              action: () => console.log('Inline Block'),
              name: 'Inline Block',
            },
            {
              action: () => console.log('Image'),
              name: 'Image',
            },
            {
              action: () => console.log('Nav'),
              name: 'Nav',
            },
            {
              action: () => console.log('Footer'),
              name: 'Footer',
            },
            {
              action: () => console.log('Header'),
              name: 'Header',
            },
            {
              action: () => console.log('Main'),
              name: 'Main',
            },
            {
              action: () => console.log('Aside'),
              name: 'Aside',
            },
          ],
        },
      ],
      [
        {
          title: 'Form',
          items: [
            {
              action: () => console.log('Form'),
              name: 'Form',
            },
            {
              action: () => console.log('Input'),
              name: 'Input',
            },
            {
              action: () => console.log('Textarea'),
              name: 'Textarea',
            },
            {
              action: () => console.log('Button'),
              name: 'Button',
            },
            {
              action: () => console.log('Checkbox'),
              name: 'Checkbox',
            },
            {
              action: () => console.log('Radio'),
              name: 'Radio',
            },
            {
              action: () => console.log('Select'),
              name: 'Select',
            },
            {
              action: () => console.log('Datalist'),
              name: 'Datalist',
            },
          ],
        },
      ],
      [
        {
          title: 'Text',
          items: [
            {
              action: () => console.log('Paragraph'),
              name: 'Paragraph',
            },
            {
              action: () => console.log('Heading'),
              name: 'Heading',
            },
            {
              action: () => console.log('Sub Heading'),
              name: 'Sub Heading',
            },
            {
              action: () => console.log('Date'),
              name: 'Date',
            },
            {
              action: () => console.log('Quote'),
              name: 'Quote',
            },
          ],
        },
      ],
    ];
  }

  _renderBackButton() {
    if (this.props.view <= 0) {
      return false;
    }

    return <Button onClick={() => this.props.changeMenu(0)}>Go Back</Button>;
  }

  render() {
    const classes = classNames({
      'element-menu': true,
      'element-menu--active': this.props.status,
    }, this.props.className);

    return (
      <div className={classes}>
        <ButtonGroup>
          {this._renderBackButton()}
          <Button
            elevate
            onClick={() => this.props.toggleMenu(!this.props.status)}
            primary
            style={{
              width: 40,
              padding: 0,
            }}
          >
            <div
              className="ion ion-plus"
              style={{
                transform: `rotate(${this.props.status ? 45 : 0}deg)`,
                transformOrigin: 'center',
              }}
            />
          </Button>
        </ButtonGroup>
        <Menu
          changeMenu={this.props.changeMenu}
          items={this._getMenuItems()}
          status={this.props.status}
          view={this.props.view}
        />
      </div>
    );
  }
}

ElementMenu.defaultProps = {
  changeMenu: noop,
  className: '',
  status: false,
  toggleMenu: noop,
  view: 0,
};

ElementMenu.propTypes = {
  changeMenu: PropTypes.func.isRequired,
  className: PropTypes.string,
  status: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  view: PropTypes.number.isRequired,
};

export default ElementMenu;
