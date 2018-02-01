    (function($, Highcharts){
      var chartOptions = {};

      chartOptions.chart = { renderTo: "pie_chart" };
      chartOptions.title = { text: "A sample pie chart" };

      chartOptions.series = [{
        type: "pie",
        name: "Sample chart",
        data: [
          ["Section 1", 30],
          ["Section 2", 50],
          ["Section 3", 20]
        ]
      }];

      var pieChartOptions = {
        dataLabels: {
          style: { fontSize: 20 },
          connectorWidth: 3,
          formatter: function() {
            var label = this.point.name + " : " + this.percentage + "%";
            return label;
          }
        }
      };

      chartOptions.plotOptions = { pie: pieChartOptions };

      var chart = new Highcharts.Chart(chartOptions);

    })(jQuery, Highcharts);