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

    return {
        /*
         * init the document indexes only required for create the document in the first time 
         */
        initDocumentIndexes:function(indexes){
            let p = new Promise((rs, rj)=>{
                let c = _RL.getHODClient();
                _.forEach(indexes, (index)=>{
                    c.call(CONST.HOD_APIS.createtextindex, {index:index, flavor:"standard"}, (err, rsp, body)=>{
                        if(!err){
                            console.error(`Fail to call initDocumentIndexes ${err}`);
                            rj({result:false, error:err});
                        }
                        else{
                            body = JSON.parse(body);
                            if(body.error){
                                console.error(`Fail to call initDocumentIndexes ${body.error}`);
                                rj({result:false, error:body.error});
                            }
                            else{
                                rs({result:true, error:null});
                            }
                        }
                    });
                });
            });

            return p;
        },

        /*
         * @param documents, {documents:[{
         *      title:TITLE_TYPE, define in the global.CONST
         *      reference:string, which is a uuid.v4
         *      relativeDocuments:reference0 it is a uuid.v4 array
         *      content:string
         * }]}
         *
         */
        addDocumentsToIndex:function(documents){
             let c = _RL.getHODClient();
             let _documentsWithSentiment = [];
             return _.reduce(documents, (memo, doc)=>{
                 let p = new Promise((rs, rj)=>{
                     c.call(CONST.HOD_APIS.analyzesentiment, {text:doc.content, language:_lang}, (err, rsp, body)=>{
                         if(err){
                             console.error(`Fail to call addDocumentToIndex->analyzesentiment ${err}`);
                             rj({result:false, error: err});
                         }
                         else{
                             body = JSON.parse(body);
                             if(body.error){
                                 console.error(`Fail to call addDocumentToIndex->analyzesentiment ${body.error}`);
                                 rj({result:false, error:body.error});
                             }
                             else{
                                 doc.sentimentScore = body.aggregate.score;
                                 doc.sentimentType = body.aggregate.sentiment;
                                 _documentsWithSentiment.push(doc);
                                 rs({result:true, error:null});
                             }
                         }
                     });
                 });

                 return memo.then(()=>{
                     return p(doc);
                 });
             }, Promise.resolve())
             .then(()=>{
                let p = new Promise((rs, rj)=>{
                    c.call(CONST.HOD_APIS.addtotextindex, {json:_documentsWithSentiment}, (err, rsp, body)=>{
                        if(!err){
                            rj({result:false, error:err});
                        }
                        else{
                            body = JSON.parse(body);
                            if(body.error){
                                rj({result:false, error:body.error});
                            }
                            else{
                                rs({result:true, error:null});
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