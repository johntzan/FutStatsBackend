var express = require('express');

var request = require('request');
var router = express.Router();

<<<<<<< HEAD
/* Search users */
=======
/* GET users listing. */
>>>>>>> bef1e606765e4fccc46383474fa965831ec5d2a1
router.get('/:query', function(req, res, next) {
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

module.exports = router;
