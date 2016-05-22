/**
 * Created by shange on 5/21/2016.
 */
var HOD     = require("havenondemand");
var CONST   = require("../common/global").CONST;
var Service = require("./service").Service;
var RL      = require("./resourceLocatorService").ResourceLocatorService;
var SF      = require("./serviceFactory").ServiceFactory;
var _       = require("lodash");


function ConversationSuggestionService(){
    let _currentSentimentScore = 0.0;
    let _resourceLocator       = SF.getService(RL);
    let _latestTopics          = [];
    let _latestTopicLength     = 5;
    let _lang                  = _resourceLocator.getCurrentLanguage();

    function _updateLatestTopics(topic){
        _latestTopics.push(topic);
        if(_latestTopics.length >= _latestTopicLength){
            _latestTopics.shift();
        }

        let c = _resourceLocator.getHODClient();
        c.call(CONST.HOD_APIS.analyzesentiment, {text:topic}, (err, rsp, body)=>{
            if(!err){
                if(!body.error){
                    _currentSentimentScore += body.aggregate.score;
                    _currentSentimentScore /= _latestTopics.length;
                }
                else{
                    console.warn(`Fail to call _updateLatestTopics(${topic}) ${body.error} the topic will be ignore`);
                }
            }
            else{
                console.warn(`Fail to call _updateLatestTopics(${topic}) ${err} the topic will be ignore`);
            }
        });
    }

    return {
        getSuggestAnswers:function(topic, indexes=[CONST.TITLE_TYPES.Male, CONST.TITLE_TYPES.Female]){
            let p = new Promise((rs, rj)=>{
                topic = topic.trim();
                if(topic){
                    let c = _resourceLocator.getHODClient();
                    c.call(CONST.HOD_APIS.findsimilar, {text:topic, indexes:indexes, print:"all"}, (err, rsp, body)=>{
                        if(err){
                            err = JSON.stringify(err);
                            console.error(`Fail to call getSuggestAnswers(${topic}) ${err}`);
                            rj({result:false, error:err});
                            return;
                        }
                        else{
                            if(body.error){
                                body.error = JSON.stringify(body.error);
                                console.error(`Fail to call getSuggestAnswers(${topic}) ${body.error}`);
                                rj({result:null, error:body.error});
                                return;
                            }
                            else{
                                let documents = _.filter(body.documents, (doc)=>{
                                    return doc.relativedocument;
                                });
                                let answers = [];

                                _.reduce(documents, (memo, doc)=>{
                                    let p = new Promise((rs, rj)=>{
                                        let partnerIndex = doc.index == CONST.TITLE_TYPES.Female? CONST.TITLE_TYPES.Male:CONST.TITLE_TYPES.Female;
                                        c.call(CONST.HOD_APIS.getcontent, {index_reference:doc.relativedocument, print:"all", indexes:[partnerIndex]}, (err, rsp, body)=>{
                                            if(err){
                                                err = JSON.stringify(err);
                                                console.error(`Fail to call getSuggestAnswers(${topic}) ${err}`);
                                                rj({result:null, error:err})
                                            }
                                            else{
                                                if(body.error){
                                                    body.error = JSON.stringify(body.error);
                                                    console.error(`Fail to call getSuggestAnswers(${topic}) ${body.error}`);
                                                    rj({result:null, error:body.error});
                                                }
                                                else{
                                                    answers = _.union(answers, body.documents);
                                                    rs({result:true, error:null});
                                                }
                                            }
                                        });
                                    });
                                    return memo.then(()=>{
                                        return p;
                                    });
                                }, Promise.resolve()).then(()=>{
                                    answers = _.map(answers, (doc)=>{
                                        let partnerDoc = _.find(documents, (pDoc)=>{
                                            return pDoc.relativedocument == doc.reference;
                                        });
                                        return {message:doc.content, score:doc.weight, sentiment:partnerDoc.sentimentscore};
                                    });
                                    _updateLatestTopics(topic);
                                    rs({result:answers, error:null});
                                    return;
                                }).catch((e)=>{
                                    console.error(`Fail to call getSuggestAnswers(${topic}) ${body.error}`);
                                    rj({result:null, error:body.error});
                                });
                            }
                        }
                    });
                }
                else{
                    rs({result:{answers:[]}, error:null});
                    return;
                }
            });

            return p;
        },

        /*
         * Get current sentiment status of the current conversation partner
         * @return a Promise with a value {sentiment:SENTIMENTAL_TYPES, score:float (-1, 1)}
         */
        estimateCurrentSentimentStatus:function(){
            let p = new Promise((rs, rj)=>{
                rs({result:_currentSentimentScore, error:null});
            });

            return p;
        },

        resetCurrentSentimentStatus:function(){
            _currentSentimentScore = 0.0;
        }
    }
}

ConversationSuggestionService.__proto__ = Service;
exports.ConversationSuggestionService = ConversationSuggestionService;