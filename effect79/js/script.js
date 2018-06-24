const filters = new (function () {
    const fBlur = d3.selectAll('feGaussianBlur:first-child');
    const pBlur = d3.select('feComponentTransfer + feGaussianBlur');
    const fFunc = d3.select('feFuncA[type=linear]');
    const fMatr = d3.select('feColorMatrix');
    let fComp = d3.selectAll('feComposite');
    let active;

    const ids = {
        fcd: '#component-discrete',
        fcl: '#component-linear',
        fmx: '#colormatrix'
    };
    const xmls = new XMLSerializer();
    const pre = d3.select('pre');

    this.activate = function (a) {
        active = ids[a];
        this.showSource();
    };

    this.showSource = function () {
        const source = xmls.serializeToString(d3.select(active).node())
          .replace(/>\s*</g, '><')
          .replace(/<fe/g, '\n<fe')
          .replace(/(<\/\w+>)(<\/\w+>)/g, '$1\n$2')
          .replace(/(<feFuncA|<feMergeNode)/g, '    $1')
          .trim()
        pre.text(source);
    };

    this.blur = function (deviation) {
        fBlur.attr('stdDeviation', deviation);
        this.showSource();
    };

    this.postBlur = function (deviation) {
        pBlur.attr('stdDeviation', deviation);
        this.showSource();
    };

    this.contrast = function (slope, intercept) {
        fFunc.attr('slope', slope)
            .attr('intercept', intercept);
        fMatr.attr('values', [
            "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0", 
            slope, 
            intercept
        ].join(' '));
        this.showSource();
    };

    this.combinate = function (operator) {
        fComp.remove();
        switch (operator) {
        case 'none':
            return this.showSource();
        case 'merge':
            fComp = d3.selectAll('filter')
                .append('feMerge');
            fComp.append('feMergeNode')
                .attr('in', "cutoff");
            fComp.append('feMergeNode')
                .attr('in', "SourceGraphic");
            return this.showSource();
        case 'blend':
            fComp = d3.selectAll('filter')
                .append('feBlend');
            break;
        default:
            fComp = d3.selectAll('filter')
                .append('feComposite')
                .attr('operator', operator);
            break;
        }
        fComp.attr('in', "SourceGraphic")
            .attr('in2', "cutoff");
        this.showSource();
    };
})();

const tweaks = new (function () {
    this.blur = d3.select('#blur-select');
    const check = d3.select('#blur-select input');
    this.linear = d3.select('#linear-select');
    const selects = d3.selectAll('#linear-select input');
    const slope = selects.filter('#slope');
    const intercept = selects.filter('#intercept');
    const visSlope = d3.select('#visSlope');

    this.activate = function (active) {
        this.blur.classed('inactive', active !== 'fcd');
        check.property('disabled', active !== 'fcd');
        this.linear.classed('inactive', active === 'fcd');
        selects.property('disabled', active === 'fcd');
    };

    this.limit = function () {
        const min = 1 - slope.property('value');
        intercept.attr('min', min);
        if (min > intercept.property('value')) {
            intercept.property('value', min);
        }
        return [
            slope.property('value'), 
            intercept.property('value')
        ];
    };

    this.visualize = function (slope, intercept) {
        visSlope.attr('x1', -intercept * 100 / slope)
            .attr('x2', (1 - intercept) * 100 / slope);
    };
})();

const primitives = d3.selectAll('.primitive');
const examples =  d3.selectAll('.example');
const goo = d3.selectAll('.goo');

d3.selectAll('input[name=variant]').on('change', function () {
    if (!this.checked) return;
    examples.classed('hide', true)
        .filter(this.id).classed('hide', false);
}).dispatch('change');

d3.select('#color').on('change', function () {
    primitives.classed('bw', this.checked);
}).dispatch('change');

d3.select('#filter-select').on('change', function () {
    goo.attr('class', 'goo ' + this.value);
    filters.activate(this.value);
    tweaks.activate(this.value);
}).dispatch('change');

d3.select('#deviation').on('input change', function () {
    d3.select('#devNum').text(this.value);
    filters.blur(this.value);
}).dispatch('change');

tweaks.blur.on('change', function () {
    filters.postBlur(this.checked ? 1 : 0);
}).dispatch('change');

tweaks.linear.on('change', function () {
    const params = tweaks.limit();
    tweaks.visualize.apply(tweaks, params);
    filters.contrast.apply(filters, params);
}).dispatch('change');

d3.select('#combine-select').on('change', function (e) {
  filters.combinate(this.value);
}).dispatch('change');

function tweenFactory (forth) {
    return function () {
        let interpolator;
        const node = this,
            from = forth ? 0 : 500,
            to   = forth ? 500 : 0;
        if (this instanceof SVGElement) {
            interpolator = d3.interpolateTransformSvg(
                'translate(0, ' + from + ')',
                'translate(0, ' + to + ')'
            );
            return function (t) {
                node.setAttribute("transform", interpolator(t));
            };
        } else {
            interpolator = d3.interpolateTransformCss(
                'translate(0px, ' + from + 'px)',
                'translate(0px, ' + to + 'px)'
            );
            return function (t) {
                node.style.transform = interpolator(t);
            };
        }
    };
}

d3.selectAll('.move').transition()
    .on('start', function repeat () {
        d3.active(this)
            .duration(2000)
            .ease(d3.easeSinInOut)
            .tween('forth', tweenFactory(true))
        .transition()
            .duration(2000)
            .ease(d3.easeSinInOut)
            .tween('back', tweenFactory(false))
        .transition()
            .on('start', repeat);
    });