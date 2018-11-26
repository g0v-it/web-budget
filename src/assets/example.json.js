export default{
        "title": "2019 - Disegno Legge di Bilancio Presentato Elaborabile Spese Capitolo",
        "description": "Dati di Spesa relativi al Disegno Legge di Bilancio Presentato per l'esercizio finanziario di riferimento - Atto dovuto in formato elaborabile - [DLB_SPE_ELB_CAP_001]\n",
        "source": "http://data.budget.g0v.it/resource/spd_dlb_spe_elb_cap_01_2019",
        "um": "EUR",
        "partitionSchemes":  { 
            "default": {
                "title": "STATO",
                "partitions" : []
            },
            "top_partition": {
                "title": "MINISTERO",
                "partitions" : [
                    {
                        "title": "MIN2",
                        "amount": "100"
                    },
                    {
                        "title": "MIN3",
                        "amount": "150"
                    },
                    {
                        "title": "MIN4",
                        "amount": "340"
                    },
                    {
                        "title": "MIN5",
                        "amount": "400"
                    }
                ]
            },
            "second_partition":{
                "title": "MISSIONE",
                "partitions" : [
                    {
                        "title": "MIS1",
                        "amount": "100"
                    },
                    {
                        "title": "MIS2",
                        "amount": "150"
                    },
                    {
                        "title": "MIS3",
                        "amount": "140"
                    },
                    {
                        "title": "MIS4",
                        "amount": "400"
                    }

                ]
            }
        },
        "partitionOrderedList": [
            "default","top_partition","second_partition"
        ],
        "accounts": [
            {
                "code": "7921291ce7a4073b400adae308da375e",
                "title": "5borso tito0 lorem lorem li del debito statahhikbjhvjhvhhhhh lole",
                "amount": 150,
                "previousValue": 100,
                "partitions": ["MIN2","MIS1"],
                "subject": "Economia e Finanze"
            },
            {
                "code": "9573e01d3ad28201b6de9b73370b5ff8",
                "title": "rimborso titoli del debito statale",
                "amount": 140,
                "previousValue": 140,
                "partitions": ["MIN3","MIS2"],
                "subject": "Economia e Finanze"
            },
            {
                "code": "7921291ce7a4073b400adae308da375e",
                "title": "tutela dei livelli essenziali di assistenza",
                "amount": 200,
                "previousValue": 201,
                "partitions": ["MIN4","MIS3"],
                "subject": "Economia e Finanze"
            },
            {
                "code": "7921291ce7a4073b400adae308da375e",
                "title": "tutela dei livelli essenziali di assistenza",
                "amount": 200,
                "previousValue": 250,
                "partitions": ["MIN5","MIS4"],
                "subject": "Economia e Finanze"
            }
        ]
    }
