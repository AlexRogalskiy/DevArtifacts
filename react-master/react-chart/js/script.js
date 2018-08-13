console.clear();

class Rebalancing extends React.Component {

		constructor () {
			super();
			this.state = {
        index: 0,
        isPlaying: false,
        onionSkinView: false
			}
		}
  
    componentWillMount () {
      d3.json(jsonUrl, (err, data) => {
        if (err) throw console.log(err);
        this.setState({data, index: data.length - 1, ready: true});
      });
    }
  
    _onButtonClick (frames) {
      var state = this.state,
          index = +state.index + +frames;
      
      if (frames === 'play' || frames === 'pause') {
        if (state.index === state.data.length - 1) {
          return this.setState({index: 0}, this._onPlayOrPause);
        }
        else {
          return this._onPlayOrPause();
        }
      }

      if (index < 0) {
        
        index = 0;

        if (state.isPlaying) { this._onPlayOrPause(); }
      }

      else if (index > state.data.length - 1) {

        index = state.data.length - 1;
        
        if (state.isPlaying) { this._onPlayOrPause(); }
      }
      
      this.setState({index});
    }
    
    _onRangeClick (newIndex) {
      this.setState({ index: newIndex });
    }
    
    _toggleOnionSkinView () {
        this.setState({ onionSkinView: !this.state.onionSkinView });
    }
  
    _onPlayOrPause () {
      var state = this.state;
      this.setState({isPlaying: !state.isPlaying}, () => {

        if (state.isPlaying) {
          clearInterval(this.timer);        
        }

        else {
          this.timer = setInterval(this._onButtonClick.bind(this, 1), 50);        
        }
      });
    }
	
    render () {
        var state = this.state,
            output = {},
            cn = "rebalancing__";
      
        output.html = <div className="rebalancing"><Loader /></div>;
        
        if (state.ready) {
          output.html = (
            <div className="rebalancing">
                <div className={cn + 'player'}>
                  <RebalancingChart
                    data={state.data}
                    index={state.index}
                    onionSkinView={state.onionSkinView} />
                  <div className={cn + "view"}>
                    <span>{format(date(state.data[state.index].date))}</span>
                    <span>
                      <input id="onionSkinView" type="checkbox" onChange={this._toggleOnionSkinView.bind(this)} />
                      <label htmlFor="onionSkinView">
                        <svg width="15" height="15">
                          <circle cx="2.5" cy="2.5" r="2.5" fill="#bbb" />
                          <circle cx="7.5" cy="7.5" r="2.5" fill="#888" />
                          <circle cx="12.5" cy="12.5" r="2.5" fill="#444" />
                        </svg>
                      </label>
                    </span>
                  </div>
                  <RebalancingTimeline
                    data={state.data}
                    index={state.index}
                    onRangeClick={this._onRangeClick.bind(this)} />
                  <RebalancingControls
                    data={state.data}
                    index={state.index}
                    isPlaying={state.isPlaying}
                    onButtonClick={this._onButtonClick.bind(this)} />
                </div>
            </div>);
        }
        return output.html;
    }
};

class RebalancingChart extends React.Component {
  constructor () {
    super();
    this.state = {
      isDOMReady: false,
      isDataReady: false,
      isSetupReady: false,
      x: d3.scale.ordinal(),
      y: d3.scale.linear(),
      r: d3.scale.sqrt().range([3, 15]),
      guides: [-1, -0.3, -0.2, 0, 0.2, 0.3, 1]
    }
  }
  
  componentWillMount () {
    this._updateDomains();
  }
  
  componentDidMount () {
      var state = this.state,
          w = +React.findDOMNode(this.refs.container).getBoundingClientRect().width,
          h = +React.findDOMNode(this.refs.container).getBoundingClientRect().height;
    
        
    state.y.range([h, 0]);
    state.x.rangeRoundBands([0, w]);
    
    window.addEventListener('resize', this._onResize.bind(this));
    
    this.setState({
      isDOMReady: true,
      y: state.y,
      x: state.x,
      w, h
    });
  }
  
  componentWillUnmount () {
        window.removeEventListener('resize', this._onResize);
  }
  
