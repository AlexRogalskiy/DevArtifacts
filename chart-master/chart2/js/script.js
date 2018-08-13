var config = {
  margin: [15, 10],
  width: 0,
  height: 0,
  color: d3.scale.ordinal(),
  activeControls: {'all': true}
},
    rawData = {
      "info":{
        "CDI":{
          "name": "CDI",
          "legend": "CDI, principal indicador usado para calcular os juros de CDB, LCI, LCA e outros",
          "data": [ 0.1617, 0.19, 0.1505, 0.1182, 0.1237, 0.099, 0.0974, 0.1159, 0.0841, 0.0805, 0.1077 ]
        },
        "IMA-B": {
          "name": "Inflação",
          "legend": "IMA-B, índice dos títulos públicos federais atrelados à inflação, calculado pela ANBIMA",
          "data": [ 0.1985, 0.1389, 0.2209, 0.1404, 0.1103, 0.1895, 0.1704, 0.1511, 0.2668, -0.1002, 0.1454 ]
        },
        "PTAX": {
          "name": "Dólar",
          "legend": "PTAX, a taxa média apurada com base nas operações realizadas no mercado de câmbio",
          "data": [ -0.0813, -0.1182, -0.0866, -0.1716, 0.3195, -0.2550, -0.0431, 0.1258, 0.0894, 0.1464, 0.1339 ]
        },
        "IBOV": {
          "name": "Ibovespa",
          "legend": "Índice Bovespa, composto pelas ações mais negociadas da bolsa de valores nos últimos 12 meses",
          "data": [ 0.1781, 0.2771, 0.3293, 0.4365, -0.4122, 0.8266, 0.0104, -0.1811, 0.0740, -0.1550, -0.0291 ]
        },
        "IFMM": {
          "name": "Fundos multimercado",
          "legend": "IFMM, índice de fundos multimercados calculado pelo banco BTG Pactual",
          "data": [ 0.1630, 0.1887, 0.2132, 0.1254, 0.058, 0.1685, 0.0926, 0.1116, 0.1343, 0.0934, 0.0755 ]
        },
        "Poupança Velha": {
          "name": "Poupança",
          "legend": "Poupança com a regra antiga, mais vantajosa que a atual, calculada pela Taxa Referencial (TR) + 0,5% ao mês",
          "data": [ 0.0804, 0.0919, 0.0841, 0.0798, 0.0774, 0.0709, 0.068, 0.075, 0.0658, 0.0632, 0.0702 ]
        },
        "IRFM": {
          "name": "Tesouro prefixado",
          "legend": "IRF-M, Índice dos títulos públicos federais de renda fixa prefixada, calculado pela ANBIMA",
          "data": [ 0.1544, 0.1954, 0.1830, 0.1073, 0.1388, 0.1247, 0.1187, 0.1445, 0.1430, 0.0261, 0.1140 ]
        }
      },
      "dates": [{
        "date" : "2004",
        "data": ["IMA-B", "IBOV", "IFMM", "CDI", "IRFM", "Poupança Velha", "PTAX"]
      },{
        "date": "2005",
        "data": ["IBOV", "IRFM", "CDI", "IFMM", "IMA-B", "Poupança Velha", "PTAX"]
      },{
        "date": "2006",
        "data": ["IBOV", "IMA-B", "IFMM", "IRFM", "CDI", "Poupança Velha", "PTAX"]
      },{
        "date": "2007",
        "data": ["IBOV", "IMA-B", "IFMM", "CDI", "IRFM", "Poupança Velha", "PTAX"]
      },{
        "date": "2008",
        "data": ["PTAX", "IRFM", "CDI", "IMA-B", "Poupança Velha", "IFMM", "IBOV"]
      },{
        "date": "2009",
        "data": ["IBOV", "IMA-B", "IFMM", "IRFM", "CDI", "Poupança Velha", "PTAX"]
      },{
        "date": "2010",
        "data": ["IMA-B", "IRFM", "CDI", "IFMM", "Poupança Velha", "IBOV", "PTAX"]
      },{
        "date": "2011",
        "data": ["IMA-B", "IRFM", "PTAX", "CDI", "IFMM", "Poupança Velha", "IBOV"]
      },{
        "date": "2012",
        "data": ["IMA-B", "IRFM", "IFMM", "PTAX", "CDI", "IBOV", "Poupança Velha"]
      },{
        "date": "2013",
        "data": ["PTAX", "IFMM", "CDI", "Poupança Velha", "IRFM", "IMA-B", "IBOV"]
      },{
        "date": "2014",
        "data": ["IMA-B", "PTAX", "IRFM", "CDI", "IFMM", "Poupança Velha", "IBOV"]
      }]
    };

