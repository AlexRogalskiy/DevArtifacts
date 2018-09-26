var express = require('express'),
	url = require('url'),
	request = require('request'),
	ejs = require('ejs'),
	options = require('./config');


var app = express();

app.set('views', __dirname);
app.set('view engine', 'ejs');

app.get('/google/feeds/for/:search', function(req, res){		
	var search = req.params.search;
	
	// add search param
	options.query.q = search;
	var targetUrl = url.format(options);
	console.log(targetUrl);
	
	// make request to search
	request(targetUrl, function(err, response, body){		
		var feeds = JSON.parse(body);
		res.render('google-search', {feeds: feeds.responseData, keyword: search});		
	});	
});


app.listen(5005, function(){
	console.log('Listening on port 5005...');
});

/*
 *	ЗАДАНИЕ 1
	
		1. Подключите модули 'url', 'request', 'express' и 'ejs'
		2. Откройте в браузере страницу по адресу http://internet.yandex.ru/
		3. Создайте переменную myIP и присвойте ей ip-адрес указанный в строке "Мой IPv4"
		4. Создайте переменную app - сервер, созданный на основе фреймворк express
		5. Поставьте сервер на "прослушку" порта 8080
		6. Укажите, где находятся файлы для представлений с помощью переменной __dirname, указывающую на текущую директорию
*/ 

/*
 *	ЗАДАНИЕ 2
 
		1. Создайте файл представления для вывода результатов поиска по фидам:
			<h3>Результат поиска по <%= keyword %></h3>
			<dl>
				<% feeds.entries.forEach(function(feed){ %>
					<dt><a href="<%- feed.link%>"><%- feed.title %></a></dt>
					<dd><%- feed.contentSnippet %></dd>
				<% }); %>
			</dl>
		2. Сохраните файл в текущей директории под именем google-search.ejs
*/

/*
 *	ЗАДАНИЕ 3
 
		1. Создайте для сервера обработчик метода GET, который обрабатывает обращение к адресу: /google/feeds/for/:search 
				(например: http://localhost:8080/google/feeds/for/RUSSIA)
		2. Получите значение, параметра :search (в примере: RUSSIA)
		3. Создайте объект options с параметрами protocol, host, pathname, query для формирования url вида
				http://ajax.googleapis.com/ajax/services/feed/find?v=1.0&userip=195.19.32.197&q=RUSSIA
				- значение параметра 'userip' должно соответствовать значению переменной myIP
				- значение параметра 'q' должно соответствовать значению полученного параметра :search
		4. Сформируйте нужный url с помощью метода format объекта url (помните, вы подключили модуль 'url'?)
		5. Вызовите функцию request (помните, вы подключили модуль 'request'?) передав ей первым параметром сформированный url и вторым параметром функцию обратного вызова
		6. Функция обратного вызова должна прнимать три аргумента: err, res и body. В переменную body придет ответ в виде строки в формате JSON. Эту строку необходимо распарсить как:
				var feeds = JSON.parse(body);
			В переменной feeds должен появится объект
		8. Заполните представление используя метод render объекта response как:
				response.render('google-search.ejs', {feeds: feeds.responseData, keyword: search});
		9. Сохраните файл и запустите сервер через консоль
		10. Запросите сервер через браузер и убедитесь в корректной работе кода
*/

/*
	Если останется время (или задание на дом)
*/

/*
 *	ЗАДАНИЕ 4 
	
		1. Создайте файл представления для вывода новостей Яндекса:
				<h3><%= count %> последних новостей от Яндекс в категории <%= category %></h3>
				<dl>
					<% news.entries.forEach(function(item){ %>
						<dt><a href="<%- item.link%>"><%- item.title %></a></dt>
						<dd><%- item.contentSnippet %></dd>
					<% }); %>
				</dl>
		2. Сохраните файл в текущей директории под именем yandex-news.ejs
*/

/*
 *	ЗАДАНИЕ 5
 
		1. Создайте для сервера обработчик метода GET, который обрабатывает обращение к адресу: /yandex/:cnt/news/for/:search 
				(например: http://localhost:8080/yandex/10/news/for/auto)
		2. В отличие от Задания 3, сформированный URL должен выглядеть как:
				http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&userip=195.19.32.197&num=10&q= http://news.yandex.ru/CATEGORY.rss
				- значение параметра 'num' должно соответствовать значению полученного параметра :cnt	
				- вместо подстроки CATEGORY должно стоять значение полученного параметра :search
		3. Заполните представление используя метод render объекта response как:
				response.render('yandex-news.ejs', {news: feeds.responseData.feed, category: search, count: cnt});
		4. Сохраните файл и запустите сервер через консоль
		5. Запросите сервер через браузер и убедитесь в корректной работе кода, передавая значения для категории:
				auto, world, internet, sport, culture, movies, politics
				
*/