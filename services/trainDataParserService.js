/**
 * Created by shange on 5/21/2016.
 */
var CONST   = require("../common/global").CONST;
var Service = require("./service").Service;
var UUID    = require("uuid");

function TrainDataParserService(){
    let _currentSentimentStatus = CONST.SENTIMENT_TYPES.Neutral;

    return {
        /*
         * Get a suggestion list base on the given topic, the sentiment type is defined in the global.
         * The relative documents should be a UUID.v4 array reference the direct next conversation. For
         * example
         * A: XXX...   //which generate a uuid UUID0
         * B: YYY...   //which generate a uuid UUID1
         * the relativeDocuments field of XXX... document should be [UUID1]
         * 
         * @param content, string
         * @return, {documents:[{
         *      title:TITLE_TYPE, define in the global.CONST
         *      reference:string, which is a uuid.v4
         *      relativeDocuments:reference0 it is a uuid.v4 array
         *      content:string
         * }]}
         *
         */
        parse:function(content){

        }
    }
}

TrainDataParserService.__proto__ = Service;
exports.TrainDataParserService = TrainDataParserService;