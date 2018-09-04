import { get } from 'axios';
import Configuration from './utils/configuration'

export const BudgetData = () => {

    const __apiEndpoint = Configuration().current().apiEndpoint;
    const __debug = Configuration().current().debug;

    const log = (what) => {
        if (__debug) console.log(what);
    }

    let __data = {
        meta: {},
        accounts: [],
        partitionLabels: {},
        selectedNode: {},
        selectedPartition: "default"
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
        get(`${__apiEndpoint}/partition_labels`)
            .then(response => {
                __data.partitionLabels = response.data;
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
        get(`${__apiEndpoint}/accounts`)
            .then(response => {
                __data.accounts = response.data.accounts;
                __data.meta = response.data.meta;
            })
            .catch(err => {
                log(err);
            });
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
    const selectNode = (id) => {
        if (id) {
          get(`${__apiEndpoint}/account/${id}`)
            .then(response => {
                __data.selectedNode = response.data;
            })
            .catch(err => {
                log(err);
            });
        } else {
          __data.selectedNode = {};
        }
    };

    const selectPartition = (partition) => {
        __data.selectedPartition = partition || "default";
        log(["selectedPartition", __data.selectedPartition]);
    };

    readPartitionLabels();
    readAccounts();

    return {
        state: __data,
        readPartitionLabels: readPartitionLabels,
        readAccounts: readAccounts,
        selectNode: selectNode,
        selectPartition: selectPartition
    };
}