<template>
  <div>
    <v-list dense nav>
      <v-list-item :class="isActive ? 'open-active':''" link>
        <v-list-item-icon v-if="drawer" class="menu-icon">
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-icon v-if="!drawer" class="menu-icon">
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title  v-if="!item.children">
            <router-link class="drawer-link" :to="item.link">
              {{ item.title }}
            </router-link>
          </v-list-item-title>
          <v-list-item-title v-if="item.children">
            <v-container @click="openMenu" style="padding: 4px 0px 0px 0px">
              <v-row no-gutters>
                <v-col md="8">
                  {{ item.title }}
                </v-col>
                <v-col style="padding-left: 25px" md="4">
                  <v-icon :class="open ? 'arrow-open' : 'arrow-close'" small>
                    mdi-chevron-right
                  </v-icon>
                </v-col>
              </v-row>
            </v-container>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list v-if="open" dense nav>
      <div v-for="(child, i) in item.children" :key="i">
        <v-list-item :class="currentRouter == child.pageName ? 'nav-active' :''" @click="goto(child.link)" link>
          <div class="menu-child-space" />
          <v-list-item-title>
            {{ child.name }}
          </v-list-item-title>
        </v-list-item>
      </div>
    </v-list>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "LeftBarMenu",
  props: {
    item: {
      type: Object,
      default: () => {
        {
        }
      },
    },
  },
  computed: {
    ...mapGetters("app", ["drawer", "currentRouter"]),
    isActive: function () {
      const routes = JSON.stringify(this.item)
      if(routes.includes(this.currentRouter)) {
        this.open = true;
        return true
      } else {
        return false
      }
    }
  },
  data() {
    return {
      open: false,
    };
  },
  methods: {
    openMenu() {
      this.open = !this.open;
    },
    goto(link) {
      this.$router.push({path: link})
    },
  },
  mounted() {
    
  }
};
</script>
<style>
.drawer-link {
  text-decoration: none !important;
  color: white !important;
}
.menu-icon {
  margin-right: 8px !important;
}
.child-link {
  text-decoration: none;
  color: white;
}
.menu-child-space {
  width: 40px;
}
.arrow-open {
  transform: rotate(90deg);
  transition: 0.7s;
}
.arrow-close {
  transform: rotate(0deg);
  transition: 0.7s;
}
.nav-active {
  background-color: rgb(130,236,229, 0.3);
}
.open-active {
  background-color: rgb(130,136,229, 0.3);
}
</style>