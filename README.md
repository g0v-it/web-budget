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

## Data

All visualized data are extracted from [bdap portal](https://bdap-opendata.mef.gov.it/tema/bilancio-finanziario-dello-stato-0) and processed by a dedicated *smart data management platform* (DMP) compliant with the W3C Semantic Web standards. The platform and the datalake is available in the [data-budget repository](https://git.copernicani.it/g0v-it/data-budget)

The web application connects to data management platform through an api server endpoint available at the address http://v1.api.data.budget.g0v.it/. You can also run your private instance of the platform (see data-budget repo for more info )


## Support

For answers you may not find in here or in the Wiki, avoid posting issues. Feel free to ask for support on the [Slack](https://linkeddatacenter.slack.com/) general room. Make sure to mention **@enrico** so he is notified.

## Credits

- [All Contributors](../../contributors)
- The Smart data platform is based on the [SDaaS Platform](https://bitbucket.org/linkeddatacenter/sdaas/wiki/Home) by LinkedData.Center . 
- The [Vue community](https://vuejs.org) for the great framework

## License

The MIT License (MIT). Please see License File for more information.


