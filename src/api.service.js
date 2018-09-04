import { get } from 'axios';
import Configuration from './utils/configuration'

const apiEndpoint = Configuration().current().apiEndpoint;


/**
 * Return array value as:
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
export const getAccounts = () => {
    return new Promise((res, rej) => {
        get(`${apiEndpoint}/accounts`)
            .then(response => {
                res(response.data);
            })
            .catch(err => {
                rej(err);
            });
    });
}


/**
 * Return single node details as:
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
export const getNodeDetails = (id) => {
    return new Promise((res, rej) => {
        get(`${apiEndpoint}/account/${id}`)
            .then(response => {
                res(response.data);
            })
            .catch(err => {
                rej(err);
            });
    });
}


/**
 * Return all possible partitions and al possible labels
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
export const getPartitionLabels = () => {
    return new Promise((res, rej) => {
        get(`${apiEndpoint}/partition_labels`)
            .then(response => {
                res(response.data);
            })
            .catch(err => {
                rej(err);
            });
    });
}