<template>
    <div class="modal-layout">
        <div class="details">
            lore {{JSON.stringify(currentNode)}}
            <!-- <GraphBubble style=""></GraphBubble> -->
        </div>
        <div class="comments">
            commenti
        </div>
    </div>
</template>
<script>
import GraphBubble from "@/components/GraphBubble.vue";

export default {
  name: "detail-bubble",
  components: {
    GraphBubble
  },
  props: {
    currentNode: Object
  },
  data() {
    return {};
  },
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

.comments {
  padding: 1rem;
  flex: 1;
  min-width: 20rem;
  background: #00ffee;
  min-height: 100%;
}
</style>