  componentDidUpdate (prevProps, prevState) {

    var state = this.state;
    if (state.isDOMReady && state.isDataReady && !state.isSetupReady) {
      this._setupChart();
    }

    else if (state.isDOMReady && state.isDataReady && state.isSetupReady) {
      if (prevProps.index !== this.props.index) {
        this._updateChart();        
      }
      else {
        d3.select('.rebalancing-chart__past')
          .classed('rebalancing-chart__past--visible', this.props.onionSkinView);
      }
    }
  }
  
  _onResize () {
    var state = this.state,
        w = +React.findDOMNode(this.refs.container).getBoundingClientRect().width,
        h = +React.findDOMNode(this.refs.container).getBoundingClientRect().height;

    state.y.range([h, 0]);
    state.x.rangeRoundBands([0, w]);

    this.setState({
      y: state.y,
      x: state.x,
      w, h
    }, this._updateChart);
  }
  
  _updateDomains () {
       var state = this.state,
        props = this.props,
        data = props.data[props.index].allocation,
        yDomain = [],
        xDomain = Object.keys(data),
        rDomain = [];
        
    yDomain.push(d3.max(d3.entries(data),
        d => d3.max(d3.entries(d.value),
            e => {
              if (e.key === 'deviation') {
                return Math.abs(e.value);
            }
        })
    ));
    
    
    yDomain.push(d3.max(d3.entries(data),
        d => d3.max(d3.entries(d.value),
            e => {
              if (e.key === 'deviation') {
                return e.value;
            }
        })
    ));

    rDomain.push(d3.min(d3.entries(data),
        d => d3.min(d3.entries(d.value),
            e => {
              if (e.key === 'wallet') {
                return e.value;
            }
        })
    ));
    
    rDomain.push(d3.max(d3.entries(data),
        d => d3.max(d3.entries(d.value),
            e => {
              if (e.key === 'wallet') {
                return e.value;
            }
        })
    ));
    
    state.y.domain([-d3.max([0.35, yDomain[0]]), d3.max([0.35, yDomain[1]]) ]);
    state.r.domain(rDomain);
    state.x.domain(xDomain);
    
    this.setState({
      isDataReady: true,
      x: state.x,
      y: state.y,
      r: state.r
    });

  }
  
  _setupChart () {
    var state = this.state,
        props = this.props,
        data = props.data[props.index].allocation,
        svg = d3.select(React.findDOMNode(this.refs.container));

    svg.selectAll('.rebalancing-chart__guides')
      .data(state.guides)
      .enter()
      .append('line.rebalancing-chart__guides')
      .attr({
        x1: 0,
        x2: state.w,
        y1: d => Math.round(state.y(d)),
        y2: d => Math.round(state.y(d)),
        'data-index': d => d
      });

    svg.selectAll('.rebalancing-chart__circles')
      .data(d3.entries(data))
      .enter()
      .append('circle.rebalancing-chart__circles')
      .translate([state.x.rangeBand() / 2, 0])
      .attr({
        cx: d => state.x(d.key),
        r: d => state.r(d.value.wallet),
        cy: d => state.y(d.value.deviation),
        fill: d => investmentClasses[d.key].color
      });
    
    this._setupPastChart(svg);
    
    this.setState({isSetupReady: true});

  }
  
  _setupPastChart (svg) {
    var props = this.props,
        state = this.state;

    svg = svg.append('g.rebalancing-chart__past');

    for (var skin = 1; skin < props.data.length - 1; skin++) {
      var data = props.data[props.index - skin].allocation;

      svg.selectAll('.rebalancing-chart__past-circles-' + skin)
        .data(d3.entries(data))
        .enter()
        .append('circle.rebalancing-chart__past-circles-' + skin)
        .translate([state.x.rangeBand() / 2, 0])
        .attr({
          cx: d => state.x(d.key),
          r: d => state.r(d.value.wallet) < 0 ? 0 : state.r(d.value.wallet),
          cy: d => state.y(d.value.deviation),
          fill: d => investmentClasses[d.key].color,
          'fill-opacity': Math.pow(0.4, Math.log(skin))
        });
    }
  }
  
