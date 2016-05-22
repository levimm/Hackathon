/**
 * Created by shange on 5/21/2016.
 */
 "use strict";
var CONST = require("../common/global").CONST;
var Service = require("./service").Service;
var Bing = require('node-bing-api')({ accKey: "u+7DcIcPb8wnEahAau+eS+bxmBesRkdnPYLqAweiIkI" });
var seg = require('segment');
function TopicSuggestionService(){

    var Segment = require('segment');
    var segment = new Segment();
    segment.useDefault();

    return {


        extractKeysCH: function(sentence){
            var result = [];
            segment.doSegment(sentence).forEach(item=>{
                // only fetch noun.
                if( item.p && item.p == seg.POSTAG.D_N ){
                    result.push(item.w);
                }
            });
            return result;
        },
        /*
          example:
          recommand.getRecommand('Trump', function(error, web, news){
              if(error != null){
                  console.log ('error occurs');
              }
              else
              {
                  // web result;
                  console.log('web results ......');
                  if(web!= null){
                  web.forEach(item=>{
                      console.log(item.Title);
                      console.log(item.Uri);
                      console.log(item.Description);
                      })
                  }
                  console.log('news results .......');
                  if(news!=null){
                      news.forEach(item=>{
                          console.log(item.Title);
                          console.log(item.Uri);
                          console.log(item.Description);
                          })
                      }
                  }
              });


         */
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
