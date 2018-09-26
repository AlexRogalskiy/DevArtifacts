var React = require('react');
var Thumbnail = require('./thumbnail');

// Thumbnail List
var ThumbnailList = React.createClass({
  render: function () {
    var list = this.props.thumbnailData.map(function (object) {
      return <Thumbnail {...object} />
    });
    return <div>
        {list}
    </div>
  }
});

module.exports = ThumbnailList;