console.clear();

/**
 * TODO:
 *
 * - Handle pauses / tab defocus
 * - Better touch controls
 * - Responsive layout & UI
 * - More efficient matching routine
 * - Shorter explode/drop-lock time
 * - Hiscore (via LocalStorage)
 * - Music + SFX
 *
**/

// 'Utils' object available - see https://codepen.io/njmcode/pen/doPJLM.js

var dc = document.getElementById('output'),
    dctx = dc.getContext('2d');

var c = document.createElement('canvas'),
    ctx = c.getContext('2d');
c.width = dc.width;
c.height = dc.height;

var CX = Math.round(c.width * 0.5),
    CY = Math.round(c.height * 0.5);

var FPS = 70,
    frameDuration = 1000 / FPS;

/**
 *
 * Model for the game.  Tracks blocks, play grid, timing, scoring etc.
 * Also checks for matches and clears/updates blocks.
 *
 **/
var Game = (function() {

    var BASE_SPEED = 0.001,
        INIT_DROPTIME = 0.8;

    var SCORING = {
        dropPlaced: 10,
        matched: 500
    };

    var _dropTimer = 0;

    var Game = {
        rows: 20,
        cols: 10,
        dropTime: INIT_DROPTIME,
        dropsPerSpeedup: 10,
        colors: ['transparent', 'LightSlateGray', 'GreenYellow', 'DeepSkyBlue', 'Salmon', 'GoldenRod'],

        isPlaying: false,
        score: 0,

        grid: [],
        currentPiece: null,
        nextPiece: null,
        pieceCount: 0,

        startTime: 0,
        endTime: 0,

        destroyList: [],

        hasTouch: false
    };

    /**
     *
     * Private methods
     *
     **/

    // Return a new random piece, positioned at the spawn point
    function _generatePiece() {
        var colors = [];
        for (var i = 0; i < 3; i++) {
            colors.push(Utils.getRndInt(1, Game.colors.length - 1));
        }
        return {
            colors: colors,
            x: 4,
            y: 0
        };
    }

    // Spawn the current piece and queue the next one
    function _spawnPiece() {
        if (Game.nextPiece) {
            Game.currentPiece = Object.create(Game.nextPiece);
            Game.pieceCount++;
        }
        Game.nextPiece = _generatePiece();
    }

    // Return the lowest free index in a given column (0 = top row)
    function _getColHeight(x) {
        var ridx = Game.rows - 1;
        while (Game.grid[ridx][x] > 0) {
            ridx--;
        }
        return ridx;
    }

    // Process the grid and drop any blocks which have empty space under them
    function _doFullGravity() {
        var y;
        for (var x = 0; x < Game.cols; x++) {
            var emptycount = 0,
                tmpArr = [];
            for (y = 0; y < Game.rows; y++) {
                if (Game.grid[y][x] > 0) {
                    tmpArr.push(Game.grid[y][x]);
                } else {
                    emptycount++;
                }
            }
            for (var i = 0; i < emptycount; i++) {
                tmpArr.unshift(0);
            }
            for (y = 0; y < Game.rows; y++) {
                Game.grid[y][x] = tmpArr[y];
            }
        }
    }

    // Removes duplicates from a given array
    function unique(array) {
        return array.filter(function(el, index, arr) {
            return index == arr.indexOf(el);
        });
    }

    // Finds any row and column matches (i.e. 3 or more of the same colour)
    // from the given xy position, and returns an array of unique IDs for
    // those cells.
    function _findNearbyMatchingTrios(color, x, y) {
        // Check occupied cells only
        if (color === 0) return [];

        var _matches = [],
            allMatches = [],
            axes = {
                'v': {
                    initial: y,
                    max: Game.rows - 1
                },
                'h': {
                    initial: x,
                    max: Game.cols - 1
                }
            };

        // Check vertically and horizontally from the given position
        ['v', 'h'].forEach(function(axis) {
            _matches = [];
            // Check either side of the target cell
            [-1, 1].forEach(function(dir) {

                var i = axes[axis].initial,
                    outOfMatches = false;

                // Keep checking in this direction as long as we keep finding cells which match
                // the current cell's color, and we don't hit the edges of the grid.  
                // Add what we find to a 'matching' list
                while (!outOfMatches && i >= 0 && i <= axes[axis].max) {
                    var _targetCell = (axis === 'v') ? Game.grid[i][x] : Game.grid[y][i];

                    if (_targetCell > 0 && _targetCell === color) {
                        // Create a UID for the current cell so we can easily de-dupe later
                        var _cid = (axis === 'v') ? (i * Game.rows) + x : (y * Game.rows) + i;
                        if (_matches.indexOf(_cid) === -1) _matches.push(_cid);
                        i += dir;
                    } else {
                        outOfMatches = true;
                    }
                }
            });
            // If we've found 3 or more matches, add them to the list
            if (_matches.length >= 3) {
                allMatches = allMatches.concat(_matches);
            }
        });

        return allMatches;
    }

    /**
     *
     * Public methods
     *
     **/

    Game._test = function() {
        Game.init();
        this.grid[Game.rows - 1][0] = 1;
        this.grid[Game.rows - 2][0] = 1;
        this.grid[Game.rows - 3][0] = 1;
        var matches = _findNearbyMatchingTrios(1, 0, Game.rows - 1);
        console.assert(matches.length === 3, matches, 'Game should match 3 in a column');

        console.info('All tests passed');
        Game.init();
    };

    Game.init = function() {

        // Create empty grid
        this.grid = [];
        for (var y = 0; y < this.rows; y++) {
            this.grid[y] = [];
            for (var x = 0; x < this.cols; x++) {
                this.grid[y][x] = 0;
            }
        }

        // Init spawns
        this.destroyList = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.pieceCount = 0;
    };

    Game.start = function() {
        // start
        this.score = 0;
        this.dropTime = INIT_DROPTIME;
        _dropTimer = Date.now() * BASE_SPEED;
        this.startTime = Date.now();
        this.isPlaying = true;
    };

    Game.update = function() {
        if (!this.isPlaying) return false;

        // Act only if we're ready for the next 'tick'
        var t = Date.now() * BASE_SPEED;
        if (t - _dropTimer < this.dropTime) return;

        _dropTimer = Date.now() * BASE_SPEED;

        // Handle the current piece in play
        if (this.currentPiece) {

            // Check for the current piece hitting blocks below it
            var isCollided = (this.currentPiece.y + 2 == _getColHeight(this.currentPiece.x));
            if (isCollided) {
                // Add piece blocks to the game grid
                this.currentPiece.colors.forEach(function(color, idx) {
                    Game.grid[Game.currentPiece.y + idx][Game.currentPiece.x] = color;
                });

                // Update score for a placed piece, and destroy the active piece
                this.score += SCORING.dropPlaced;
                this.currentPiece = null;
                //_dropTimer -= 99999999999;

            } else {
                // Drop the current piece 1 row if there's room
                this.currentPiece.y++;
            }
        } else {
            // Trigger falling on any blocks with space under them
            _doFullGravity();

            // Iterate the board and test for matching colours in horizontal
            // and vertical directions.  If 3 or more in a given direction match,
            // mark them for destruction.
            this.destroyList = [];
            for (var y = 0; y < this.rows; y++) {
                for (var x = 0; x < this.cols; x++) {
                    var cell = this.grid[y][x];

                    var matches = _findNearbyMatchingTrios(cell, x, y);
                    if (matches.length) this.destroyList = this.destroyList.concat(matches);
                }
            }

            // Handle any cells marked for destruction.
            // We don't clear the 'destroyList' yet so we can use it in rendering.
            // We also don't spawn a new piece until everything has been destroyed,
            // allowing for cascade/chain-reactions after gravity has been applied.
            if (this.destroyList.length > 0) {
                this.destroyList = unique(this.destroyList);
                this.destroyList.forEach(function(cid) {
                    // Calc xy from the UID of the destroyed cell,
                    // and mark it as blank
                    var x = cid % Game.rows,
                        y = Math.floor(cid / Game.rows);
                    Game.grid[y][x] = 0;
                });
                // Update the score: base score for destroying 3 blocks,
                // plus a bonus multipler for more than 3
                this.score += SCORING.matched + (SCORING.matched * (this.destroyList.length - 3));
            } else {
                // If we have nothing to destroy, spawn the next piece
                _spawnPiece();

                // End the game if we have no room to spawn properly
                if (_getColHeight(4) <= 2) {
                    console.log('GAME OVER');
                    this.endTime = Date.now();
                    this.isPlaying = false;
                    return;
                }

                // If we've spawned enough pieces, speed the game up by 5%
                if (this.pieceCount % this.dropsPerSpeedup === 0) {
                    console.log('Speed up!');
                    this.dropTime = Math.max(this.dropTime * 0.95, 0.1);
                }
            }
        }
    };

    // Cycle the current piece's colours
    Game.cyclePiece = function() {
        if (!this.isPlaying || !this.currentPiece) return false;
        this.currentPiece.colors.unshift(this.currentPiece.colors.pop());
    };

    // Move the current piece left or right if nothing's in the way
    Game.movePiece = function(dir) {
        if (!this.isPlaying || !this.currentPiece) return false;
        if (this.currentPiece.x + dir < 0 || this.currentPiece.x + dir >= this.cols) return false;
        if (_getColHeight(this.currentPiece.x + dir) < this.currentPiece.y + 2) return false;
        this.currentPiece.x += dir;
    };

    // Immediately move the piece as far down as it can go
    Game.dropPiece = function() {
        if (!this.isPlaying || !this.currentPiece) return false;
        this.currentPiece.y = _getColHeight(this.currentPiece.x) - 2;
    };

    return Game;

})();

