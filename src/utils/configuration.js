export default function() {

    let __current = {
        loaded: false,

        debug: true,

        // default configuration
        apiEndpoint: 'http://194.177.121.230:8080'
    }


    let __proxy = {
        current: function(){
            if (window.__settings !== undefined && !__current.loaded) {
                __current = { ...__current, ...window.__settings, loaded: true };
            }
            return __current;
        }
    };

    return __proxy;

}