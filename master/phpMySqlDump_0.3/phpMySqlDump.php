<?
define('SCRIPTNAME', 	'PhpMySqlDump v0.3');
define('BY',			'by Satis, updated 23 April 2010');
define('LINK',			'<a href="http://clankiller.com">Clankiller.com</a>');
/*
 Created by Satis
	thanks to Ciaran Wills for some ideas
 http://clankiller.com

 Revision History
	23 April 2010 - v0.3
		Added scrolling to progress messages
		Clear progress messages every time dump is clicked
		On file dump failure, unlink any existing file
		Added gzip support and detection
	21 April 2010 - v0.2
		Added simultaneous dumping of 3 tables
		Changed name of script
		Altered writing to update table to be synchronous so simultaneous writes don't lock the browser up
		On successful dump, the table name in the "tables to dump" table now becomes the download link
		If a second dump request is made after a table was successfully dumped, the table parser strips off the previous link
		Any existing file is now unlinked before being redumped
		Progress Messages dialog improved
	20 April 2010 - v0.1a
		Initial script creation.  All basic functionality added.

*/
class dbdump{
	private $link;
	private $t;

	function dbdump(){
		$content = null;
		if($_POST['ajax']){
			//ajax call
			$content .= '<?xml version="1.0" standalone="yes"?>'
				.'<data>';
			switch($_POST['request']){
				case 'connect':
					$this->ajaxConnect($_POST['hostname'], $_POST['db'], $_POST['username'], $_POST['password']);
					if($this->link)
						$content .= $this->ajaxTableList();
					else
						$content .= '<error>Failed to connect to database</error>';
					break;
				case 'dump':
					if($this->ajaxDump($_POST['hostname'], $_POST['db'], $_POST['username'], $_POST['password'], $_POST['table'], $_POST['gzip'])){
						if($_POST['gzip'] == 'false')
							$link = $_POST['db'] .'_' .$_POST['table'] .'.sql';
						else
							$link = $_POST['db'] .'_' .$_POST['table'] .'.gz';
						$content .= '<responseBlock>'
							.'<responseType>dump</responseType>'
							.'<giz>' .$_POST['gzip'] .'</giz>'
							.'<table>' .$_POST['table'] .'</table>'
							.'<link><![CDATA[<a target="_blank" href="' .$link .'">' .$_POST['table'] .'</a>]]></link>'
							.'<command><![CDATA[' .$this->t .']]></command>'
							.'<status>1</status>'
						.'</responseBlock>';
					}
					else{
						$content .= '<responseBlock>'
							.'<responseType>dump</responseType>'
							.'<table>' .$_POST['table'] .'</table>'
							.'<status>0</status>'
							.'<reason>Dump Failed</reason>'
						.'</responseBlock>';
					}
					break;
			}
			$content .= '</data>';
			header('Content-Type: text/xml');
		}
		else{
			//regular page load
			$content .= $this->pageHeader();
			$content .= $this->body();
			$content .= $this->pageFooter();
		}
		echo $content;
	}
	function pageHeader(){
		$content = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">'
			.'<html>'
			.'<head>'
				.'<title>MySQL Database Dump Utility</title>'
				.$this->css()
				.$this->js()
			.'</head>'
			.'<body>';
		return $content;
	}
	function css(){
		$content = '<style type="text/css">'
			.'body 			{	background-color: #1f6b55; color: #000000; }'
			.'a				{	text-decoration: none;}'
			.'a:hover		{	text-decoration: underline;}'
			.'.header		{	font-weight: bold; font-size: 140%; padding-left: 15px; color: #88efdd; }'
			.'.subheader	{	padding-left: 20px;  color: #88efdd;}'
			.'.subheader a	{	color: #88efdd;}'
			.'.connection 	{	border-collapse: collapse; background-color: #ebf6fe; border: 1px solid #31bca3; float: left;}'
			.'.connection'
				.' thead th	{	background-color: #2424c5; border-bottom: 1px solid #31bca3; color: #ffffff; }'
			.'.connection'
				.' tbody th	{	text-align: right; padding-left: 5px; }'
			.'.connection'
				.' td		{	padding-right: 5px; }'
			.'.tableList	{	border-collapse: collapse; background-color: #ebf6fe; border: 1px solid #31bca3; margin-left: 15px; float: left;}'
			.'.tableList'
				.' thead th	{	background-color: #2424c5; border-bottom: 1px solid #31bca3; color: #ffffff; }'
			.'.tableList'
				.' tbody th	{	text-align: right; padding-left: 5px;}'
			.'.tableList'
				.' .ops		{	text-align: center; border-bottom: 1px solid #31bca3;}'
			.'.tableList'
				.' td		{	padding-right: 5px; }'
			.'#progress		{	background-color: #ebf6fe; border: 1px solid #31bca3; float: left; display: none; margin-left: 15px; height: 500px;	overflow: auto;}'
			.'#progress'
				.' div		{	padding: 0px 15px 0px 15px; }'
			.'#progress'
				.' .title	{	font-weight: bold;}'
			.'#progress'
				.' .error	{	padding-left: 15px; color: #dd0000;}'
			.'#progress'
				.' .success	{	padding-left: 15px; color: #00dd00;}'
			.'#progress'
				.' a		{	padding-left: 15px;}'
			.'#progress'
				.' .heading	{	background-color: #2424c5; border-bottom: 1px solid #31bca3; color: #ffffff; text-align: center; font-weight: bold;}'
			.'#progress'
				.' .message {	padding-left: 25px;}'
		.'</style>';
		return $content;
	}
	function js(){
		$content = '<script type="text/javascript">
			var connect;
			var dbtables;
			var dumptables;
			var gzip;
			var update;
			var messages;
			var timer;
			
			function dbdump(option, el, sub, sub1, link){
				switch(option){
					case "connect":
						connect = new Array();
						dbtables = new Array();
						var t = el.parentNode.parentNode.parentNode;
						connect["hostname"] = tools.urlEncode(t.firstChild.childNodes[1].firstChild.value);
						connect["db"] = tools.urlEncode(t.childNodes[1].childNodes[1].firstChild.value);
						connect["username"] = tools.urlEncode(t.childNodes[2].childNodes[1].firstChild.value);
						connect["password"] = tools.urlEncode(t.childNodes[3].childNodes[1].firstChild.value);
						var errorContent = el.parentNode.innerHTML.replace("AJAX request failed", "") + "AJAX request failed";
						ajax("request=connect&hostname=" + connect["hostname"] + "&db=" + connect["db"] + "&username=" + connect["username"] + "&password=" + connect["password"], window.location.href, el.parentNode, errorContent);
						el.parentNode.innerHTML = "...loading...";
						break;
					case "select":
						switch(el.value){
							case "All":
								var checkboxes = el.parentNode.parentNode.parentNode.getElementsByTagName("input");
								for(var i=4; i<checkboxes.length; i++)
									checkboxes[i].checked = true;
								break;
							case "None":
								var checkboxes = el.parentNode.parentNode.parentNode.getElementsByTagName("input");
								for(var i=4; i<checkboxes.length; i++)
									checkboxes[i].checked = false;
								break;
							default:
								alert("There is a coding error somewhere.  Please contact the developer.");
								break;
						}
						break;
					case "dump":
						var checkboxes = el.parentNode.parentNode.parentNode.getElementsByTagName("input");
						dumptables = new Array();
						messages = new Array();
						gzip = checkboxes[3].checked;
						for(var i=4; i<checkboxes.length; i++){
							if(checkboxes[i].checked == true){
								if(checkboxes[i].parentNode.previousSibling.innerHTML.substr(0, 1) == "<"){
									checkboxes[i].parentNode.previousSibling.innerHTML = checkboxes[i].parentNode.previousSibling.firstChild.innerHTML;
								}
								var j = dumptables.length;
								dumptables[j] = new Array();
								dumptables[j]["table"] = checkboxes[i].parentNode.previousSibling.innerHTML;
								dumptables[j]["process"] = 0;
								dumptables[j]["retries"] = 0;
							}
						}
						if(dumptables.length == 0){
							alert("select at least 1 table to dump");
							return;
						}
						update = document.getElementById("progress");
						update.innerHTML = "<div class=\'heading\'>Progress Messages</div>";
						update.style.display = "block";
						dbdump("message", null, "<div class=\'title\'>Beginning dump of " + dumptables.length + " tables</div>");
						
						for(var i=0; i<3 && i<dumptables.length; i++){
							dumptables[i]["process"] = 1;
							dbdump("message", null, "<div class=\'message\'>dumping " + dumptables[i]["table"] + "</div>");
							ajax("request=dump&hostname=" + connect["hostname"] + "&db=" + connect["db"] + "&username=" + connect["username"] + "&password=" + connect["password"] + "&table=" + dumptables[i]["table"] + "&gzip=" + gzip, window.location.href);
						}
						
						//set up timer to do element updates.  Updating the element asynchronously can lock the browser up
						timer = setInterval("dbdump(\'update\')", 100);
						break;
					case "message":
						var l = messages.length;
						messages[l] = new Array();
						messages[l]["status"] = 0;
						messages[l]["message"] = sub;
						messages[l]["special"] = sub1;
						messages[l]["link"] = link;
						break;
					case "update":
						var l = messages.length; //set before looping to avoid race conditions
						var tr = document.getElementById("tables").firstChild.childNodes[1].childNodes;
						for(var i=0; i<l; i++){ //loop through message array
							if(messages[i]["status"] == 0){	//message is not processed
								switch(messages[i]["special"]){
									case "success":	//success message... turn table name into download link
										for(var j=1; j<tr.length; j++){
											if(tr[j].firstChild.innerHTML == messages[i]["message"]){
												tr[j].firstChild.innerHTML = messages[i]["link"];
												break;
											}
										}
										break;
									default:	//some other message, stick it in the messages table
										update.innerHTML += messages[i]["message"];
										messages[i]["status"] = 1;
										break;
								}
							}
						}
						break;
				}
			}
			function ajaxResponse(responseBlock){
				for(var i=0; i<responseBlock.length; i++){
					switch(responseBlock[i].getElementsByTagName("responseType")[0].firstChild.nodeValue){
						case "tableRow":
							var tablename = responseBlock[i].getElementsByTagName("content")[0].firstChild.nodeValue;
							dbtables[dbtables.length] = tablename;
							break;
						case "buildTable":
							var _gzip = responseBlock[i].getElementsByTagName("gzip")[0].firstChild.nodeValue;
							var content = "<table class=\'tableList\'>" +
								"<thead>" +
									"<tr><th colspan=2>Tables to Dump</th></tr>" +
								"</thead><tbody>" +
									"<tr><td colspan=2 class=\'ops\'>" +
										"<input type=\'button\' onclick=\'dbdump(\"select\",this)\' value=\'All\'>" +
										"<input type=\'button\' onclick=\'dbdump(\"select\",this)\' value=\'None\'>" +
										"<input type=\'button\' onclick=\'dbdump(\"dump\",this)\' value=\'Dump\'>" +
										"<br>";
							
							if(_gzip == 0){
								content += "<span style=\'color: #cccccc;\' title=\'Gzip not available\'>" +
									"Gzip Unavailable <input type=\'checkbox\' disabled=\'disabled\'>" +
								"</span>";
							}
							else{
								content += "Gzip Files <input type=\'checkbox\'>";
							}
							content += "</td></tr>";
							for(var i=0; i<dbtables.length; i++){
								content += "<tr>" +
									"<th>" + dbtables[i] + "</th>" +
									"<td><input type=\'checkbox\'></td>" +
								"</tr>";
							}
							content += "</tbody></table>";
							document.getElementById("tables").innerHTML = content;
							document.getElementById("tables").previousSibling.childNodes[1].childNodes[4].firstChild.innerHTML = "<input type=\'button\' value=\'Connect\' onclick=\'dbdump(\"connect\", this);\'>"
							break;
						case "dump":
							var table = responseBlock[i].getElementsByTagName("table")[0].firstChild.nodeValue;
							var status = responseBlock[i].getElementsByTagName("status")[0].firstChild.nodeValue;
							
							//get index of current table
							var dumpI = -1;
							for(var k=0; k < dumptables.length; k++){
								if(table == dumptables[k]["table"]){
									dumpI = k;
									break;
								}
							}
							if(dumpI == -1){ //invalid table returned..
								alert("Invalid table result returned.  Something bad has happened");
								return;
							}
							switch(status){
								case "1":
									var link = responseBlock[i].getElementsByTagName("link")[0].firstChild.nodeValue;
									dumptables[dumpI]["process"] = 2;
									dumptables[dumpI]["link"] = link;
									dbdump("message", null, table, "success", link);
									break;
								case "0":
									var reason = responseBlock[i].getElementsByTagName("reason")[0].firstChild.nodeValue; 
									dbdump("message", null, "<div class=\'error\'>" + table + " update failed: " + reason + "</div>");
									dumptables[dumpI]["retries"]++;
									if(dumptables[dumpI]["retries"] == 3){
										dumptables[dumpI]["process"] = -1;
										dbdump("message", null, table + " failed too many times, skipping<br>");
									}
									else
										dumptables[dumpI]["process"] = 0;	//reset process so it can be sent again
									break;
							}
							
							//move on to additional tables
							var more = false;
							for(var k=0; k < dumptables.length; k++){
								if(dumptables[k]["process"] == 0){
									dumptables[k]["process"] = 1;
									dbdump("message", null, "<div class=\'message\'>dumping " + dumptables[k]["table"] + "</div>");
									ajax("request=dump&hostname=" + connect["hostname"] + "&db=" + connect["db"] + "&username=" + connect["username"] + "&password=" + connect["password"] + "&table=" + dumptables[k]["table"] + "&gzip=" + gzip, window.location.href);
									return;
								}
								if(dumptables[k]["process"] == 1)
									more = true;
							}
							if(!more){
								//all tables have been processed, kill timer and write last messages
								clearInterval(timer);
								dbdump("message", null, "<div class=\'title\'>Processing complete</div>");
								dbdump("update");
							}
							break;
					}
				}
			}'
			.$this->js_ajax()
			.$this->js_tools()
		.'</script>';
		return $content;
	}
	function js_ajax(){
		$content = '
		var ajaxObject = new Array();
		var lastQuery = 0;
		
		function ajax(query, page, errorElement, errorRestore){
			var curDate = new Date();
			lastQuery = curDate.valueOf();
			query = "ajax=true&" + query;
			var id = -1;
			var alreadyRequested = false;
			for(i=0; i<ajaxObject.length; i++){
				if(ajaxObject[i].getProcessing() == false)	//ie7/ie8 can"t reused xmlhttprequest objects...lovely
					id = i;
				if(ajaxObject[i].getProcessing() == true && ajaxObject[i].getRequest() == query){
					alreadyRequested = true;
					break;
				}
			}
			if(alreadyRequested)
				return;
			if(id == -1){
				id = ajaxObject.length;
				ajaxObject[id] = new ajaxOO();
			}
			ajaxObject[id].setID(id);
			ajaxObject[id].setPage(page);
			ajaxObject[id].setErrorRecovery(errorElement, errorRestore);
			ajaxObject[id].send(query);
		}
		function queryTimeout(id){
			ajaxObject[id].timeout();
		}
		function ajaxOO(){
			var that = this;
			var request;
			var processing;
			var xmlhttp;
			var page;
			var errorRestore;
			var id;
			var timer;

			this.send = function(vars){
				if(that.processing)
					return false;
				that.request = vars;
				that.processing = true;
				
				if (!xmlhttp && typeof XMLHttpRequest != "undefined") {
					try { xmlhttp = new XMLHttpRequest(); } catch (e) { xmlhttp = false; }
				}
				if(!xmlhttp){
					alert("Error, either javascript is disabled or you browser doesn\"t support AJAX.");
					that.processing = false;
					return false;
				}
				xmlhttp.open("POST", that.page, true);
				xmlhttp.onreadystatechange = function(){
					if(xmlhttp.readyState == 4){
						clearTimeout(that.timer);
						if(xmlhttp.status == 500){
							that.showError("Internal Server Error");
							that.processing = false;
							return;
						}
						var t = document.getElementById("test");
						try{ var result = xmlhttp.responseXML; }
						catch(e){	that.showError("Result not readable", result);	that.processing = false; return;}
						try{ var errors = result.getElementsByTagName("error");}
						catch(e){	that.processing = false; return; }
						if(errors.length > 0){
							var error = "";
							for(i=0; i<errors.length; i++){ error += errors.item(i).firstChild.nodeValue + "<br>";	}
							that.showError(error, result);
							that.processing = false; 
							return;
						}
						try{ var response = result.getElementsByTagName("responseBlock"); }
						catch(e){	
							that.showError("AJAX response tag missing or unreadable"); 
							that.processing = false; return; 
						}
						that.processing = false;
						ajaxResponse(response);
					}
				}
				xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xmlhttp.setRequestHeader("Content-length", vars.length);
				xmlhttp.setRequestHeader("Connection", "close");
				try{	
					xmlhttp.send(vars);	
					that.timer = setTimeout("queryTimeout(" + that.id + ")", 5000);
				}catch(e){
					alert("unable to send request:: " + e.message);
				}
				return true;
			}
			this.showError = function(error){
				if(that.errorRestore && that.errorRestore["element"])
					that.errorRestore["element"].innerHTML = that.errorRestore["content"];
				alert(error.replace("<br>", "\n"));
			}
			this.abort = function(){
				xmlhttp.abort();
				that.aborting=true;
				processing = false;
			}
			this.getProcessing = function(){
				return that.processing;
			}
			this.getRequest = function(){
				return that.request;
			}
			this.setPage = function(page){
				that.page = page;
			}
			this.setErrorRecovery = function(element, content){
				that.errorRestore = new Array();
				that.errorRestore["element"] = element;
				that.errorRestore["content"] = content;
			}
			this.setID = function(id){
				that.id = id;
			}
			this.timeout = function(error){
				that.abort();
				that.send(that.request);
			}
		}';
		return $content;
	}
	function js_tools(){
		$content = "
		function tools(){}
		tools.urlEncode = function(str) {
			return escape(str).replace(/\+/g,'%2B').replace(/%20/g, '+').replace(/\*/g, '%2A').replace(/\//g, '%2F').replace(/@/g, '%40');
		}
		";
		return $content;
	}
	function body(){
		$content = '<div class="header">' .SCRIPTNAME .'</div>'
				.'<div class="subheader">' .BY .'</div>'
				.'<div class="subheader">' .LINK .'</div>'
				.'<table class="connection">'
				.'<thead>'
					.'<tr><th colspan=2>Connection Settings</th></tr>'
				.'</thead>'
				.'<tbody>'
					.'<tr>'
						.'<th>Hostname</th>'
						.'<td><input></td>'
					.'</tr><tr>'
						.'<th>Database</th>'
						.'<td><input></td>'
					.'</tr><tr>'
						.'<th>Username</th>'
						.'<td><input></td>'
					.'</tr><tr>'
						.'<th>Password</th>'
						.'<td><input type="password"></td>'
					.'</tr>'
					.'<tr>'
						.'<td colspan=2>'
							.'<input type="button" value="Connect" onclick="dbdump(\'connect\', this);">'
						.'</td>'
					.'</tr>'
				.'</tbody></table>'
				.'<span id="tables"></span>'
				.'<div id="progress"></div>';
		
		return $content;
	}
	function bgzip(){	//test if gzip is available
		exec('gzip -h', $output, $result);
		if($result == 0 && count($output) > 0)
			return '1';
		return '0';
	}
	function pageFooter(){
		$content = '</body></html>';
	
		return $content;
	}
	
	function ajaxConnect($hostname, $db, $username, $password){
		@$this->link = mysql_connect($hostname, $username, $password);
		if($this->link){
			@$t = mysql_select_db($db, $this->link);
			if(!$t)
				$this->link = false;
		}
	}
	function ajaxTableList(){
		$content = null;
		$sql = 'show tables';
		$result = mysql_query($sql);
		if(!$result)
			return '<error>Failed to retreieve table list</error>';
		while($row = mysql_fetch_row($result)){
			$content .= '<responseBlock>'
				.'<responseType>tableRow</responseType>'
				.'<content>' .$row[0] .'</content>'
			.'</responseBlock>';
		}
		$content .= '<responseBlock>'
			.'<responseType>buildTable</responseType>'
			.'<gzip>' .$this->bgzip() .'</gzip>'
		.'</responseBlock>';
		return $content;
	}
	function ajaxDump($hostname, $db, $username, $password, $table, $gzip){
		$filename = ($gzip == 'true')? $db .'_' .$table .'.gz' : $db .'_' .$table .'.sql';
		if(file_exists($filename))
			unlink($filename);
		
		if($gzip == 'true')
			$command = 'mysqldump --opt --host=' .$hostname .' --user=' .$username .' --password=' .$password .' ' .$db .' ' .$table .' | gzip > ' .$filename;
		else
			$command = 'mysqldump --opt --host=' .$hostname .' --user=' .$username .' --password=' .$password .' ' .$db .' ' .$table .' > ' .$filename;
		
		$this->t = $command;
		$result; $output;
		exec($command, $output, $result);
		if($result == 0 && file_exists($filename))
			return true;
		if(file_exists($filename))
			unlink($filename); //unlink the file if there was a failure
		return false;
	}
}
$t = new dbdump();
?>