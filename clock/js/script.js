console.clear();

class PolarGantt {
	constructor() {
    this.radians = Math.PI / 180;
	}
  
  init(opt) {
    let container = d3.select(opt.sel),
        measures = container.node().getBoundingClientRect(),
        t = new Date();
  
    this.clockRadius = (measures.width * 0.8) / 2;
    this.margin = (measures.width * 0.2) / 4;
    this.width = (this.clockRadius + this.margin * 2) * 2;
    this.height = (this.clockRadius + this.margin * 2) * 2;
    this.hoursHandLength = this.clockRadius - 18;
    this.minutesHandLength = this.clockRadius / 2;
    this.secondsHandLength = this.clockRadius / 1.25;
    this.hoursTickStart = this.clockRadius;
    this.hoursTickLength = -8;
    this.hoursLabelRadius = this.clockRadius - 40;
    this.hoursLabelYOffset = 6;
    this.hoursScale = d3.scale.linear().range([0, 330]).domain([0, 23]);
    this.minutesScale = this.secondsScale = d3.scale.linear().range([0,354]).domain([0,59]);

    this.hoursData = {
  		value: t.getHours() + t.getMinutes() / 60,
	  	length: -this.hoursHandLength,
  		scale: this.hoursScale
	  };
    this.minutesData = {
      value: t.getMinutes(),
	  	length: -this.minutesHandLength,
  		scale: this.minutesScale
    }
    this.secondsData = {
      value: t.getSeconds(),
	  	length: -this.secondsHandLength,
  		scale: this.secondsScale
    }
    this.color = d3.scale.linear()
      .range(["hsl(-180,50%,50%)", "hsl(180,50%,50%)"])
      .domain([0, this._fields().length - 1])
      .interpolate(this._interpolateHsl);
    
    this._draw(container); 
    
    setInterval(() => {
    	this._updateData();
  	  this._moveHands();
    }, 1000);
  }
  
  _arc(data) {    
    let t0 = data.start.getHours() + data.start.getMinutes() / 60,
        t1 = data.end.getHours() + data.end.getMinutes() / 60,
        scale = this.hoursData.scale,
        ratio = (this.clockRadius - 8) / this._fields().length,
        padding = 0.3;
           
    let arc = d3.svg.arc()
      .startAngle(scale(t0) * this.radians)
      .endAngle(scale(t1) * this.radians)
      .innerRadius(d => (d.index + padding) * ratio)
      .outerRadius(d => (d.index - padding) * ratio + ratio)
      .cornerRadius(ratio);
    
    return arc(data);
  }
  
