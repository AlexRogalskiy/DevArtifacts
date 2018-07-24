const textarea = document.querySelector('textarea');
const colorWolf = '#ff0000';
const colorBear = '#ffa500';
const colorWebelos = '#ffff4d';
const color11 = '#4da64d';
let startOn = new Date();
startOn.setMonth(startOn.getMonth()-6);
// console.log(startOn)
textarea.addEventListener('change', function() {
	getData();
});

function getData() {
	const data = textarea.value;
	const scouts = [];

	// console.log('data', data);
	const dataByLine = data.split('\n');
	// console.log('dataByLine', dataByLine);
	dataByLine.map(function(curLine) {
		const dataByTab = curLine.split('\t');
		// console.log('dataByTab', dataByTab);
		if(dataByTab[1] === 'M' && parseInt(dataByTab[2], 10) < 12) {
			scouts.push({
				name: dataByTab[0],
				birthday: dataByTab[3],
			});
		}
	});
	if(scouts.length > 0) {
		loadChart(scouts);
	}
}

function loadChart(cubs) {
	google.charts.load("current", {packages:["timeline"]});
	google.charts.setOnLoadCallback(drawChart);
	function drawChart() {
		var container = document.getElementById('scoutlist');
		var chart = new google.visualization.Timeline(container);
		var dataTable = new google.visualization.DataTable();
		dataTable.addColumn({ type: 'string', id: 'Position' });
		dataTable.addColumn({ type: 'string', id: 'Name' });
		dataTable.addColumn({ type: 'date', id: 'Start' });
		dataTable.addColumn({ type: 'date', id: 'End' });
		cubs.map(function(cub){
			const bday = new Date(cub.birthday);
			const startCubs = new Date(bday);
			startCubs.setFullYear(bday.getFullYear() + 8);
			const startBear = new Date(startCubs);
			startBear.setFullYear(startCubs.getFullYear() + 1);
			const startWebelos = new Date(startBear);
			startWebelos.setFullYear(startBear.getFullYear() + 1);
			const start11 = new Date(startWebelos);
			start11.setFullYear(startWebelos.getFullYear() + 1);
			const startYM = new Date(start11);
			startYM.setFullYear(start11.getFullYear() + 1);
			// console.log(bday);
			// console.log(startCubs)
			const dens = [];
			// if(startCubs > startOn || startBear > startOn) {
				dens.push([ cub.name, 'Wolf', startCubs > startOn ? startCubs : startOn, startBear > startOn ? startBear : startOn ]);
			// }
			// if(startBear > startOn || startWebelos > startOn) {
				dens.push([ cub.name, 'Bear', startBear > startOn ? startBear : startOn, startWebelos > startOn ? startWebelos : startOn ]);
			// }
			// if(startWebelos > startOn || start11 > startOn) {
				dens.push([ cub.name, 'Webelos', startWebelos > startOn ? startWebelos : startOn, start11 > startOn ? start11 : startOn ]);
			// }
			// if(start11 > startOn && startYM > startOn) {
				dens.push([ cub.name, '11 yr old', start11, startYM ]);
			// }
			dataTable.addRows(dens);
		});

		var options = {
			colors: [colorWolf, colorBear, colorWebelos, color11],
			timeline: { rowLabelStyle: { fontSize: 11 }, barLabelStyle: { fontSize: 9 } },
		};

		chart.draw(dataTable, options);
		
		const mouseableElement = document.querySelector('#scoutlist');
		const theLine = document.querySelector('.vertical');
		mouseableElement.addEventListener('mousemove', function(event){
			const x = event.clientX;
			// console.log('x', x);
			const adjustedX = x - 10;
			theLine.style.left = (adjustedX)+'px';
			const rects = document.querySelectorAll('rect');
			// console.log('rects', rects)
			const count = {
				wolf:0,
				bear:0,
				webelos:0,
				eleven:0
			};
			rects.forEach(function(rect){

				const rectStartX = parseInt(rect.getAttribute('x'), 10);
				const rectEndX = rectStartX + parseInt(rect.getAttribute('width'), 10);
				// console.log('rect', rectStartX, rectEndX)
				if(adjustedX > rectStartX && adjustedX < rectEndX) {
					// console.log('rect is now', rect);
					// console.log('color', rect.getAttribute('fill'));
					switch (rect.getAttribute('fill')) {
						case colorWolf:
							count.wolf++;
							break;
						case colorBear:
							count.bear++;
							break;
						case colorWebelos:
							count.webelos++;
							break;
						case color11:
							count.eleven++;
							break;
					}
				}
				// console.log(count);
				document.querySelector('.countWolf').innerHTML = count.wolf;
				document.querySelector('.countBear').innerHTML = count.bear;
				document.querySelector('.countWebelos').innerHTML = count.webelos;
				document.querySelector('.count11').innerHTML = count.eleven;

			});
		});
	}
}

getData();