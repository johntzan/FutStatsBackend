var express = require("express");
var request = require("request");
var cheerio = require("cheerio");

var router = express.Router();

/* GET User Profile. */
router.get("/:username/:id", (req, res) => {
  var user = {
    name: req.params.username,
    id: req.params.id
  };

  var url =
    "https://www.futwiz.com/en/fut-champions/user/" + user.name + "/" + user.id;
  request(url, function(error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);

      //   const username = $("#siteContainer > div.sitecontent > div > h1").text();

      //leaderboards table
      const table = {
        username: user.name,
        region: "",
        console: "",
        rankings: []
      };

      $("#panel > div.main-content.background-bright table > tbody > tr").each(
        function(i, elem) {
          var element = $(this).text();
          //   console.log(element);
          element = element.trim().split("\n");
          // var month = element.shift();
          // element.push(month);
          var leaderboardsObj = {
            month: element
          };
          table.rankings.push(leaderboardsObj);
        }
      );

      //Region
      let region = $(
        "#panel > div.main-content.background-bright div.col-9.leftContent div.col-3.userbar > div.pull-left.mr-20.text-center > p.mt-10"
      ).text();

      let system_played = $(
        "#panel > div.main-content.background-bright div.col-9.leftContent div.col-3.userbar > div:nth-child(3) > p.mt-10"
      ).text();

      table.region = region;
      table.console = system_played;

      console.log(table);
      res.json(table);
    } else {
      console.log(error);
    }
  });
});

module.exports = router;
