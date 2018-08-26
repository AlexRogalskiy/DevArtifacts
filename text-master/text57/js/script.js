class Mirror extends React.Component {
  componentDidMount() {
    _.each(document.querySelectorAll('.Mirror-original [data-mirror-hover]'), this.mirrorEventsOn);
  }
  
  findReflectedElement(el) {
    const id = el.dataset.mirrorId;
    return document.querySelectorAll(`.Mirror-reflection [data-mirror-id=${id}]`);
  }
  
  mirrorEventsOn(el) {
    const reflection = this.findReflectedElement(el);
    
    el.addEventListener('mouseenter', () => reflection.classlist.add('hover'))
    el.addEventListener('mouseleave', () => reflection.classlist.remove('hover'))
  }
  
  render() {
    return (
      <div className="Mirror">
        <div className="Mirror-original">
          {this.props.children}
        </div>
        <div className="Mirror-reflection">
          {this.props.children}
        </div>
      </div>
    );
  }
}

const Content = (props) => (
  <div className="Content">
    <h1 className="Title">For designers and front-end developers</h1>
  </div>
)

const root = document.getElementsByClassName("root")[0];
ReactDOM.render(<Mirror><Content /></Mirror>, root);