![copernicani](https://copernicani.it/wp-content/uploads/cropped-logo_orizzontale_trasparente-1-e1525161268864.png)

# web-budget

An interactive web application that visualizes government financial reports.

This application is inspired by similar applications developed by the [g0v community](http://gov.asia/) in [Taiwan](https://github.com/g0v/twbudget) and [Taipey](https://github.com/tony1223/tw-budget-platform)

g0v is a decentralized civic tech community to advocate transparency of information and build tech solutions
for citizens to participate in public affairs from the bottom up. The g0v community was born in Taiwan thanks to [Audrey Tang](https://de.wikipedia.org/wiki/Audrey_Tang), [Chia-liang Kao](https://github.com/clkao) and many others.

## Who is using it

As we know, this code is used to:

- visualize the Italian Budget (Legge di bilancio), see https://budget.g0v.it/
- visualize the public Financial Reports of INPS, see https://inps.g0v.it/


## Docker

### run local docker image

The webapp requires to connect to a platform that provides the data, e.g:

```bash
git clone https://github.com/g0v-it/data-inps.git ../testdata
cd ../testdata; docker-compose up -d
#take note of the api container port, e.g.
APIPORT=29322
```

Than you are ready to build and run webapp container:

```bash
docker build -t webapp .
docker run -d --name webapp -p 29313:8080 -e G0V_API_ENDPOINT=http://localhost:$APIPORT webapp
```

Try it pointing your browser to http://localhost:29313

Remove the container with `docker rm -f webapp`


You can use the following environment variables with the container image:

- `G0V_CONFIG_URL` -> is the URL to the application JSON configuration (if not passed in a json file is generated from the other environment variables and put in `/config.json`)
- `G0V_STRING_URL` -> is the URL to the application JSON strings (if not passed the default `/strings/mef.json` is used)
- `G0V_LOCALE` -> `locale` (the application Locale)
- `G0V_AMOUNT_FORMAT` -> `amountFormat` (the format for currency values)
- `G0V_RATE_FORMAT` -> `rateFormat` (the format for percentages)
- `G0V_API_ENDPOINT` -> `apiEndpoint` (the API base endpoint)
- `G0V_TWEETS_URL` -> `tweetsUrl` (the google sheets URL for the tweets archive)
- `G0V_APP_HASHTAG` -> `appHashtag` (the application hashtag)
- `G0V_APP_HASHTAG` -> `appHashtag` (the application hashtag)
- `G0V_SHOW_MEF_LOGO` -> `showMefLogo` (whether to show the MEF logo)
- `G0V_G0V_LOGO_URL` -> `g0vLogoUrl` (where to link the g0v logo)



### build docker image

the project contains a `Dockerfile` which uses a two-stages build process: it first creates an image with the full node.js environment where the `npm build` step is run and then it creates an image containing only the compiled application files and the nginx server to serv them.

The final docker image runs a script that at startup generates the `config.js` file from environment variables, this allows
whoever runs the image to customize the application configuration simply by passing the right environment.

The `docker` directory contains the nginx configuration and the command run by the image.

To build the image a `Makefile` is provided that builds and tags the image:

```$bash
make build
```

The `NAME` and `VERSION` variables in the `Makefile` set the docker image name and tag (look at the file to see the details).

The image exposes the web server on port `8080`.


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Configuration

To customize the settings add a `config.js` file in the `public` directory with this content:

```
(function(window) {
  window.__configurationUrl = "/config.json";
  window.__stringUrl = "/strings/inps.json";
})(this);

```

And a `config.json` file to the `public` directory with this content and customize the parameters:

```
{
  "locale": "it",
  "amountFormat": "$ 0,0 ",
  "rateFormat": "0.0 %",
  "tweetsUrl": "",
  "appHashtag": "",
  "apiEndpoint": "http://data.budget.g0v.it/api/v1",
  "showMefLogo": true,
  "g0vLogoUrl": "https://copernicani.it/g0v"
}
```

The configuration is read on page load and exposed in the object exported from `utils/configuration.js`

```
import Configuration from './utils/configuration'

let settings = Configuration;
let apiEndpoint = settings.current().apiEndpoint;
```

The configuration object is also exposed as the vue prototype attribute `$settings`

## Data

All visualized data are extracted and processed by a dedicated *smart data management platform* (DMP) compliant with the W3C Semantic Web standards. The platform is available in the [data-budget repository](https://github.com/g0v-it/data-budget).

The web application connects to data management platform through a REST endpoint that is available at the address http://data.budget.g0v.it/api/v1. Beside json APIs the platform provides a SPARQL 1.1. interface at the address http://data.budget.g0v.it/sdaas/sparql

You can also run a local instance of the platform (see [data-budget repo](https://github.com/g0v-it/data-budget) for more info ).

## Support

For answers you may not find in here or in the Wiki, avoid posting issues. Feel free to ask for support on the [Slack](https://linkeddatacenter.slack.com/) general room. Make sure to mention **@enrico** so he is notified.

## Credits

- [Miah Mohd Ehtesham](https://github.com/miahmohd), [Leonardo Longhi](https://github.com/LeonardoLonghi) and [Luca Mearelli](https://github.com/luca) for the webapp code design.
- [Enrico Fagnoni](https://github.com/ecow), [Yassine Ouahidi](https://github.com/YassineOuahidi) and [LinkedData.Center](http://linkeddata.center) for the smart data management platform
- [Mike Bostock](https://bost.ocks.org/mike/) for the [D3.js library](https://d3js.org/)
- [Evan You](http://evanyou.me/) and he [Vue community](https://vuejs.org) for the great framework

Thanks to all project contributors, to the [Copernicani community](https://copernicani.it/) and to the [g0v asia community](http://g0v.asia) for ideas and support.

## License

The MIT License (MIT). Please see License File for more information.
