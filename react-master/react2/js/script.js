var MyCom = React.createClass({
  getInitialState: function() {
    return {
      slider: ["first", "second", "third", "fourth", "fifth"],
      activeIndex: 1,
      left: 0
    }
  },
  prevSlide: function() {
    this.setState({
      activeIndex: this.state.activeIndex - 1,
      left: this.state.left + 400 // this.props.sliderWidth not working for some reason
    })
    if (this.state.activeIndex === 1) {
      this.setState({
        activeIndex: this.state.activeIndex + this.state.slider.length - 1,
        left: this.state.left - this.props.sliderWidth * (this.state.slider.length - 1)
      })
    }
  },
  nextSlide: function() {
    this.setState({
      activeIndex: this.state.activeIndex + 1,
      left: this.state.left - this.props.sliderWidth
    })
    if (this.state.activeIndex === this.state.slider.length) {
      this.setState({
        activeIndex: this.state.activeIndex - this.state.slider.length + 1,
        left: 0
      })
    }
  },
  clickIndicator: function(e) {
    this.setState({
      activeIndex: parseInt(e.target.textContent),
      left: this.props.sliderWidth - parseInt(e.target.textContent) * this.props.sliderWidth
    })
  },
  render: function() {
    var style = {
      left: this.state.left,
      width: this.props.sliderWidth,
      height: this.props.sliderHeight
    };
    return (
      <div>
        <div  className="slider-wrapper">
        <ul className="slider">
        {this.state.slider.map(function(item,index) {
          return (
          <li style={style} className={index+1 === this.state.activeIndex ? 'slider-item' : 'hide'}>{item}</li>
         
          )
        },this)
        }
        </ul>
        </div>
        <div className="buttons-wrapper">
        <button className="prev-button" onClick={this.prevSlide}></button>
        <button className="next-button" onClick={this.nextSlide}></button>
        </div>
        <div className="indicators-wrapper">
          <ul className="indicators">
         {this.state.slider.map(function(item,index) {
          return (
          <li className={index+1 === this.state.activeIndex ? 'active-indicator' : ''}onClick={this.clickIndicator}>{index+1}</li>
          )
        },this)
        }
          </ul>
        </div>
      </div>
    );
  }
});
ReactDOM.render(
  <MyCom sliderWidth="400" sliderHeight="250"/>,
  document.getElementById("app")
);