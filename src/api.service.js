import { get, post } from "axios";
import { computeNewFilteredTotals } from "./utils/functions";
import Configuration from "./utils/configuration";

export const BudgetData = () => {
  const __apiEndpoint = Configuration().current().apiEndpoint;
  const __debug = Configuration().current().debug;

  const log = what => {
    if (__debug) console.log(what);
  };

  let __initialized = false;
  let __data = {
    meta: {},
    accounts: [],
    partitionLabels: {},
    filteredTot: {},
    selectedNode: {},
    selectedPartition: "default",
    filters: {
      top_partition: [],
      second_partition: []
    }
  };

  /**
   * Reads from the API all possible partitions and al possible labels
   *
   * {
   *      "top_partition": [
   *          {
   *              "top_partition": "Economia e Finanze",
   *              "amount": "585875847718.0"
   *          },
   *          ...
   *      ]
   *      "second_partition": [
   *          {
   *              "second_partition": "Debito pubblico",
   *              "amount": "3456767718.0"
   *          },
   *          ...
   *      ]
   * }
   */
  const readPartitionLabels = () => {
    Promise.all([
      get(`${__apiEndpoint}/partition_labels`),
      post(`${__apiEndpoint}/filter`, __data.filters)
    ])
      .then(response => {
        let partitionLabels = response[0].data;
        let filteredTot = response[1].data;
        __data.partitionLabels = computeNewFilteredTotals(
          partitionLabels,
          filteredTot
        );
        __data.filteredTot = filteredTot;
      })
      .catch(err => {
        log(err);
      });
  };

  /**
   * Reads from the API the accounts data which contains an accounts array and a meta object:
   * meta: { ... },
   * accounts:[
   *      {
   *          code": "6f56a0d1838705054a19089059fc04ae",
   *          name": "Ammortamento mutui per alloggi e residenze universitarie",
   *          amount": "0.0",
   *          last_amount": "1622775.0",
   *          top_level": "Istruzione",
   *          partitions": {
   *              "top_partition": "Istruzione",
   *              "second_partition": "Istruzione universitaria e formazione post-universitaria"
   *          },
   *      },
   *  ]
   */
  const readAccounts = () => {
    return get(`${__apiEndpoint}/accounts`);
    /* .then(response => {
        __data.accounts = response.data.accounts;
        __data.meta = response.data.meta;
      })
      .catch(err => {
        log(err);
      }); */
  };

  /**
   * Reads from the API the single node details as:
   *{
   *    code": "6f56a0d1838705054a19089059fc04ae",
   *    name": "Ammortamento mutui per alloggi e residenze universitarie",
   *    amount": "0.0",
   *    last_amount": "1622775.0",
   *    top_level": "Istruzione",
   *    "past_values": {
   *        "2017": ""
   *    },
   *    partitions": {
   *        "top_partition": "Istruzione",
   *        "second_partition": "Istruzione universitaria e formazione post-universitaria"
   *    },
   *}
   */
  const selectNode = id => {
    if (id) {
     return  get(`${__apiEndpoint}/account/${id}`)
        
    } else {
      __data.selectedNode = {};
    }
  };

  const selectPartition = partition => {
    __data.selectedPartition = partition || "default";
    /* log(["selectedPartition", __data.selectedPartition]); */
  };

  /** Get new filtered totals
           * {
            "top_partition_label": {
                "Difesa": "20968907714.0"
            },
            "second_partition_label": {
                "difesa e sicurezza del territorio": "19450591431.0",
                "servizi istituzionali e generali delle amministrazioni pubbliche": "1068213647.0",
                "sviluppo sostenibile e tutela del territorio e dell'ambiente": "450102636.0"
            }
        }
           */
  /*   const readFilteredPartitionsTotals = () => {
    post(`${__apiEndpoint}/filter`, __data.filters).then(res => {
      //calocla nuovi tot
    });
  }; */

  const initData = () => {
    Promise.all([
      get(`${__apiEndpoint}/accounts`),
      get(`${__apiEndpoint}/partition_labels`),
      post(`${__apiEndpoint}/filter`, __data.filters)
    ]).then(response => {
      let partitionLabels = response[1].data;
      let filteredTot = response[2].data;
      __data.partitionLabels = computeNewFilteredTotals(
        partitionLabels,
        filteredTot
      );
      __data.accounts = response[0].data.accounts;
      __data.meta = response[0].data.meta;
      __data.filteredTot = filteredTot;
      __initialized = true;
    });
  };

  return {
    initialized: __initialized,
    state: __data,
    readPartitionLabels,
    readAccounts,
    selectNode,
    selectPartition,
    initData
  };
};
