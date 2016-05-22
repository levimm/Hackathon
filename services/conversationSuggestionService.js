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
        _latestTopics.push();
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
                            console.error(`Fail to call getSuggestAnswers(${topic}) ${err}`);
                            rj({result:false, error:err});
                            return;
                        }
                        else{
                            if(body.error){
                                console.error(`Fail to call getSuggestAnswers(${topic}) ${body.error}`);
                                rj({result:null, error:body.error});
                                return;
                            }
                            else{
                                let documents = body.documents;
                                let answers = _.map(documents, (doc)=>{
                                    return {message:doc.content, score:doc.weight, sentiment:doc.sentimentscore};
                                });
                                _updateLatestTopics(topic);
                                rs({result:answers, error:null});
                                return;
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