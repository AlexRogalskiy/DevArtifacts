// Let's get our orbit on, man...
var orbit = {
    // Initialize the orbiting
    init: function(selector) {
        this.elements = document.querySelectorAll(selector || '[data-orbit]');
        
        // Set the update interval
        this.setupIntervals();
    },

    // Setup the intervals for rotating
    setupIntervals: function() {
        var self = this;
        this.elements.forEach(function(el) {
            self.update(el);
            this.interval = setInterval(function() {
                self.update(el);
            }, 5000);
        });
    },
    
    // Update the orbit rotate3d
    update: function(el) {
        var min = -1;
        var max = 1;
        
        // Get our rotate values
        var rotate = [
            (Math.floor(Math.random() * (max - min + 1)) + min)+'.'+(Math.floor(Math.random() * 9) + 1),
            (Math.floor(Math.random() * (max - min + 1)) + min)+'.'+(Math.floor(Math.random() * 9) + 1)
        ];

        // Set the transform
        el.style.webkitTransform = 'rotate3d('+rotate[0]+', '+rotate[1]+', 0, 1deg)';
        el.style.MozTransform = 'rotate3d('+rotate[0]+', '+rotate[1]+', 0, 1deg)';
        el.style.msTransform = 'rotate3d('+rotate[0]+', '+rotate[1]+', 0, 1deg)';
        el.style.OTransform = 'rotate3d('+rotate[0]+', '+rotate[1]+', 0, 1deg)';
        el.style.transform = 'rotate3d('+rotate[0]+', '+rotate[1]+', 0, 1deg)';        
    }
}

// Start it up
orbit.init();
