console.clear();
class pokemortyDex {
  constructor(options) {
    try {
      this.sliderId = options.sliderId;
      this.dataURL = options.dataURL;
      this.controlsToggle = options.controlsToggle;
      this.mortySpritesheet = options.mortySpritesheet;
      this.chartWrapperId = options.chartWrapperId;
      this.filterObject = {
        badges: [0, 45],
        type: {
          rock: true,
          paper: true,
          scissors: true,
          normal: true
        }
      }
    } catch (err) {
      return console.log('Missing options: ' + err);
    }
  } 
  
  init() {    
    this.renderUI();
    this.fetch();
  }
  
  createChart() {
    const chartWrapper = document.querySelector(this.chartWrapperId);
    this.config = {
      m: { t: 20, r: 20, b: 30, l: 40 },
      w: chartWrapper.offsetWidth - 20 - 40,
      h: chartWrapper.offsetHeight - 20 - 30,
      padding: 1,
      radius: chartWrapper.offsetWidth * 0.01
    }
    this.y = d3.scaleLinear().range([this.config.h, 0])
    this.x = d3.scaleLinear().range([0, this.config.w]);
    
    this.radar = d3.select('#radar')
        .append('svg')
        .attr('width', 140)
        .attr('height', 140)
        .append('g');
    
    this.svg = d3.select(this.chartWrapperId)
        .append('svg')
        .attr('class', 'chart__svg')
        .attr('width', this.config.w + this.config.m.l + this.config.m.r)
        .attr('height', this.config.h + this.config.m.t + this.config.m.b)
        .append('g')
        .attr('transform',
          `translate(${this.config.m.l},${this.config.m.t})`
        );
    
    this.mortys = d3.select(this.chartWrapperId).append('div')
        .attr('class', 'chart__mortys')
        .append('div')
        .style('transform', `translate( ${this.config.m.l}px,${this.config.m.t}px)`)
        .style('width', `${this.config.w}px`)
        .style('height', `${this.config.h}px`);
    
    this.x.domain(d3.extent(this.data, d => d.Total));
    this.y.domain(d3.extent(this.data, d => d.XP));
    
    this.svg.append('g')
        .attr('transform', `translate(${this.config.w / 2}, 0)`)
        .append('text')
        .attr('class', 'chart__label')
        .style('text-anchor', 'middle')
        
    
    this.svg.append('g')
        .attr('class', 'chart__x chart__axis')
        .attr('transform', `translate(0, ${this.config.h})`)
        .call(d3.axisBottom(this.x))
        .append('text')
        .attr('class', 'chart__label')
        .attr('x', this.config.w)
        .attr('y', -6)
        .style('text-anchor', 'end')
        .text('Total');
    
    this.svg.append('g')
        .attr('class', 'chart__y chart__axis')
        .call(d3.axisLeft(this.y))
        .append('text')
        .attr('class', 'chart__label')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.7em')
        .style('text-anchor', 'end')
        .text('Base XP');
    
    this.nodes = this.svg.append('g')
        .attr('class', 'chart__nodes');

    this.updateChart();
    
    d3.select(window).on("resize", () => {
      $(this.chartWrapperId).html('');
      this.createChart();
    });
  }
    
