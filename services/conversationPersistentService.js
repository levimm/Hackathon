/**
 * Created by shange on 5/21/2016.
 */

var HOD     = require("havenondemand");
var Service = require("./service").Service;
var CONST   = require("../common/global").CONST;
var RL      = require("./resourceLocatorService").ResourceLocatorService;
var SF      = require("./serviceFactory").ServiceFactory;
var _       = require("lodash");

function ConversationPersistentService(){
    let _RL = SF.getService(RL);
    let _lang = _RL.getCurrentLanguage();
    let _flavor = _RL.getCurrentFlavor();

    return {
        /*
         * init the document indexes only required for create the document in the first time 
         */
        initDocumentIndexes:function(indexes){
            let c = _RL.getHODClient();
            return _.reduce(indexes, (memo, index)=>{
                let p = new Promise((rs, rj)=>{
                    c.call(CONST.HOD_APIS.createtextindex,
                           {index:index, flavor:_flavor},
                            (err, rsp, body)=>{
                                if(err){
                                    console.error(`Fail to call initDocumentIndexes ${err}`);
                                    rj({result:false, error:err});
                                    return;
                                }
                                else{
                                    if(body.error){
                                        console.error(`Fail to call initDocumentIndexes ${body.error}`);
                                        rj({result:false, error:body.error});
                                        return;
                                    }
                                    else{
                                        rs({result:true, error:null});
                                        return;
                                    }
                                }
                            });
                });
                return memo.then(()=>{
                    return p;
                });
            }, Promise.resolve());
        },

        /*
         * @param documents, {document:[{
         *      title:TITLE_TYPE, define in the global.CONST
         *      reference:string, which is a uuid.v4
         *      relativeDocument:reference0 it is a uuid.v4 array
         *      content:string
         * }]}
         *
         */
        addDocumentsToIndex:function(documents, index){
             let c = _RL.getHODClient();
             let _documentsWithSentiment = [];
             return _.reduce(documents.document, (memo, doc)=>{
                 let p = new Promise((rs, rj)=>{
                     c.call(CONST.HOD_APIS.analyzesentiment, {text:doc.content}, (err, rsp, body)=>{
                         if(err){
                             err = JSON.stringify(err);
                             console.error(`Fail to call addDocumentToIndex->analyzesentiment ${err}`);
                             rj({result:false, error: err});
                             return;
                         }
                         else{
                             if(body.error){
                                 body.error = JSON.stringify(body.error);
                                 console.error(`Fail to call addDocumentToIndex->analyzesentiment ${body.error}`);
                                 rj({result:false, error:body.error});
                                 return;
                             }
                             else{
                                 doc.sentimentscore = body.aggregate.score;
                                 doc.sentimenttype = body.aggregate.sentiment;
                                 _documentsWithSentiment.push(doc);
                                 rs({result:true, error:null});
                                 return;
                             }
                         }
                     });
                 });

                 return memo.then(()=>{
                     return p;
                 });
             }, Promise.resolve())
             .then(()=>{
                let p = new Promise((rs, rj)=>{
                    c.call(CONST.HOD_APIS.addtotextindex, {json:JSON.stringify({document:_documentsWithSentiment}), index:index}, (err, rsp, body)=>{
                        if(err){
                            err = JSON.stringify(err);
                            console.error(`Fail to call addDocumentToIndex->addtotextindex(${_documentsWithSentiment}) ${err}`);
                            rj({result:false, error:err});
                            return;
                        }
                        else{
                            if(body.error){
                                body.error = JSON.stringify(body.error);
                                console.error(`Fail to call addDocumentToIndex->addtotextindex(${_documentsWithSentiment}) ${body.error}`);
                                rj({result:false, error:body.error});
                                return;
                            }
                            else{
                                rs({result:true, error:null});
                                return;
                            }
                        }
                    });
                });

                return p;
            });
        }
    };
}

ConversationPersistentService.__proto__ = Service;
exports.ConversationPersistentService = ConversationPersistentService;