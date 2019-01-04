import Tabletop from "@/utils/tabletop.js";
import Configuration from "@/utils/configuration";
import moment from "@/utils/momentCustomization.js";

const TweetData = function() {
  const __tweetsUrl = Configuration.current().tweetsUrl;
  const __debug = Configuration.current().debug;

  const log = what => {
    if (__debug) console.log(what);
  };

  let __td = {
    initialized: false,
    data: undefined
  };

  /*
  * transforms the entities string in a json and extracts the URLS
  * */
  const normalizeTweet = (element) => {
    element.entities = JSON.parse(element.entities_str);
    element.expanded_urls = element.entities.urls.map((entity) => {
      return entity.expanded_url;
    });
    element.datetime = moment(element.time, "DD-MM-YYYY HH:mm:ss");
  };

  const processData = (data, tabletop) => {
    data.forEach(normalizeTweet)
    __td.data = data;
    __td.initialized = true;
  };

  __td.readTweets = () => {
    if (__tweetsUrl && __tweetsUrl != '') {
      Tabletop.init( {
        key: __tweetsUrl,
        callback: processData,
        simpleSheet: true
      } );
    } else {
      __td.initialized = true;
    }
  };

  __td.forUrl = (url) => {
    if (__td.initialized && __td.data) {
      return __td.data.filter((element) => { return element.expanded_urls.indexOf(url) >= 0 });
    }
    return [];
  };

  __td.initData = () => {
    __data.length = 0;
    window.addEventListener('DOMContentLoaded', readTweets);
  };

  return __td;
};

export default TweetData;