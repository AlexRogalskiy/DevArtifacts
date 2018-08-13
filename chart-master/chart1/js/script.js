class Charts {
	chartOptions;
	constructor() {
		this.chartOptions = {
			scales: {
				xAxes: [{
					display: false
				}],
				yAxes: [{
					display: false
				}]
			},
			tooltips: {
				enabled: false
			},
			legend: {
				display: false
			}
		};
		this.initLineCurved();
	}
	
	initLineCurved(): void {
		var ctx_1 = $("#lineChart_1"),
			 ctx_2 = $("#lineChart_2"),
			 ctx_3 = $("#lineChart_3"),
			 chartData_1 = {
				type: 'line',
				data: {
					labels: ["A", "B", "C", "D", "E", "F"],
					datasets: [
						{
							lineTension: 0,
							borderColor: this.convertHex("#FC5185", 100),
							backgroundColor: this.convertHex("#FC5185", 100),
							pointBorderWidth: 0,
							pointRadius: 0,
							data: [35, 59, 78, 60, 71, 65]
						},
						{
							lineTension: 0,
							borderColor: this.convertHex("#364F6B", 100),
							backgroundColor: this.convertHex("#364F6B", 100),
							pointBorderWidth: 0,
							pointRadius: 0,
							data: [55, 79, 88, 63, 89, 75]
						}
					]
				},
				options: this.chartOptions
			},
			 chartData_2 = {
				type: 'line',
				data: {
					labels: ["A", "B", "C", "D", "E", "F"],
					datasets: [
						{
							lineTension: 0,
							borderColor: this.convertHex("#EDF68D", 100),
							backgroundColor: this.convertHex("#EDF68D", 100),
							pointBorderWidth: 0,
							pointRadius: 0,
							data: [48, 89, 78, 41, 61, 95]
						},
						{
							lineTension: 0,
							borderColor: this.convertHex("#377FD9", 100),
							backgroundColor: this.convertHex("#377FD9", 100),
							pointBorderWidth: 0,
							pointRadius: 0,
							data: [65, 118, 90, 83, 89, 75]
						}
					]
				},
				options: this.chartOptions
			},
			 chartData_3 = {
				type: 'line',
				data: {
					labels: ["A", "B", "C", "D", "E", "F"],
					datasets: [
						{
							lineTension: 0,
							borderColor: this.convertHex("#70D4B4", 100),
							backgroundColor: this.convertHex("#70D4B4", 100),
							pointBorderWidth: 0,
							pointRadius: 0,
							data: [55, 64, 88, 101, 81, 95]
						},
						{
							lineTension: 0,
							borderColor: this.convertHex("#B51A62", 100),
							backgroundColor: this.convertHex("#B51A62", 100),
							pointBorderWidth: 0,
							pointRadius: 0,
							data: [95, 81, 109, 112, 104, 115]
						}
					]
				},
				options: this.chartOptions
			},
			 
			 myLineChart_1 = new Chart(ctx_1, chartData_1),
			 myLineChart_2 = new Chart(ctx_2, chartData_2),
			 myLineChart_3 = new Chart(ctx_3, chartData_3);
	}
	convertHex(hex, opacity) {
		hex = hex.replace('#','');
		var r = parseInt(hex.substring(0,2), 16);
		var g = parseInt(hex.substring(2,4), 16);
		var b = parseInt(hex.substring(4,6), 16);
		
		var result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
		return result;
	}
}

new Charts();