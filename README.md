# web-budget

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


```
{ 
    "meta": { 
        "year": 2018, 
        "um": "KEUR", 
        "update": "2018-07-11", 
        "source": "https://bdap-opendata.mef.gov.it/opendata/spd_lbf_spe_elb_cap_01_2017" ,
        "partitions":{
            "missione" : {
                    "Debito pubblico":Total amount,
                    "Politiche economico-finanziarie e di bilancio e tutela della finanza pubblica": Total amount
                }
        }
        }, 
    "accounts": [
    { 
        "code": "0290010001", 
        "amount": 25216805, 
        "last_amount": 30030561,
        "partitions": {
            "missione": "Politiche economico-finanziarie e di bilancio e tutela della finanza pubblica"
        },
        "tags": ["MINISTERO DELL'ECONOMIA E DELLE FINANZE"]
    }, 
    { 
        "code": "0290010002", 
        "amount": 26072022,
        "last_amount": 29042762,
        "partitions": {
            "missione": "Debito pubblico"
        },
        "tags": ["MINISTERO DELL'ECONOMIA E DELLE FINANZE"]
    }
]



```