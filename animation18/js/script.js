/*

NOTE:

THREE.FlatShading doesn't work on MeshNormalMaterial right 
now, I'm looking into how to recreate that (last time I actively worked
on this was several Three.js versions ago, a lot has changed lol)

NOTE AGAIN:
Now there's just no shading on MeshNormalMaterial any more lol,
but FlatShading is the default

*/

const defaultConfig = {
	// -------------- // 
	number: 20, // number of objects
	boundaries: 10, // example: 20 means position = THREE.Math.randInt(-20,20)
	size: 2, // object size
	// -------------- //
	kaleidoscope: true,
	sides: 6, // number of kaleidoscope sides
	angle: 45, // kaleidoscope angle, in degrees
	// -------------- //
	colorshift: false, // RGB color shift shader filter
	//flatshading: false, // flat or smooth shading
	wireframe: false, // wireframe mode
	space: false // space background
	// -------------- //
};


class Canvas extends React.PureComponent {
  constructor(props) {
    super(props);
    
    this.init = this.init.bind(this);
    this.animate = this.animate.bind(this);
    this.renderScene = this.renderScene.bind(this);
  }

  componentDidMount() {
		this.init();
		this.animate();
		
    window.addEventListener('resize', function() {

    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize(window.innerHeight, window.innerHeight);

    }.bind(this), false);
  }
		
	componentDidUpdate() {
		this.init();
	}
	
	componentWillUnmount() {
		cancelAnimationFrame(this.animate);
	}
  
  init() {
		
		if (this.renderer && this.container) {
			this.container.removeChild(this.renderer.domElement);
		}

		this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize( window.innerHeight, window.innerHeight );
    this.container.appendChild( this.renderer.domElement );
      
    this.geometry = new THREE.IcosahedronGeometry(this.props.size, 0);

    this.material = new THREE.MeshNormalMaterial({
      wireframe: this.props.wireframe
    });

    this.group = new THREE.Object3D();
    
    for (var i = 0; i < this.props.number; i++) {
      
      let mesh = new THREE.Mesh(this.geometry, this.material);

      let b = this.props.boundaries;
      mesh.position.set(
        THREE.Math.randInt(-b, b),
        THREE.Math.randInt(-b, b),
        THREE.Math.randInt(-b, b)
      );
      
      this.group.add(mesh);
      
    }
    
    this.scene.add(this.group);

    this.light = new THREE.DirectionalLight(0xFFFFFF);
    this.light.position.set(0, 0, 250);
    this.scene.add(this.light);

    this.camera.position.set(0, 0, 40); 
    
    // postprocessing
    if (this.props.kaleidoscope || this.props.colorshift) {
      // support transparency thanks to https://codepen.io/SephReed/pen/jWWEQE
      var renderTarget = new THREE.WebGLRenderTarget(
        window.innerHeight,
        window.innerHeight,
        {
          minFilter: THREE.LinearFilter, 
          magFilter: THREE.LinearFilter, 
          format: THREE.RGBAFormat, 
          stencilBuffer: false 
        }
      );

      this.composer = new THREE.EffectComposer(this.renderer, renderTarget);
      this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));    
    }

    if (this.props.kaleidoscope) {
      var effect = new THREE.ShaderPass(THREE.KaleidoShader);
      effect.uniforms['sides'].value = this.props.sides;
      effect.uniforms['angle'].value = this.props.angle * Math.PI / 180;
      this.composer.addPass(effect);
    }
    
    if (this.props.colorshift) {
      var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
      effect.uniforms['amount'].value = 0.005;
      this.composer.addPass(effect);
    }
    
    if (this.props.kaleidoscope || this.props.colorshift) {
      effect.renderToScreen = true;
    }
  }

  animate() {
    this.animation = requestAnimationFrame(this.animate);

  	this.group.rotation.x += 0.01;
  	this.group.rotation.y += 0.01;
  	this.group.rotation.z += 0.01;

  	this.renderScene();
  }

  renderScene() {
    if (this.props.kaleidoscope || this.props.colorshift) {
  		this.composer.render();	
  	} else {
  		this.renderer.render(this.scene, this.camera);
  	}
  }
  
  render() {    
    return (<div ref={(ref) => { this.container = ref; }}></div>)
  }
}



