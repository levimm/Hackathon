/**
 * Created by shange on 5/21/2016.
 */

//The basic service type
var Service = (function(){
    let _serviceCaches = new Map();

    return {
        getInstance:function(){
            if(!_serviceCaches.has(this.name)){
                let ins = new this();
                _serviceCaches.set(this.name, ins);
                return ins;
            }
            else{
                return _serviceCaches.get(this.name);
            }
        }
    };
})();

exports.Service = Service;