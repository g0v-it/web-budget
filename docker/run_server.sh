#!/bin/sh

# Generate the config file from ENV

if [ "$G0V_DEBUG" != "" ]
then
    G0V_DEBUG="window.__settings.debug = $G0V_DEBUG;"
fi

if [ "$G0V_LOCALE" != "" ]
then
    G0V_LOCALE="window.__settings.locale = \"$G0V_LOCALE\";"
fi

if [ "$G0V_AMOUNT_FORMAT" != "" ]
then
    G0V_AMOUNT_FORMAT="window.__settings.amountFormat = \"$G0V_AMOUNT_FORMAT\";"
fi

if [ "$G0V_RATE_FORMAT" != "" ]
then
    G0V_RATE_FORMAT="window.__settings.rateFormat = \"$G0V_RATE_FORMAT\";"
fi

if [ "$G0V_API_ENDPOINT" != "" ]
then
    G0V_API_ENDPOINT="window.__settings.apiEndpoint = \"$G0V_API_ENDPOINT\";"
fi

if [ "$G0V_TWEETS_URL" != "" ]
then
    G0V_TWEETS_URL="window.__settings.tweetsUrl = \"$G0V_TWEETS_URL\";"
fi

if [ "$G0V_APP_HASHTAG" != "" ]
then
    G0V_APP_HASHTAG="window.__settings.appHashtag = \"$G0V_APP_HASHTAG\";"
fi

if [ "$G0V_SHOW_MEF_LOGO" != "" ]
then
    G0V_SHOW_MEF_LOGO="window.__settings.showMefLogo = $G0V_SHOW_MEF_LOGO;"
fi

if [ "$G0V_MEF_LOGO_URL" != "" ]
then
    G0V_MEF_LOGO_URL="window.__settings.mefLogoUrl = \"$G0V_MEF_LOGO_URL\";"
fi

if [ "$G0V_G0V_LOGO_URL" != "" ]
then
    G0V_G0V_LOGO_URL="window.__settings.g0vLogoUrl = \"$G0V_G0V_LOGO_URL\";"
fi

cat > /usr/share/nginx/html/config.js <<CONF

(function (window) {

    window.__settings = window.__settings || {};

    $G0V_DEBUG
    $G0V_LOCALE
    $G0V_AMOUNT_FORMAT
    $G0V_RATE_FORMAT
    $G0V_API_ENDPOINT
    $G0V_TWEETS_URL
    $G0V_APP_HASHTAG
    $G0V_SHOW_MEF_LOGO
    $G0V_MEF_LOGO_URL
    $G0V_G0V_LOGO_URL

}(this));

CONF

# Run the server

nginx -g "daemon off;"
