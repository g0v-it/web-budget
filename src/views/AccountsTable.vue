<template>
  <div class="g0v-container">


    <div class="g0v-table-container">
      <!--  -->
      <v-card>
        <v-card-title>
          <h1 class="g0v-title">Accounts Table</h1>

          <v-spacer />
          <v-spacer />
          <v-text-field
            v-model="search" append-icon="search"
            label="Cerca" single-line
            hide-details
          />
        </v-card-title>
        <v-data-table
          :headers="headers" :items="accounts"
          :search="search" :pagination.sync="pagination"
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
            <td class="account-name">{{ props.item.name }}</td>
            <td class="account-amount"><amount :amount="props.item.amount" format="$ 0.0 a" /></td>
            <td class="account-amount"><rate :rate="props.item.rate" format="+0.0 %" /></td>
            <td class="account-top">{{ props.item.partitions.top_partition }}</td>
            <td class="account-second">{{ props.item.partitions.second_partition }}</td>
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
export default {
  data() {
    return {
      pagination: {
        sortBy: "amount",
        descending: true
      },
      search: "",
      headers: [
        { text: "Nome", value: "name" },
        { text: "Spesa", value: "amount" },
        { text: "Differenza dall'ultima spesa", value: "rate" },
        { text: "Ministero", value: "partitions.top_partition" },
        { text: "Missione", value: "partitions.second_partition" }
      ]
    };
  },
  computed: {
    budget: function() {
      return this.$root.$data.budget.state;
    },
    accounts: function() {
      return this.budget.accounts.map(item => {
        item.rate = (item.amount - item.last_amount) / item.last_amount;
        item.rate = isFinite(item.rate) ? item.rate : NaN;
        return item;
      });
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
      this.$root.$data.budget.readAccounts();
    }
  }
};
</script>

<style scoped>
.g0v-container {
  margin: 3em 2em;
  /*  padding: 2em 2em; */
}
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

.account-name {
  /*   font-size: 1.1em !important; */
  font-weight: 500;
  width: 30%;
}
.account-amount {
  width: 10%;
}
.account-top {
  width: 15%;
}
/* .account-second {
  width: auto;
} */
</style>
