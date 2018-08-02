// Class way
class HelloWorld extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      color: "hotpink"
    };
  }
  
  toggleColor() {
    if(this.state.color === "hotpink") {
      this.setState({
        color:"yellow"
      });
    } else {
      this.setState({
        color:"hotpink"
      });
    }
  }
  
  changeColor(event) {
    this.setState({
      color: event.target.value
    });
  }
  
  render() { // method to return jsx
    const styleObj = {
      backgroundColor: this.state.color
    };
    
    return (
      <section style={styleObj} id="hello-world">
        <h2 onClick={this.toggleColor.bind(this)}>{this.state.color}</h2>
        <input value={this.state.color} onChange={this.changeColor.bind(this)} 
          placeholder="Enter a color"/>
      </section>
    );
  }
}

ReactDOM.render(<HelloWorld />, document.getElementById("app"));

// props, style, className, state