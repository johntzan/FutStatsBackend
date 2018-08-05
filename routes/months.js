var express = require("express");
var router = express.Router();

/* GET MONTHS */
router.get("/", function(req, res, next) {
  var monthsAvailable = [
    "October 2016",
    "November 2016",
    "December 2016",
    "January 2017",
    "February 2017",
    "March 2017",
    "April 2017",
    "May 2017",
    "June 2017",
    "July 2017",
    "August 2017",
    "October 2017",
    "November 2017",
    "December 2017",
    "January 2018",
    "February 2018",
    "March 2018",
    "April 2018",
    "May 2018",
    "June 2018",
    "July 2018",
    "August 2018"
  ];

  res.json(monthsAvailable);
});

module.exports = router;
