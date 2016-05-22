/**
 * Created by shange on 5/21/2016.
 */
 "use strict";
var CONST = require("../common/global").CONST;
var Service = require("./service").Service;
var Bing = require('node-bing-api')({ accKey: "u+7DcIcPb8wnEahAau+eS+bxmBesRkdnPYLqAweiIkI" });

function TopicSuggestionService(){

    return {

        getRecommand: function(keyWord, callback){
            //Bing.;
            Bing.composite(keyWord, {
                top: 10,  // Number of results (max 50) 
                skip: 3,   // Skip first 3 results ,
                sources:"web+news",
                newsSortBy: "Date"
            }, function(error, res, body){
                var webResult = null;
                var newsResult = null;
                if(error == null && body != null){
                    webResult = body.d.results[0].Web ;
                    newsResult = body.d.results[0].News;
                }
                callback(error, webResult, newsResult);
                
            });

        }
      }
}

TopicSuggestionService.__proto__ = Service;
exports.TopicSuggestionService = TopicSuggestionService;
