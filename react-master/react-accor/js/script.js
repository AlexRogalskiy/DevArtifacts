const Accordion = (props) => {
  return (
    <div className="accordion">{ props.children }</div>
  )
}

const AccordionItemContext = React.createContext({
  expanded: false,
  toggleExpansion: () => {}
});

class AccordionItem extends React.Component {
  constructor (props) {
    super(props)
    
    this.toggleExpansion = () => {
      this.setState({ expanded: !this.state.expanded })
    }
    
    this.state = {
      expanded: false,
      toggleExpansion: this.toggleExpansion
    }
  }
  render () {
    return (
      <AccordionItemContext.Provider value={this.state}>
        <div className="accordion-item">
          {this.props.children}
        </div>
      </AccordionItemContext.Provider>
    )
  }
}

const AccordionHeader = (props) => {
  return (
    <AccordionItemContext.Consumer>
      {({ expanded, toggleExpansion }) => (
        <h2 className="accordion-header">
          <button onClick={toggleExpansion}>
            { expanded ? '▼ ' : '► ' } 
            { props.children }
          </button>
        </h2>
      )}
    </AccordionItemContext.Consumer>
  )
}

const AccordionPanel = (props) => {
  return (
    <AccordionItemContext.Consumer>
      {({ expanded }) => <div className={"accordion-panel " + (expanded ? 'expanded' : '')}>{props.children}</div>}
    </AccordionItemContext.Consumer>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    return (
      <Accordion>
        <AccordionItem>
          <AccordionHeader>
            Section 1
          </AccordionHeader>
          <AccordionPanel>
            Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            Section 2
          </AccordionHeader>
          <AccordionPanel>
            Sed non urna. Donec et ante. Phasellus eu ligula. Vestibulum sit amet purus. Vivamus hendrerit, dolor at aliquet laoreet, mauris turpis porttitor velit, faucibus interdum tellus libero ac justo. Vivamus non quam. In suscipit faucibus urna.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            Section 3
          </AccordionHeader>
          <AccordionPanel>
            Nam enim risus, molestie et, porta ac, aliquam ac, risus. Quisque lobortis. Phasellus pellentesque purus in massa. Aenean in pede. Phasellus ac libero ac tellus pellentesque semper. Sed ac felis. Sed commodo, magna quis lacinia ornare, quam ante aliquam nisi, eu iaculis leo purus venenatis dui.
            <ul>
              <li>List item one</li>
              <li>List item two</li>
              <li>List item three</li>
            </ul>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)