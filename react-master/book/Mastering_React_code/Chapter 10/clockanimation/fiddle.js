var Motion = ReactMotion.Motion
,   spring = ReactMotion.spring
;

var Clock = React.createClass({
	getInitialState: function () {
		return { baseDate: new Date(), hours: 0, mins: 0, secs: 0 };
	},
	componentDidMount: function () {
		var node      = ReactDOM.findDOMNode(this)
		,   get       = node.querySelector.bind(node)
		,   parts     = node.querySelectorAll('canvas')
		,   faceCtx   = get('.clockface').getContext('2d')
		,   hourCtx   = get('.hourhand').getContext('2d')
		,   minCtx    = get('.minutehand').getContext('2d')
		,   secondCtx = get('.secondhand').getContext('2d')
		,   width     = node.clientWidth
		,   height    = node.clientHeight
		;

		Array.prototype.forEach.call(parts, function (canvas) {
			canvas.setAttribute('width', width);
			canvas.setAttribute('height', height);
		});
		// render off pixel boundaries for bolder lines
		faceCtx.translate(.5, .5);

		// create the clock face
		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach(function (mult) {
			faceCtx.save();
			faceCtx.translate(width>>1,height>>1);
			faceCtx.rotate((360 / 12 * mult)  * (Math.PI / 180));
			faceCtx.translate(0, -(width>>1));
      faceCtx.beginPath();
			faceCtx.moveTo(0, (mult)%3 ? 8 : 15); // longer ticks every 3 hours
			faceCtx.lineTo(0, 1);
			faceCtx.stroke();
			faceCtx.restore();
		});
		faceCtx.beginPath();
		faceCtx.arc(width>>1, height>>1, (width>>1)-1 , 0, 2 * Math.PI, false);
		faceCtx.stroke();

		// create the clock hands
		hourCtx.translate(width>>1, width>>1); // center
		hourCtx.lineWidth = 5;
		hourCtx.moveTo(0,0);
		hourCtx.lineTo(0, -(width>>1) +18);
		hourCtx.stroke();

		minCtx.translate(width>>1, width>>1);
		minCtx.strokeStyle = "#666";
		minCtx.lineWidth = 2;
		minCtx.moveTo(0,0);
		minCtx.lineTo(0, -(width>>1) + 10);
		minCtx.stroke();

		secondCtx.translate(width>>1, width>>1);
		secondCtx.strokeStyle = "#f00"; // red second hand
		secondCtx.lineWidth = 2;
		secondCtx.moveTo(0,12);
		secondCtx.lineTo(0, -(width>>1) + 2);
		secondCtx.stroke();

		// start with initial state base date
		this.setBaseDate(this.state.baseDate);
		// begin aggressively calculating updates
		window.requestAnimationFrame(this.tick);
	},
	componentWillReceiveProps: function (nextProps) {
		var newBaseDate = new Date();
		// if props aren't parseable set date to current
		if (!isNaN(parseInt(nextProps.hours,10) + parseInt(nextProps.mins,10) + parseInt(nextProps.secs,10))) {
			newBaseDate.setHours(nextProps.hours%24);
			newBaseDate.setMinutes(nextProps.mins%60);
			newBaseDate.setSeconds(nextProps.secs%60);
			this.setBaseDate(newBaseDate);
		} else {
			this.setBaseDate(new Date());
		}
	},
	setBaseDate: function (date) {
		this.setState({ baseDate: date });
		this.startTick = new Date(); // re-establish starting point
	},
	format: function (num) {
		return num > 9 ? num : '0'+num;
	},
	tick: function () {
		var nextTick = new Date()
		,   diff = nextTick.valueOf() - this.startTick.valueOf()
		;

		// Here we use a logical OR to clamp the values to whole numbers
		// This allows us to render just once per second while aggressively updating
		// our time data
		var clockState = {
			hoursDisp: ((this.state.baseDate.getHours()+diff/1000/3600)|0),
			minsDisp: ((this.state.baseDate.getMinutes()+diff/1000/60)|0),
			secsDisp: ((this.state.baseDate.getSeconds()+diff/1000)|0),
		};
		clockState.amPm = clockState.hoursDisp%24 > 12 ? 'pm':'am';

		// degrees
		clockState.hours = clockState.hoursDisp*30;
		clockState.mins = clockState.minsDisp*6;
		clockState.secs = clockState.secsDisp*6;

		this.setState(clockState);
		window.requestAnimationFrame(this.tick); // resume updates at 60fps
	},
	// only allow render when there's a value change
	shouldComponentUpdate: function (nextProps, nextState) {
		return (
			nextState.hours !== this.state.hours || 
			nextState.mins !== this.state.mins ||
			nextState.secs !== this.state.secs
		);
	},
	render: function () {
		return (
			<div className="clock-component">
				<canvas ref="clockface" className="clockface"></canvas>
				<Motion style={{
					hours: spring(this.state.hours),
					mins: spring(this.state.mins),
					secs: spring(this.state.secs)
				}}>
				{({hours,mins,secs}) =>
					<div className="hands">
						<canvas ref="hourhand" className="hourhand" style={{
							WebkitTransform: `rotate(${hours}deg)`,
							transform: `rotate(${hours}deg)`
						}}></canvas>
						<canvas ref="minutehand" className="minutehand" style={{
							WebkitTransform: `rotate(${mins}deg)`,
							transform: `rotate(${mins}deg)`
						}}></canvas>
						<canvas ref="secondhand" className="secondhand" style={{
							WebkitTransform: `rotate(${secs}deg)`,
							transform: `rotate(${secs}deg)`
						}}></canvas>
					</div>
				}
				</Motion>
				<pre className="digital">
					{this.format(this.state.hoursDisp%12)}:{this.format(this.state.minsDisp%60)}:{this.format(this.state.secsDisp%60)} {this.state.amPm}
				</pre>
			</div>
		);
	}
});
var ClockExample = React.createClass({
	getInitialState: function () { return {}; },
	getVal: function (name) {
		return this.refs[name].value;
	},
	setTime: function () {
		this.setState({
			hours: this.getVal('hours'),
			mins: this.getVal('mins'),
			secs: this.getVal('secs')
		});
	},
	render: function () {
		return (
			<div className="clock-example">
				<fieldset>
					<legend>Set the time</legend>
					<label>hours   <input maxLength="2" ref="hours" /></label>
					<label>minutes <input maxLength="2" ref="mins" /></label>
					<label>seconds <input maxLength="2" ref="secs" /></label>
					<button onClick={this.setTime}>SET</button>
				</fieldset>
				<Clock hours={this.state.hours} mins={this.state.mins} secs={this.state.secs}/>
			</div>
		);
	}
});

ReactDOM.render(<ClockExample />, document.getElementById('app'));