var RankingChart = {

    init: function () {

      if (!document.contains(document.querySelector('#rankingChart'))) return;

      config.width = document.querySelector('#rankingChart').offsetWidth;
      config.height = config.width;
      config.color = d3.scale.ordinal()
          .range(['#27bdbe', '#2bd2a3', '#7c5d83', '#db5f9d', '#f37077', '#f1c40f', '#bdbdbd'])
          .domain(Object.keys(rawData.info));

      this.plot(rawData);

    },

    plot: function (data) {

        var canvas = d3.select('#rankingChart'),
            control = d3.select('#rankingControl'),
            that = this;

        control
            .append('div')
            .attr({
                class: 'ranking__control-cell',
                'data-code': 'all',
                'data-state': 'active'
            })
            .append('span')
            .attr('class', 'ranking__control-text')
            .html('Todos');

        for (var key in data.info) {
            control
                .append('div')
                .attr({
                    class: 'ranking__control-cell',
                    'data-code': key,
                    'data-state': 'inactive'
                })
                .append('span')
                .attr('class', 'ranking__control-text')
                .html(data.info[key].name);
        }

        d3.selectAll('.ranking__control-cell')
            .on('click', function () {
                that.onControlClick(this);
            });

        for (var rowIndex = 0; rowIndex < data.dates.length; rowIndex++) {
            var row = canvas
                .append('div')
                .attr('class', 'ranking__row');

            for (var colIndex = 0; colIndex < data.dates[rowIndex].data.length; colIndex++) {

                var code = data.dates[rowIndex].data[colIndex],
                    year = data.dates[rowIndex].date,
                    value = data.info[data.dates[rowIndex].data[colIndex]].data[rowIndex],
                    name = data.info[data.dates[rowIndex].data[colIndex]].name;

                var cell = row.append('div')
                    .attr({
                        class: 'ranking__cell',
                        'data-value': value,
                        'data-year': year,
                        'data-code': code,
                        'data-state': 'inactive'
                    })
                    .style('background', config.color(code))
                    .on('mouseover', function () {
                        that.onMouseover(this);
                    })
                    .on('mouseleave', function () {
                        that.onMouseout(this);
                    })
                    .on('click', function () {
                        that.onCellClick(this);
                    });

                var format = d3.format('.2%'),
                    infoString = [
                        name,
                        '<br/>',
                        format(value)
                    ].join('');

                var info = cell.append('span')
                    .attr('class', 'ranking__cell-info')
                    .html(infoString);
            }
        }

    },

    onMouseover: function (target) {
        document.querySelector('.ranking__control-cell[data-code="all"]').dataset.state = 'active';
        config.activeControls = {all: true};
        this.toggleControls();
        this.toggleUnfocused(target.dataset.code);

    },

    onMouseout: function (target) {
        this.toggleDefault();
    },

    onCellClick: function (target) {
        this.toggleDefault();
        this.toggleActive(target);
    },

    onControlClick: function (target) {
        var code = target.dataset.code;
        var codes;

        if (target.dataset.code === 'all') {
            config.activeControls = {all: true};
            this.toggleDefault();
            this.toggleControls();
            return;
        }
        else {
            document.querySelector('.ranking__control-cell[data-code="all"]').dataset.state = 'inactive';
            config.activeControls.all = false;
        }

        config.activeControls[code] = !config.activeControls[code];
        codes = Object.keys(config.activeControls).map(function (key) {
            if (config.activeControls[key]) {
                return key;
            }
            return undefined;
        }).filter(function (item) {
            return !!item;
        });

        this.toggleUnfocused(codes);
        this.toggleControls();
    },

    toggleControls: function () {
        var active = Object.keys(config.activeControls).map(function (item) {
            if (config.activeControls[item]) {
                return item;
            }

            return false;
        }).filter(function (item) {
            return !!item;
        });

        var selector = '*';

        [].forEach.call(
            document.querySelectorAll('.ranking__control-cell'),
            function (el) {
                el.dataset.state = 'inactive';
        });

        if (active.length > 0 && active.length < 7) {
            selector = active.map(function (item) {
                return '.ranking__control-cell[data-code="' + item + '"]';
            }).join(',');
        }

        else {
          selector = '.ranking__control-cell[data-code="all"]';
          this.toggleDefault();
        }

        [].forEach.call(
            document.querySelectorAll(selector),
            function (el) {
                el.dataset.state = 'active';
        });
    },

    toggleDefault: function () {
        [].forEach.call(
            document.querySelectorAll('.ranking__cell'),
            function (el) {
                el.className = 'ranking__cell';
            }
        );
    },

    toggleActive: function (target) {
        if (target.dataset.active === 'active') {
            target.dataset.active = 'inactive';
            this.toggleDefault();
        }
        else {
            target.dataset.active = 'active';
            target.className = 'ranking__cell ranking__cell--active';
            this.toggleUnfocused(target.dataset.code);
        }
    },

    toggleUnfocused: function (codes) {
        if (typeof codes === 'string') {
            codes = [codes];
        }

        codes = codes.map(function (code) {
            return ':not([data-code="' + code + '"])';
        }).join('');

        [].forEach.call(
            document.querySelectorAll('.ranking__cell--unfocused'),
            function (el) {
                el.classList.toggle('ranking__cell--unfocused');
            }
        );

        [].forEach.call(
            document.querySelectorAll('.ranking__cell' + codes),
            function (el) {
                el.className = 'ranking__cell ranking__cell--unfocused';
            }
        );
    }
};

RankingChart.init();