class Kaleidoscope extends React.Component {
	
	constructor(props) {
		super();
		
		this.state = Object.assign({}, defaultConfig, {
			open: true
		});
		
		this.toggleConfig = this.toggleConfig.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.renderNumberInput = this.renderNumberInput.bind(this);
		this.renderCheckboxInput = this.renderCheckboxInput.bind(this);
		
	}
	
	toggleConfig(event) {
		this.setState(function(prevState) {
			return { open: !prevState.open }
		});
	}
	
	handleInput(field, value) {
		var state = Object.assign({}, this.state);
		state[field] = value;
		this.setState(state);
	}
	
	// render
	
	renderNumberInput(field, label) {
		return (<span>
			<label htmlFor={field}>{label}</label>
			<input
				type="number"
				value={this.state[field]}
				id={field}
				data-field={field}
				onChange={(event) => { this.handleInput(field, event.target.value) }}
			/>
		</span>)
	}
	
	renderCheckboxInput(field, label) {
		return (<span>
			<input
				type="checkbox"
				checked={this.state[field]}
				id={field}
				data-field={field}
				onChange={(event) => { this.handleInput(field, event.target.checked) }}
			/>
			<label htmlFor={field}>{label}</label>
		</span>)
	}
	
	renderConfig() {
		let className = this.state.open ? 'open' : 'closed';
		
		return (<aside id="config" className={className}>
			<a className="action" onClick={this.toggleConfig}>
				<svg width="24" height="24" viewBox="0 0 24 24">
					<title>Options</title>
					<path fill="#FFF" d="M3 4h5q0.57 0 0.867 0.5l7.711 13.5h4.422q0.414 0 0.707 0.293t0.293 0.707-0.293 0.707-0.707 0.293h-5q-0.57 0-0.867-0.5l-7.711-13.5h-4.422q-0.414 0-0.707-0.293t-0.293-0.707 0.293-0.707 0.707-0.293zM14 4h5q0.414 0 0.707 0.293t0.293 0.707-0.293 0.707-0.707 0.293h-5q-0.414 0-0.707-0.293t-0.293-0.707 0.293-0.707 0.707-0.293z"></path>
				</svg>
			</a>
			<h1>config</h1>
			<form>
				<p>3d</p>
				{this.renderNumberInput('number', 'number of objects')}
				{this.renderNumberInput('boundaries', 'positioning boundaries')}
				{this.renderNumberInput('size', 'object size')}
				<p>kaleidoscope</p>
				{this.renderCheckboxInput('kaleidoscope', 'kaleidoscope mode')}
				{this.renderNumberInput('sides', 'number of sides')}
				{this.renderNumberInput('angle', 'kaleidoscope angle')}
				<p>style</p>
				{this.renderCheckboxInput('colorshift', 'rgb color shift')}
				{/*this.renderCheckboxInput('flatshading', 'flat shading')*/}
				{this.renderCheckboxInput('wireframe', 'wireframe mode')}
				{this.renderCheckboxInput('space', 'space mode')}
			</form>
		</aside>);
	}
	
	render() {
		let canvasProps = Object.assign({}, this.state);
		delete canvasProps.open;
		delete canvasProps.space;
		
		let classNames = ['kaleidoscopeContainer', (this.state.space ? 'spaceBackground' : '')].join(' ');
		
		return (<div className={classNames}>
			{this.renderConfig()}
			<Canvas {...canvasProps} />
		</div>);
	}
	
}


ReactDOM.render(<Kaleidoscope />, document.getElementById('react-container'));

