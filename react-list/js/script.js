
// binds animation classes
const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

/*
 * Bulk of the drag logic + animation
 */
class ListItem extends React.Component {
	
	constructor() {
		super();
		
		// youll see why later in the functions
		this.initialState = {
			
			// are we picked up?
			isActive: false,
			
			// is moved from initial pos (using the mouse as the reference)
			hasMoved: false,
			
			// initial MOUSE locations
			mInitX: 0,
			mInitY: 0,
			
			// mouse offset from initial locations
			mOffsetX: 0, 
			mOffsetY: 0,
		}
		
		this.state = Object.assign(
			this.initialState,
			{
				isOutOfBounds: false, // should the item be removed
				threshold: 65, // threshold beyond which we are considered 'removed'
			}
		);
		
		// dem func bindings
		for (let l of ['pickUp', 'letGo', 'drag']) {
			this[l] = this[l].bind(this);
		}
	}
	
	
	/* register and deregister mouse events, we don't want these around after an item has been 'let go' */
	componentWillUpdate(nextProps, nextState) {
		if (nextState.isActive && !this.state.isActive) { // picked up
			return this.register('mousemove', this.drag).register('mouseup', this.letGo);
    }
		
		if (!nextState.isActive && this.state.isActive) { // let go
			return this.register('mousemove', this.drag, true).register('mouseup', this.letGo, true);
		}
	}
	
	
	/* we want the visual classes to update before kicking off the delete, so the logic waits till now */
	componentDidUpdate(prevProps, prevState) {
		if (this.state.isOutOfBounds && !this.state.isActive) {
			return this.props.removeItem(this.props.id);
		}
	}
	
	
	/* short hand for adding and removing document event listeners + chainable bonus */
	register(eventName, func, undo = false) {
		document[!undo ? 'addEventListener' : 'removeEventListener'](eventName, func);
		return this;
	}
	
	
	/* method to set the 'picked up' state of the element, aka 'selected' */
	pickUp(e) {
		if (!this.isLeftMouse(e)) return false;
		this.setState({
			isActive: true,
			mInitX: e.pageX,
			mInitY: e.pageY,
		});
		this.silenceEvent(e); // quiet the mouse events to minimize collateral damage
	}

	
	/* method to 'let go' of the item */
	letGo(e) {
		const newState = {
			isActive: false,
			hasMoved: false,
		}
		// if we're out of bounds, dont reset the position, otherwise do
		this.setState( (!this.state.isOutOfBounds) ? this.initialState : newState );
	}
	
	
	/* function continuously called while an item is 'moving', see componentWillUpdate bindng */
	drag(e) {
		const offset = e.pageX - this.state.mInitX; // calculate the distance we moved
		this.setState({
			hasMoved: true,
			isOutOfBounds: (offset > this.state.threshold),
			mOffsetX: offset,
		});
	}
	
	
	/* helper to minimize repetition, we don't want mouse events doing anything while picked up */
	silenceEvent(e) {
		e.stopPropagation();
    e.preventDefault();
	}
	
	
	/* helper to ignore the right mouse click when picking up */
	isLeftMouse(e) {
    if ('buttons' in e) {
        return e.buttons === 1;
    } else if ('which' in e) {
        return e.which === 1;
    } else {
        return e.button === 1;
    }
	}
	
	
	/* returns a 'style' object for the distance offset. ORDER IS IMPORTANT */
	getElemPixelPos() {
		let pos = '0px';
		if (this.state.isOutOfBounds || this.state.hasMoved && this.state.isActive && this.state.mOffsetX > 0) {
			pos = this.state.mOffsetX + 'px';
		}
		return {
			left: pos,
		};
	}
	
	
	/*
		// @TODO optimize this, no need to keep re-assigning
		abstract out class compilation to nt pollute the render 
	*/
	getElemClasses() {
		let stateClasses = '';
		if (this.state.isActive) {
			stateClasses = stateClasses + ' is-active';
		}
		if (this.state.hasMoved) {
			stateClasses = stateClasses + ' is-moving';
		}
		if (this.state.isOutOfBounds) {
			stateClasses = stateClasses + ' state-deleting';
		}
		return 'item-zone' + stateClasses;
	}
	
	
	/* you know the deal */
	render() {
		return (
			<div className={this.getElemClasses()}>

				<div
					className="item"
					isPickedUp={this.state.isSelected}
					onMouseDown={this.pickUp}
					style={ this.getElemPixelPos() } >
					<span>
						{this.props.title}
					</span>
				</div>
				
				<div className="delete-overlay">
					<span className="delete">
						<svg className="skull-icon" width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
							<defs>
								<path d="M40.567 32.208A19.907 19.907 0 0 0 44 21C44 9.954 35.046 1 24 1S4 9.954 4 21c0 4.153 1.266 8.011 3.433 11.208A4.487 4.487 0 0 0 6 35.5c0 2.48 2.015 4.5 4.5 4.5h2.728l.859 7h19.826l.86-7H37.5c2.48 0 4.5-2.015 4.5-4.5a4.49 4.49 0 0 0-1.433-3.292z" id="a"/>
								<mask id="b" x="0" y="0" width="40" height="46" fill="#fff">
									<use xlinkHref="#a"/>
								</mask>
							</defs>
							<g fill="none" fill-rule="evenodd">
								<use stroke="#BC4155" mask="url(#b)" stroke-width="6" xlinkHref="#a"/>
								<path d="M17 30a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm14 0a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm-9.527 2.99c.051-.546.537-.99 1.093-.99.552 0 .958.451.907.99l-.38 4.02c-.051.546-.537.99-1.093.99a.894.894 0 0 1-.907-.99l.38-4.02zm3 4.02c.051.546.537.99 1.093.99a.894.894 0 0 0 .907-.99l-.38-4.02A1.115 1.115 0 0 0 25 32a.894.894 0 0 0-.907.99l.38 4.02z" fill="#BC4155"/>
							</g>
						</svg>
					</span>
				</div>
				
				{/*<DevPanel values={this.state} />*/}
			</div>
		);
	}
}


