import { get } from "axios";

const ConfigurationFactory = function() {
  let __loading = false;

  let __current = {
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
      return __current;
    },
    loaded: false
  };

  __proxy.load = function(vm) {
    if (
      window.__configurationUrl !== undefined &&
      !__loading &&
      !__proxy.loaded
    ) {
      __loading = true;
      get(window.__configurationUrl)
        .then(res => {
          __current = { ...__current, ...res.data };
          __proxy.loaded = true;
          if (vm) {
            vm.$data.configurationLoaded = true;
          }
        })
        .catch(error => {
          __loading = false;
        });
    }
  };

  return __proxy;
};

const Configuration = ConfigurationFactory();

export default Configuration;
