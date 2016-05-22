var express = require('express');
var app = express();
var SF = require("./services/serviceFactory").ServiceFactory;
var CS = require("./services/conversationSuggestionService").ConversationSuggestionService;

app.get('/', function(req, res){
    res.send('Welcome to Flirting Master server');
});
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

var answer_suggest = express.Router();
answer_suggest.get('/:text', function(req, res){
    var keyword = req.params.text;
	
	var callback = function(response){
		res.json(response);
	}

	var cs = SF.getService(CS);
	cs.getSuggestAnswers(keyword, callback);
});

app.use('/answer_suggest', answer_suggest);

app.set('port', process.env.PORT || 5000);

var server = app.listen(app.get('port'), function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Flirting Master app listening at http://%s:%s', host, port);
});
