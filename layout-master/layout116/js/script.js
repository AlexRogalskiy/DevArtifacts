$(function(){
	$("nav.main header a, nav.main a.open").click(function(e){
		e.preventDefault();
		$("nav, main, footer").toggleClass("collapsed");

		setTimeout(function() {
			$(window).trigger("throttledresize", true);
		}, 410);
	});

/* Start data generation and handling */
	function formatData(data, type) {
		dataTemp = {
			date: [],
			count: data.count
		};
		var dataOut = [],
			ticks = [];

		if (type == "hourly") {
			var range = moment().range(moment(data.daterange[0], "M-D-YY hh:mm"), moment(data.daterange[1], "M-D-YY hh:mm"));

			range.by(moment().range(moment(data.daterange[0], "M-D-YY hh:mm"), moment(data.daterange[0], "M-D-YY hh:mm").add("hours", 1)), function(m) {
				dataTemp.date.push(m.valueOf());
				ticks.push([m.valueOf(), m.format("h:00 A")]);
			});
		}
		else {
			var range = moment().range(moment(data.daterange[0], "M-D-YY"), moment(data.daterange[1], "M-D-YY"));

			range.by(moment().range(moment(data.daterange[0], "M-D-YY"), moment(data.daterange[0], "M-D-YY").add("days", 1)), function(m) {
				dataTemp.date.push(m.valueOf());
				ticks.push([m.valueOf(), m.format("MMM D")]);
			});
		}

		num = dataTemp.count.length;

		for (var i = 0; i < num; i++) {
			dataOut.push([dataTemp.date[i], dataTemp.count[i]]);
		}


		var units = Math.pow(10, Math.floor(Math.log(Math.max.apply(Math, data.count)) / Math.log(10))),
			maxVal = Math.ceil(Math.max.apply(Math, data.count) / units) * units;

		return [dataOut, ticks, maxVal];
	}

	function yticks(axis) {
		var units = Math.pow(10, Math.floor(Math.log(axis.datamax) / Math.log(10))),
			maxScale = Math.ceil(axis.datamax / units) * units,
			values = [];

		while (maxScale / 4 !== Math.round(maxScale / 4)) maxScale++;

		values.push([maxScale, (maxScale).toLocaleString()]);
		values.push([(maxScale * 3) / 4, ((maxScale * 3) / 4).toLocaleString()]);
		values.push([(maxScale * 2) / 4, ((maxScale * 2) / 4).toLocaleString()]);
		values.push([(maxScale) / 4, (maxScale / 4).toLocaleString()]);
		values.push([0, "0"]);

		return values;
	}

	function plotResize(chart) {
		var labels = $(chart).find(".flot-x-axis div"),
			numLabels = labels.length,
			centerLabel = Math.ceil(numLabels / 2) - 1,
			centerElm = $(chart).find(".flot-x-axis div").eq(centerLabel),
			after = centerElm.nextAll("div"),
			before = centerElm.prevAll("div"),
			maxWidth = 0,
			maxLabels = 0,
			finalLabels = {},
			totalWidth = $(chart).find(".flot-x-axis")[0].offsetWidth;

		totalWidth = totalWidth - parseInt(labels[0].style.left) - (totalWidth - (parseInt(labels.last()[0].style.left) + labels.last()[0].offsetWidth));

		labels.css("display", "").each(function() {
			w = this.offsetWidth;

			if (w > maxWidth) {
				maxWidth = w;
			}
		});

		maxWidth += 28;

		maxLabels = Math.round(totalWidth / maxWidth);

		finalLabels[Math.round(numLabels * 1/2)] = function(i) { return (i != 0 && (Math.abs(i) + 1) % 2 != 1); };
		finalLabels[Math.round(numLabels * 1/3)] = function(i) { return (i != 0 && (Math.abs(i) + 1) % 3 != 1); };
		finalLabels[Math.round(numLabels * 1/4)] = function(i) { return (i != 0 && (Math.abs(i) + 1) % 4 != 1); };
		finalLabels[Math.round(numLabels * 1/5)] = function(i) { return (i != 0 && (Math.abs(i) + 1) % 5 != 1); };
		finalLabels[Math.round(numLabels * 1/6)] = function(i) { return (i != 0 && (Math.abs(i) + 1) % 6 != 1); };
		finalLabels[Math.round(numLabels * 1/7)] = function(i) { return (i != 0 && (Math.abs(i) + 1) % 7 != 1); };
		finalLabels[0] = function(i) { return (i != 0 && (Math.abs(i) + 1) % 7 != 1); };

		while (typeof finalLabels[maxLabels] == "undefined") maxLabels--;

		labels.each(function(i, e) {
			i = i - centerLabel;

			if (finalLabels[maxLabels](i)) e.style.display = "none";
		});

		al = after.length;
		bl = before.length;

		if (al - bl == 1) after.last()[0].style.display = "none";
		else if (bl - al == 1) before.last()[0].style.display = "none";
	}

	function lineChart(elm, idata, label, color, type) {
		var data = formatData(idata, type);

		chart = $.plot(elm, [
			{
				label: label,
				data: data[0]
			}
		], {
			series: {
				points: {
					show: true,
					fillColor: color,
					radius: 4,
					lineWidth: 1,
					strokeColor: "#FFF"
				},
				splines: {
					show: true,
					tension: 0.3,
					lineWidth: 3
				}
			},
			xaxis: {
				tickLength: 0,
				ticks: data[1],
				font: {
					size: 11,
					lineHeight: 13,
					family: "Arial, sans-serif",
					color: "#888"
				}
			},
			yaxis: {
				font: {
					size: 11,
					lineHeight: 13,
					family: "Arial, sans-serif",
					color: "#888"
				},
				tickFormatter: function(y) { return y.toLocaleString(); },
				min: 0,
				max: data[2],
				ticks: yticks
			},
			colors: [color],
			shadowSize: 0,
			tooltip: true,
			tooltipOpts: {
				content: function(label, x, y) {
					if (type == "hourly") return '<div class="hover-title">' + moment(x).format("dddd, MMMM Do YYYY h:00 A") + '</div><b style="color:' + color + '">' + y.toLocaleString() + " </b><span>" + label.toLowerCase() + "</span>";
					return '<div class="hover-title">' + moment(x).format("dddd, MMMM Do YYYY") + '</div><b style="color:' + color + '">' + y.toLocaleString() + " </b><span>" + label.toLowerCase() + "</span>";
				}
			},
			grid: {
				hoverable: true,
				borderWidth: 0,
				margin: 1,
				mouseActiveRadius: 2000
			},
			legend: {
				labelFormatter: function() {
					return "";
				}
			}
		});

		plotResize(chart.getPlaceholder()[0]);

		return chart;
	}


	var charts = [
		{
			elm: "#todays-clicks",
			label: "Clicks",
			color: "#62a9dd",
			type: "hourly",
			data: {
				daterange: ["7-1-13 00:00", "7-1-13 24:00"],
				count: [158, 176, 180, 110, 201, 246, 177, 236, 189, 103, 298, 147, 234, 255, 223, 149, 268, 296, 119, 254, 252, 219, 262, 232]
			}
		},
		{
			elm: "#months-clicks",
			label: "Clicks",
			color: "#e74c3c",
			type: "daily",
			data: {
				daterange: ["7-1-13", "7-31-13"],
				count: [3117, 3716, 3120, 3774, 3103, 3181, 3930, 3684, 3496, 3114, 3598, 3903, 3923, 3392, 3932, 3801, 3213, 3670, 3154, 3328, 3059, 3063, 3835, 3550, 3122, 3933, 3857, 3107, 3874, 3085, 3705]
			}
		}
	];

	var drawn = [];

	numCharts = charts.length;

	for (var i = 0; i < numCharts; i++) {
		drawn.push(lineChart(charts[i].elm, charts[i].data, charts[i].label, charts[i].color, charts[i].type));
	}

	$.event.special.throttledresize.threshold = 6;

	$(window).on("throttledresize", function(event) {
		numCharts = drawn.length;

		for (var i = 0; i < numCharts; i++) {
			var placeholder = drawn[i].getPlaceholder();

			if (placeholder.width() == 0 || placeholder.height() == 0) return;
			
			drawn[i].resize();
			drawn[i].setupGrid();
			drawn[i].draw();

			plotResize(placeholder[0]);
		}
	});
});

$(window).load(function(){
  $(window).trigger("throttledresize", true);
  
  setTimeout(function(){
		$(window).trigger("throttledresize", true);
  }, 200);
});

/* End data generation and handling */