var React = require('react');
var Button = require('./button');
var List = require('./list');

var Dropdown = React.createClass({
  handleClick: function () {
    console.log('dropdown');
  },

  render: function () {
    var visible;

    // if (this.state.dropdownOpen) {
    //   visible = 'visible';
    // } else {
    //   visible = 'hidden';
    // }

    return <div className="dropdown">
      <Button
        whenClicked={this.handleClick}
        className="btn btn-default"
        title={this.props.title}
        subTitleClassName="caret" />
      <List items={this.props.items} />

    </div>
  }
});

module.exports = Dropdown;