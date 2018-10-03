<template>
  <div class="container">


    <div class="g0v-table-container">
      <!--  -->
      <v-card>
        <v-card-title>
          <v-spacer />
          <v-spacer />
          <v-text-field
            v-model="search" append-icon="search"
            label="Cerca" single-line
            hide-details
          />
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="accounts"
          :search="search"
          :pagination.sync="pagination"
          rows-per-page-text="Righe per pagina"
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
                <v-icon small>arrow_upward</v-icon>
              </th>
            </tr>
          </template>


          <template slot="items" slot-scope="props">
            <td class="account-name" width="35%" style="font-weight: 500;">
              {{ props.item.name }} <router-link :to="{name:'account-details', params:{code:props.item.code}}"><v-icon small color="blue">link</v-icon></router-link>
            </td>
            <td class="account-amount" width="10%"><amount :amount="props.item.amount" format="$ 0.0 a" /></td>
            <td class="account-amount" width="10%"><rate :rate="props.item.rate" format="+0.0 %" /></td>
            <td class="account-top" width="15%">{{ props.item.partitions.top_partition }}</td>
            <td class="account-second" width="">{{ props.item.partitions.second_partition }}</td>
          </template>

          <template slot="pageText" slot-scope="props">
            {{ props.pageStart }} - {{ props.pageStop }} di {{ props.itemsLength }}
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
</template>

<script>
const previousYear = function(meta) {
  return +meta.year-1;
}
export default {
  data() {
    return {
      accounts: [],
      pagination: {
        sortBy: "amount",
        descending: true
      },
      search: "",
      headers: [
        { text: "Nome", value: "name" },
        { text: "Spesa", value: "amount" },
        { text: "Var. da legge di bilancio "+previousYear(this.$root.$data.budget.state.meta), value: "rate" },
        { text: "Ministero", value: "partitions.top_partition" },
        { text: "Missione", value: "partitions.second_partition" }
      ]
    };
  },
  computed: {
    budget: function() {
      return this.$root.$data.budget.state;
    }
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
  },
  mounted() {
    if (!this.budget.accounts.length) {
      this.$root.$data.budget.readAccounts().then(res => {
        this.accounts = res.data.accounts.map(item => {
          item.rate = (item.amount - item.last_amount) / item.last_amount;
          item.rate = isFinite(item.rate) ? item.rate : NaN;
          return item;
        });
      });
    }
    this.accounts = this.budget.accounts.map(item => {
      item.rate = (item.amount - item.last_amount) / item.last_amount;
      item.rate = isFinite(item.rate) ? item.rate : NaN;
      return item;
    });
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
