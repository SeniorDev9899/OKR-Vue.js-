<template>
<v-container fluid class="goal-container">
  <v-row style="height:100%;width:100%;" no-gutters>
    <SubMenu v-if="showSubMenu" />
    <v-col>
      <!--<Header /> -->
      <router-view @selectKR="selectKR" @selectedObject="selectedObject" @ShowSubMenu="handle_ShowSubMenu"></router-view>
    </v-col>
    <RightEditor ref="rightEditor" />
  </v-row>
</v-container>
</template>

<script>
import RightSidebar from '@/components/common/RightSidebar.vue';
import OKRGoalListView from '@/components/okrgoal/OKRGoalListView.vue';
import SubMenu from '@/components/okrgoal/SubMenu.vue';

export default {
  components: {
    RightSidebar,
    OKRGoalListView,
    SubMenu,
    // Header: () => import("@/components/okrgoal/Header.vue"),
    RightEditor: () => import('@/components/okrgoal/rightInfo/RightEditor.vue'),
    // GoalLeftbar: () => import('@/components/okrgoal/GoalLeftbar.vue')
  },
  data() {
    return {
      app: true,
      isEditing: false,
      header: true,
      showSubMenu: null,
    }
  },
  created() {
    this.showSubMenu = true;
  },
  methods: {
    handdle_appToggle(prop) {
      this.app = prop;
    },
    selectKR(data) {
      this.$refs.rightEditor.open(data);
      this.isEditing = true
    },
    selectedObject() {
      this.$refs.rightEditor.close()
      this.isEditing = false
      this.header = false
      this.showSubMenu = !this.showSubMenu;
    },
    handleClose() {
      if(this.isEditing){
        this.$refs.rightEditor.close()
        this.isEditing = false
      }
    },
    handle_ShowSubMenu(prop) {
      this.showSubMenu = prop;
    }
  }
}
</script>

<style>
.goal-container {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

.v-main__wrap {
  height: 100%;
  width: 100%;
}
</style>
