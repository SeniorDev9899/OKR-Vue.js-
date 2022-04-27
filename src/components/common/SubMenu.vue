<template>
<v-list class="sub_li" v-if="subMenu">
  <v-container align-end justify-end class="sub_co">
    <v-layout align-end justify-end fill-height column>
      <v-flex shrink>
        <v-list-item v-for="sub_menu in subMenus" :key="sub_menu.name" id="nav_font_sub" :class="subMenu ? 'subMenu' : ''">
          <router-link :to=sub_menu.route style="color : white !important; border-bottom: 0px !important;">{{ sub_menu.name }}</router-link>
        </v-list-item>
      </v-flex>
    </v-layout>
  </v-container>
</v-list>
</template>

<script>
export default {
  props: {
    subMenus: {
      type: Array
    },
    subMenu: {
      type: Boolean
    }
  },
  created() {

  }
}
</script>

<style>
#nav_font_sub {
  color: white !important;
}

#nav_font_sub:hover {
  background-color: rgb(75 111 252) !important;
}

.sub_co {
  padding: 0px !important;
}

.sub_li {
  padding-bottom: 0px !important;
}

.subMenu {
  opacity: 1;
  transform: translateX(0px) !important;
  transition: all 2s ease 0.2s;
}
</style>
