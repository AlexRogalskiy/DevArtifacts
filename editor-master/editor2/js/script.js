$(document).ready(() => {
  let previewOpen = false;
  $("#preview-collapse").click(() => {
    previewOpen = !previewOpen;
    
    let buttonText = previewOpen ? "Edit" : "Preview";
    let newPos = previewOpen ? "0" : "-100%";
    
    $("#output").stop();
    $("#preview-collapse").html(buttonText);
    $("#output").animate({"right": newPos}, 200);
  });
});

let defaultInput = "# Markdown Editor\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

function Editor(props) {
  return(
    <textarea onChange={props.onChange}>
      {defaultInput}
    </textarea>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      output: defaultInput
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      output: event.target.value
    });
  }

  render() {
    return(
      <div id="container">
        <div id="editor">
          <Editor onChange={this.handleChange}/>
        </div>
        <div id="output" dangerouslySetInnerHTML={{__html: marked(this.state.output)}}>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
