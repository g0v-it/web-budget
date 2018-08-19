<template>
  <v-app>
    <v-navigation-drawer disable-resize-watcher v-model="drawer" app>
      <v-list>

        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
        >

          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title><router-link v-bind:to="item.path" v-text="item.title"></router-link></v-list-tile-title>
          </v-list-tile-content>

        </v-list-tile>

      </v-list>
    </v-navigation-drawer>

    <v-toolbar app :clipped-left="clipped">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
    </v-toolbar>

    <v-content>
      <router-view />
    </v-content>

  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      drawer: false,
      clipped: false,
      items: [
        {
          icon: "bubble_chart",
          title: "Bubble Graph",
          path: "/"
        },
        {
          icon: "pie_chart",
          title: "Another Graph",
          path: "/treemap"
        }
      ],
      title: "Budget.g0v.it"
    };
  },
  methods:{}
};
</script>

<style>
a{
    text-decoration: none;
}
</style>
