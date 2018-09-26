var React = require('react');
var Button = require('./button');

// Thumbnail component
var Thumbnail = React.createClass({
  render: function () {
    return <div className="col-sm-5">
        <div className="thumbnail">
          <img src={this.props.imgUrl} alt="image text" />
          <div className="caption">
            <h3>{this.props.label}</h3>
            <p>{this.props.text}</p>
            <Button title={this.props.title} subTitle={this.props.number}
            className="btn btn-primary" subTitleClassName="badge" />
        </div>
      </div>
    </div>
  }
});

module.exports = Thumbnail;