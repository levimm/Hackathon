/**
 * Created by shange on 5/21/2016.
 */

exports.Service = Service;

//The basic service type
var Service = {
    getInstance:function(){
        return new this();
    }
};