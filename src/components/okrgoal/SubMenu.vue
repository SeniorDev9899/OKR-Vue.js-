<template>
<v-sheet  class="ho_nav_dra_sec transition" >
  <v-navigation-drawer ref="goalDrawer" :width="navigation.width" class="hnv_navdra" :class="app ? 'hnav_drw_1' : 'hnav_drw_2'">
    <!-- okr sidebar search -->
    <span style="display:none;">{{render}}</span>
    <div class="okr-sidebar-search">
      <v-icon>
        mdi-magnify
      </v-icon>
      <input type="text" data-name="search-input" placeholder="搜索同事" v-model="search" @focus="getAttentions" />
      <div class="search-result px-2 py-2" v-if="!!search && filteredAttentions.length != 0">
        <div class="search-label">点击下方姓名可搜索 Ta 的目标</div>
        <div class="pt-2">
          <div class="d-flex justify-start align-center my-2 attention-user" v-if="filteredAttentions.length != 0" v-for="user in filteredAttentions" :key="user.id" @click="pickAttention(user)">
            <UserAvatar :name="user.employeeName.substring(0, 1)" width='30px' height = '30px' />
            <span class="ml-2">{{user.employeeName}}</span>
          </div>
        </div>
      </div>
    </div>
    <v-list dense>
      <v-list-item class="okr-sidebar-bluehover">
        <!-- <router-link style="color: rgb(63, 71, 85);" class="routing-link" :to="`/home/okr_goal/list/${pageCount}/1`" @click="showOKR">
          我的OKR
        </router-link> -->
        <span @click="showOKR" style="cursor:pointer;">我的OKR</span>
      </v-list-item>
      <!-- :disabled="disabled" -->
      <v-expansion-panels v-model="panel">
        <v-expansion-panel>
          <v-expansion-panel-header @click="showAttentions">关注的人</v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="selectedAttentions">
              <div class="d-flex justify-start align-center my-2 attention-user" v-if="attentions.length != 0" v-for="user in attentions" :key="user.id" @click="pickAttention(user)">
                <UserAvatar :name="user.employeeName.substring(0, 1)" width='30px' height = '30px' />
                <span class="ml-2">{{user.employeeName}}</span>
              </div>
            </div>
            <v-menu bottom offset-y :close-on-content-click="closeOnContentClick" style="width: 538px;" v-model="pickModal">
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on">
                  <div class="add-important-person">
                    <v-icon aria-hidden="false" class="" style="font-size: 18px;">
                      mdi-plus
                    </v-icon>
                    <span>添加关注的人</span>
                  </div>
                </div>
              </template>

              <v-list style="padding: 0px 0px !important;">
                <v-list-item style="padding: 0px 0px !important;">
                  <v-list-item-title>
                    <!-- <UserPicker @pick="(param) => pickUser(param)" /> -->
                      <AdvancedUserPiker @closeModal="closeModal" :attentions="attentions" />
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-expansion-panel-content>
          <div class="up-company-line"></div>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header @click="getCompanyAllOkrs">公司全部目标</v-expansion-panel-header>
          <v-expansion-panel-content>
            <DepartmentPicker @pick="selectDepartment"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <div class="up-company-line"></div>
      <v-list-item class="okr-sidebar-bluehover">
        目标统计
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <div class="tog_hnav-back">
    <v-btn class="tg_hnav_btn" @click.stop="tog_hnav" v-bind:style="{ top: screenheight + scroll + 'px' }">
      <v-icon v-if="app" class="ma_icon_arrow">
        mdi-menu-left
      </v-icon>
      <v-icon v-if="disapp" class="ma_icon_arrow">
        mdi-menu-right
      </v-icon>
    </v-btn>
  </div>
</v-sheet>
</template>

<script>
import AdvancedUserPiker from "@/components/common/AdvancedUserPicker.vue";
import UserDepartmentTeamPicker from "@/components/common/UserDepartmentTeamPicker.vue";
import { constant } from '@/constants/constant.js'
import { mapActions, mapGetters } from 'vuex'
import { getUser } from '@/utils/authUser.service';
import UserPicker from "@/components/common/UserPicker.vue";
import UserAvatar from '@/components/common/UserAvatar.vue';