// simple list container
class List extends React.Component {
	constructor() {
		super();
		
		this.state = {
			items: ['Click and drag to delete', 'Pick Me!', 'This One', 'Pick the other guys'].map( i => ({
				id: uuid.v4(),
				title: i,
			})),
		}
		
		// dem func bindings
		for (let f of ['removeOne', 'addOne']) {
			this[f] = this[f].bind(this);
		}
	}
	
	addOne() {
		this.setState({
			items: [...this.state.items, { id: uuid.v4(), title: 'Haven\'t had enough huh...' }]
		})
	}
	
	removeOne(id) {
		this.setState({
			items: this.state.items.filter( i => i.id !== id ),
		});
	}
	
	render() {
		return (
			<div className="list">
				<div className="list-inner">
					<header className="list-header">
						<h3>My List</h3>
						<button className="btn-add-one" onClick={this.addOne}>Add Item</button>
					</header>
					<ul className="list-items">
						<ReactCSSTransitionGroup
							transitionName="drag"
							transitionEnter={false}
							transitionLeaveTimeout={330}>
							{ this.state.items.map( (v, k) => ( <ListItem key={v.id} {...v} removeItem={this.removeOne} /> )) }
						</ ReactCSSTransitionGroup>
					</ul>
				</div>
				<div className="shadow"></div>
			</div>
		)		
	}
}

// render the list
ReactDOM.render(<List />, document.getElementById('target'));


/* Used to dev debug drag values */
// function DevPanel({ values }) {

// 	function stateToHTML() {
// 		const result = [];
// 		for (let k in values) {
// 			result.push(
// 				<span className="x">{[k]}: <b>{String(values[k])}</b></span>
// 			);
// 		}
		
// 		if (values.mOffsetX > values.threshold) {
// 			result.push( <span className="x">Out of Bounds</span> )
// 		}
// 		return result;
// 	}
	
// 	return (
// 		<div className="dev-panel">
// 			<ul>{ stateToHTML() }</ul>
// 		</div>
// 	);
// }