  _redraw () {
    var state = this.state,
        props = this.props,
        data = props.data[props.index].allocation,
        svg = d3.select(React.findDOMNode(this.refs.container));

    svg.selectAll('.rebalancing-chart__guides')
      .data(state.guides)
      .attr({
        x1: 0,
        x2: state.w,
        y1: d => Math.round(state.y(d)),
        y2: d => Math.round(state.y(d))
      });

    svg.selectAll('.rebalancing-chart__circles')
      .data(d3.entries(data))
      .translate([state.x.rangeBand() / 2, 0])
      .attr({
        r: d => state.r(d.value.wallet),
        cx: d => state.x(d.key),
        cy: d => state.y(d.value.deviation)
      });
    
    for (var skin = 1; skin < props.data.length - 1; skin++) {
      if (props.index - skin < 0) { break; }
      else {
        svg.selectAll('.rebalancing-chart__past-circles-' + skin)
          .data(d3.entries(props.data[props.index - skin].allocation))
          .translate([state.x.rangeBand() / 2, 0])
          .attr({
            cx: d => state.x(d.key),
            r: d => state.r(d.value.wallet) < 0 ? 0 : state.r(d.value.wallet),
            cy: d => state.y(d.value.deviation)
          });
      }
    }
  }
  
  _updateChart () {
    this._updateDomains();
    this._redraw();
  }
  
  render () {
    return <svg
      ref="container"
      className="rebalancing__chart rebalancing-chart" />;
  }
}

class RebalancingTimeline extends React.Component {
  
  constructor () {
    super();
  }

  _update (event) {
    this.props.onRangeClick(+event.currentTarget.value);
  }

  render () {
    var props = this.props,
        output = {},
        cn = 'rebalancing-timeline__';

    return (
      <div className="rebalancing__timeline rebalancing-timeline">
        <span>{format(date(props.data[0].date))}</span>
        <input
            type="range"
            value={props.index}
            min="0"
            max={props.data.length - 1}
            className="rebalancing-timeline__input"
            onChange={this._update.bind(this)} />
        <span>{format(date(props.data[props.data.length - 1].date))}</span>
      </div>
    );
  }
}

class RebalancingControls extends React.Component {
  constructor () {
    super();
  }
  
  _onButtonClick (event) {
    let frames = event.currentTarget.dataset.frames;
    this.props.onButtonClick(frames);
  }
  
  render () {
    var playOrPause = this.props.isPlaying ? ['pause', 'i-pause'] : ['play', 'i-play'];

    if (this.props.index === this.props.data.length - 1) {
      playOrPause = ['play', 'i-reload'];
    }
    
    return (
      <div className="rebalancing__controls rebalancing-controls">
        <button onClick={this._onButtonClick.bind(this)} data-frames={-10}><i className="i-fast-backward" /></button>
        <button onClick={this._onButtonClick.bind(this)} data-frames={-1}><i className="i-backward" /></button>
        <button onClick={this._onButtonClick.bind(this)} data-frames={playOrPause[0]}><i className={playOrPause[1]} />
      </button>
        <button onClick={this._onButtonClick.bind(this)} data-frames={1}><i className="i-forward" /></button>
        <button onClick={this._onButtonClick.bind(this)} data-frames={10}><i className="i-fast-forward" /></button>
      </div>
    );
  }
}

class Loader extends React.Component {
  constructor () {
    super();
  }
  render() {
    return (<div className="loader"><svg><circle cx="50" cy="50" r="20" fill="none" strokeWidth="2" /></svg></div>);
  }
}

const jsonUrl = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/20221/dummy-deviation.json",
      investmentClasses = {
          postfixed: {
            name: 'Juros pós-fixados',
            color: '#1f9898'
          },
          prefixed: {
            name: 'Juros prefixados',
            color: '#135d5d'
          },
          inflation: {
              name: 'Inflação',
              color: '#f5a623'
          },
          stock: {
              name: 'Ações Brasil',
              color: '#f37077'
          },
          exterior: {
              name: 'Ações EUA',
              color: '#5c4561'
          }
      },
      format = d3.time.format("%d/%m/%y"),
      date = d3.time.format("%Y-%m-%d").parse;

React.render(<Rebalancing />, document.getElementById("app"));