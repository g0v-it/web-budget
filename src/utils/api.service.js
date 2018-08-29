import { get } from 'axios';

const apiEndpoint = 'http://194.177.121.230:8080';

export const getAccounts = () => {
    return get(`${apiEndpoint}/accounts`);
}

export const getNodeDetails = (id) => {
    return get(`${apiEndpoint}/account/${id}`);
}

export const getPartitionLabels = () => {
    return get(`${apiEndpoint}/partition_labels`);
}