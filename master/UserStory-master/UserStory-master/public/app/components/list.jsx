var React = require('react');


// Unordered list
var ulList = React.createClass({
  render: function () {
    var list = this.props.items.map(function (item) {
      return <li><a href="#">{item}</a></li>
    });
    return <ul className="dropdown-menu">
        {list}
    </ul>
  }
});

module.exports = ulList;