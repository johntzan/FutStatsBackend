var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var router = express.Router();
var redis = require("redis");

// create a new redis client and connect to our local redis instance
var client = redis.createClient(process.env.REDIS_URL);

client.on("error", function(err) {
  console.log("Error " + err);
});

router.get("/:month/:region/:console", (req, res) => {
  var params = {
    month: req.params.month,
    region: req.params.region,
    console: req.params.console
  };

  var paramsAsString = params.month + params.region + params.console;
  // console.log(paramsAsString);

  var top100 = {
    console: []
  };

  client.get(paramsAsString, function(err, reply) {
    if (reply !== null) {
      //   console.log("FOUND: " + paramsAsString);
      //   top100 = JSON.parse(reply);
      //   res.json(top100);
      // } else {
      console.log("NOT FOUND: " + paramsAsString);
      // http://localhost:8080/api/top100/current/all/ps4
      // for different months change /current/ with /monthYear/ ex: /march2017/.
      // changing out '/all/' for region -> /americas/ for region [americas, europe, row]
      var url1 =
        "http://www.futwiz.com/en/fut-champions/leaderboards/" +
        params.month +
        "/" +
        params.region +
        "/" +
        params.console;
      // console.log(url1);
      request(url1, function(error, response, html) {
        if (!error) {
          var $ = cheerio.load(html);
          $(
            "#panel > div.main-content.background-bright div.col-9.leftContent > table > tbody > tr"
          ).each(function(i, elem) {
            var element = $(this).text();
            element = element.trim().split("\n");
            if (params.console === "ps4") {
              element.splice(1, 2); //removes 2 blank spots in index 1 & 2 added in recently by futwiz
            } else {
              element.splice(1, 3); //xbox for some reason has 3 blank spots?..
            }
            console.log(element);
            top100.console.push(element);
          });

          client.set(paramsAsString, JSON.stringify(top100));
          client.expire(paramsAsString, 43200);

          res.json(top100);
        }
      });
    }
  });
});

module.exports = router;
