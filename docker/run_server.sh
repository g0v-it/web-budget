#!/bin/sh

# Generate the bootstrap config file from ENV

if [ "$G0V_CONFIG_URL" != "" ]
then
    G0V_CONFIG_URL="window.__configurationUrl = \"$G0V_CONFIG_URL\";"
else
    G0V_CONFIG_URL="window.__configurationUrl = \"/config.json\";"
fi


# Pre-load an external string definition
if [ "${G0V_STRING_URL:0:4}" == "http" ]
then
	if wget -q -O "/usr/share/nginx/html/strings/custom.json" "$G0V_STRING_URL"
	then
		G0V_STRING_URL="/strings/custom.json"
	else
		G0V_STRING_URL=""
	fi
fi

if [ "$G0V_STRING_URL" != "" ]
then
    G0V_STRING_URL="window.__stringUrl = \"$G0V_STRING_URL\";"
else
    G0V_STRING_URL="window.__stringUrl = \"/strings/default.json\";"
fi

cat > /usr/share/nginx/html/config.js <<CONF

(function (window) {
    $G0V_CONFIG_URL
    $G0V_STRING_URL
}(this));

CONF

# Generate the JSON config file from ENV

if [ "$G0V_DEBUG" != "" ]
then
    G0V_DEBUG="\"debug\": $G0V_DEBUG"
else
    G0V_DEBUG="\"debug\": false"
fi

if [ "$G0V_LOCALE" != "" ]
then
    G0V_LOCALE="\"locale\": \"$G0V_LOCALE\","
fi

if [ "$G0V_AMOUNT_FORMAT" != "" ]
then
    G0V_AMOUNT_FORMAT="\"amountFormat\": \"$G0V_AMOUNT_FORMAT\","
fi

if [ "$G0V_RATE_FORMAT" != "" ]
then
    G0V_RATE_FORMAT="\"rateFormat\": \"$G0V_RATE_FORMAT\","
fi

if [ "$G0V_API_ENDPOINT" != "" ]
then
    G0V_API_ENDPOINT="\"apiEndpoint\": \"$G0V_API_ENDPOINT\","
fi

if [ "$G0V_TWEETS_URL" != "" ]
then
    G0V_TWEETS_URL="\"tweetsUrl\": \"$G0V_TWEETS_URL\","
fi

if [ "$G0V_APP_HASHTAG" != "" ]
then
    G0V_APP_HASHTAG="\"appHashtag\": \"$G0V_APP_HASHTAG\","
fi

if [ "$G0V_SHOW_MEF_LOGO" != "" ]
then
    G0V_SHOW_MEF_LOGO="\"showMefLogo\": $G0V_SHOW_MEF_LOGO,"
fi

if [ "$G0V_MEF_LOGO_URL" != "" ]
then
    G0V_MEF_LOGO_URL="\"mefLogoUrl\": \"$G0V_MEF_LOGO_URL\","
fi

if [ "$G0V_G0V_LOGO_URL" != "" ]
then
    G0V_G0V_LOGO_URL="\"g0vLogoUrl\": \"$G0V_G0V_LOGO_URL\","
fi

if [ "$G0V_MAX_RADIUS" != "" ]
then
    G0V_MAX_RADIUS="\"g0vMaxRadius\": \"$G0V_MAX_RADIUS\","
fi

cat > /usr/share/nginx/html/config.json <<CONF
{

    $G0V_LOCALE
    $G0V_AMOUNT_FORMAT
    $G0V_RATE_FORMAT
    $G0V_API_ENDPOINT
    $G0V_TWEETS_URL
    $G0V_APP_HASHTAG
    $G0V_SHOW_MEF_LOGO
    $G0V_MEF_LOGO_URL
    $G0V_G0V_LOGO_URL
    $G0V_MAX_RADIUS
    $G0V_DEBUG
}

CONF

# Run the server

nginx -g "daemon off;"
