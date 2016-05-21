/**
 * Created by shange on 5/21/2016.
 */

var CONST = require("../common/global").CONST;
var Service = require("./service").Service;
var HOD = require("havenondemand");


function ResourceLocatorService(){
    //all the training data files should start with trainingData*.txt
    let _dataRootPath = "../data";
    let _hodAPIkey    = "9056c4dc-ccbc-47a7-9e6b-2bd676851fa5";
    let _hodVersion   = "v1";

    //http://user:pass@proxy.server.com:3128
    //let _hodProxy = null;

    return {
        /*
         * Get a suggestion list base on the given topic, the sentiment type is defined in the global
         * @param
         * @return, {filename:string,
         *           content:string}
         *
         */
        iterateTrainingData:function *(){

        },

        getHODClient:function(){
            return HOD.HODClient(_hodAPIkey, _hodVersion);
        },

        getCurrentLanguage:function(){
            return "eng";
        }
    }
}

ResourceLocatorService.__proto__ = Service;
exports.ResourceLocatorService = ResourceLocatorService;