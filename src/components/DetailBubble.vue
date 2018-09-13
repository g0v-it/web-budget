<template>
    <div class="modal-layout">
        <div class="details">
            <h2 class="azione">{{selectedNode.name}}</h2>
            <h3 class="ministero">Ministero: {{selectedNode.top_level}}</h3>
            <!--     <h3 class="missione">Missione: {{selectedNode.partitions.second_partition}}</h3> -->
            <p>Spesa: <amount :amount="selectedNode.amount" /></p>
            <p>Ultima spesa: <amount :amount="selectedNode.last_amount" /></p>
            <!-- <GraphBubble :values="selectedNode.last_values" style=""></GraphBubble> -->
        </div>
        <div class="comments">

        </div>
    </div>
</template>
<script>
import GraphBubble from "@/components/GraphBubble.vue";

export default {
  components: {
    GraphBubble
  },
  props: {
    selectedNode: Object
  },
  watch: {
    selectedNode(newVal, oldVal) {
      /* viene chiamato quando selectedNode cambia */
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>
<style>
.modal-layout {
  margin: 0;
  padding: 1rem 1rem;
  min-height: 30rem;
  width: 100%;
  display: flex;
  flex-direction: row;
}
@media screen and (max-width: 700px) {
  .modal-layout {
    flex-direction: column;
  }
}
.details {
  padding: 1rem;
  flex: 1;
  min-height: 100%;
}

.azione {
  font-size: 2rem;
  font-weight: 500;
  margin: 1rem 0;
}
.ministero,
.missione {
  font-size: 1.5rem;
  font-weight: 400;
  margin: 1rem 0;
}

.comments {
  padding: 1rem;
  flex: 1;
  min-width: 20rem;
  background: #ececec;
  min-height: 100%;
}
</style>