/**
 *
 * Handles keypresses and touch events during the game.
 *
 **/

var Controls = (function() {

    var KEYS = {
        'left': 37, // LEFT
        'right': 39, // RIGHT
        'drop': 40, // DOWN
        'cycle': 38, // UP
        'cycleAlt': 32 // SPACE
    };

    function init() {
        // Bind keyboard controls
        $(window).on('keydown', function(e) {
            e.preventDefault();
            var k = e.keyCode || e.which;
            switch (k) {
                case KEYS.cycle:
                    Game.cyclePiece();
                    break;
                case KEYS.cycleAlt:
                    if (Game.isPlaying) {
                        Game.cyclePiece();
                    } else {
                        Game.init();
                        Game.start();
                    }
                    break;
                case KEYS.left:
                    Game.movePiece(-1);
                    break;
                case KEYS.right:
                    Game.movePiece(1);
                    break;
                case KEYS.drop:
                    Game.dropPiece();
                    break;
                default:
                    break;
            }
        });

        // Bind touch controls if present.
        if (!!('ontouchstart' in window)) {
            Game.hasTouch = true;

            dc.addEventListener('touchstart', function(e) {

                e.preventDefault();

                // Tap anywhere to start game
                if (!Game.isPlaying) {
                    Game.init();
                    Game.start();
                    return;
                }

                var touch = e.changedTouches[0],
                    x = touch.pageX - c.offsetLeft,
                    y = touch.pageY - c.offsetTop;

                // top-left: drop piece
                if (x < CX && y < CY) {
                    Game.dropPiece();
                }

                // top-right: cycle piece
                if (x > CX && y < CY) {
                    Game.cyclePiece();
                }

                // bottom-left: move piece left
                if (x < CX && y > CY) {
                    Game.movePiece(-1);
                }

                // bottom-right: move piece right
                if (x > CX && y > CY) {
                    Game.movePiece(1);
                }

            }, false);
        }
    }

    return {
        init: init
    };

})();

