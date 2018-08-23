<template>
    <div>
        Lorem ipsum dolor sit ame
        t consectetur adipisicing elit. In numquam totam delectus illum expedita commodi nulla tempore 
        sit animi est ab, dignissimos consectetur laudantium eius dolores! Consectetur officiis recusandae adipisci?
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
<style scoped>
.details-layout {
  z-index: 1;
  height: 80%;
  margin: 30px;
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  width: 80%;
}
/* .details-layout {
  position: absolute;
  top:0;
  left:0;
  margin: 5rem;
  z-index: 1;
  width: 78rem;
  height: 100%;
  display: flex;
  justify-content: space-between;
} */
.details {
  height: 100%;
}
</style>
