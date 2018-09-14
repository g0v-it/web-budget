export default function() {
  let __current = {
    loaded: false,

    debug: true,

    locale: "it",

    amountFormat: "$ 0.0, a",

    rateFormat: "+0.0 %",

    // default configuration
    apiEndpoint: "http://data.budget.g0v.it/api/v1"
  };

  let __proxy = {
    current: function() {
      if (window.__settings !== undefined && !__current.loaded) {
        __current = { ...__current, ...window.__settings, loaded: true };
      }
      return __current;
    }
  };

  return __proxy;
}
