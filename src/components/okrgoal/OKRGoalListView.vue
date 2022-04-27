<template>
<v-container fluid class="px-0 py-0" style="height: 100%">
  <v-skeleton-loader v-if="loading" type="article,list-item-avatar-three-line,list-item-avatar-three-line,list-item-avatar-three-line,list-item-avatar-three-line,list-item-avatar-three-line,list-item-avatar-three-line,list-item-avatar-three-line,list-item-avatar-three-line,list-item-avatar-three-line"></v-skeleton-loader>
  <Header @mode="setArrangeMode" :showHint="showHint" @displayRightUserEdit="handle_displayRightUserEdit" />
  <v-sheet class="goal-content">
    <v-container fluid>
      <v-row v-if="!currentObject">
        <!-- <v-sheet v-if="okrObj.length == 0" style="display:flex;align-center;justify-content:center;width:100%;background-color:rgb(247 249 251);padding-top:10px">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-sheet> -->

        <v-col cols="12" v-if="(okrObj.length) !== 0">
          <span v-for="(obj) in okrObj" :key="obj.id">
            <GoalListItem :item="obj" :okrObj="okrObj" :pageItemCount="$route.params.countsPerPage" :currentPage="currentPage" @selectObject="selectObject()" @selectKR="selectKR" />
          </span>
        </v-col>
        <v-col cols="12" class="text-center" v-if="okrObj.length == 0">
          <div v-if="!isHidden" style="margin-top: 100px">
            <!-- <v-card class="d-flex justify-center mb-6">
                            <v-img width="128" src="@/assets/images/update.png"></v-img>
                        </v-card> -->
            <div class=" text-md-body-1">
              尚未制定「{{this.okrFilter.ob_cycle!=null?(this.okrFilter.ob_cycle).replace(/(.*)\/(.*)/, "$1年 第$2季度").replace(/(.*)-(.*)/, "$1年 $2月"):''}}」的 OKRs <p></p>
              好的管理，从制定工作目标开始。围绕目标开展重点工作，目标达成更可控。<p></p>
              <v-btn class="primary" @click="confirmTaRemind">
                提醒 ta 创建
              </v-btn>
            </div>
            <div class="text-caption mt-8 aling-center">
              <span class="grey--text">找不到OKR？试试</span>
              <span @click="hintFilters" style="cursor: pointer" class="yellow--text align-center mx-2">
                <v-icon class="mx-1" color="yellow">mdi-hand-pointing-right</v-icon>检查
              </span>
              <span class="grey--text">顶部筛选条件</span>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="okrObj.length > 0">
        <div class="text-caption mt-4 aling-center ml-auto mr-auto">
          <span class="grey--text">找不到OKR？试试</span>
          <span @click="hintFilters" style="cursor: pointer" class="yellow--text align-center mx-2">
            <v-icon class="mx-1" color="yellow">mdi-hand-pointing-right</v-icon>检查
          </span>
          <span class="grey--text">顶部筛选条件</span>
        </div>
      </v-row>
      <v-row>
        <v-col class="d-flex mr-10" v-if="okrObj.length !== 0">
          <v-spacer></v-spacer>
          <v-pagination :length="
                pageInfo.page_totals
                  ? Math.ceil(
                      pageInfo.page_totals / $route.params.countsPerPage
                    )
                  : 0
              " v-model="currentPage" @input="getPageItems" prev-icon="mdi-menu-left" next-icon="mdi-menu-right">
          </v-pagination>
        </v-col>
      </v-row>
      <v-row v-if="currentObject">
        <OkrDetailComponent />
        <OKRTab />
      </v-row>
    </v-container>
  </v-sheet>
  <OKRUserRightEditor ref="userEditor" />
  <ConfirmDlg ref="confirmDlg" />
</v-container>
</template>

