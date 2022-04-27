<template>
  <v-card class="library-header">
    <v-container fluid class="header-field px-5 py-3">
      <div class="d-flex justify-space-between align-center ">
        <div class="d-flex justify-start top-right">
          <p>OKR 案例库</p>
          <div class="ml-4"></div>
        </div>
        <div class="d-flex justify-end">
          <span class="expansion-toggle ml-2" @click="setExpansionToggleone">
            <v-icon v-if="isExpansionToggle[0] == 0">
              mdi-toggle-switch-outline
            </v-icon>
          </span>
          <span class="expansion-toggle ml-2" @click="setExpansionToggleone">
            <v-icon v-if="isExpansionToggle[0] == 1">
              mdi-file-tree
            </v-icon>
          </span>
        </div>
      </div>
    </v-container>
    <v-container fluid style="background: #f7f9fb;">
      <div id="tabs">
        <div class="tabs mx-2">
          <a
            v-on:click="activetab = '1'"
            v-bind:class="[activetab === '1' ? 'active' : '']"
            >全部类型</a
          >
          <a
            v-on:click="activetab = menu.ob_id"
            v-bind:class="[activetab === menu.ob_id ? 'active' : '']"
            v-for="(menu, index) in okrMenu"
          >
            {{ menu.ob_name }}
          </a>
        </div>

        <div class="contents">
          <div v-if="activetab === '1'" class="tabcontent">
            <TabAlltype :menuId="1" :create_goal="create_goal" @createGoalLibrary="handle_createGoalLibrary" />
          </div>
          <div
            v-for="(menu, index) in okrMenu"
            v-if="activetab === menu.ob_id"
            class="tabcontent"
          > 
          <TabAlltype :menuId="menu.ob_id" :create_goal="create_goal" @createGoalLibrary="handle_createGoalLibrary" />
          </div>
        </div>
      </div>
    </v-container>
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import TabAlltype from "@/components/library/TabAlltype.vue";

export default {
  props: ['create_goal', 'library'],
  components: {
    TabAlltype,
  },
  data() {
    return {
      activetab: "1",
    }; 
  },
  computed: {
    ...mapGetters("okr", ["okrMenu"]),
    content() {
      return this.componentsName[this.active];
    },
    isExpansionToggle: {
      get() {
        return this.$store.getters["app/isExpansionToggle"];
      },
      set(newValue) {
        return newValue;
      },
    },
  },
  mounted() {
    this.getSettings();
    this.getLibrarymenu({});
  },
  methods: {
    activate(index) {
      this.active = index;
    },
    handle_createGoalLibrary(prop) {
      this.$emit("createGoalLibrary", prop);
    },
    ...mapActions("app", [
      "setExpansionToggleone",
      "setMoreSettingToggle",
      "getSettings",
    ]),
    ...mapActions("okr", ["getLibrarymenu"]),
  },
};
</script>
<style>
.library-header {
  box-shadow: none !important;
}
.top-right p {
  font-size: 20px;
}
.expansion-toggle {
  border: 1px solid #e6eaef;
  border-radius: 3px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  color: #3f4755;
}
.expansion-toggle:hover {
  border-color: #2879ff;
  cursor: pointer;
}
.expansion-toggle .v-icon {
  font-size: 20px;
}
.expansion-toggle:hover .v-icon {
  color: #2879ff;
}
.header-field {
  box-shadow: 0 0 8px 0 #e9eef3;
}
.tabs__nav {
  display: flex;
}
.tabs a {
  padding: 5px 12px;
  transition: background-color 0.2s;
  border-right: none;
  font-size: 14px;
  margin-right: 8px;
  color: black;
}
.tabs a.active {
  background-color: #f0f2f5;
  cursor: default;
  border-radius: 21px;
  color: #2879ff;
}
</style>
