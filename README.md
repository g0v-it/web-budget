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

    // API base endpoint
    window.__settings.apiEndpoint = 'http://194.177.121.230:8080';

}(this));
```

The configuration is read on page load and exposed in the object exported from `utils/configuration.js`

```
import Configuration from './utils/configuration'

let settings = Configuration();
let apiEndpoint = settings.current().apiEndpoint;
```

The configuration object is also exposed as the vue prototype attribute `$settings`

### Data

All visualized data are extracted from [bdap portal](https://bdap-opendata.mef.gov.it/tema/bilancio-finanziario-dello-stato-0) and processed by a dedicated *smart data management platform* (DMP) compliant with the W3C Semantic Web standards. The platform is available in the [data-budget repository](https://git.copernicani.it/g0v/data-budget)

The web application connects to data management platform through an REST endpoint available at the address http://data.budget.g0v.it/api/v1. You can also run your private instance of the platform (see data-budget repo for more info )


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


