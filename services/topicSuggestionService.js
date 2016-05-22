/**
 * Created by shange on 5/21/2016.
 */
 "use strict";
var CONST = require("../common/global").CONST;
var Service = require("./service").Service;
var Bing = require('node-bing-api')({ accKey: "u+7DcIcPb8wnEahAau+eS+bxmBesRkdnPYLqAweiIkI" });
var seg = require('segment');
var Service = require("./service").Service;
var RL      = require("./resourceLocatorService").ResourceLocatorService;
var SF      = require("./serviceFactory").ServiceFactory;

function TopicSuggestionService(){

    let _resourceLocator       = SF.getService(RL);


    var Segment = require('segment');
    var segment = new Segment();
    segment.useDefault();

    var WordPOS = require('wordpos'),
        wordpos = new WordPOS();


    return {

        findRelatedInterests:function(sentence, callback){
            let c = _resourceLocator.getHODClient();

            var that = this;
            var extractor = that.extractKeysEN;
            c.call( CONST.HOD_APIS.identifylanguage,{text: sentence},function(err, res, body){
                if(err != null)
                    console.log(err);

                if(body != null){
                    if(body.language == "japanese" || body.language == "chinese"){
                        extractor = that.extractKeysCH;
                    }
                }
                extractor(sentence, item=>{
                    console.log(item);
                    that.getRecommand(item.join(' '), function(err, res, body){
                        if(err != null)
                            console.log(err);
                        callback(body || []);
                    });
                });

                    
            });
            /*extractor(sentence, item=>{
                console.log(item);
                that.getRecommand(item.join(' '), function(err, res, body){
                    if(err != null)
                        console.log(err);
                    callback(body || []);
                });
            });*/
        },

        extractKeysEN:function(sentence, callback){
            console.log('extract key EN: ' + sentence);
            wordpos.getNouns(sentence, function(result){
                callback(result);
            });
        },

        extractKeysCH: function(sentence, callback){
            console.log('extract key CH: ' + sentence);
            var result = [];
            segment.doSegment(sentence).forEach(item=>{
                // only fetch noun.
                if( item.p && item.p == seg.POSTAG.D_N ){
                    result.push(item.w);
                }
            });
            
            process.nextTick(callback.bind(undefined,result));
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
            console.log('keyworkd: '+ keyWord);
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
