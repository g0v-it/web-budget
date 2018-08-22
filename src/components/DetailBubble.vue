<template>
<v-card class="detail">
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            Privacy Policy
          </v-card-title>
  
          <v-card-text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </v-card-text>
  
          <v-divider></v-divider>
  
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="handle"
            >
              I accept
            </v-btn>
          </v-card-actions>
  </v-card> 
</template>
<script>
export default {
    props:{
    },
    data(){
      return{
      }
    },
    methods:{
      handle: function(ev){
        this.$emit("close",ev)
      }
    }
};
</script>
<style scoped>
.detail{
  position: absolute;
  right:0;
  top:0;
  width:33%;
  height: 100%;
  z-index: 1;
}
</style>
