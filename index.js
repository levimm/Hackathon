var express = require('express');
var app = express();
var SF = require("./services/serviceFactory").ServiceFactory;
var CS = require("./services/conversationSuggestionService").ConversationSuggestionService;
var REC = require("./services/TopicSuggestionService").TopicSuggestionService;

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
	cs.getSuggestAnswers(keyword).then(callback);
});
app.use('/answer_suggest', answer_suggest);

var current_sentiment = express.Router();
current_sentiment.get('/', function(req, res){
	var cs = SF.getService(CS);
	var callback = function(response){
		res.json(response);
	}
	cs.estimateCurrentSentimentStatus().then(callback);
});
app.use('/current_sentiment', current_sentiment);


// Find recommanded topics from search engine (bing)
// invoke: GET http://127.0.0.1:5000/recommanded_topic?lastSentence=hello%20world
// response: [{Description:'', Title:'', Url:''}, {}, {}]
var recommanded_topic = express.Router();
recommanded_topic.get('/', function(req, res){
    var  recommand = SF.getService(REC);
    console.log(req.query['lastSentence']);
    var callback = function(response){
        res.json(response);
    }
    recommand.findRelatedInterests( req.query['lastSentence'], callback);
});

app.use('/recommanded_topic', recommanded_topic);


app.set('port', process.env.PORT || 5000);

var server = app.listen(app.get('port'), function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Flirting Master app listening at http://%s:%s', host, port);
});
