	window.onload = function()
	{
		var lis = document.getElementById('cssdropdown').getElementsByTagName('li');
		for(i = 0; i < lis.length; i++)
		{
			var li = lis[i];
			if (li.className == 'headlink')
			{
				li.onmouseover = function() { this.getElementsByTagName('ul').item(0).style.display = 'block'; }
				li.onmouseout = function() { this.getElementsByTagName('ul').item(0).style.display = 'none'; }
			}
		}
	}
	/* or with jQuery:
	$(document).ready(function(){
		$('#cssdropdown li.headlink').hover(
			function() { $('ul', this).css('display', 'block'); },
			function() { $('ul', this).css('display', 'none'); });
	});
	*/