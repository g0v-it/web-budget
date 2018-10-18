![copernicani](https://copernicani.it/wp-content/uploads/cropped-logo_orizzontale_trasparente-1-e1525161268864.png)

# web-budget

An interactive web application that visualizes the Italian Government budget data.

This application is inspired by similar applications developed by the [g0v community](http://gov.asia/) in [Taiwan](https://github.com/g0v/twbudget) and [Taipey](https://github.com/tony1223/tw-budget-platform)

g0v is a decentralized civic tech community to advocate transparency of information and build tech solutions 
for citizens to participate in public affairs from the bottom up. The g0v community was born in Taiwan thanks to [Audrey Tang](https://de.wikipedia.org/wiki/Audrey_Tang), [Chia-liang Kao](https://github.com/clkao) and many others.


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

To customize the settings add a `config.js` file in the `public` directory 
with this content and customize the parameters:

```
(function (window) {

    window.__settings = window.__settings || {};

    // Application Locale
    window.__settings.locale = 'it',

    // Format for currency values
    window.__settings.amountFormat = '$ 0,0. ',

    // Format for percentages
    window.__settings.rateFormat = '0.0 %',

    // API base endpoint
    window.__settings.apiEndpoint = 'http://data.budget.g0v.it/api/v1';


}(this));
```

The configuration is read on page load and exposed in the object exported from `utils/configuration.js`

```
import Configuration from './utils/configuration'

let settings = Configuration();
let apiEndpoint = settings.current().apiEndpoint;
```

The configuration object is also exposed as the vue prototype attribute `$settings`

## Data

All visualized data are extracted and processed by a dedicated *smart data management platform* (DMP) compliant with the W3C Semantic Web standards. The platform is available in the [data-budget repository](https://github.com/g0v-it/data-budget).

The web application connects to data management platform through a REST endpoint that is available at the address http://data.budget.g0v.it/api/v1. Beside json APIs the platform provides a SPARQL 1.1. interface at the address http://data.budget.g0v.it/sdaas/sparql

You can also run a local instance of the platform (see [data-budget repo](https://github.com/g0v-it/data-budget) for more info ).

## Docker

the project contains a `Dockerfile` which uses a two-stages build process: it first creates an image with the full node.js environment where the `npm build` 
step is run and then it creates an image containing only the compiled application files and the nginx server to serv them.

The final docker image runs a script that at startup generates the `config.js` file from environment variables, this allows
whoever runs the image to customize the application configuration simply by passing the right environment.

These are the available environment variables and the corresponding configuration parameter:

- `G0V_LOCALE` -> `locale` (the application Locale)
- `G0V_AMOUNT_FORMAT` -> `amountFormat` (the format for currency values)
- `G0V_RATE_FORMAT` -> `rateFormat` (the format for percentages)
- `G0V_API_ENDPOINT` -> `apiEndpoint` (the API base endpoint)
- `G0V_TWEETS_URL` -> `tweetsUrl` (the google sheets URL for the tweets archive)
- `G0V_APP_HASHTAG` -> `appHashtag` (the application hashtag)
- `G0V_APP_HASHTAG` -> `appHashtag` (the application hashtag)
- `G0V_SHOW_MEF_LOGO` -> `showMefLogo` (whether to show the MEF logo)
- `G0V_MEF_LOGO_URL` -> `mefLogoUrl` (where to link the MEF logo)
- `G0V_G0V_LOGO_URL` -> `g0vLogoUrl` (where to link the g0v logo)

The `docker` directory contains the nginx configuration and the command run by the image.

To build the image a `Makefile` is provided that builds and tags the image:
 
```$bash
make build
``` 

The `NAME` and `VERSION` variables in the `Makefile` set the docker image name and tag (look at the file to see the details).  

The image exposes the web server on port `8080`.

For example to run the built image, specifying an API endpoint and listening on port 9999:

```$bash
docker run -i -t --rm \
       -e G0V_API_ENDPOINT=http://data.budget.g0v.it/api/v1 \
       -p 9990:8080 \
       web-budget-g0v:0.0.1
```

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


