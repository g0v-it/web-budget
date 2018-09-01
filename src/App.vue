<template>
    <v-app>
        <v-navigation-drawer temporary v-model="drawer" app>
            <v-list>

                <v-list-tile value="true" v-for="(item, i) in items" :key="i">

                    <v-list-tile-action>
                        <v-icon v-html="item.icon"></v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            <router-link v-bind:to="item.path" v-text="item.title"></router-link>
                        </v-list-tile-title>
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

        <footer>
            <ul class="g0v-footer">
                <li>
                    <a target="_blank" rel="noopener noreferrer" href="https://git.copernicani.it/g0v/web-budget">Seguici su Gitlab</a>
                </li>
                <li class="g0v-credits">
                    <router-link :to="{ name: 'credits' }">crediti</router-link>
                </li>
                <li class="g0v-license">
                    <a target="_blank" rel="license" href="http://creativecommons.org/licenses/by/4.0/">
                        <img alt="Creative Commons License" src="https://i.creativecommons.org/l/by/4.0/80x15.png" />
                    </a>
                </li>
            </ul>
        </footer>

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
        },
        {
          icon: "",
          title: "Crediti",
          path: "/credits"
        }
      ],
      title: "Budget.g0v.it"
    };
  },
  methods: {}
};
</script>

<style>
a {
  text-decoration: none;
}

footer {
  height: 3rem;
  width: 100;
  padding: 0.5rem 2rem;
}

.g0v-footer {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  justify-content: space-between;
  text-decoration: none;
}

.g0v-credits{
    padding: 0 2rem;
}

.g0v-footer img {
  border-width: 0;
}

.g0v-footer a {
  color: rgba(0, 0, 0, 0.87);
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  text-decoration: none;
}

.g0v-license{
   margin-left: auto;
}

</style>
