var CONST = require("./common/global").CONST;
var SF = require("./services/serviceFactory").ServiceFactory;
var CS = require("./services/conversationSuggestionService").ConversationSuggestionService;
var REC = require("./services/topicSuggestionService").TopicSuggestionService;
var PS = require("./services/conversationPersistentService").ConversationPersistentService;
var LR = require("./services/resourceLocatorService").ResourceLocatorService;
var UUID = require("uuid");

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
var ps = SF.getService(PS);
var lr = SF.getService(LR);

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

var c = lr.getHODClient();
//c.call(CONST.HOD_APIS.listresources, {}, (err, rsp, body)=>{
//    console.log(body);
//});

//c.call(CONST.HOD_APIS.findsimilar, {text:"hello"}, (err, rsp, body)=>{
//    console.log(body);
//});

/*
 [{
 *      title:TITLE_TYPE, define in the global.CONST
 *      reference:string, which is a uuid.v4
 *      relativeDocument:reference0 it is a uuid.v4 array
 *      content:string
 * }
 */

//
//
//var document0 = {title:CONST.TITLE_TYPES.Female,
//    reference         :UUID.v4(),
//    relativeDocument  :null,
//    content           :"Nice to see you"
//};
//
//var document1 = {title:CONST.TITLE_TYPES.Male,
//    reference:UUID.v4(),
//    relativeDocument:null,
//    content:"Nice to see you too"
//};
//
//
////
//document0.relativeDocument = document1.reference;
////
//ps.addDocumentsToIndex({document:[document1]}, CONST.TITLE_TYPES.Male).then((v)=>{
//    console.log("success added document");
//}).catch((e)=>{
//    console.error(e);
//});


//
//ps.initDocumentIndexes([CONST.TITLE_TYPES.Male, CONST.TITLE_TYPES.Female]).then((v)=>{
//    console.log("success to call initDocumentIndexes");
//}).catch((e)=>{
//    console.error("fail to call initDocumentIndexes");
//});

cs.getSuggestAnswers("see you later").then((v)=>{
    v = JSON.stringify(v);
    console.log(`Success ${v}`);
}).catch((e)=>{
    console.error(`Failed ${e}`);
});
