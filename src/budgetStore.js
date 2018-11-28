import { get, post } from "axios";
import { computeNewFilteredTotals } from "./utils/functions";
import Configuration from "./utils/configuration";
import { encodeFilters, decodeFilters } from "@/utils/functions.js";
import json from "@/assets/example.json.js";
import filter from "@/assets/filtered_tot.js";

export let state = {
  meta: {},
  accounts: [],
  partitionLabels: {},
  partitionButtons: [], //oggetti utilizzati per creare bottoni delle partizioni
  filterSelect: [], //oggetti creati per creare select filtri
  filteredTot: {},
  selectedNode: {},
  selectedPartition: "default"
};

export let actions = {
  readAccounts: async () => {
    const { data } = await get(
      `${Configuration.current().apiEndpoint}/accounts`
    );
    //const { data } = await get(`http://194.177.121.230:8080/accounts`);
    state.accounts = data.accounts;
    state.meta = { ...data };
    delete state.meta.accounts;
    delete state.meta.partitionScheme;
    delete state.meta.partitionOrderedList;
    state.partitionLabels = data.partitionScheme;

    //itera i patition schema che saranno visualizzati
    for (let i = 0; i < data.partitionOrderedList.length; ++i) {
      //creo l'oggetto per la visualizzazione del bottone
      let part = {
        value: data.partitionOrderedList[i],
        title: data.partitionScheme[data.partitionOrderedList[i]].title
      };
      //creo l'oggetto per la visualizzazione della select
      let select = {
        value: data.partitionOrderedList[i],
        title: data.partitionScheme[data.partitionOrderedList[i]].title,
        labels: [],
        model: []
      };
      //l'oggetto viene inserito solo se ha delle partitions
      if (
        data.partitionScheme[data.partitionOrderedList[i]].partitions.length !=
        0
      ) {
        //inserisco le lables delle partitions nell oggetto della select
        for (
          let k = 0;
          k <
          data.partitionScheme[data.partitionOrderedList[i]].partitions.length;
          k++
        ) {
          select.labels.push(
            data.partitionScheme[data.partitionOrderedList[i]].partitions[k][
              "label"
            ]
          );
        }
        state.filterSelect.push(select);
      }
      state.partitionButtons[i] = part;
    }
  },

  readFilteredTots: async filters => {
    const { data } = await get(
      `${Configuration.current().apiEndpoint}/filter?filters=${encodeFilters(
        filters
      )}`
    );
    //console.log("filters req", filters);
    /* const { data } = await get(
      `http://194.177.121.230:8080/filter?filters=${encodeFilters(filters)}`
    ); */
    console.log("reding filters");
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
      const { data } = await get(
        `${Configuration.current().apiEndpoint}/account/${code}`
      );
      //const { data } = await get(`http://194.177.121.230:8080/account/${code}`);
      state.selectedNode = data;
    } catch (error) {
      state.selectedNode = {};
    }
  }
};
