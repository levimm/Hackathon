/**
 * Created by shange on 5/21/2016.
 */

//The basic service type
var Service = {
    getInstance:function(){
        return new this();
    }
};

exports.Service = Service;