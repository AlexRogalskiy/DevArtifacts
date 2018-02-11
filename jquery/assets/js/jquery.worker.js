// Based on https://gist.github.com/3833571 with some modifications

(function($, undefined){

	// Worker method
	$.worker = function(args) { 
		
	    var def = $.Deferred();
        
        if (window.Worker) {
        	
            var url = args.file;

            // Construct the Web Worker
            var worker = new Worker(url); 

            // If the Worker closes, resolve the Deferred
            worker.onclose = function(event) {            
                def.resolve(); 
            };
            
            // If the Worker posts a message, send a notification
            worker.onmessage = function(event) {            
                def.notifyWith(event); 
            };

            // If the Worker reports an error, reject the Deferred
            worker.onerror = function(event) {
                def.reject(event); 
            };

            // Create a pointer to 'postMessage' on the Deferred
            def.postMessage = function(msg){
                worker.postMessage(msg);
            };

            def.terminate = function(){
                worker.terminate();
                def.resolve();
            };

            // If args were passed, start the worker with supplied args
            if(args.args){
                worker.postMessage(args.args); 
            }
		}
		else {
			def.reject('No worker support!');
		}
		
	    return def;
	};

})(jQuery);