<template>
  <v-app>
    <v-toolbar app :clipped-left="clipped">
      <router-link :to="{ name: 'd3-bubble-graph' }" class="g0v-header-link"><img :src="logo_copernicani_orizzontale" class="g0v-header-logo"></router-link>
      <a :href="url_g0v" target="_blank"  class="g0v-header-link"><img :src="logo_g0v" class="g0v-header-logo-g0v"/></a>
      <v-flex class="text-xs-left">
        <v-toolbar-title v-text="title" class="g0v-header-title" />
      </v-flex>

      <social-sharing
        inline-template
        :hashtags="appHashtag"
        class="g0v-social-buttons"
      >
        <div>
          <network network="twitter" class="g0v-social-link">
            <i class="fab fa-twitter" />
          </network>
          <network network="facebook" class="g0v-social-link">
            <i class="fab fa-facebook-f" />
          </network>
        </div>
      </social-sharing>

      <v-menu :nudge-width="100">
        <v-toolbar-title slot="activator">
          <v-icon>{{ currentItemIcon }}</v-icon><v-icon>arrow_drop_down</v-icon>
        </v-toolbar-title>

        <v-list>
          <v-list-tile
            value="true" v-for="(item, i) in items"
            :key="i"
          >

            <v-list-tile-action>
              <v-icon v-html="item.icon" />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                <router-link :to="item.path" v-text="item.title" />
              </v-list-tile-title>
            </v-list-tile-content>

          </v-list-tile>
        </v-list>
      </v-menu>

    </v-toolbar>

    <v-content>
      <router-view />
    </v-content>

    <footer>
      <ul class="g0v-footer">
        <li>
          <a
            target="_blank" rel="noopener noreferrer"
            href="https://github.com/g0v-it"
          >Seguici su GitHub</a>
        </li>
        <li class="g0v-credits">
          <router-link :to="{ name: 'credits' }">crediti</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'terms-and-conditions' }">termini d'uso</router-link>
        </li>
        <li class="g0v-license">
          <a
            target="_blank" rel="license"
            href="http://creativecommons.org/licenses/by/4.0/"
          >
            <img alt="Creative Commons License" src="https://i.creativecommons.org/l/by/4.0/80x15.png">
          </a>
        </li>
      </ul>
    </footer>

  </v-app>
</template>

<script>
import Configuration from "@/utils/configuration";

export default {
  name: "App",
  data() {
    return {
      drawer: false,
      clipped: false,
      items: [
        {
          icon: "bubble_chart",
          title: "Grafico a Bolle",
          path: "/"
        },
        {
          icon: "view_list",
          title: "Lista Azioni",
          path: "/list"
        },
        {
          icon: "table_chart",
          title: "Tabella Azioni",
          path: "/table"
        },
        {
          icon: "people",
          title: "Crediti",
          path: "/credits"
        },
        {
          icon: "account_balance",
          title: "Termini d'uso",
          path: "/terms-and-conditions"
        }
      ],
      title: ""
    };
  },
  methods: {},
  computed: {
    logo_copernicani_orizzontale() {
      return require("@/assets/copernicani_orizzontale.png");
    },
    logo_g0v() {
      return require("@/assets/g0v.svg");
    },
    url_g0v() {
      return Configuration().current().g0vLogoUrl;
    },
    currentItem() {
      let currentPath = this.$route.path;

      let item = this.items.find(function(el) {
        return el.path === currentPath;
      });

      return item;
    },
    currentItemIcon() {
      if (this.currentItem) {
        return this.currentItem.icon;
      } else {
        return "bubble_chart";
      }
    },
    appHashtag() {
      return Configuration().current().appHashtag;
    }
  }
};
</script>

<style>
a {
  text-decoration: none;
}

@media (min-width: 768px) {
  footer {
    height: 3rem;
    width: 100;
    padding: 0.5rem 2rem;
  }
  .g0v-credits {
    padding: 0 2rem;
  }
  .g0v-footer {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    justify-content: space-between;
    text-decoration: none;
  }
}

@media (max-width: 768px) {
  footer {
    height: 4rem;
    width: 100;
    padding: 0.5rem 2rem;
  }
  .g0v-footer {
    margin: 0;
    padding: 0;
    list-style: none;
    column-count: 2;
    text-align: start;
  }
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

.g0v-license {
  margin-left: auto;
}
.g0v-header-link {
  display: block;
  height: 64px;
}
.g0v-header-logo {
  max-height: 90%;
}
.g0v-header-title {
  margin-left: 1em;
}
.g0v-social-buttons {
  margin-right: 1em;
}
.g0v-social-link {
  width: 32px;
  font-size: 20px;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.54);
}
.g0v-header-logo-g0v {
  height: 36px;
  vertical-align: bottom;
  margin: 12px 1em;
}
</style>
