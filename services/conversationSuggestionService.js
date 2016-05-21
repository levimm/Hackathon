/**
 * Created by shange on 5/21/2016.
 */
var HOD = require("havenondemand");
var CONST = require("../common/global").CONST;
var Service = require("./service").Service;


exports.ConversationSuggestionService = ConversationSuggestionService;

function ConversationSuggestionService(){
    let _currentSentimentStatus = CONST.SENTIMENT_TYPES.Neutral;

    return {
        /*
         * Get a suggestion list base on the given text, the sentiment type is defined in the global
         * @param text, string
         * @return, {answers:[{message:string,
         *                     score:float (-1~1),
         *                     sentiment:string},
         *                     ...]}
         *
         */
        getSuggestAnswers:function(text, callback){

        },

        /*
         * Get current sentiment status of the current conversation partner
         * @return a SENTIMENTAL_TYPES
         */
        estimateCurrentSentimentStatus:function(){

        }
    }
}

ConversationSuggestionService.__proto__ = Service;