  _draw(container) {
    this._updateData();
    
    let svg = container.append('svg')
      .attr({
        width: this.width,
        height: this.height
      });
    
    // Lower Container
    let face = svg.append('g')
      .attr({
        id: 'clock-face',
        transform: [
          'translate(',
          this.clockRadius + this.margin * 2,
          ',',
          this.clockRadius + this.margin * 2,
          ')'].join('')
      });
    
    // Outer Arc (frame)
    face.append('path')
      .attr('d', d3.svg.arc()
      .startAngle(0)
      .endAngle(Math.PI * 2)
      .innerRadius(this.clockRadius + this.hourTickLength)
      .outerRadius(this.clockRadius))
      .style('fill', 'rgba(24, 24, 31, 0.8)');
    
    // Inner Circle (background)
    face.append('circle')
      .attr({
        cx: 0,
        cy: 0,
        r: this.clockRadius,
        fill: 'rgba(31, 30, 39, 0.8)'
      })
    
    // Ticks
    face.selectAll('.hours-tick')
      .data([0, 6, 12, 18]).enter()
			.append('line')
      .attr({
        class: 'hours-tick',
        x1: 0, x2: 0,
        y1: this.hoursTickStart,
        y2: this.hoursTickStart + this.hoursTickLength,
        transform: d => {
          let rotate = 0;
          switch (d) {
            case 6: rotate = 90; break;
            case 12: rotate = 180; break;
            case 18: rotate = 270; break;
            default: rotate = 0
          }
          return 'rotate(' + rotate + ')';
        }
      });
    
    // Ticks Labels
    
	  face.selectAll('.hours-label')
		  .data(['18H', '6H']).enter()
			.append('text')
      .attr({
        class: 'hours-label',
        'alignment-baseline': 'middle',
        'text-anchor': (d, i) => i ? 'start' : 'end',
        x: (d, i) => i ? this.width / 2 - 28: -this.width / 2 + 28,
        y: (d, i) => {
          return -this.hoursLabelRadius * 
           Math.cos(this.radians * 90);
        }
      }).text(d => d);
  
  let field = face.selectAll('g.agenda-arc')
      .data(this._fields)
      .enter()
      .append('g')
      .attr('class', 'agenda-arc');
    
    field.append("path").attr('class', 'agenda-arc-path');
    
    field.select("path")
      .attr('d', d => this._arc(d))
      .style("fill", d => this.color(d.index) );
    
  
	let hands = face.append('g').attr('id','clock-hands');

	face.append('g')
    .attr('id','face-overlay')
    .append('circle')
    .attr({
      class: 'hands-cover',
      x: 0, y: 0,
      r: this.clockRadius / 20
    });

	hands.append('line')
    .attr({
      class: 'hours-hand',
      x1: 0, y1: 0, x2: 0, y2: this.hoursData.length,
      transform: 'rotate('+ this.hoursData.scale(this.hoursData.value) +')'
    });
    
  hands.append('line')
    .attr({
      class: 'minutes-hand',
      x1: 0, y1: 0, x2: 0, y2: this.minutesData.length,
      transform: 'rotate('+ this.minutesData.scale(this.minutesData.value) +')'
    });
    
    
  hands.append('line')
    .attr({
      class: 'seconds-hand',
      x1: 0, y1: 0, x2: 0, y2: this.secondsData.length,
      transform: 'rotate('+ this.secondsData.scale(this.secondsData.value) +')'
    });
  }
  
  _fields() {
    let suffix = '2015-11-09 ';
    return [{ 
      index: 0,
      start: new Date(suffix + '03:00:00 UTC'),   // 2 PM
      end: new Date(suffix + '09:00:00 UTC')      // 3:30 PM
    },{ 
      index: 1,
      start: new Date(suffix + '09:00:00 UTC'),   // 3 PM
      end: new Date(suffix + '14:00:00 UTC')      // 6 PM
    },{
      index: 2,
      start: new Date(suffix + '11:00:00 UTC'),   // 6 PM
      end: new Date(suffix + '14:00:00 UTC')      // 10 PM
    },{
      index: 3,
      start: new Date(suffix + '12:00:00 UTC'),   // 6 PM
      end: new Date(suffix + '18:00:00 UTC')      // 10 PM
    },{
      index: 4,
      start: new Date(suffix + '16:40:00 UTC'),   // 6 PM
      end: new Date(suffix + '21:00:00 UTC')      // 10 PM
    }];
  }
  
  _moveHands() {
	  d3.select('#clock-hands .hours-hand')
      .transition()
      .ease('elastic')
      .duration(1000)
      .attr('transform', 'rotate('+ this.hoursData.scale(this.hoursData.value) +')');
    
    d3.select('#clock-hands .minutes-hand')
      .transition()
      .ease('elastic')
      .duration(1000)
      .attr('transform', 'rotate('+ this.minutesData.scale(this.minutesData.value) +')');
    
    d3.select('#clock-hands .seconds-hand')
      .transition()
      .ease('linear')
      .duration(1000)
      .attr('transform', 'rotate('+ this.secondsData.scale(this.secondsData.value) +')');
  }
  
  _interpolateHsl(a, b) {
    let i = d3.interpolateString(a, b);
    return t => d3.hsl(i(t));
  }
  
  _updateData() {
    let t = new Date();
    this.hoursData.value = t.getHours() + t.getMinutes() / 60;
    this.minutesData.value = t.getMinutes();
    this.secondsData.value = t.getSeconds();
  }
}

let polarGantt = new PolarGantt();

polarGantt.init({ sel: '#target' });