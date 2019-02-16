var express = require("express");
var router = express.Router();

/* GET MONTHS */
router.get("/", function(req, res, next) {
  var monthsAvailable = [
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
    "August 2018", 
    "October 2018",
    "November 2018",
    "December 2018",
    "January 2019",
    "February 2019"
  ];

  res.json(monthsAvailable);
});

module.exports = router;
