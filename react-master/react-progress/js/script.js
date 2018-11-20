class ProgressCircle extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      path: this.generateSvgPathString(props),
      pathLength: this.calculateCircleCircumference(props)
    };
  }

  /**
   * Rotate background ring
   */
  updateBackgroundOffset() {
    this.setState({
      backgroundOffset: this.state.backgroundOffset - 10
    });
  }

  /**
   * Calculate what the path of a circle centered in a space will be
   *
   * @param     {Object}    props
   * @return    {String}
   */
  generateSvgPathString(props = this.props) {
    // Radius
    var r = parseFloat(props.radius, 10);
    var rx = r;
    var ry = r;

    // Center it
    var cx = r + parseInt(props.strokeWidth, 10);
    var cy = r + parseInt(props.strokeWidth, 10);

    var path = 'M' + (cx-rx).toString() + ',' + cy.toString();
    path += 'a' + rx.toString() + ',' + ry.toString() + ' 0 1,0 ' + (2 * rx).toString() + ',0';
    path += 'a' + rx.toString() + ',' + ry.toString() + ' 0 1,0 ' + (-2 * rx).toString() + ',0';

    return path;
  }

  getProgress() {
    if(this.props.progress) {
      return this.props.progress;
    } else if (this.props.total === 0) {
      return 0;
    } else {
      return (this.props.loaded / this.props.total) * 100;
    }
  }

  /**
   * Caluclate the circumference so we know how to animate the line
   *
   * @param     {Object}    props
   * @return    {Number}
   */
  calculateCircleCircumference(props = this.props) {
    return 2 * Math.PI * props.radius;
  }

  /**
   * Calculate offset to make the line grow as we progress
   */
  calculateStrokeDashoffset() {
    return this.state.pathLength * ((100 - this.getProgress()) / 100);
  }

  /**
   * Generates a stroke array that slowly closes up
   * @return {[type]} [description]
   */
  getBackgroundStrokeArray() {
    // Convert from string
    let bgStrokeArrayParts = this.props.backgroundPath.strokeArray.split(' ');

    // Ensure we have two numbers
    if(bgStrokeArrayParts.length === 1) {
      bgStrokeArrayParts.push(bgStrokeArrayParts[0]);
    }

    // Cast
    bgStrokeArrayParts = bgStrokeArrayParts.map((item) => parseInt(item, 10));

    /**
     * Convert to a float and cap it around 80% so the dashed line
     * never turns completely solid hiding the actual progress
     */
    let percent = (this.props.progress / 100) * 0.8;

    return (percent * bgStrokeArrayParts[0]) + ' ' + (1 - percent) * bgStrokeArrayParts[1];
  }

  /**
   * Render
   * @return {React}
   */
  render() {
    /**
     * How wide/tall is it?
     *
     * @type    {Number}
     */
    var dimension = (parseInt(this.props.radius, 10) + parseInt(this.props.strokeWidth, 10)) * 2;

    /**
     * Rotate 90deg so the line starts at the top
     *
     * @type    {String}
     */
    var pathTransform = 'translate(' + dimension + ' 0) rotate(90)';

    /**
     * Setup SVG Styles
     *
     * @type    {Object}
     */
    var pathStyles = {
      strokeDashoffset : this.calculateStrokeDashoffset() + 'px'
    };

    /**
     * Apply any css classes
     *
     * @type    {String}
     */
    var svgClasses = classNames({
      'upload-progress--svg' : true
    });

    /**
     * Should we include a background line?
     *
     * @type    {React}
     */
    var background = null;
    if(this.props.background === true) {
      background = (
        <path
          className='upload-progress--background'
          d={this.state.path}
          fill='none'
          stroke='#eeeeee'
          strokeWidth={this.props.strokeWidth} />
      );
    }

    return (
      <div className={classNames(this.props.className, 'upload-progress')}>
        <svg
          className={svgClasses}
          width='100%'
          viewBox={'0 0 ' + dimension + ' ' + dimension}
          height='100%'>
          {background}
          <path
            className='upload-progress--path'
            transform={pathTransform}
            style={pathStyles}
            ref='circle'
            d={this.state.path}
            strokeDasharray={this.state.pathLength}
            fill='none'
            stroke='#000000'
            strokeWidth={this.props.strokeWidth} />
          <path
            className='upload-progress--background'
            ref='background'
            d={this.state.path}
            strokeDasharray={this.getBackgroundStrokeArray()}
            fill='none'
            stroke='#000000'
            strokeWidth={this.props.strokeWidth * 0.95}
            /* Custom SVG Animation */
            dangerouslySetInnerHTML={{__html: '<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 ' + (dimension / 2) + ' '+ (dimension / 2) + '" to="-360 ' + (dimension / 2) + ' ' + (dimension / 2) + '" dur="' + this.props.backgroundPath.speed + '" repeatCount="indefinite" />'}}
          />
        </svg>
      </div>
    );
  }
}

/**
 * Defaults
 * @type {Object}
 */
ProgressCircle.defaultProps = {
  backgroundStrokeArray: 3,
  backgroundPath: {
    strokeArray: '10 10',
    speed: '10s'
  },
  radius: 100,
  strokeWidth: 5,
  className: '',
  progress: 0,
  total: 0,
  loaded: 0
}

/**
 * Helper function to handle classes
 */
function classNames() {
  let args = Array.prototype.slice.call(arguments);
  args = args.map((arg) => {
    if(typeof arg === 'string') {
      return arg;
    } else if (typeof arg === 'object') {
      let result = '';
      for(let key in arg) {
        if(arg.hasOwnProperty(key) && arg[key]) {
          result += ' ' + key;
        }
      }
      return result;
    } else {
      return '';
    }
  });
  return args.join(' ').trim();
}

/**
 * Helper component to show what it looks like to load something
 */
class Automator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    }
    this.updateProgress = this.updateProgress.bind(this);
  }
  
  componentDidMount() {
    this.interval = setInterval(this.updateProgress, 500);
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  updateProgress() {
    let progress = this.state.progress + (Math.random() * this.props.speed);

    if (this.state.progress === 100) {
      progress = 0;
    } else if (progress > 100) {
      progress = 100;
    } 
    
    this.setState({
      progress: progress
    });
  }
  
  render() {
    return (
      <ProgressCircle
        progress={this.state.progress}
      />
    )
  }
}

React.render(
  <Automator
    speed={11} />, document.getElementById('container') );
