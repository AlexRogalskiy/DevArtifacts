var React = require('react');

var Badge = React.createClass({
  // handleClick: function () {
  //   console.log('clicked');
  // },

  render: function () {
    return <button onClick={this.props.whenClicked}
      className={this.props.className} type="button">
      {this.props.title}
      <span className={this.props.subTitleClassName}> {this.props.subTitle}</span>
    </button>
  }
});

module.exports = Badge;