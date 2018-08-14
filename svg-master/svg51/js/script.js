var calculateArc = function(value) {
        var radius = 75;
        var x = Math.cos((2 * Math.PI)/(100/value));
        var y = Math.sin((2 * Math.PI)/(100/value));

        var longArc = (value <= 50) ? 0 : 1;

        return "M" + radius + "," + radius + " L" + radius + "," + 0 + ", A" + radius + "," + radius + " 0 " + longArc + ",1 " + (radius + y*radius) + "," + (radius - x*radius) + " z";
    },
    setPath = function(value) {
        document.querySelector('.arc').setAttribute('d', calculateArc(value));
    };

    setPath(document.querySelector('.input--range').value);

    document.querySelector('.input--range').addEventListener('input', function() {
        setPath(this.value);
    }, false);