  updateChart() {
    let typeCondition = false;
    const t = d3.transition().duration(750);
    const filteredData = this.data.filter((d, i) => {
      const badgeCondition = (
        d.Badges >= this.filterObject.badges[0] && 
        d.Badges <= this.filterObject.badges[1]);
      
      switch (d.Type) {
        case 'Rock': typeCondition = this.filterObject.type.rock;
        break;
        case 'Paper': typeCondition = this.filterObject.type.paper;
        break;
        case 'Scissors':typeCondition= this.filterObject.type
                                            .scissors;
        break;
        case 'Normal': typeCondition = this.filterObject.type.normal;
        break;
        default: break;
      }
      
      if (badgeCondition && typeCondition) {  return d; }
    });
    
    this.x.domain(d3.extent(filteredData, d => d.Total));
    this.y.domain(d3.extent(filteredData, d => d.XP));
    
    filteredData.forEach(d => {
      d.x = this.x(d.Total);
      d.y = this.y(d.XP);
      d.radius = this.config.radius;
    });
    
    
    this.nodes.selectAll('*').remove();
    this.mortys.selectAll('*').remove();

    const radarChartOptions = {
      w: 100,
      h: 100,
      levels: 2,
      maxValue: d3.max(this.data, d => d.Total) / 4,
      roundStrokes: true,
      color: d3.scaleOrdinal(d3.schemeCategory20c)
    };
    
    this.cells = this.nodes
        .selectAll('g')
        .data(filteredData)
      .enter()
        .append('g')
    
    this.simulation = d3.forceSimulation(this.data)
        .force('x', d3.forceX(d => d.x).strength(1))
        .force('y', d3.forceY(d => d.y).strength(1))
        .force('collide', d3.forceCollide(this.config.radius * 1.5))
        .stop();
    
    for (let i = 0; i < 100; ++i) this.simulation.tick();

    let voronoiW = [-this.config.m.l, -this.config.m.t],
        voronoiH = [+this.config.w + this.config.m.r,
                     this.config.h + this.config.m.t];
    
    this.cells.data(d3.voronoi().extent([voronoiW, voronoiH])
        .x(d => d.x)
        .y(d => d.y)
        .polygons(filteredData));
    
    this.cells
        .append('path')
        .attr('class', 'chart__voronoi')
        .attr('d', d => `M${d.join('L')}Z`)
        .on('mouseenter', (d, si) => {
          let i = d.data['#']; i = `.mortyicon-${i<=999?("00"+i).slice(-3):i}`;
          let radarData = [];
          d3.select(i).style('transform', 'scale(3)');
          d3.select(i).style('z-index', '2');
          d3.select('.chart__label').text(d.data['Name']);
          radarData.push([
            { axis: 'ATK', value: d.data['ATK'] },
            { axis: 'DEF', value: d.data['DEF'] },
            { axis: 'SPD', value: d.data['SPD'] },
            { axis: 'HP', value: d.data['HP'] }
          ]);
          d3.select("#radar").html('');
          RadarChart("#radar", radarData, radarChartOptions);
      
        })
        .on('mouseleave', (d) => {
          let i = d.data['#']; i = `.mortyicon-${i<=999?("00"+i).slice(-3):i}`;
          d3.select(i).style('transform', 'scale(1)');
          d3.select(i).style('z-index', '1');
        });
    
    // this.cells.append('circle').attr('class', 'chart__dot')
    //     .attr('r', d => d.data.radius)
    //     .attr('cx', d => d.data.x).attr('cy', d => d.data.y);
    
    this.mortys.selectAll('img')
        .data(filteredData)
        .enter()
        .append('img')
        .attr('src', this.mortySpritesheet)
        .attr('class', d => {
            let i = d['#'];
            return `mortyicon-${i<=999?("00"+i).slice(-3):i}`;
        })
        .attr('style', (d, i) => {
          let l = d.x - 6, 
              t = d.y - 7;
          
          return `left: ${l}px; top: ${t}px;`
        })
  }
  
  fetch() {
    d3.json(this.dataURL, (err, data) => {
      if (err) {
        return console.log(err);
      }
      
      this.data = data.data;
      
      this.createChart();
    });
  }

  renderUI() {
    const slider = document.querySelector(this.sliderId);
    const controlsToggle = $(this.controlsToggle);
    
    noUiSlider.create(slider, {
      start: [0, 45],
      connect: true,
      step: 1,
      range: {'min': 0, 'max': 45 },
      format: wNumb({ decimals: 0 })
    });
    
    controlsToggle.on('click', ev => {
      ev.currentTarget
          .parentNode
          .classList
          .toggle('controls--active');
    });    
    
    slider.noUiSlider.on('change', (values, handle) => {
      this.updateFilterObject('badges', values);
    });
    
    ['#normal', '#rock', '#paper', '#scissors'].forEach(id => {
      $(id).on('change', (ev) => {
        this.updateFilterObject(id.replace('#', ''), ev.currentTarget.checked);
      });
    });
  }
  
  updateFilterObject(input, values) {
    this.filteredData = this.data;
    
    if (this.data) {
      switch (input) {
        case 'badges':
          this.filterObject.badges = [+values[0], +values[1]];
          break;
        case 'rock':
        case 'paper':
        case 'scissors':
        case 'normal':
          this.filterObject.type[input] = values;
          break;
        case 'rare':
          this.filterObject.rare = values;
          break;
        default: break;
      }
    }
    
    this.updateChart();
  }
}


let pkmydex = new pokemortyDex({
  sliderId: '#badgesNumber',
  chartWrapperId: '#chart',
  controlsToggle: '#toggleControls',
  dataURL: 'file:///D:/Downloads/wbdev2-code/code/chart3/mortys.json',//'https://s3-us-west-2.amazonaws.com/s.cdpn.io/20221/mortys.json',
  mortySpritesheet: [
    'data:image/png;base64,',
    'iVBORw0KGgoAAAANSUhEUgAAAGEAAABhAQMAAAD8yF3gAAAAA1BMVEX///+',
  'nxBvIAAAAAXRSTlMAQObYZgAAABRJREFUeNpjYBgFo2AUjIJRQDkAAAVOAAF3d96LAAAAAElFTkSuQmCC'
  ].join('')
});

pkmydex.init();