export default {
  components: {
    AdvancedUserPiker,
    DepartmentPicker: () => import("@/components/common/DepartmentPicker.vue"),
    UserDepartmentTeamPicker,
    UserPicker,
    UserAvatar
  },
  props: {
    subMenuList: {
      type: Array,
    },
  },
  data() {
    return {
      closeOnContentClick: false,
      app: true,
      disapp: false,
      sub_men: false,
      tree: [],
      panel: [0],
      scroll: 0,
      initiallyOpen: ["public"],
      navigation: {
        shown: true,
        width: 190,
        borderSize: 1
      },
      pickModal: false,
      attentions: [],
      search: null
    };
  },
  computed: {
    ...mapGetters("user", ["users"]),
    screenheight: function () {
      return Math.floor(window.screen.availHeight / 2) - 142;
    },
    direction() {
      return this.navigation.shown === false ? "Open" : "Closed";
    },
    pageCount: function() {
      return constant.pageCount;
    },
    filteredAttentions: function() {
      if(!!this.search) {
        return this.attentions.filter(user => user.employeeName.includes(this.search));
      }
    },
    render: function() {
      this.showAttentions();
    }
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll);
    this.setBorderWidth();
    this.setEvents();
    this.getUsers();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
  },
  methods: {
    ...mapActions("okr", ["getOkrs"]),
    ...mapActions("app", ['setFilter', 'formatFilter', 'setCompanyView', 'setPickedUser']),
    ...mapActions("user", ["getUsers", "updateUser", "updateUserVisitCnt"]),
    getAttentions() {
      this.showAttentions();
    },
    pickAttention(user) {
      this.setPickedUser(user);
      let filter = {};
      const currentCycle = this.getCycle();
      Object.assign(filter, { ob_status: "", ob_cycle: currentCycle, ob_owner: user.id });
      this.setFilter(filter);
      this.getOkrs({});
      this.updateUserVisitCnt(user);
      this.search = null;
    },
    showAttentions() {
      const currentUser = this.users.filter(u => u.id == getUser().id);
      if(currentUser.length != 0) {
        let userIds = currentUser[0].user_attentions.split(",");
        let filteredUsers = this.users.filter(u => userIds.includes(u.id + ""));
        this.attentions = filteredUsers;
      }
    },
    closeModal() {
      this.pickModal = false;
    },
    userPickerOpen() {
      this.$refs.userPicker.openDialog();
    },
    onScroll(e) {
      this.scroll = window.scrollY;
    },
    tog_hnav() {
      this.$emit("appToggle", this.app);
      this.disapp = !this.disapp;
      this.app = !this.app;
    },
    showOKR() {
      // this.setCompanyView('user')
      this.setPickedUser(getUser());
      this.formatFilter();
      const currentCycle = this.getCycle();
      let filter = {};
      Object.assign(filter, { ob_status: "", ob_cycle: currentCycle, ob_owner: getUser().id });
      this.setFilter(filter);
      this.getOkrs({});
    },
    getCompanyAllOkrs() {
      this.setCompanyView('company')
      this.formatFilter();
      this.getOkrs({});
    },
    pickDepartment(e) {
      this.upperDepartment = e.data;
    },
    setBorderWidth() {
      let i = this.$refs.goalDrawer.$el.querySelector(
        ".v-navigation-drawer__border"
      );
      i.style.width = this.navigation.borderSize + "px";
      i.style.cursor = "ew-resize";
      i.style.backgroundColor = "gray";
    },
    setEvents() {
      const minSize = this.navigation.borderSize;
      const el = this.$refs.goalDrawer.$el;
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
    selectDepartment(e) {
      // this.formatFilter()
      this.setFilter({ob_operator: `dp${e.data.dp_serial_id}.${e.data.id}`})
      this.getOkrs({})
    }
  },
};
</script>


<style>
.ho_nav_dra_sec {
  position: relative;
  height: 100%;
  display: flex;
  font-size: 14px;
  color: #565e66;
}

.ho_nav_dra_sec:hover .hnav_tg_co {
  display: flex !important;
}

