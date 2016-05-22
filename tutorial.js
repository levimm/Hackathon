var CONST = require("./common/global").CONST;
var SF = require("./services/serviceFactory").ServiceFactory;
var CS = require("./services/conversationSuggestionService").ConversationSuggestionService;
var REC = require("./services/topicSuggestionService").TopicSuggestionService;
//
//var express = require('express');
//var app = express();
//
//app.get('/', function (req, res) {
//  res.send('Hello World!');
//});
//
//app.listen(3000, function () {
//    console.log('Example app listening on port 3000!');
////comment merged<<<<<<< .mine//make conflict here=======//comment>>>>>>> .theirs
//});
console.log(CONST.HOD_APIS.addtotextindex);
var cs = SF.getService(CS);
var recommand = SF.getService(REC);

recommand.getRecommand('Trump', function(error, web, news){
    if(error != null){
        console.log ('error occurs');
    }
    else
    {
        // web result;
        console.log('web results ......');
        if(web!= null){
            web.forEach(item=>{
                console.log(item.Title);
                console.log(item.Uri);
                console.log(item.Description);
            })
        }
        /*for(var i = 0; i <=5; i++){
            item = web[i];
            console.log(item.Title );
            console.log(item.Uri);
            console.log(item.Description);
        }*/
        console.log('news results .......');
        //for(var i = 0; i <=5; i++){
        //    var item = news[i];
        if(news!=null){
            news.forEach(item=>{
                console.log(item.Title);
                console.log(item.Uri);
                console.log(item.Description);
            })
        }
        /*console.log(item.Title );
            console.log(item.Uri);
            console.log(item.Description);
       */ //}
    }
});