<script>
import {
  mapGetters,
  mapActions,
  mapState
} from "vuex";
import AddSort from "@/components/common/AddSort.vue";
import GoalListItem from "@/components/okrgoal/GoalItemComponent.vue";
import GoalAddComponent from "@/components/okrgoal/GoalAddComponent.vue";
import OKRTab from "@/components/okrgoal/tabView/OKRGoaltab.vue";
import OkrDetailComponent from "@/components/okrgoal/okrDetail/OkrDetailComponent.vue";
import OKRUserRightEditor from "@/components/okrgoal/OKRUserRightEditor.vue";
import {
  Routes
} from "@/constants/routes";
import {
  getUser
} from "@/utils/authUser.service";
import {
  messages
} from "@/constants/messages";
export default {
  components: {
    AddSort,
    GoalListItem,
    GoalAddComponent,
    OKRTab,
    OkrDetailComponent,
    Header: () => import("@/components/okrgoal/Header.vue"),
    OKRUserRightEditor,
    ConfirmDlg: () => import('@/components/common/ConfirmDlg.vue')
  },
  data() {
    return {
      currentObject: null,
      isShow: false,
      isHidden: false,
      objs: [],
      updatedOKR: [],
      currentPage: null,
      showHint: false,
      arrangeMode: 1,
      arrangeFilter: "created_at ASC",
    };
  },
  computed: {
    ...mapGetters("okr", ["okrObj", "pageInfo", "loading"]),
    ...mapGetters("auth", ["authUser"]),
    ...mapGetters("app", ["okrFilter"])
    // pageItemCount: this.$route.params.countsPerPage,
    // currentPage: this.$route.params.pageNum
  },
  mounted() {
    this.currentPage = Number(this.$route.params.pageNum);
    this.getOkrs({
      payload: {
        page_start: (this.currentPage - 1) * this.$route.params.countsPerPage,
        page_counts: this.$route.params.countsPerPage,
      },
    });
    // show SubMenu on OKR Goal
    if (this.currentPage == 1) {
      this.$emit("ShowSubMenu", true);
    }
    // get object list for addsort view
    this.getOkrsForAddsort({
      ob_company_id: this.authUser.user_company_id,
      ob_status: "",
      ob_owner: this.authUser.id,
    });
  },
  methods: {
    ...mapActions("okr", ["getOkrs", "getFilteredOkrs", "getOkrsForAddsort"]),
    ...mapActions("app", ["setFilter", "formatFilter"]),
    selectObject() {
      // this.currentObject = this.okrObj[index];
      this.$emit("selectedObject");
    },
    selectKR(data) {
      this.$emit("selectKR", data);
    },
    async confirmTaRemind() {
      if (await this.$refs.confirmDlg.open('确定提醒 Ta 么？', '系统将会发送通知提醒 Ta 去创建 OKR', {})) {
        this.$store.dispatch("app/setNotification", {
          status: "success",
          text: messages.NOTIFICATION_SUCESSFULLY,
        });
      }
    },
    getPageItems() {
      this.getOkrs({
        payload: {
          page_start: (this.currentPage - 1) * this.$route.params.countsPerPage,
          page_counts: this.$route.params.countsPerPage,
        },
      });
      this.$router.push({
        path: `${Routes.OKR_LIST_PAGE}/${this.$route.params.countsPerPage}/${this.currentPage}`,
      });
    },
    hintFilters() {
      this.showHint = true;
      setTimeout(() => {
        this.showHint = false;
      }, 5000);
    },
    handle_displayRightUserEdit(prop) {
      this.$refs.userEditor.open(prop);
    },
    setArrangeMode(e) {
      this.arrangeMode = e;
      let temp = null;
      switch (this.arrangeMode) {
        case 1:
          temp = "created_at ASC";
          break;
        case 2:
          temp = "created_at DESC";
          break;
        case 3:
          temp = "updated_at ASC";
          break;
        default:
          temp = "updated_at DESC";
      }
      this.setFilter({
        ob_sortby: temp,
      });
      this.getOkrs({
        payload: {
          page_start: (this.currentPage - 1) * this.$route.params.countsPerPage,
          page_counts: this.$route.params.countsPerPage,
        },
      });
    },
  },
};
</script>

<style>
.goal-content {
  width: 100%;
  height: calc(100% - 140px);
  background-color: #f7f9fb !important;
}

.create-goal-letter {
  font-size: 14px;
}
</style>
