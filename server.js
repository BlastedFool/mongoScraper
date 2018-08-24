var bodyParser = require("body-parser");
var request = require("request");
var mongoose = require("mongoose");
var logger = require("morgan");
var cheerio = require("cheerio");
var path = require("path");

var db = require("./models");// Require all models


var app = express(); 

// Initialize Express
var PORT = process.env.PORT || 3000;

var app = express();


// Use morganfor logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({
    extended: false
}));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));



//mongo connection


//routes

// Routes
app.get("/", function(req, res) {
  res.send(index.html);
});

// A GET route for scraping the invision blog
app.get("/scrape", function(req, res) {
  
  request("http://www.espn.com/nba/", function (error, response, html) {
    
    var $ = cheerio.load(html);

    $(".title-link").each(function(i, element) {
      
      var title = $(element).children().text();
      var link = $(element).attr("href");
      var snippet = $(element).siblings('p').text().trim();
      var articleCreated = moment().format("YYYY MM DD hh:mm:ss");

      var result = {
        title: title,
        link: link,
        snippet: snippet,
        articleCreated: articleCreated,
        isSaved: false
      }
      
      console.log(result);
      
      db.Article.findOne({title:title}).then(function(data) {
        
        console.log(data);

        if(data === null) {

          db.Article.create(result).then(function(dbArticle) {
            res.json(dbArticle);
          });
        }
      }).catch(function(err) {
          res.json(err);
      });

    });

  });
});

