/**
 * Created by shange on 5/21/2016.
 */

var CONST = require("../common/global").CONST;
var Service = require("./service").Service;


exports.ResourceLocatorService = ResourceLocatorService;

function ResourceLocatorService(){
    //all the training data files should start with trainingData*.txt
    let _dataRootPath = "../data";

    return {
        /*
         * Get a suggestion list base on the given topic, the sentiment type is defined in the global
         * @param
         * @return, {filename:string,
         *           content:string}
         *
         */
        iterateTrainingData:function *(){

        }
    }
}

ResourceLocatorService.__proto__ = Service;