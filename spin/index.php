<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
	<title>Text Spinning Effect with jQuery | Webspeaks.in</title>
	<meta http-equiv="content-type" content="text/html;charset=utf-8" />
	<style>
	#main{
		width:90%;
		margin:50px auto;
		font-family: Georgia, Times, serif;
		text-align:center;
		border: 1px double #cccccc;
	}
	h2{
		font-size: 26px;
		font-weight: normal;
		line-height: 1.4em;
		margin: 0.25em 0 0;
		padding: 0 0 4px;
		text-shadow: 1px 1px 0 white;
	}
	h2.head{
		border-bottom: 1px dotted #cccccc;
		color:#333333;
	}
	#spin{
		width:80%;
		padding-left:400px;
		margin:50px auto;
		text-align:left;
	}
	#spin h2{
		color: #888888;
	}
	</style>
	<script src="jquery-1.7.1.min.js"></script>
	<script type="text/javascript">
		$(document).ready(function() {
			var _spacing;				//folds letter spacing of the text
			var status;					//expanding or contracting
			var max_spacing = 10;		//maximum expansion on right
			var min_spacing = -30;		//maximum expansion on left
			var el = $('#spin');		//element to be spinned
			_spacing = parseFloat(el.css('letter-spacing'));	//get the current spacing

			//start the spin effect
			setInterval(function() {
				spin(el);
			}, 80);

			function spin(el) {
				if (!isNumber(_spacing)) {
					_spacing = 1;
				} else {
					if (status == '+') {
						_spacing++;
					} else {
						_spacing--;
					}
				}

				if (_spacing == max_spacing) {
					status = '-';
				} else if (_spacing == min_spacing) {
					status = '+';
				}
				el.animate({
					'letter-spacing': _spacing+'px'
				}, 100);
			}

			function isNumber(n) {
				return !isNaN(parseFloat(n)) && isFinite(n);
			}
		});
	</script>
</head>

<body>
	<div id="main">
		<h2 class="head">Text Spinning Effect with jQuery</h2>
		<div id="spin"><h2>This text will spin.</h2></div>
	</div>
</body>

</html>
