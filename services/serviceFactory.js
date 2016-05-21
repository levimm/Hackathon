/**
 * Created by shange on 5/21/2016.
 */

exports.ServiceFactory = serviceFactory;

var serviceFactory = {
    getService:function(service){
        return service.getInstance();
    }
};