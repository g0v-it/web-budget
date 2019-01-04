<template>
  <VApp v-if="configurationLoaded">
    <!--  <VNavigationDrawer
      temporary v-model="drawer"
      app
    >
      <VList>
        <VListTile
          value="true"
          v-for="(item, i) in items"
          :key="i"
        >
          <VListTileAction>
            <VIcon v-html="item.icon" />
          </VListTileAction>
          <VListTileContent>
            <VListTileTitle><RouterLink :to="item.path" v-text="item.title" /></VListTileTitle>
          </VListTileContent>
        </VListTile>
      </VList>
    </VNavigationDrawer> -->

    <VToolbar app :clipped-left="clipped">
      <!--  <VToolbarSideIcon @click.stop="drawer = !drawer" /> -->
      <VMenu :nudge-width="100">
        <!-- <VToolbarTitle slot="activator"> -->
        <VToolbarSideIcon slot="activator" />
        <!--  </VToolbarTitle> -->

        <VList>
          <VListTile
            value="true" v-for="(item, i) in items"
            :key="i"
          >
            <VListTileAction>
              <VIcon v-html="item.icon" />
            </VListTileAction>
            <VListTileContent>
              <VListTileTitle>
                <RouterLink v-if="!item.external" :to="item.path" v-text="item.title" />
                <a v-if="item.external" target="_blank" rel="noopener noreferrer" :href="item.path">{{item.title}}</a>
                 <v-icon v-if="item.external" size="10px" class="external-link">launch</v-icon>
              </VListTileTitle>
            </VListTileContent>
          </VListTile>
        </VList>
      </VMenu>

      <a
        :href="url_g0v" target="_blank"
        class="g0v-header-link"
      >
        <img :src="string['$LOGO_HEADER_1']" class="g0v-header-logo">
      </a>
      <!--RouterLink
        :to="{ name: 'accounts-partition',params:{urlPartitionID:$root.$data.budgetState.selectedPartition} }"
        class="g0v-header-link"
      >
        <img :src="string['$LOGO_HEADER_2']" class="g0v-header-logo-g0v">
      </RouterLink-->
      <VFlex class="text-xs-left">
        <VToolbarTitle v-text="title" class="g0v-header-title" />
      </VFlex>

      <SocialSharing
        inline-template
        :hashtags="appHashtag"
        class="g0v-social-buttons"
      >
        <div>
          <Network network="twitter" class="g0v-social-link">
            <i class="fab fa-twitter" />
          </Network>
          <Network network="facebook" class="g0v-social-link">
            <i class="fab fa-facebook-f" />
          </Network>
        </div>
      </SocialSharing>
    </VToolbar>

    <VContent>
      <KeepAlive :include="['BubbleView', 'TableView']">
        <RouterView />
      </KeepAlive>
    </VContent>

    <footer>
      <ul class="g0v-footer">
        <li>
          <a :href="string['$LOGO_FOOTER_G0V_HREF']" target="_blank">
            <img :src="string['$LOGO_FOOTER_G0V']" 
            class="g0v-logo"/>
          </a>
        </li>
        <li>
          <a
            target="_blank" rel="noopener noreferrer"
            :href="string['$FOLLOW_US_LINK']"
          >
            {{ string['$FOLLOW_US_TEXT'] }}
          </a>
        </li>
        <li class="g0v-credits hide">
          <RouterLink :to="{ name: 'credits' }">
            {{ string['$CREDIT_PAGE'] }}
          </RouterLink>
        </li>
        <li class="hide">
          <a
            target="_blank" rel="noopener noreferrer" :href="string['$TERMS_URL']"
          >
            {{ string['$TERMS_PAGE'] }}
          </a>
        </li>
        <li class="g0v-version hide">
          {{ version }}
        </li>
        <li class="g0v-license hide">
          <a
            target="_blank" rel="license"
            href="http://creativecommons.org/licenses/by/4.0/"
          >
            <img alt="Creative Commons License" src="https://i.creativecommons.org/l/by/4.0/80x15.png">
          </a>
        </li>
      </ul>
    </footer>
  </VApp>
  <div v-else-if="!configurationLoaded" class="progress">
    <div class="indeterminate" />
  </div>
</template>

<script>
import { get } from "axios";
import Configuration from "@/utils/configuration";
var resizeTimer;
var currentWidth;

