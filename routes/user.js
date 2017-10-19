var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

var router = express.Router();

/* GET User Profile. */
router.get('/:username/:id', (req, res) => {

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

				let region = $('#siteContainer > div.sitecontent > div:nth-child(3) > div > div.span-240 > div.pull-left.mr-20.text-center > p.mt-10').text();
				// console.log('Region: ' + region);

				let system_played = $('#siteContainer > div.sitecontent > div:nth-child(3) > div > div.span-240 > div:nth-child(3) > p.mt-10').text();
				if(system_played.length<1){
					// console.log('console is null, use alt method');
					system_played = $('#siteContainer > div.sitecontent > div:nth-child(3) > div > div.span-240 > div:nth-child(7) > p.mt-10').text();
				}

				table.region = region;
				table.console = system_played;

				console.log(table);
				res.json(table)

				}
	});
});

module.exports = router;
