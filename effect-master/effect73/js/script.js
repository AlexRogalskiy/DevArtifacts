class Partical {
    constructor(particalModel, stageConfig) {
        this.particalModel = particalModel;
        this.stageConfig = stageConfig;
    }
    
    isCollide(partical) {
        var dx = this.particalModel.x - partical.particalModel.x;
        var dy = this.particalModel.y - partical.particalModel.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.particalModel.boundsR + partical.particalModel.boundsR) {
            return true;
        } else {
            return false;
        }
    }
    
    render() {
        // create partical
        this.stageConfig.context.fillStyle = "#AEBF40";        
        this.stageConfig.context.beginPath();
        this.stageConfig.context.arc(
            this.particalModel.x, 
            this.particalModel.y, 
            this.particalModel.r, 
            0, 
            Math.PI * 2, false);
        
        this.stageConfig.context.fill();
        
        // create bounding circle
        this.stageConfig.context.strokeStyle = "#AEBF40";
        this.stageConfig.context.beginPath();
        this.stageConfig.context.arc(
            this.particalModel.x, 
            this.particalModel.y, 
            this.particalModel.boundsR, 
            0, 
            Math.PI * 2, false);
        // this.stageConfig.context.stroke();
    }
    
    renderConnections() {
        // draw lines to related particals
        this.particalModel.related.forEach((compare) => {
            this.stageConfig.context.lineWidth = 0.5;
            this.stageConfig.context.beginPath();
            this.stageConfig.context.moveTo(this.particalModel.x, this.particalModel.y);
            this.stageConfig.context.lineTo(compare.particalModel.x, compare.particalModel.y);
            this.stageConfig.context.stroke();
        });
    }
}

class ParticalView {
    constructor() {
        this.quant = 30;
        this.particalRadius = 2.5;
        this.particalMesh = 30;
        this.particals = [];
        
        this._setup();
        this._createParticals();
        this._render();        
    }
    
    _setup() {
        let stage = document.createElement('canvas');
        let stageWidth = stage.width = window.innerWidth;
        let stageHeight = stage.height = window.innerHeight;
        let context = stage.getContext('2d');
        let centerX = stage.width / 2;
        let centerY = stage.height / 2;
        
        this.stageConfig = {
            stage: stage,
            context: context,
            stageWidth: stageWidth,
            stageHeight: stageHeight,
            centerX: centerX,
            centerY: centerY,
            bounds: 300
        };
        
        document.body.appendChild(this.stageConfig.stage);
    }
    
    _render() {
        this._update();
        this._checkCollisions();
        this._draw();
        window.requestAnimationFrame(this._render.bind(this));
    }
    
    _createParticals() {
        for (let i = 0; i < this.quant; i++) {
            let x = this.stageConfig.centerX + ((Math.random() * (this.stageConfig.bounds * 2)) - this.stageConfig.bounds);
            let y = this.stageConfig.centerY + ((Math.random() * (this.stageConfig.bounds * 2)) - this.stageConfig.bounds);            
            let speed = 2;
            let vx = (Math.random() * speed) - (speed / 2);
            let vy = (Math.random() * speed) - (speed / 2);
            
            let particalConf = {
                r: this.particalRadius,
                x: x,
                y: y,
                vx: vx,
                vy: vy,
                boundsR: this.particalRadius * this.particalMesh,
                related: []
            };
            let partical = new Partical(particalConf, this.stageConfig);
            this.particals.push(partical);
        }
    }
    
    _update() {
        this.particals.forEach((partical) => {            

            partical.particalModel.x += partical.particalModel.vx;
            partical.particalModel.y += partical.particalModel.vy;
            
            let xMax = this.stageConfig.centerX + this.stageConfig.bounds;
            let yMax = this.stageConfig.centerY + this.stageConfig.bounds;
            let xMin = this.stageConfig.centerX - this.stageConfig.bounds;
            let yMin = this.stageConfig.centerY - this.stageConfig.bounds;
            
            if (partical.particalModel.x > xMax) {
                partical.particalModel.x = xMax;
                partical.particalModel.vx *= -1;
            } else if (partical.particalModel.x < xMin) {
                partical.particalModel.x = xMin;
                partical.particalModel.vx *= -1;
            }
            
            if (partical.particalModel.y > yMax) {
                partical.particalModel.y = yMax;
                partical.particalModel.vy *= -1;
            } else if (partical.particalModel.y < yMin) {
                partical.particalModel.y = yMin;   
                partical.particalModel.vy *= -1;
            }
        });
    }
    
    _checkCollisions() {
        this.particals.forEach((partical) => {
            // clear out previous connections
            partical.particalModel.related = [];
            
            this.particals.forEach((compare) => {
                let isCollide = partical.isCollide(compare);
                
                if (isCollide) {
                    partical.particalModel.related.push(compare);   
                }
            });
        });
    }
    
    _draw() {
        this.stageConfig.context.clearRect(0, 0, this.stageConfig.stageWidth, this.stageConfig.stageHeight);
        this.particals.forEach((partical) => {            
            partical.render();
            partical.renderConnections();
        });
    }
}

new ParticalView();