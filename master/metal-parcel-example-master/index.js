import Component from 'metal-jsx';
import defineWebComponent from 'metal-web-component';

class App extends Component {
    render() {
        return(
            <div class="App">
                <h1 class="App-title">Metal.js</h1>
                <p class="App-subtitle">Build UI components in a solid, flexible way.</p>
            </div>
        );
    }
}

defineWebComponent('my-app', App);
