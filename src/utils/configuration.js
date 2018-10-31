export default function() {
  let __current = {
    loaded: false,

    debug: true,

    locale: "it",

    amountFormat: "$ 0,0. ",

    rateFormat: "0.0 %",

    tweetsUrl: "",

    appHashtag: "",

    // default configuration
    apiEndpoint: "https://data.budget.g0v.it/api/v1",

    // showing MEF logo?
    showMefLogo: true,

    // MEF logo URL
    mefLogoUrl: "https://bdap-opendata.mef.gov.it/catalog",

    // G0V logo URL
    g0vLogoUrl: "https://copernicani.it/g0v"
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