export default {
  name: "App",
  data() {
    return {
      drawer: false,
      clipped: false,
      string: Configuration.current().strings,
      title: "",
      version: ""
    };
  },
  methods: {
    resizeHandler() {
      // debouncing
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        let widthChanged = currentWidth != document.documentElement.clientWidth;
        if (widthChanged) {
          currentWidth = document.documentElement.clientWidth;
          window.location.reload();
        }
      }, 250);
    }
  },
  created() {
    get("/version.json")
      .then(res => {
        this.$data.version = res.data.version;
      })
      .catch(error => {
        this.$data.version = "-";
      });
  },
  mounted() {
    currentWidth = document.documentElement.clientWidth;
    this.$nextTick(function() {
      /* window.addEventListener("resize", this.resizeHandler); */
    });
  },
  beforeUpdate() {},
  computed: {
    items() {
      return [
        {
          icon: "bubble_chart",
          title: this.string["$FIRST_VIEW"],
          path: "/",
          external:false
        },
        /* {
          icon: "view_list",
          title: this.string["$SECOND_VIEW"],
          path: "/list"
        }, */
        {
          icon: "table_chart",
          title: this.string["$THIRD_VIEW"],
          path: "/table",
          external:false
        },
        {
          icon: "cloud",
          title: this.string["$SPARQL_PAGE"],
          path: this.string["$URL_SPARQL_PAGE"],
          external:true
        },
        {
          icon: "share",
          title: this.string["$LOD_PAGE"],
          path: this.string["$URL_LOD_PAGE"],
          external:true
        },
        {
          icon: "people",
          title: this.string["$CREDIT_PAGE"],
          path: "/credits",
          external:false
        },
        {
          icon: "account_balance",
          title: this.string["$TERMS_PAGE"],
          path: this.string["$TERMS_URL"],
          external:true
        }
      ];
    },
    /* logo_copernicani_orizzontale() {
      return require("@/assets/copernicani_orizzontale.png");
    },
    logo_g0v() {
      return require("@/assets/g0v.svg");
    }, */
    url_g0v() {
      return Configuration.current().g0vLogoUrl;
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
      return Configuration.current().appHashtag;
    },
    configurationLoaded() {
      return this.$root.$data.configurationLoaded;
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeHandler());
  }
};
</script>

<style>

a {
  text-decoration: none;
}
.external-link{
  margin-left:0.5rem;
}
.g0v-logo{
  margin-left:2rem ;
  margin-right:2rem ;
  height: 20px;
  width: 50px;
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
    padding: 0.5rem 1rem;
  }
  .g0v-footer {
    margin: 0;
    padding: 0;
    list-style: none;
    column-count: 2;
    text-align: start;
  }
  .hide {
    display: none;
  }
}
@media (max-height: 415px) {
  .hide {
    display: none;
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

.g0v-version {
  margin-left: auto;
  margin-right: 10px;
  font-size: 0.7rem;
  color: rgba(100, 100, 100, 1);
}
.g0v-license {
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
.progress {
  width: 50%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 50%;
  transform: translateX(-50%);
  height: 4px;
  display: block;
  background-color: #fcff66;
  border-radius: 2px;
  background-clip: padding-box;
  overflow: hidden;
}
.progress .indeterminate {
  background-color: #e5e31c;
}
.progress .indeterminate:before {
  content: "";
  position: absolute;
  background-color: inherit;
  top: 0;
  left: 0;
  bottom: 0;
  will-change: left, right;
  -webkit-animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395)
    infinite;
  animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
}
.progress .indeterminate:after {
  content: "";
  position: absolute;
  background-color: inherit;
  top: 0;
  left: 0;
  bottom: 0;
  will-change: left, right;
  -webkit-animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1)
    infinite;
  animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1)
    infinite;
  -webkit-animation-delay: 1.15s;
  animation-delay: 1.15s;
}

@-webkit-keyframes indeterminate {
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%;
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }
}
@keyframes indeterminate {
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%;
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }
}
@-webkit-keyframes indeterminate-short {
  0% {
    left: -200%;
    right: 100%;
  }
  60% {
    left: 107%;
    right: -8%;
  }
  100% {
    left: 107%;
    right: -8%;
  }
}
@keyframes indeterminate-short {
  0% {
    left: -200%;
    right: 100%;
  }
  60% {
    left: 107%;
    right: -8%;
  }
  100% {
    left: 107%;
    right: -8%;
  }
}
</style>
