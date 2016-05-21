"use strict";
var CONST = require("../common/global").CONST;
var Service = require("./service").Service;
var havenondemand = require('havenondemand')
var client = new havenondemand.HODClient('efb6e1b1-c65d-4fd7-82dd-d6e6dbfe7cc4', 'v1', 'http://web-proxy.sgp.hpecorp.net:8080')

exports.SocialNetworkAnalyzeService = SocialNetworkAnalyzeService;

/* This service analyze the target's social network's image and text */
function SocialNetworkAnalyzeService(){
    
 	// data scraping is not actually performed here. Use the prepared data instead.
    let _dataRootPath = "../data";

    return {
    	/*
         * Get image logos
         * @param url, stirng
         * @return, string
         *
         */
        getImageLogo:function(url) {
        	return new Promise((resolve, reject) => {
				var data = {'url' : url}
				client.call('recognizeimages', data, function(err, resp, body) {
					if (err) reject(err);
					resolve(body.object[0].name);
				});
			});
        },

        /*
         * Get the positive topics from the text
         * @param file, lang 
         * @return, [topic]
         *
         */
        getPositiveInfo:function(file, lang) {
        	return new Promise((resolve, reject) => {
				var data = {'file' : file, 'language' : lang}
				client.call('analyzesentiment', data, function(err, resp, body) {
					if (err) reject(err);
					var topics = [];
					for (let t of body.positive) {
						topics.push(t.topic);
					}
					resolve(topics);
				});
			});
        },

		/*
         * Get a suggestion list base on the given topic, the sentiment type is defined in the global
         * @param file, lang
         * @return, [topic]
         *
         */
        getNegativeInfo:function(file, lang) {
        	return new Promise((resolve, reject) => {
				var data = {'file' : file, 'language' : lang}
				client.call('analyzesentiment', data, function(err, resp, body) {
					if (err) reject(err);
					var topics = [];
					for (let t of body.negative) {
						topics.push(t.topic);
					}
					resolve(topics);
				});
			});
        }
    }
}

SocialNetworkAnalyzeService.__proto__ = Service;