/**
 *
 * Handles all game rendering. Draws the grid, moveable piece,
 * score, and some superfluous demoscene eye candy type shit.
 *
 **/

var Display = (function() {

    var CELL_SPACING = 1,
        NUM_STARS = 50,
        CELL_SIZE = Math.floor((c.height / Game.rows) * 0.95),
        DRAW_X = CX - (Math.floor(Game.cols * 0.5) * (CELL_SIZE + CELL_SPACING)),
        DRAW_X2 = CX + (Math.floor(Game.cols * 0.5) * (CELL_SIZE + CELL_SPACING)),
        DRAW_Y = CY - (Math.floor(Game.rows * 0.5) * (CELL_SIZE + CELL_SPACING));

    var Display = {};

    var _stars = [];

    /**
     *
     * Private methods
     *
     **/

    // Render a block at a given co-ord and colour.
    // if isExploding is true, renders a random burst of rectangles instead
    function _drawCell(cidx, x, y, isExploding) {
        var px = DRAW_X + (CELL_SPACING + CELL_SIZE) * x,
            py = DRAW_Y + (CELL_SPACING + CELL_SIZE) * y;

        if (isExploding) {
            // random colour burst
            ctx.fillStyle = Utils.getRndHexColor();
            px += Utils.getRndInt(2, CELL_SIZE - 8);
            py += Utils.getRndInt(2, CELL_SIZE - 8);
            var rs = Utils.getRndInt(1, 6);
            ctx.fillRect(px, py, rs, rs);
        } else if (cidx > 0) {
            // standard colour block with bevel
            ctx.fillStyle = Game.colors[cidx];
            ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
            
            var g = ctx.createLinearGradient(px, py, px + CELL_SIZE, py + CELL_SIZE);
            g.addColorStop(0, 'rgba(255,255,255,0.6)');
            g.addColorStop(1, 'rgba(0,0,0,0.6)');
            ctx.fillStyle = g;
            ctx.fillRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        }
    }

    // Applies a random co-ord and velocity to a given object.
    // Used for the bg starfield
    function _initStar(star) {
        star.y = Utils.getRndInt(0, c.height);
        star.x = DRAW_X2 + Utils.getRndInt(0, 100);
        star.s = Utils.getRndInt(1, 5);
    }

    /**
     *
     * Public methods
     *
     **/

    Display.init = function() {
        // init an array of star objects for tracking the bg starfield
        _stars = [];
        for (var i = 0; i < NUM_STARS; i++) {
            var st = {};
            _initStar(st);
            _stars.push(st);
        }
    };

    Display.render = function() {
        // Clear the canvas
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, c.width, c.height);

        var t = Date.now();

        // Draw pulsating bg gradient
        var g = ctx.createLinearGradient(0, CY, 0, c.height);
        g.addColorStop(0, 'black');
        g.addColorStop(1, 'rgba(0,0,100,' + Math.abs(Math.sin(t * 0.0003)) + ')');
        ctx.fillStyle = g;
        ctx.fillRect(0, CY, c.width, CY);

        // Draw side logos
        ctx.font = '70px Fredericka the Great';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        'KOLOMZ'.split('').forEach(function(char, idx) {
            // draw each char of the logo with waviness and color cycling
            // YAY MAGIC NUMBERS
            var ti = t * 0.003,
                y = 150 + (70 * idx),
                x = 75 - Math.sin(ti + (idx * 1.2)) * 10,
                r = Math.floor(Math.sin(ti + idx) * 100) + 55,
                g = Math.floor(Math.sin(ti + idx) * 100) + 55,
                b = 255;

            ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',0.5)';
            ctx.fillText(char, x, y);
            ctx.save();
            ctx.scale(-1, 1);
            ctx.fillText(char, -c.width + x, y);
            ctx.restore();
        });

        // Draw credit
        ctx.fillStyle = 'rgba(200,200,255,0.8)';
        ctx.font = '16px VT323';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText('BY @NJMCODE', c.width - 2, c.height - 2);

        // Draw touch guide symbols if needed
        if (Game.hasTouch && Game.isPlaying) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '70px monospace';
            ctx.fillText('<', 70, c.height - 100);
            ctx.fillText('>', c.width - 70, c.height - 100);
            ctx.fillText('⇩', 70, 150);
            ctx.fillText('↻', c.width - 70, 150);
        }

        // Draw starfield
        ctx.fillStyle = 'rgba(20,0,0,0.4)';
        ctx.fillRect(DRAW_X, 0, DRAW_X2 - DRAW_X, c.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        _stars.forEach(function(star) {
            star.x -= star.s;
            if (star.x > DRAW_X2) return;
            ctx.rect(star.x, star.y, 1, 1);
            if (star.x < DRAW_X) _initStar(star);
        });
        ctx.fill();

        // Draw walls of play area
        g = ctx.createLinearGradient(DRAW_X - 6, 0, DRAW_X - 6, c.height);
        g.addColorStop(0, 'LightSteelBlue');
        g.addColorStop(1, 'LightCoral');
        ctx.fillStyle = g;
        ctx.rect(DRAW_X - 6, 0, 4, c.height);
        ctx.rect(DRAW_X2 + 1, 0, 4, c.height);
        ctx.fill();

        // Draw next piece indicator
        ctx.font = '20px VT323';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'white';

        if (Game.nextPiece) {
            ctx.textAlign = 'left';
            ctx.fillText('NEXT >>', 10, 10);
            Game.nextPiece.colors.forEach(function(color, idx) {
                _drawCell(color, -2, idx);
            });
        }

        // Draw score
        ctx.fillStyle = 'white';
        ctx.textAlign = 'right';
        ctx.fillText('SCORE', c.width - 10, 10);
        ctx.fillStyle = Utils.getRndHexColor();
        ctx.font = '30px VT323';
        ctx.fillText(Game.score, c.width - 10, 30);

        // Draw placed blocks
        for (var y = 0; y < Game.rows; y++) {
            for (var x = 0; x < Game.cols; x++) {
                _drawCell(Game.grid[y][x], x, y);
            }
        }

        // Animate destroyed blocks, if any
        if (Game.destroyList.length) {
            Game.destroyList.forEach(function(cid) {
                var x = cid % Game.rows,
                    y = Math.floor(cid / Game.rows);
                _drawCell(0, x, y, true);
            });
        }

        // Draw current moveable piece
        if (Game.currentPiece) {
            var bx = Game.currentPiece.x,
                by = Game.currentPiece.y,
                cols = Game.currentPiece.colors;
            cols.forEach(function(color, idx) {
                _drawCell(color, bx, by + idx);
            });
        }

        // Draw title/game over screen if needed
        if (!Game.isPlaying) {
            
            // Draw central overlay
            ctx.fillStyle = 'rgba(30,0,60,0.4)';
            ctx.fillRect(DRAW_X, 0, DRAW_X2 - DRAW_X, c.height);
            
            // Draw big K
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle'; 
            ctx.font = '200px Fredericka the Great';
            ctx.save();
            var trans = Math.sin(t * 0.002).toFixed(2);
            ctx.translate(CX, CY - 70);
            ctx.scale(trans, 1);
            ctx.fillStyle = 'rgba(250, 200, 255, 0.2)';
            ctx.fillText('K', 0, 0);
            ctx.restore();

            // Draw main big text
            ctx.strokeStyle = 'black';
            ctx.font = '70px VT323';
            var str = (Game.score) ? 'GAME OVER' : '-KOLOMZ!-';
            str.split('').forEach(function(char, idx) {
                // draw each char of the big text with waviness and color cycling
                // YAY MOAR MAGIC NUMBERS
                var ti = t * 0.004,
                    x = CX - (30 * 4) + (30 * idx),
                    y = CY - 80 - Math.sin(ti + (idx * 0.3)) * (Math.sin(ti * 0.2) * 40),
                    r = Math.floor(Math.sin(ti + idx) * 128) + 128,
                    g = Math.floor(Math.sin(ti * 2) * 128) + 128,
                    b = 150;

                ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',1)';
                ctx.fillText(char, x, y);
                ctx.strokeText(char, x, y);
            });

            ctx.font = '30px VT323';
            
            // Draw final score
            if (Game.score) {
                ctx.fillStyle = 'white';
                ctx.fillText('SCORE: ' + Game.score, CX, CY + 80);
                ctx.fillText('SURVIVAL TIME: ' + Math.max(0, Math.round((Game.endTime - Game.startTime) / 1000)) + 's', CX, CY + 110);
            }

            // Draw start prompt
            ctx.fillStyle = (Math.sin(t * 0.04) > 0) ? 'lightseagreen' : 'lightgreen';
            str = (Game.hasTouch) ? 'TAP TO PLAY' : 'PRESS SPACE TO PLAY';
            ctx.fillText(str, CX, CY + 160);

            // Draw key controls
            if (!Game.hasTouch) {
                ctx.font = '20px VT323';
                ctx.fillStyle = 'lightblue';
                ctx.fillText('LEFT/RIGHT : MOVE', CX, CY + 200);
                ctx.fillText('UP/SPACE : CYCLE', CX, CY + 220);
                ctx.fillText('DOWN : HARD DROP', CX, CY + 240);
            }
        }

        // Blit the frame to the display canvas
        dctx.drawImage(c, 0, 0);
    };

    return Display;

})();

/**
 * Main loop
 **/

var _ft = _ct = Date.now();
function frame() {
    requestAnimationFrame(frame);
    _ct = Date.now();
    if(_ct - _ft > frameDuration) {
        Game.update(_ct);
        Display.render();
        _ft = _ct;
    }
}

// Launch
Game._test();
Game.init();
Controls.init();
Display.init();
frame();