<template>
    <div class="modal-layout">
        <div class="details">
            <GraphBubble style=""></GraphBubble>
        </div>
        <div class="comments">
            commenti    
        </div>
    </div>
</template>
<script>
import GraphBubble from "@/components/GraphBubble.vue";
 
export default {
   components: {
    GraphBubble
  },
  props: {},
  data() {
    return {};
  },
  methods: {
    handle: function(ev) {
      this.$emit("close", ev);
    }
  }
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

.details{
    padding: 1rem;
    flex:1;
    min-height: 100%;
}

.comments{
    padding: 1rem;
    flex:1;
    background: #00ffee;
    min-height: 100%;
}
</style>
