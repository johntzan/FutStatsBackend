var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var http = require('http');
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var config = require('./src/config.json');

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

//
// API routes
//

var api = express.Router();

// middleware to use for all requests
api.use(function(req, res, next) {
	// do logging
	console.log('loading..');
	next();
});

// perhaps expose some API metadata at the root
api.get('/', (req, res) => {
	res.json({ message: "Welcome to Weekend League Stats API!" });
});

//API to get User Profile Fut Champions
api.get('/user/:username/:id', (req, res) => {

	var user = {
		name: req.params.username,
		id: req.params.id
	}

	var url = 'http://www.futwiz.com/en/fut-champions/user/' + user.name + '/' + user.id;
	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

				//username
				const username = $('div.headercopy h1').text();

				//leaderboards table
				const table = {
					username: username,
					region: "",
					console: "",
					rankings: []
				};
				//#siteContainer > div.sitecontent > div:nth-child(4) > div > div.span-550 > table > tbody > tr

				$('div.span-550 > table > tbody > tr').each(function(i, elem) {
					var element = $(this).text();
					// console.log(element);
					element = element.trim().split('\n');
					// var month = element.shift();
					// element.push(month);
					var leaderboardsObj = {
						month: element
					};
					table.rankings.push(leaderboardsObj);
				});

				let region = $('#siteContainer > div.sitecontent > div:nth-child(4) > div > div.span-240 > div.pull-left.mr-20.text-center > p.mt-10').text();
				// console.log('Region: ' + region);

				let system_played = $('#siteContainer > div.sitecontent > div:nth-child(4) > div > div.span-240 > div:nth-child(3) > p.mt-10').text();
				if(system_played.length<1){
					// console.log('console is null, use alt method');
					system_played = $('#siteContainer > div.sitecontent > div:nth-child(4) > div > div.span-240 > div:nth-child(7) > p.mt-10').text();
				}

				table.region = region;
				table.console = system_played;

				console.log(table);
				res.json(table)

				}
	});
});

api.get('/top100/:month/:region/:console', (req, res) => {

	var top100 = {console: []}

	var params = {
		month: req.params.month,
		region: req.params.region,
		console :req.params.console
	}

	//for different months change /current/ with /monthYear/ ex: /march2017/.
	//changing out '/all/' for region -> /americas/ for region [americas, europe, row]
	var url2 = 'http://www.futwiz.com/en/fut-champions/leaderboards/' + params.month + '/' + params.region + '/' + params.console ;
	console.log(url2);
	request(url2, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			$('#siteContainer > div.sitecontent > div:nth-child(4) > div.span-820 > table > tbody > tr').each(function(i, elem) {
				var element = $(this).text();
				element = element.trim().split('\n');
				// console.log(element);
				top100.console.push(element);

			});

			res.json(top100);
		}

	});
		});


		api.get('/search/:query', (req, res) => {

			var params = req.params.query;
			if(params.length>1){

				var url2 = 'http://www.futwiz.com/en/fut-champions/search/' + params;
				request(url2, function(error, response){
					if(!error){
						var results = JSON.parse(response.body);
						res.json(results);
					}

				});

			}

	});

	api.get('/months', (req, res) => {

			var monthsAvailable = ["October 2016", "November 2016", "December 2016", "January 2017", "February 2017", "March 2017",
															"April 2017", "May 2017, June 2017"];

			res.json(monthsAvailable);

		});

		//backup link for getting leaderboards - https://www.easports.com/cgw/api/fifa/fut/leaderboard?platform=ps4&region=ams&period=curr
		//found on ea sports site

	// api router
	app.use('/api', api);

	app.server.listen(process.env.PORT || config.port);
	console.log(`Started on port ${app.server.address().port}`);
