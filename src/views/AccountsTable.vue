<template>
  <div class="container">
    <div class="g0v-table-container">
      <!--  -->
      <VCard>
        <VCardTitle>
          <VSpacer />
          <VSpacer />
          <VTextField
            v-model="search" append-icon="search"
            :label="string['$SEARCH_LABEL']" single-line
            hide-details
          />
        </VCardTitle>
        <VDataTable
          :headers="headers"
          :items="accounts"
          :search="search"
          :pagination.sync="pagination"
          :rows-per-page-text="string['$PAGINATOR_TABLE_TEXT']"
          :rows-per-page-items="[25,50,100,{text:'Tutti',value:-1}]"
          class="elevation-1"
        >
          <template slot="headers" slot-scope="props">
            <tr>
              <th
                style="text-align: left;"
                v-for="header in props.headers"
                :key="header.text"
                :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                @click="changeSort(header.value)"
              >
                {{ header.text }}
                <VIcon small>
                  arrow_upward
                </VIcon>
              </th>
            </tr>
          </template>


          <template slot="items" slot-scope="props">
            <td
              class="account-name" width="35%"
              style="font-weight: 500;"
            >
              {{ props.item.title }} <RouterLink :to="{name:'account-details', params:{code:props.item.code}}">
                <VIcon small color="blue">
                  link
                </VIcon>
              </RouterLink>
            </td>
            <td class="account-amount" width="10%">
              <Amount :amount="props.item.amount" format="$ 0.0 a" />
            </td>
            <td class="account-amount" width="10%">
              <Rate :rate="props.item.rate" format="+0.0 %" />
            </td>
            <td class="account-top" width="15%">
              {{ props.item.partitionLabel.join(', ') }}
            </td>
          </template>

          <template slot="pageText" slot-scope="props">
            {{ props.pageStart }} - {{ props.pageStop }} di {{ props.itemsLength }}
          </template>
        </VDataTable>
      </VCard>
    </div>
  </div>
</template>

<script>
import * as BudgetStore from "@/budgetStore.js";
import Configuration from "@/utils/configuration";

const previousYear = function(meta) {
  return +meta.year - 1;
};
export default {
  name: "TableView",

  data() {
    return {
      string: Configuration.current().strings,
      accounts: [],
      pagination: {
        sortBy: "amount",
        descending: true
      },
      search: ""
    };
  },

  computed: {
    headers() {
      return [
        { text: this.string["$HEADER_COLUMN_1"], value: "title" },
        { text: this.string["$HEADER_COLUMN_2"], value: "amount" },
        {
          text: this.string["$HEADER_COLUMN_3"],
          value: "rate"
        },
        {
          text: this.string["$HEADER_COLUMN_4"],
          value: "partitionLabel[0]"
        }
      ];
    },
    budget() {
      return this.$root.$data.budgetState;
    }
  },

  async beforeRouteEnter(to, from, next) {
    if (BudgetStore.state.accounts.length === 0) {
      await BudgetStore.actions.readAccounts();
    }
    next();
  },

  mounted() {
    this.accounts = this.budget.accounts.map(item => {
      item.rate = (item.amount - item.previousValue) / item.previousValue;
      item.rate = isFinite(item.rate) ? item.rate : NaN;
      return item;
    });
  },

  methods: {
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    }
  }
};
</script>

<style scoped>
.g0v-table-container {
  background-color: #aaaaaa;
}
.g0v-title {
  font-weight: 400;
  margin-bottom: 0.5em;
}

td::first-letter {
  text-transform: uppercase;
}

/* .account-second {
  width: auto;
} */
</style>
