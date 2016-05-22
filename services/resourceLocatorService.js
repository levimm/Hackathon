/**
 * Created by shange on 5/21/2016.
 */
 "use strict";
var CONST = require("../common/global").CONST;
var Service = require("./service").Service;
var HOD = require("havenondemand");
var fs = require('fs');
var path = require('path');

function ResourceLocatorService(){
    //all the training data files should start with trainingData*.txt
    let _currentDirPath = __dirname;
    let _dataRootPath   = path.join(_currentDirPath.substr(0, _currentDirPath.lastIndexOf(path.sep)), "data");

    //let _hodAPIkey    = "9056c4dc-ccbc-47a7-9e6b-2bd676851fa5"; //(edwin)
    let _hodAPIkey    = "efb6e1b1-c65d-4fd7-82dd-d6e6dbfe7cc4"; //(levi)
    let _hodVersion   = "v1";

    //http://user:pass@proxy.server.com:3128
    //let _hodProxy = null;

    return {
        /*
         * Get a suggestion list base on the given topic, the sentiment type is defined in the global
         * @param
         * @return, [content:string]
         *
         */
        iterateTrainingData:function(){
            var contents = [];
            var files = fs.readdirSync(_dataRootPath);
            for (let file of files) {
                if (file.startsWith('trainingData')) {
                    contents.push(fs.readFileSync(path.join(_dataRootPath, file)).toString());
                }
            }
            return contents;
        },

        getHODClient:function(){
            console.log("call getHODClient");
            var client = new HOD.HODClient(_hodAPIkey, _hodVersion);
            console.log(`created ${client} with ${_hodAPIkey}, ${_hodVersion}`);
            return client;
        },

        getCurrentLanguage:function(){
            return "eng";
        },

        getCurrentFlavor:function(){
            return "explorer";
        }
    }
}

ResourceLocatorService.__proto__ = Service;
exports.ResourceLocatorService = ResourceLocatorService;