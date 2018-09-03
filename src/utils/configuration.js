export default function() {

    let __current = {
        loaded: false,

        // default configuration
        apiEndpoint: 'http://localhost:9990'
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