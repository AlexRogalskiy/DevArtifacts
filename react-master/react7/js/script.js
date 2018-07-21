var RatingStar = React.createClass({
  propTypes: {
    size: React.PropTypes.number,
    activeFill: React.PropTypes.string,
    inactiveFill: React.PropTypes.string,
    active: React.PropTypes.bool
  },
  
  getDefaultProps: function() {
    return {
      size: 12,
      activeFill: "#4080FF",
      inactiveFill: "#BEC2C9",
      active: true
    }
  },
  
  render: function() {
    var fill = this.props.active ? this.props.activeFill : this.props.inactiveFill,
        sizeStr = this.props.size + 'px';
    return (
      <span onClick={(function(a, e){
          this.props.clickHandler(a, e)
        }).bind(this, this.props.index)}>
        <svg xmlns="http://www.w3.org/2000/svg"
          width={sizeStr}
          height={sizeStr}
          viewBox="0 0 12 12">
          <polygon
            fill={fill}
            points="6 8.5200001 2.47328849 10.854102 3.60333748 6.77872286 0.293660902 4.14589803 4.51878111 3.96127709 6 0 7.48121889 3.96127709 11.7063391 4.14589803 8.39666252 6.77872286 9.52671151 10.854102">
          </polygon>
        </svg>
      </span>
    )
  }
})

var Rating = React.createClass({
  propTypes: {
    score: React.PropTypes.number,
    outOf: React.PropTypes.number,
    size: React.PropTypes.number,
    colors: React.PropTypes.array,
    mutable: React.PropTypes.bool
  },
  
  getDefaultProps: function() {
    return {
      score: 0,
      outOf: 5,
      size: 12,
      colors: ['#4080FF', '#BEC2C9'],
      mutable: true
    }
  },
  
  getInitialState: function() {
    return {
      rating: this.props.score
    }
  },
  
  // Update rating after clicking on a star
  // If the user clicks on the current rating, reset to 0
  updateRating: function(newRating, e) {
    if(this.props.mutable == false) return;
    if(newRating + 1 == this.state.rating) {
      this.setState({rating: 0})
    } else {
      this.setState({rating: newRating + 1})
    }
  },
  
  // Render the stars
  // returns an array of RatingStar components
  renderRating: function() {
    var output = [];
    
    for(var i = 0; i < this.props.outOf; i++) {
      var isActive = i >= this.state.rating && i < this.props.outOf ? false : true;
      output.push(
        <RatingStar key={i}
          size={this.props.size}
          active={isActive}
          clickHandler={this.updateRating}
          index={i}
          activeFill={this.props.colors[0]}
          inactiveFill={this.props.colors[1]}/>
      )
    }
    
    return output;
  },
  
  render: function() {
    var className = "c-rating";
    if(this.props.mutable == true) className += " c-rating--mutable"
    return (
      <div className={className}>{this.renderRating()}</div>
    );
  }
});

ReactDOM.render(
  <div>
    <Rating score={3} size={12} />
    <Rating score={2} size={16} />
    <Rating score={6} outOf={7} size={24} colors={['#F35369']} />
    <Rating score={2} size={16} mutable={false} />
  </div>,
  document.getElementById('root')
);