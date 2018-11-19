import { get, post } from "axios";
import { computeNewFilteredTotals } from "./utils/functions";
import Configuration from "./utils/configuration";
const __apiEndpoint = Configuration.current().apiEndpoint;

export let state = {
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

export let actions = {
  readAccounts: async () => {
    const { data } = await get(`${__apiEndpoint}/accounts`);
    state.accounts = data.accounts;
    state.meta = data.meta;
  },

  readPartitionLabels: async () => {
    const { data } = await get(`${__apiEndpoint}/partition_labels`);
    state.partitionLabels = data;
  },

  readFilteredTots: async () => {
    const { data } = await post(`${__apiEndpoint}/filter`, state.filters);
    state.partitionLabels = computeNewFilteredTotals(
      state.partitionLabels,
      data
    );
    state.filteredTot = data;
  },

  selectPartition: partitionId => {
    state.selectedPartition = partitionId || "default";
  },

  selectNode: async code => {
    try {
      const { data } = await get(`${__apiEndpoint}/account/${code}`);
      state.selectedNode = data;
    } catch (error) {
      state.selectedNode = {};
    }
  }
};
