<template>
    <div class="container fluid">
        <div class="partition-buttons">
            <v-btn-toggle v-model="partitionID" mandatory>
                <v-btn flat color="primary" value="default">
                    dafault
                </v-btn>
                <v-btn flat color="primary" value="missione">
                    per missione
                </v-btn>
            </v-btn-toggle>
        </div>
        <BubbleGraphLegend v-if="partitionID=='default'"/>
        <BudgetBubbles class="graph-layout" @click="onClick" @over="onMouseOver" @out="onMouseOut" :partitionID="partitionID" />
        <TooltipBubble style="top: 3rem ; right: 2rem;"
            :currentNode="currentNode"
            :topLevel="currentNode.topLevel"
            :title="currentNode.name"
            :amount="currentNode.amount"
            :diff="currentNode.diff"
            :bgColor="currentNode.colorBg"
            :dkColor="currentNode.darkerColor"
            v-if="showTooltip && !dialog"
            ></TooltipBubble>

        <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark color="primary">
                <v-btn icon dark @click.native="dialog = false; $router.push({ name: 'd3-bubble-graph'})">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>{{code}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn dark flat ><v-icon>file_copy</v-icon></v-btn>
                </v-toolbar-items>
                </v-toolbar>
                
                <DetailBubble></DetailBubble>
            </v-card>
        </v-dialog>
        <footer>
            <ul class="footer">
                <li><a href="https://git.copernicani.it/g0v/web-budget"> Visita sorgenti dell'App</a></li>
                <li><a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
                <img alt="Creative Commons License" src="https://i.creativecommons.org/l/by/4.0/80x15.png" />
                </a></li>
            </ul>
        </footer>
    </div>
</template>

<script>
// @ is an alias to /src
import BudgetBubbles from "@/components/BudgetBubbles.vue";
import TooltipBubble from "@/components/TooltipBubble.vue";
import DetailBubble from "@/components/DetailBubble.vue";
import BubbleGraphLegend from "@/components/BubbleGraphLegend.vue";

export default {
  props: {
    code: String
  },
  components: {
    BudgetBubbles,
    TooltipBubble,
    DetailBubble,
    BubbleGraphLegend
  },

  data: () => {
    return {
      partitionID: "default",
      currentNode: {},
      showTooltip: false,
      dialog: false
    };
  },
  mounted() {
    if (this.code) {
      this.dialog = true;
    } else {
      this.dialog = false;
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === "d3-bubble-graph") {
        this.dialog = false;
      }
    }
  },
  methods: {
    onClick(node) {
      this.dialog = true;
      this.showTooltip = false;
      this.$router.push({ name: "account-details", params: { code: node.id } });
    },
    onMouseOver(node) {
      let n = {};
      n.topLevel = "ECONOMIA E FINANZE";
      n.name =
        "Realizzazione del sistema integrato delle banche dati in materia tributaria e fiscale";
      n.amount = "€ 3894 bilion";
      n.diff = "" + Math.round(node.d.diff * 100) / 100 + " %";
      n.colorBg = `${node.colorBg}`;
      n.darkerColor = node.darkerColor;
      n.x = node.x;
      n.y = node.y;
      this.currentNode = n;
      this.showTooltip = true;
    },
    onMouseOut(node) {
      this.showTooltip = false;
    },
    closeDialog(el) {
      console.log(el);
      this.dialog = false;
    }
  }
};
</script>

<style>
.container {
  height: 100%;
}
.card {
  border-radius: 2px;
  min-width: 0;
  text-decoration: none;
  -webkit-box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
    0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
  background-color: #fff;
  color: rgba(0, 0, 0, 0.87);
}

.container > .graph-layout {
  width: 100%;
  height: 100%;
}

.footer{
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    justify-content: space-between;
}
.footer img{
    border-width:0;
}

.footer a{
    text-decoration: none;

}
</style>
