<template>
    <div class="modal-layout">
        <div class="details">
            
        </div>
        <div class="comments">
            commenti    
        </div>
    </div>
</template>
<script>
export default {
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
  height: 100%;
  width: 100%;
  display: flex;
}
.details{
    padding: 1rem;
    flex:1;
    height: 100%;
}

.comments{
    padding: 1rem;
    flex:1;
    background: #00ffee;
    height: 100%;
}
</style>
