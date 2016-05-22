/**
 * Created by shange on 5/21/2016.
 */

var LR = require("./services/resourceLocatorService").ResourceLocatorService;
var SF = require("./services/serviceFactory").ServiceFactory;
var PS = require("./services/conversationPersistentService").ConversationPersistentService;
var _ = require("lodash");
var CONST = require("./common/global").CONST;
var TP  = require("./services/trainDataParserService").TrainDataParserService;


var lr = SF.getService(LR);
var ps = SF.getService(PS);
var tp = SF.getService(TP);
var contents = lr.iterateTrainingData();
contents.forEach((content)=>{
    let data = tp.parse(content);
    var femaleDocuments = [];
    var maleDocuments = [];

    let female = CONST.TITLE_TYPES.Female.toLowerCase();
    _.forEach(data.documents, (doc)=>{

        if(doc.title.toLowerCase() == female){
            femaleDocuments.push(doc);
        }
        else{
            maleDocuments.push(doc);
        }
    });

    ps.addDocumentsToIndex({documents:femaleDocuments}, CONST.TITLE_TYPES.Female).then(()=>{
        console.log("add female document successful");
    });
    ps.addDocumentsToIndex({documents:maleDocuments}, CONST.TITLE_TYPES.Male).then(()=>{
        console.log("add male document successful");
    });

});
