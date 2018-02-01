(function($, Highcharts) {
      var options = {
        chart: { renderTo: "customer_data" },
        title: { text: "Customer Data" },
        credits: { enabled: false }
      };

      $.getJSON('sample_data/customer_data.json', function(data) {
        var ages = [];

        $.each(data.customers, function(index, customer) {
          if (typeof ages[customer.age] === "undefined") {
            ages[customer.age] = 1;
          } else {
            ages[customer.age] += 1;
          }
        });

        var age_data = [];

        $.each(ages, function(index, e) {
          if (typeof e !== "undefined") {
            age_data.push([index, e]);
          }
        });
        options.series = [{
          type: "column",
          name: "Customer Ages",
          data: age_data
        }];

        var chart = new Highcharts.Chart(options);
      });

    })(jQuery, Highcharts);