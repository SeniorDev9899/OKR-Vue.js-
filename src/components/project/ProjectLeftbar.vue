<template>
<v-navigation-drawer color="#ECEFF1" height="1000"  ref="projectDrawer" :width="navigation.width" v-model="navigation.shown">
  <v-container fluid>
    <v-row class="ma-2 pt-2">
      <v-text-field outlined dense append-icon="mdi-magnify"></v-text-field>
    </v-row>
    <v-row>
      <v-btn  class="ml-3 justify-start" block text>
				<v-icon class="pt-1 mr-2">mdi-tag-outline</v-icon>按标签查看
			</v-btn>
      <v-btn @click="setFilter('recent')"  class="ml-3 justify-start" block text>最近查看</v-btn>
      <v-btn @click="setFilter('owner')" class="ml-3 justify-start" block text>
				我负责的
			</v-btn>
      <v-btn @click="setFilter('participant')" class="ml-3 justify-start" block text>
				我参与的
			</v-btn>
      <v-btn @click="setFilter('follower')" class="ml-3 justify-start" block text>
				我关注的
			</v-btn>
      <!--
      <v-btn @click="setFilter('company_visible')" class="ml-3 justify-start" block text>
				所有公开的
			</v-btn>
      
      <v-btn class="ml-3 justify-start" block text>
				公司全部项目审批
			</v-btn> -->
      <v-divider></v-divider>
      <v-btn @click="setFilter('company')" class="ml-3 justify-start" block text>
				公司全部项目
			</v-btn>
      <DepartmentPicker v-if="rendered" @pick="getDepartmentItem"/>
    </v-row>
  </v-container>
</v-navigation-drawer>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ProjectLeftbar',
  components: {
    DepartmentPicker: () => import('@/components/common/DepartmentPicker.vue')
  },
  data: () => ({
    navigation: {
      shown: true,
      width: 250,
      borderSize: 2
    },
    rendered: false
  }),
  computed: {
    ...mapGetters('auth', ['authUser']),
    direction() {
      return this.navigation.shown === false ? "Open" : "Closed";
    },
  },
  methods: {
    ...mapActions('item', ['getItems', 'getRecentItems']),
    setBorderWidth() {
      let i = this.$refs.projectDrawer.$el.querySelector(
        ".v-navigation-drawer__border"
      );
      i.style.width = this.navigation.borderSize + "px";
      i.style.cursor = "ew-resize";
      i.style.backgroundColor = "gray";
    },
    setEvents() {
      const minSize = this.navigation.borderSize;
      const el = this.$refs.projectDrawer.$el;
      const drawerBorder = el.querySelector(".v-navigation-drawer__border");
      const vm = this;
      const direction = el.classList.contains("v-navigation-drawer--right") ?
        "right" :
        "left";
      function resize(e) {
        document.body.style.cursor = "ew-resize";
        let f =
          direction === "right" ?
          document.body.scrollWidth - e.clientX - 190 :
          e.clientX - 190;
        el.style.width = f + "px";
      }

      drawerBorder.addEventListener(
        "mousedown",
        (e) => {
          if (e.offsetX < minSize) {
            el.style.transition = "initial";
            document.addEventListener("mousemove", resize, false);
          }
        },
        false
      );

      document.addEventListener(
        "mouseup",
        () => {
          el.style.transition = "";
          this.navigation.width = el.style.width;
          document.body.style.cursor = "";
          document.removeEventListener("mousemove", resize, false);
        },
        false
      );
    },
    setFilter(filterName) {
      switch ( filterName ) {
        case 'recent':
          this.getItems({item_recents: this.authUser.user_recent_items})
          break;
        case  'owner':
          this.getItems({item_owner: this.authUser.id})
          break;
        case 'participant':
          this.getItems({item_participant: this.authUser.id})
          break;
        case 'follower':
          this.getItems({item_followers: this.authUser.id})
          break;
        case 'company_visible':
          this.getItems({item_visible_range: 2})
          break;
        case 'company':
          this.getItems({item_company_id: this.authUser.user_company_id})
          break;
      }
      this.$emit('setMode', filterName)
    },
    getDepartmentItem(e) {
    }
  },
  mounted() {
    this.getItems({item_recents: this.authUser.user_recent_items})
    this.setBorderWidth();
    this.setEvents();
    this.$emit('rendered')
    this.rendered = true
  }
}
</script>
