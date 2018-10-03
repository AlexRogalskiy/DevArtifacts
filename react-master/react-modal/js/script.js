// Imports 
const { createStore } = Redux;
const { Provider, connect } = ReactRedux;


// Set InitialState
const initialState = {
  modal: false
}


// ActionTypes:
const OPEN_MODAL = 'OPEN_MODAL';
const CLOSE_MODAL = 'CLOSE_MODAL';


// Actions:
const openModalAction = () => ({
    type: OPEN_MODAL,
    payload: true
  });

const closeModalAction = () => ({
    type: CLOSE_MODAL,
    payload: false
  });


// Reducer
const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      return { ...state, modal: action.payload };
    case CLOSE_MODAL:
      return { ...state, modal: action.payload };
    default:
      return state;
  }
}

// Create Redux Store
const store = createStore(modalReducer);


// Re-useable Modal Component
class Modal extends React.Component {
  
  componentDidMount() {
    this.modalTarget = document.createElement('div');
    this.modalTarget.className = 'modal';
    document.body.appendChild(this.modalTarget);
    this._render();
  }
  
  componentWillReceiveProps(nextProps) {
    // If isActive prop is true, set the className to 'modal is-active'
    if (nextProps.isActive !== this.props.isActive) {
      this.modalTarget.className = nextProps.isActive ?
        'modal is-active'
        : 'modal';
    }
  }
  
  componentWillUnmount() {
    // Clean up
    ReactDOM.unmountComponentAtNode(this.modalTarget);
    document.body.removeChild(this.modalTarget);
  }
  
  _render() {
    let element = (
      <Provider store={store}>
        <div>
          <div className="modal-background"></div>
        {this.props.children}
        </div>
      </Provider>
    );
    ReactDOM.render(element, this.modalTarget);
  }
  
  render() {
    return null;
  }
}


// MyModal Component
const MyModal = ({ show, click }) => (
  <Modal isActive={show}>
    <div className="modal-content">
      <div className="modal-header">
        My Modal
      </div>
      <div className="modal-body">
        <p>This is a modal</p>
      </div>
      <div className="modal-footer">
        <button onClick={click}>
          Close
        </button>
      </div>
    </div>
  </Modal>);


// Main Component
class Main extends React.Component {
  constructor() {
    super();
    this.handleClick = this._handleClick.bind(this);
  }
  
  _handleClick(e) {
    e.preventDefault();
    if (this.props.showModal)
      this.props.dispatch(closeModalAction());
    else
      this.props.dispatch(openModalAction());
  }
  
  render() {
    return (
      <div>
        <h1>React Redux Modal</h1>
        <div className="page">
          <button onClick={this.handleClick}>
            Open Modal
          </button>
        </div>
        <MyModal 
          show={this.props.showModal}
          click={this.handleClick} />
      </div>
    );
  }
}

// Connect App to Redux Store
const App = connect((store) => ({
  // Pass store.modal as a prop
  showModal: store.modal
}))(Main);


// Render App
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('app'));