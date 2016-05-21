/**
 * Created by shange on 5/21/2016.
 */

var serviceFactory = {
    getService:function(service){
        return service.getInstance();
    }
};

exports.ServiceFactory = serviceFactory;