console.clear();

var WORDS = 'Carpenter Brut Miami Hollywood Cyber Razor 1984 Heat Summer City Infiltrator Mega Dropzone Defender Neon L.A. Angel Stereo Roland 808 Buck Power Turbo Nitro Thunder FM Cassette Night Stud Velvet Future Techno DX Transistor Cell Surrender Prophet Fairlight Jupiter Electro Venus Throttle Ferrarri Lamborghini Testarossa Cruise Atari Panther Viper Cobra Cycle Boulevard Metropolis Ninja Lipstick Violator Robotron Body Leotard Rouge Eyeshadow Filter Arpeggiator Lowpass Handheld VCR Betamax LP Burner Colecovision 2600 Omnicorp Madame Tech System Cyberdyne Bosch Trevor Tiffany Kylie Asteroid Polybius Odyssey Lazer Photon Tyrell Vinyl Arnold Magnum'

function getRndInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var RetroName = (function() {

    var words;

    function getRndArr(arr) {
        return arr[getRndInt(0, arr.length - 1)];
    }

    function generateName() {
        var numBits = getRndInt(2, 3),
            nameBits = [];

        for (i = 0; i < numBits; i++) {
            var ok = false;
            while (!ok) {
                var newbit = getRndArr(words);
                if (nameBits.indexOf(newbit) == -1) {
                    nameBits.push(newbit);
                    ok = true;
                }
            }
        }

        var name = nameBits.join(' ');
        return name;
    }

    function insertName(name) {
        $('#name, .clone').text(name);
    }

    function doRandomName() {
        var name = generateName();
        insertName(name);
    }

    function init() {
        words = WORDS.split(' ');


        for (var i = 0; i < 5; i++) {
            var ctext = $('<div>');
            ctext.addClass('clone');
            $('#clones').append(ctext);
        }

        doRandomName();

        $('#name').on('click', doRandomName);
    }

    return {
        init: init
    }
})();

var Skyline = (function() {

    var c = document.createElement('canvas'),
        ctx = c.getContext('2d');

    var NUM_BUILDINGS = 20,
        HEIGHT_VARIANTS = 4,
        MAX_HEIGHT = 200,
        WIDTH = 50,
        SPEED = -4;

    var heightSeg = Math.floor(MAX_HEIGHT / HEIGHT_VARIANTS);

    c.width = NUM_BUILDINGS * WIDTH;
    c.height = MAX_HEIGHT;

    ctx.fillStyle = 'black';

    for (var i = 0; i < NUM_BUILDINGS; i++) {
        var x = i * WIDTH,
            h = getRndInt(1, HEIGHT_VARIANTS) * heightSeg;
        ctx.fillRect(x, MAX_HEIGHT - h, WIDTH, h);
    }

    var skyline, paralayer, pos = 0;

    function update() {
        pos += SPEED;
        skyline.style.backgroundPosition = pos + 'px bottom';
        paraLayer.style.backgroundPosition = (200 + pos * 0.5) + 'px bottom';
    }

    function loop() {
        requestAnimationFrame(loop);
        update();
    }

    function init() {
        skyline = document.createElement('div');
        skyline.classList.add('skyline');
        skyline.style.backgroundImage = 'url(' + c.toDataURL() + ')';
        skyline.style.height = MAX_HEIGHT + 'px';
        document.body.appendChild(skyline);

        paraLayer = skyline.cloneNode();
        paraLayer.classList.add('para');
        document.body.appendChild(paraLayer);

        loop();
    }

    return {
        init: init
    }

})();

RetroName.init();
Skyline.init();