class Box extends React.Component {
  render() {
    
    let theClass = this.props.theClass;
    
    let theClasses = classNames({ 
      'box': true,
      [`${theClass}`]: true
    });
    
    return(
      <div className={theClasses}>
        {this.props.label}: {this.props.value}px;
        
        <span class="tl"></span>
        <span class="tr"></span>
        <span class="bl"></span>
        <span class="br"></span>
      </div>
    );
  }
}

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      value: 15
    };

    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event) {
    this.setState({value: event.target.value});
    document.documentElement.style.setProperty("--br", event.target.value + "px");
  }
  
  render() {
    
    let fourValueValue = this.state.value + "px " + this.state.value * 2 + "px " + this.state.value * 3 + "px " + this.state.value / 2;
    let threeValueValue = this.state.value + "px " + this.state.value * 2 + "px " + this.state.value * 3;
    let twoValueValue = this.state.value + "px " + this.state.value * 2;
    let slashSyntaxOne = this.state.value + "px/" + this.state.value * 3;
    let slashSyntaxTwo = this.state.value * 3 + "px/" + this.state.value;
    let slashSyntaxThree = this.state.value * 4 + "px " + this.state.value * 3 + "px " + this.state.value * 2 + "px " + this.state.value + "px/" + this.state.value + "px " + this.state.value * 2 + "px " + this.state.value * 3 + "px " + this.state.value * 4;
    
    return(
      <div>
        
        <h1>The Border Radii</h1>

        <input type="range" id="br-value" min="0" max="30" onChange={this.handleChange} value={this.state.value} />
        
        <div className="allBoxes">
          <Box theClass="br-all" value={this.state.value} label="border-radius" />
          <Box theClass="br-top-left" value={this.state.value} label="border-top-left-radius" />
          <Box theClass="br-top-right" value={this.state.value} label="border-top-right-radius" />
          <Box theClass="br-bottom-left" value={this.state.value} label="border-bottom-left-radius" />
          <Box theClass="br-bottom-right" value={this.state.value} label="border-bottom-right-radius" />
          <Box theClass="br-four-value" value={fourValueValue} label="border-radius" />
          <Box theClass="br-two-value" value={twoValueValue} label="border-radius" />
          <Box theClass="br-three-value" value={threeValueValue} label="border-radius" />
          <Box theClass="br-slash-one" value={slashSyntaxOne} label="border-radius" />
          <Box theClass="br-slash-two" value={slashSyntaxTwo} label="border-radius" />
          <Box theClass="br-slash-three" value={slashSyntaxThree} label="border-radius" />
        </div>

      </div>
    );
  }  
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);