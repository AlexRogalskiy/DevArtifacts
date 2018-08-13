var taxBurden = {
  
  nodes: {
    year: document.querySelector('#year'),
    name: document.querySelector('#name'),
    thumbnail: document.querySelector('#thumbnail'),
    percentage: document.querySelector('#percentage'),
    container: document.querySelector('#taxBurden'),
    data: document.querySelector('#data')
  },

  config: {
    w: 0,
    h: 0,
    m: 20,
    x: d3.time.scale().domain([new Date(1947,1,1), new Date(2014,1,1)]),
    y: d3.scale.linear().domain([13.8, 40]),
    data: null
  },
  
  components: {
    axis: d3.svg.axis().orient("bottom").outerTickSize(0),
    line: d3.svg.line().interpolate("step-after")
			.x(function (d) { return taxBurden.config.x(d.Ano); })
			.y(function (d) { return taxBurden.config.y(d.Carga); })
  },
  
  formatDate: d3.time.format("%Y"),
  
  parseDate: d3.time.format("%Y").parse,
  
  bisectDate: d3.bisector(function (d) { return d.Ano; }).left,
    
  init: function () {
    var resizeTimer;

    window.onresize = function () {
    	clearTimeout(resizeTimer);
	    resizeTimer = setTimeout(this.update.bind(this), 100);
  	}.bind(this);
  
    this.setMeasures();
		this.setData();
    this.plot();
  },

  setData: function () {
    this.config.data = d3.csv.parse(this.nodes.data.innerHTML);
    this.config.data.forEach(function(d) {
			d.Ano = this.parseDate(d.Ano);
			d.Carga = +d.Carga;
			d.Presidente = d.Presidente;
			d.Classe = d.Classe;
		}.bind(this));
  },
  
  setMeasures: function () {
    this.config.w = this.nodes.container.offsetWidth;
    this.config.h = this.nodes.container.offsetHeight;
    this.config.x = this.config.x.range([0, this.config.w]);
    this.config.y = this.config.y.range([this.config.h - this.config.m, 0]);  
    this.components.axis = this.components.axis.scale(this.config.x);
  },
  
  update: function () {
    this.setMeasures();
    
		d3.select(this.nodes.container).select('svg')
      .attr({
      	width: this.config.w      
	    });
    
    d3.select('.tax-burden__axis')
    	.transition()
    	.call(this.components.axis);
        
    d3.select('.tax-burden__overlay')
    	.attr({
      	height: this.config.h,
      	width: this.config.w
	    });
    
    d3.select('.tax-burden__line')
      .attr('d', '')
    	.attr('d', this.components.line);
    
  },
  
  plot: function () {
		var svg = d3.select(this.nodes.container)
    	.append('svg')
    	.attr({
        height: this.config.h,
        width: this.config.w
      });
    
    svg.append('g')
      .attr({
  			class: 'tax-burden__axis',
      	transform: ['translate(0,', this.config.h - this.config.m ,')'].join('')
	    })
			.call(this.components.axis);

    var linearGradient = svg.append('defs')
    	.append('linearGradient')
	    .attr('id', 'gradient');
		
    linearGradient
      .append("stop")
      .attr("stop-color", "#008000");

		linearGradient
			.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", "#c83a22");
    
    var path = svg.append('path')
    	.datum(this.config.data)
    	.attr({
        class: 'tax-burden__line',
        d: this.components.line,
        stroke: 'url(#gradient)'
      });
    
    var totalLength = path.node().getTotalLength();
    
    path.attr({
      'stroke-dasharray': [totalLength, totalLength].join(','),
      'stroke-dashoffset': totalLength
    })
    .transition().duration(3000).ease('linear')
    .attr('stroke-dashoffset', 0);
    
    var focus = svg.append('g')
    	.attr('class', 'tax-burden__focus');

    focus.append('line')
    	.attr({
  			class: 'tax-burden__focus-x',
      	y1: this.config.h - 20,
      	y2: 0
	    });
    
    focus.append('circle')
    	.attr({
  			class: 'tax-burden__focus-circle',
      	r: 4
	    });
    
    svg.append('rect')
    	.attr({
				class: 'tax-burden__overlay',
      	width: this.config.w,
      	height: this.config.h
	    })
    	.on({
  			mouseover: function() { focus.style('display', 'initial'); },
      	mouseout: function() { focus.style('display', 'none'); },
      	mousemove: taxBurden.mousemove
	    });
  },
  
  mousemove: function () {
	    var self = taxBurden,
					x0 = self.config.x.invert(d3.mouse(this)[0]),
					i = self.bisectDate(taxBurden.config.data, x0, 1),
					d0 = self.config.data[i - 1],
					d1 = self.config.data[i],
					d = x0 - d0.Ano > d1.Ano - x0 ? d1 : d0,
          focus = d3.select('.tax-burden__focus');

			focus.select("circle")
        .attr("transform", 
              ['translate(', self.config.x(d.Ano), ',', self.config.y(d.Carga), ')'].join(''));
		
			focus.select(".tax-burden__focus-x")
      	.attr({
  				transform: ['translate(', self.config.x(d.Ano), ',0)'].join(''),
        	y2: self.config.y(d.Carga)
	      });

    	focus.select(".tax-burden__focus-y")
        .attr({
        	transform: ['translate(0,', self.config.y(d.Carga), ')'].join(''),
        	x2: self.config.x(d.Ano)
	      })

      
      self.nodes.year.innerHTML = self.formatDate(d.Ano);
    	self.nodes.name.innerHTML = d.Presidente;
    	self.nodes.percentage.innerHTML = d.Carga + '%';
    	self.nodes.thumbnail.className = 'tax-burden__thumbnail '+ d.Classe;
  }
};

taxBurden.init();
