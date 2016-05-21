var CONST = require("./common/global").CONST;
var SF = require("./services/serviceFactory").ServiceFactory;
var CS = require("./services/conversationSuggestionService").ConversationSuggestionService;
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
var ps = SF.getService(PS);
var lr = SF.getService(LR);

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


//var document0 = {title:CONST.TITLE_TYPES.Female,
//    reference         :UUID.v4(),
//    relativeDocument  :null,
//    content           :"hello"
//};
//
//var document1 = {title:CONST.TITLE_TYPES.Female,
//    reference:UUID.v4(),
//    relativeDocument:null,
//    content:"hello"
//};
//
//document0.relativeDocument = document1.reference;
//
//ps.addDocumentsToIndex({documents:[document0, document1]});

c.call(CONST.HOD_APIS.createtextindex,
       {index:"Female", flavor:"standard"},
       (err, rsp, body)=>{
           console.log(err);
           console.log(rsp);
           console.log(body);
       });

//
//ps.initDocumentIndexes([CONST.TITLE_TYPES.Male, CONST.TITLE_TYPES.Female]).then((v)=>{
//    console.log("success to call initDocumentIndexes");
//}).catch((e)=>{
//    console.error("fail to call initDocumentIndexes");
//});
//

