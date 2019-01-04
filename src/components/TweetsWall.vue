<template>
    <div id="tweets-container">
        <div class="progress" v-if="loading">
            <div class="indeterminate"></div>
        </div>
        <blockquote class="tweet" v-for="tweet in tweets.slice(0, visibleTweets)">
            <p v-html="linkfied(tweet.text)"></p>
            <a class="tweet-user" v-bind:href="'https://twitter.com/'+tweet.from_user" target="_blank">{{ tweet.from_user }}</a>
            <span class="tweet-date">{{ tweet.datetime.format('LLL') }}</span>
            <a class="tweet-link" :href="tweet.status_url" target="_blank"><i class="fab fa-twitter"></i></a>
        </blockquote>
        <v-btn
            block @click="visibleTweets += 10"
            style="width:15em; margin: 2em auto 0 auto;"
            v-if="tweets.length > visibleTweets"
        >
            Visualizza altri
        </v-btn>
    </div>
</template>
<script>
  import TweetData from "@/utils/tweetData.js";
  import * as twittertext from "twitter-text";

  export default {
    data() {
      return {
        tweetData: TweetData(),
        visibleTweets: 5
      };
    },
    mounted() {
      this.$data.tweetData.readTweets();
    },
    computed: {
      loading: function() {
        return !this.tweetData.initialized;
      },
      tweets: function() {
        return this.tweetData.forUrl(window.location.href);
      },
    },
    methods: {
      linkfied: function(text) {
        return twittertext.autoLink(text);
      }
    }
  };
</script>
<style scoped>
    blockquote.tweet {
        font-size: 12px;
        font-weight: bold;
        line-height: 16px;
        border-color: #eee #ddd #bbb;
        border-radius: 5px;
        border-style: solid;
        border-width: 1px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        margin: 10px 5px;
        padding: 12px;
    }

    blockquote.tweet p {
        font-size: 14px;
        font-weight: normal;
        line-height: 18px;
    }

    blockquote.tweet a {
        color: inherit;
        font-weight: normal;
        text-decoration: none;
        outline: 0 none;
    }

    blockquote.tweet a.tweet-user {
        color: inherit;
        font-weight: bold;
        text-decoration: none;
        margin-right:.5em;
    }

    blockquote.tweet span.tweet-date {
        color: rgba(0,0,0,.54);
    }

    blockquote.tweet a:hover,
    blockquote.tweet a:focus {
        text-decoration: underline;
    }

    blockquote.tweet a.tweet-link {
        float:right;
        color: rgb(29, 161, 242);
    }

    /* Progress Bar */
    #tweets-container {
        position: relative;
        height: 100%;
    }
</style>
