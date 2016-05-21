var SF = require("./services/serviceFactory").ServiceFactory;
var CS = require("./services/conversationSuggestionService").ConversationSuggestionService;

var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
//comment merged<<<<<<< .mine//make conflict here=======//comment>>>>>>> .theirs
});

var cs = SF.getService(CS);

