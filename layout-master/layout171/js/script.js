class App {
	constructor(parent, options){
		Object.assign(this, {
			
		}, options);
	}
}

class Model extends App {
	constructor(){}
}

class View extends App{
	constructor(){}
}

class Controller extends App{
	constructor(){}
}



new App('#app', {});