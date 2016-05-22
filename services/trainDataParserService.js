/**
 * Created by shange on 5/21/2016.
 */
 "use strict";
var CONST   = require("../common/global").CONST;
var Service = require("./service").Service;
var UUID    = require('uuid');
var fs      = require('fs');

function TrainDataParserService(){
    let _currentSentimentStatus = CONST.SENTIMENT_TYPES.Neutral;

    return {
        /*
         * Sync function. Get a suggestion list base on the given topic, the sentiment type is defined in the global.
         * The relative documents should be a UUID.v4 array reference the direct next conversation. For
         * example
         * A: XXX...   //which generate a uuid UUID0
         * B: YYY...   //which generate a uuid UUID1
         * the relativeDocument field of XXX... document should be [UUID1]
         * 
         * @param content, string
         * @return, {documents:[{
         *      title:TITLE_TYPE, define in the global.CONST
         *      reference:string, which is a uuid.v4
         *      relativedocument:reference0 it is a uuid.v4 array
         *      content:string
         * }]}
         *
         */
        parse:function(content){
            var documents = [];
            var uuidFormer = UUID.v4();
            var uuidLatter = UUID.v4();
            content.split('\n').forEach(function (line) {
                var document = {
                    title: line[0] === 'F' ? CONST.TITLE_TYPES.Female : CONST.TITLE_TYPES.Male,
                    reference: uuidFormer,
                    relativedocument: uuidLatter,
                    content:  line.slice(line.indexOf(':') + 1).trim() };
                uuidFormer = uuidLatter;
                uuidLatter = UUID.v4();
                documents.push(document);
                // console.log(document);                
            });
            return {documents: documents};
        }
    }
}

TrainDataParserService.__proto__ = Service;
exports.TrainDataParserService = TrainDataParserService;