class FlickeringCheckbox extends React.Component {
  constructor(){
    super();
    this.state = { isIndeterminate: true };
  }
  componentDidMount() {
    setInterval(() => this.setState({isIndeterminate: !this.state.isIndeterminate}), 500);
  }
  render() {
    return <input 
      type="checkbox"
      ref={elem => elem && (elem.indeterminate = this.state.isIndeterminate)}
    />

  }
}

ReactDOM.render(
  <FlickeringCheckbox />,
  document.getElementById('root')
);
