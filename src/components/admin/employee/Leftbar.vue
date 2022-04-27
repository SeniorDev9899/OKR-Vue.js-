<template>
<div id="group-drawer">
  <v-navigation-drawer ref="drawer" :width="navigation.width">
    <v-list>
      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title class="pl-3 pt-4">
            <v-btn plain small disabled @click="addDepartment">添加部门 <v-icon>mdi-plus</v-icon></v-btn>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <DepartmentOAPicker @pick="selectDepartment"/>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <NewDepartDlg ref="newDepartDlg"/>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'GroupLeftbar',
  components: {
    NewDepartDlg: () => import('@/components/admin/employee/NewDepartDlg.vue'),
    DepartmentOAPicker: () => import('@/components/admin/DepartmentOAPicker.vue')
  },
  props: {
    departments: {
      type: Array
    }
  },
  computed: {
    ...mapGetters('app', ['drawer'])
  },
  data() {
    return {
      navigation: {
        width: 200,
        borderSize: 1
      },
      selection: null
    }
  },
  methods: {
    setBorderWidth() {
      let i = this.$refs.drawer.$el.querySelector(
        ".v-navigation-drawer__border"
      );
      i.style.width = this.navigation.borderSize + "px";
      i.style.cursor = "ew-resize";
      i.style.backgroundColor = "#BBDEFB";
    },
    setEvents() {
      const minSize = this.navigation.borderSize;
      const el = this.$refs.drawer.$el;
      const drawerBorder = el.querySelector(".v-navigation-drawer__border");
      const vm = this;
      const direction = el.classList.contains("v-navigation-drawer--right")
        ? "right"
        : "left";

      function resize(e) {
        document.body.style.cursor = "ew-resize";
        let f =
          direction === "right"
            ? document.body.scrollWidth - !this.drawer ? e.clientX-190 : e.clientX
            :  !this.clientX ? e.clientX-190 : e.clientX;
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
    async addDepartment() {
      if(await this.$refs.newDepartDlg.open()) {

      }
    },
    selectDepartment(e) {
      this.$emit('pickDepart', e)
    }
  },
  mounted() {
    this.setBorderWidth();
    this.setEvents();
  }
}
</script>
