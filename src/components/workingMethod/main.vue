<template>
<v-sheet class="main-page-container pt-2">
  <Header @pickObject="pickObject" :selectedObj="selectedObj" />
  <div class="page-content d-flex justify-space-between align-top flex-wrap">
    <ThisWeek :selectedObj="selectedObj" />
    <Object :selectedObj="selectedObj" @openObjDetailTab="openObjDetailTab" @openKRDetailTab="openKRDetailTab" />
    <NextWeek :selectedObj="selectedObj" />
    <Progress />
  </div>
  <CreateProjectDlg @create="createNewItem" ref="createItemDlg" />
  <!-- <v-navigation-drawer :width="isShowObj ? 800 : 0" right permanent fixed>
    <v-row class="d-flex justify-end ma-3">
      <v-btn fab small text @click="closeObjDetailTab">
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </v-row>
    <OkrDetailComponent v-if="selectedObj" :obj_id="currentObject" :isTab="true" />
  </v-navigation-drawer> -->
  <RightObjectEditor ref="rightObjectEditor" />
  <RightEditor ref="rightEditor" />
</v-sheet>
</template>

<script>
import Header from '@/components/workingMethod/Header.vue';
import NextWeek from '@/components/workingMethod/NextWeek.vue';
import Object from '@/components/workingMethod/Object.vue';
import Progress from '@/components/workingMethod/Progress.vue';
import ThisWeek from '@/components/workingMethod/ThisWeek.vue';
import OkrDetailComponent from '@/components/okrgoal/okrDetail/OkrDetailComponent.vue';
import {
  getUser
} from '@/utils/authUser.service';
import {
  mapGetters,
  mapActions
} from 'vuex';

export default {
  name: 'OKRWorkingMethodPage',
  components: {
    CreateProjectDlg: () => import('@/components/common/CreateProjectDlg.vue'),
    RightEditor: () => import('@/components/okrgoal/rightInfo/RightEditor.vue'),
    Header,
    NextWeek,
    Object,
    Progress,
    ThisWeek,
    OkrDetailComponent,
    RightObjectEditor: () => import('@/components/okrmap/RightObjectEditor.vue'),
  },
  data() {
    return {
      newTask: {},
      isShowObj: false,
      currentObject: null
    }
  },
  mounted() {
    this.getUsers();
    // get current object by id
    this.getOkrs({
      filter: {}
    });
    // this.getOkrs({filter: {ob_owner: getUser().id}});

    // get object list for addsort view
    this.getOkrsForAddsort({
      ob_company_id: 1,
      ob_status: "",
      ob_owner: getUser().id
    });
  },
  computed: {
    ...mapGetters("okr", ["okrObj", "okrDetail"]),
    selectedObj: function () {
      if (!this.okrDetail.ob_id) {
        if (this.okrObj[0]) {
          this.getDetail(this.okrObj[0].ob_id);
          this.currentObject = this.okrObj[0].ob_id;
          this.getObjectProgress({
            "pr_parent": this.okrObj[0].ob_id,
          });
        }
        return this.okrObj[0];
      } else {
        return this.okrDetail;
      }
    }
  },
  methods: {
    ...mapActions("user", ['getUsers']),
    ...mapActions("okr", ["getOkrs", "getDetail", "getOkrsForAddsort"]),
    ...mapActions('item', ['addItem', 'updateItem']),
    ...mapActions('progress', ['getObjectProgress']),
    getCurrentWeek() {
      let curr = new Date; // get current date
      let first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
      let last = first + 6; // last day is the first day + 6

      let firstday = new Date(curr.setDate(first)).toUTCString();
      let lastday = new Date(curr.setDate(last)).toUTCString();
      return {
        startDate: firstday,
        endDate: lastday
      }
    },
    createNewItem(newItem) {
      this.addItem(newItem)
    },
    openObjDetailTab() {
      this.$refs.rightObjectEditor.open(this.selectedObj)
      // this.isShowObj = true;
    },
    closeObjDetailTab() {
      if (!this.isShowObj) {

      } else {
        this.isShowObj = false;
      }
    },
    openKRDetailTab(data) {
      this.$refs.rightEditor.open({
        krObj: data,
        obId: this.selectedObj.ob_id,
        obStatus: this.selectedObj.ob_status
      });
    },
    pickObject(e) {
      this.getObjectProgress({
        "pr_parent": e,
      });
      this.currentObject = e; 
    }
  }
}
</script>

<style scoped>
.main-page-container {
  background-color: rgb(40, 121, 255);
}

.page-content {
  height: calc(90vh);
  background-color: #fff;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  align-items: stretch;
}
</style>