.transition {
  transition: all 0.3s ease;
}

.hnav_2 {
  width: 175px !important;
}

.tg_hnav_btn {
  background-color: white !important;
  border-top-right-radius: 25px !important;
  border-bottom-right-radius: 25px !important;
  width: 10px;
  min-width: 5px !important;
  height: 85px !important;
  cursor: pointer;
  padding: 0px !important;
  padding-left: 5px !important;
  padding-right: 5px !important;
  transition: all ease 0.3s;
}

.tg_hnav_btn:hover {
  background-color: #1b84eb !important;
  color: white !important;
}

.hnav_drw_2 {
  width: 0rem !important;
}

.tg_hnav_btn:hover {
  background-color: #1b84eb !important;
  color: white !important;
}

.hnav_tg_co {
  padding: 0px !important;
  display: none !important;
}

.ma_icon_arrow {
  font-size: 24px !important;
}

.hnav_search {
  height: 100% !important;
}

.hnv_item {
  cursor: pointer;
  padding-right: 0px;
}

.ho_nav_dra_sec .v-expansion-panel::before {
  box-shadow: none;
}

.hnv_item:focus,
.hnv_item:hover {}

.ho_nav_dra_sec .v-expansion-panel:hover {
  color: #565e66 !important;
  border-right: 3px solid !important;
  border-right-color: #2879ff !important;
  border-radius: 0px !important;
  padding: 1px !important;
}

.ho_nav_dra_sec .v-expansion-panel {
  border-radius: 0px !important;
  padding: 1px !important;
  background-color: #f7f9fb !important;
  max-width: 99% !important;
}

.ho_nav_dra_sec .v-expansion-panel-header {
  padding: 8px 15px;
  font-size: 14px;
}

.add-important-person {
  font-size: 14px;
  line-height: 24px;
  color: #acb7bf;
  text-align: center;
  display: block;
  border: dashed 2px #acb7bf;
  padding: 10px 10px;
  cursor: pointer;
}

.ho_nav_dra_sec .v-treeview-node__root {
  min-height: 27px;
  padding-left: 0px;
  padding-right: 0px;
}

.ho_nav_dra_sec .v-expansion-panel-content__wrap {
  padding: 0px 8px 10px;
}

.ho_nav_dra_sec .v-treeview-node__level {
  width: 15px;
}

.up-company-line {
  width: auto;
  height: auto;
  margin: 0 16px;
  border-bottom: 1px dashed #a0afb7;
  background-color: transparent;
  opacity: 0.5;
}

.tog_hnav-back {
  background: #f7f9fb;
}

.ho_nav_dra_sec .v-list-item {}

.okr-sidebar-search {
  box-sizing: border-box;
  min-width: 141px;
  width: calc(100% - 20px);
  background: #fff;
  border: 1px solid #f0f2f5;
  border-radius: 4px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  margin: 16px auto 0;
  position: relative;
}

.search-result {
  position: absolute;
  top: 40px;
  left: -5px;
  width: 180px;
  height: 300px;
  z-index: 10;
  background-color: #fff;
  box-shadow: 1px 1px 10px #ddd;
  border-radius: 5px;
  overflow-y: auto;
}

.search-result .search-label {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: rgb(40, 121, 255);
  background: rgba(29, 134, 240, 0.1);
  border-radius: 4px;
}

.okr-sidebar-search input {
  outline: none;
  width: 135px;
}

.ho_nav_dra_sec .theme--light.v-navigation-drawer {
  background-color: #f7f9fb;
}

.ho_nav_dra_sec .v-expansion-panel:not(:first-child)::after {
  border-top: none;
}

.ho_nav_dra_sec .v-expansion-panel--active:not(:first-child),
.v-expansion-panel--active+.v-expansion-panel {
  margin-top: 0px;
}

.okr-sidebar-bluehover {
  margin: 1px;
}

.attention-user {
  cursor: pointer;
}
.v-navigation-drawer__border{
  z-index: 1000;
}
.v-navigation-drawer__border:hover{
  border-width: 2px !important;
  border-color: blue !important;
}
</style>
