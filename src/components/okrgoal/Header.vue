<template>
  <v-card class="header-container">
    <v-container fluid class="mx-2 mt-4" style="width: 97.3%;">
      <span style="display:none;">{{render}}</span>
      <div class="d-flex justify-space-between align-center">
        <div v-if="!isUser">
          <h3>公司全部目标</h3>
        </div>
        <div v-if="isUser">
          <div class="d-flex justify-start">
            <div class="user-avatar">
              <div class="d-flex align-center justify-center">
                <span class="mt-1" v-if="!pickedUser">{{
                  authUser.employeeName.substring(0, 4)
                }}</span>
                <span class="mt-1" v-if="!!pickedUser">{{
                  pickedUser.employeeName.substring(0, 4)
                }}</span>
              </div>
            </div>            
            <div class="ml-4 user-addons" v-if="!!pickedUser && pickedUser.id == authUser.id">
              <div class="d-flex justify-start align-center">
                <span class="user-fullname">{{ authUser.employeeName }}</span>
                <!-- reusable -->
                <ToolTipComponent tooltipText="关注量" direction="top">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <span class="ml-4" style="cursor:pointer;" v-bind="attrs" v-on="on">
                        <v-icon style="color: rgb(240, 94, 94); font-size: 18px;">mdi-heart</v-icon>
                      </span>
                    </template>
                    <div class="follower-list">
                      <div style="font-size: 12px;color: #a4acb9;line-height: 18px;margin-bottom: 4px;overflow-y: auto;">关注者</div>
                      <div style="padding: 6px 0px;" class="d-flex justify-start" v-for="follower in followers" :key="follower.id">
                        <div class="follower-avatar">
                          {{follower.employeeName.substring(0,3)}}
                        </div>
                        <div class="follower-name">
                          {{follower.employeeName}}
                        </div>
                      </div>
                    </div>
                  </v-menu>
                  <span class="ml-2" style="font-size: 12px;">{{followerCnt}}</span>
                </ToolTipComponent>
                <ToolTipComponent tooltipText="访问量" direction="top">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <span class="ml-4" style="cursor:pointer;" v-bind="attrs" v-on="on">
                        <v-icon style="font-size: 18px;">mdi-eye</v-icon>
                      </span>
                    </template>
                    <div class="visit-list">
                      <div class="visit-title">
                        <span>被访问了</span>
                        <span class="ml-1">{{visitorCnt}}</span>
                        <span>次，最近访客：</span>
                      </div>
                      <div style="padding: 6px 0px;" class="d-flex justify-start" v-for="visitor in visitors" :key="visitor.id">
                        <div class="visit-avatar">
                          {{visitor.employeeName.substring(0,3)}}
                        </div>
                        <div class="visit-name">
                          <div class="name">{{visitor.employeeName}}</div>
                          <div class="time">{{visitor.created_at}}</div>
                        </div>
                      </div>
                    </div>
                  </v-menu>
                  <span class="ml-2" style="font-size: 12px;">{{visitorCnt}}</span>
                </ToolTipComponent>
                <span class="ml-4 comment-process">
                  <v-icon style="font-size: 18px;" @click="comment(pickedUser)">mdi-comment-processing-outline</v-icon>
                </span>
              </div>
              <div style="font-size: 14px;">{{department}}</div>
            </div>

            <div class="ml-4 user-addons" v-if="!!pickedUser && pickedUser.id != authUser.id">
              <div class="d-flex justify-start align-center">
                <span class="user-fullname">{{ pickedUser.employeeName }}</span>
                <!-- reusable -->
                <ToolTipComponent tooltipText="关注量" direction="top">
                  <HeartComponent :pickedUser="pickedUser" @removeFollower="removeFollower" @addFollower="addFollower" />
                  <span class="ml-2" style="font-size: 12px;">{{followerCnt}}</span>
                </ToolTipComponent>
                <ToolTipComponent tooltipText="访问量" direction="top">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <span class="ml-4" style="cursor:pointer;" v-bind="attrs" v-on="on">
                        <v-icon style="font-size: 18px;">mdi-eye</v-icon>
                      </span>
                    </template>
                    <div class="visit-list">
                      <div class="visit-title">
                        <span>被访问了</span>
                        <span class="ml-1">{{visitorCnt}}</span>
                        <span>次，最近访客：</span>
                      </div>
                      <div style="padding: 6px 0px;" class="d-flex justify-start" v-for="visitor in pickedUser.user_visitors" :key="visitor.id">
                        <div class="visit-avatar">
                          {{visitor.employeeName.substring(0,3)}}
                        </div>
                        <div class="visit-name">
                          <div class="name">{{visitor.employeeName}}</div>
                          <div class="time">{{visitor.created_at}}</div>
                        </div>
                      </div>
                    </div>
                  </v-menu>
                  <span class="ml-2" style="font-size: 12px;">{{visitorCnt}}</span>
                </ToolTipComponent>
                <span class="ml-4 comment-process">
                  <v-icon style="font-size: 18px;" @click="comment(pickedUser)">mdi-comment-processing-outline</v-icon>
                </span>
              </div>
              <div style="font-size: 14px;">{{department}}</div>
            </div>
          </div>
        </div>
        <div class="setting-addons d-flex justify-end">
          <ToolTipComponent tooltipText="了解OKR" direction="bottom">
            <router-link style="text-decoration: none;" target="_blank" to="//wiki.tita.com/x/XAAN" class="mr-4 help-hint"
              ><v-icon class="" style="font-size: 18px;"
                >mdi-help-circle</v-icon
              ></router-link>
          </ToolTipComponent>
          <div style="position:relative;">
            <Calendar @pick="pickCycle" :isWhole="true" />
            <div v-if="showHint" style="width:160px;height:50px;right:211px;" class="show-hint"></div>
          </div>
          <span class="ml-4"></span>
          <CreateGoal
            text="创建目标"
            :okrObjList="okrObjList"
            v-on:save="(param) => saveGoalData(param)"
          />
          <div class="hint-icon d-flex align-center justify-center ml-4 py-2">
            <!-- reusable -->
            <!-- <v-icon style="font-size: 18px;" class="px-2"
              >mdi-lightbulb-outline</v-icon
            > -->
          </div>
          <div class="setting-icon ml-4">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">
                  <v-icon
                    style="font-size: 18px;color:rgb(40, 121, 255);"
                    class="px-2"
                    >mdi-hexagon-outline</v-icon
                  >
                </span>
              </template>
              <v-list>
                <v-list-item>
                  <a href="#">
                    目标管理员
                  </a>
                </v-list-item>
                <v-list-item>
                  <a @click="goToSetting">
                    目标管理规定
                  </a>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </div>
      <div class="d-flex justify-space-between mt-4 ">
        <div class="d-flex justify-start" style="position:relative;">
          <span v-if="!isObOperator && isUser">
          <DropdownPopupComponent
            :dropdown="dropdown1"
            :text="dropText1"
            v-on:filterValue="(param) => filterValue1(param)"
          />
          </span>
          <DropdownPopupComponent
            :dropdown="dropdown2"
            :text="dropText2"
            v-on:filterValue="(param) => filterValue2(param)"
          />
          <div v-if="showHint" style="width:200px;height:50px;left:10px;left:-6px;top:-13px;" class="show-hint"></div>
        </div>
        <div class="d-flex justify-end">
          <!-- arrangement menu-->
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on" class="align-center mr-2">
                <span class="dropdown-text">
                  {{ arrangeMode < 3 ? '创建时间' : '更新时间'}}
                </span>
                <v-icon v-if="arrangeMode==1 || arrangeMode==3" class="mr-1" small>mdi-arrow-down</v-icon>
                <v-icon v-else class="mr-1" small>mdi-arrow-up</v-icon>
                <v-icon style="font-size: 18px;">
                  mdi-chevron-down
                </v-icon>
              </span>
            </template>
            <v-list>
              <v-list-item>
                <v-btn @click="setArrangement1" text small block>
                  <span :class="arrangeMode < 3 ? 'blue--text': ''">创建时间</span>
                  <v-icon :color="arrangeMode == 1 ? 'blue' : ''" class="ml-4" small>mdi-arrow-down</v-icon>
                  <v-icon :color="arrangeMode == 2 ? 'blue' : ''" small>mdi-arrow-up</v-icon>
                </v-btn>
              </v-list-item>
              <v-list-item>
                <v-btn @click="setArrangement2" text small block>
                  <span :class="arrangeMode > 2 ? 'blue--text': ''">更新时间</span>
                  <v-icon :color="arrangeMode == 3 ? 'blue' : ''" class="ml-4" small>mdi-arrow-down</v-icon>
                  <v-icon :color="arrangeMode == 4 ? 'blue' : ''" small>mdi-arrow-up</v-icon>
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on" class="d-flex align-center mr-4">
                <span class="dropdown-text mr-1">展示更多</span>
                <v-icon style="font-size: 18px;">
                  mdi-chevron-down
                </v-icon>
              </span>
            </template>
            <v-list>
              <v-list-item class="d-flex align-center">
                <span>更多属性</span>
                <ToolTipComponent tooltipText="开启后， 将展示目标类型， 周期和目标对齐关系" direction="top">
                  <span class="mr-4 help-hint"
                    ><v-icon class="mt-0 ml-2" style="font-size: 18px;"
                      >mdi-help-circle</v-icon
                    ></span
                  >
                </ToolTipComponent>
                <span>
                  <v-switch
                    v-model="moreAttr"
                    @change="setMoreSettingToggle"
                  ></v-switch>
                </span>
              </v-list-item>
            </v-list>
          </v-menu>
          <span class="expansion-toggle" @click="setExpansionToggle">
            <v-icon v-if="isExpansionToggle[0] == 0">
              mdi-format-vertical-align-center
            </v-icon>
            <v-icon v-if="isExpansionToggle[0] == 1">
              mdi-swap-vertical
            </v-icon>
          </span>
          <span @click="gotoMap" class="expansion-toggle ml-4">
            <v-icon>
              mdi-file-tree
            </v-icon>
          </span>
        </div>
      </div>
    </v-container>
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import ToolTipComponent from "@/components/okrgoal/shared/ToolTipComponent.vue";
import Calendar from "@/components/common/Calendar.vue";
import DropdownPopupComponent from "@/components/okrgoal/shared/DropdownPopupComponent.vue";
import { constant } from "@/constants/constant.js";
import { Routes } from "@/constants/routes.js";
import { getUser } from '@/utils/authUser.service';
import HeartComponent from '@/components/common/HeartComponent.vue';

export default {
  name: "Header",
  components: {
    CreateGoal: () => import("@/components/okrgoal/CreateGoal.vue"),
    ToolTipComponent,
    Calendar,
    DropdownPopupComponent,
    HeartComponent
  },
  props: ['showHint'],
  data() {
    return {
      dropdown1: ["我负责的", "我参与的", "我关注的"],
      dropdown2: ["全部状态", "进行中", "已结束"],
      dropdown3: [],
      moreAttr: true,
      dropText1: "我负责的",
      dropText2: "全部状态",
      filter: {},
      cycle: '',
      arrangeMode: 1
    };
  },
  mounted() {
    this.getSettings();
    this.getCurrentCycle();
    let filter = this.okrFilter;
    Object.assign(filter, { ob_status: "", ob_cycle: this.cycle, ob_owner: getUser().id });
    this.setFilter(filter)
    this.getOkrsByFilter();
    this.getUsers();
  },
  computed: {
    ...mapGetters("okr", ["okrObj"]),
    ...mapGetters("auth", ["authUser"]),
    ...mapGetters("user", ["users"]),
    ...mapGetters("app", ["okrFilter", "isUser", "pickedUser"]),
    render: function() {
      const currentUser = this.users.filter(user => user.id == getUser().id)
      this.setPickedUser(currentUser[0]);
    },
    followerCnt: function() {
      return this.pickedUser.user_be_attentions.length;
    },
    followers: function() { 
      return this.pickedUser.user_be_attentions;
    },
    visitorCnt: function() {
      return this.pickedUser.user_visit_counts;
    },
    visitors: function() {
      let tmp = [];
      this.pickedUser.user_visitors.forEach(user => {
        let date = new Date(user.created_at);
        let today = new Date();
        // To calculate the time difference of two dates
        let Difference_In_Time = today.getTime() - date.getTime();
        let difference = Difference_In_Time / (1000 * 3600 * 24);
        if(difference < 0) {
          difference = Difference_In_Time / (1000 * 3600);
          difference = difference + '小时前';
        } else if(difference >= 2) {
          difference = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
        }else {
          difference = '昨天' + today.getHours() + ":" + today.getMinutes();
        }
        user.created_at = difference;
        tmp.push(user)
      });
      return tmp;
    },
    department: function() {
      return this.pickedUser.departmentOaName;
    },
    isObOperator: function() {
      return this.okrFilter.hasOwnProperty('ob_operator')
    },
    isExpansionToggle: {
      get() {
        return this.$store.getters["app/isExpansionToggle"];
      },
      set(newValue) {
        return newValue;
      },
    },
    okrObjList: function() {
      let okrObjList = [];
      this.okrObj.map((obj) => {
        let obc = obj.ob_cycle;
        let year = obj.ob_start_date + "-" + obj.ob_end_date;
        let cycle = "";
        let goal = "全部状态";
        let quater = "";
        if (obc.includes("/")) {
          // year = obc.split('/')[0];
          quater = "/" + obc.split("/")[1];
        }
        if (obc.includes("-")) {
          // year = obc.split('-')[0];
          quater = "-" + obc.split("-")[1];
        }

        constant.cycleItems.map((c) => {
          if (c.dbformat == quater) {
            cycle = c.title;
          }
        });
        constant.statusItems.map((s) => {
          if (s.dbformat == obj.ob_status) {
            goal = s.title;
          }
        });
        let tmp = {
          id: obj.ob_id,
          cycle: cycle,
          content: obj.ob_name,
          year: year,
          goal: goal,
          parent: false,
        };
        okrObjList.push(tmp);
      });
      return okrObjList;
    },
  },
  methods: {
    ...mapActions("okr", ["addOkr", "getOkrs"]),
    ...mapActions("app", [
      "setExpansionToggle",
      "setMoreSettingToggle",
      "getSettings",
      "setFilter",
      "setPickedUser"
    ]),
    ...mapActions("user", ["updateUser", "getUsers"]),
    removeFollower(user) {
      const current = this.users.filter(user => user.id == getUser().id);
      const param = current[0].user_attentions.replace(user.id+',', '')
      let payload = {
        id: current[0].id,
        user_attentions: param
      }
      this.updateUser(payload);
      this.pickedUser.user_be_attentions = this.pickedUser.user_be_attentions.filter(user => user.id != getUser().id);
    },
    addFollower(user) {
      const current = this.users.filter(user => user.id == getUser().id);
      let param;
      if(!current[0].user_attentions.includes(user.id + '')) {
        param = current[0].user_attentions + user.id + ",";
      }
      let payload = {
        id: current[0].id,
        user_attentions: param
      }
      this.updateUser(payload);
      this.pickedUser.user_be_attentions = this.pickedUser.user_be_attentions.filter(user => user.id != getUser().id);
    },
    getCurrentCycle() {
      // Get current date, quater and filter okr objects
      // 获取当前日期、季度和过滤 okr 对象
      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1;
      let start, end, cycle;
      if(month >= 1 && month <= 3) {
        month = '/1';
        start = year + '/01/01';
        end = year + '/03/31';
        cycle = year + month;
      }
      if(month >= 4 && month <= 6) {
        month = '/2';
        start = year + '/04/01';
        end = year + '/06/30';
        cycle = year + month;
      }
      if(month >= 7 && month <= 9) {
        month = '/3';
        start = year + '/07/01';
        end = year + '/09/30';
        cycle = year + month;
      }
      if(month >= 10 && month <= 12) {
        month = '/4';
        start = year + '/10/01';
        end = year + '/12/31';
        cycle = year + month;
      }
      this.cycle = cycle;
    },
    saveGoalData(okrObj) {
      if(!!okrObj.ob_parent_object && okrObj.ob_parent_object != 0 ) {
        this.getOkrs({});
      }
    },
    getOkrsByFilter() {
      this.getOkrs({payload: {page_start: (Number(this.$route.params.pageNum)-1)*this.$route.params.countsPerPage, page_counts: this.$route.params.countsPerPage}})
      // this.getOkrs({});
    },
    filterValue1(param) {
      if(param == '我负责的') {
        let filter = this.okrFilter;
        delete filter.ob_participant;
        delete filter.ob_attention;
        Object.assign(filter, { ob_owner: getUser().id });
        this.setFilter(filter)
      }
      if(param == '我参与的') {
        let filter = this.okrFilter;
        delete filter.ob_owner;
        delete filter.ob_attention;
        Object.assign(filter, { ob_participant: getUser().id });
        this.setFilter(filter)
      }
      if(param == '我关注的' ) {
        let filter = this.okrFilter;
        delete filter.ob_owner;
        delete filter.ob_participant;
        Object.assign(filter, { ob_attention: getUser().id });
        this.setFilter(filter)
      }
      this.getOkrsByFilter();
      this.dropText1 = param;
    },
    filterValue2(param) {
      this.dropText2 = param;
      const selectedStatus = constant.statusItems.filter(
        (s) => s.title == param
      );
      // this.filter = Object.assign(this.filter, { ob_status: selectedStatus[0].dbformat });
      let filter = this.okrFilter;
      Object.assign(filter, { ob_status: selectedStatus[0].dbformat });
      this.setFilter(filter)
      this.getOkrsByFilter();
    },
    pickCycle(e) {
      if(e.cycle.includes('/1000')) {
        // this.filter = Object.assign(this.filter, {ob_cycle: null});
        let filter = this.okrFilter;
        Object.assign(filter, {ob_cycle: null});
        console.log("filter1:", filter)
        this.setFilter(filter)
        this.getOkrsByFilter();
      }else{
        this.filter = Object.assign(this.filter, {ob_cycle: e.cycle});
        let filter = this.okrFilter;
        Object.assign(filter, {ob_cycle: e.cycle});
        console.log("filter2:", filter)
        this.setFilter(filter)
        this.getOkrsByFilter();
      }
    },
    goToSetting() {
      let routeData = this.$router.resolve({ name: "okrSettingPage" });
      window.open(routeData.href, "_blank");
    },
    gotoMap() {
      this.$router.push({ path: Routes.OKR_MAP_PAGE });
    },
    comment(user) {
      this.$emit("displayRightUserEdit", {user: user});
    },
    setArrangement1() {
      if(this.arrangeMode > 2 || this.arrangeMode == 2) {
        this.arrangeMode = 1
      } else {
        this.arrangeMode = 2
      }
      this.$emit('mode', this.arrangeMode)
    },
    setArrangement2() {
      if(this.arrangeMode < 3 || this.arrangeMode == 4) {
        this.arrangeMode = 3
      } else {
        this.arrangeMode = 4
      }
      this.$emit('mode', this.arrangeMode)
    }
  },
};
</script>

<style scoped>
.header-container {
  box-shadow: none !important;
}

.user-avatar {
}

.user-avatar div {
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 56px;
  background-color: rgb(185, 204, 79);
  color: rgb(255, 255, 255);
  font-size: 14px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
}

.user-avatar div {
}

.user-addons {
  color: rgb(20, 28, 40);
}

.user-addons .user-fullname {
  font-size: 20px;
}

.user-addons .comment-process:hover .v-icon {
  color: #1687d9;
}

.user-addons > div > span:hover {
  cursor: pointer;
}

.setting-addons {
}

.setting-addons .hint-icon {
  background: #f7f8fa !important;
  border: 1px solid #e9ecf0 !important;
  color: #a4acb9;
}

.setting-addons .hint-icon:hover {
  cursor: pointer;
}

.setting-addons .setting-icon {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid rgb(230, 234, 239);
  border-radius: 3px;
  font-size: 16px;
  color: rgb(40, 121, 255);
  background-color: rgb(255, 255, 255);
  margin-left: 10px;
  cursor: pointer;
}

.setting-addons .setting-icon:hover {
  border: 1px solid rgb(40, 121, 255);
}

.v-list-item {
  font-size: 14px !important;
  min-height: 32px !important;
}

.v-list-item a {
  text-decoration: none;
  color: #3f4755;
}

.v-list-item:hover {
  color: #2879ff;
  background-color: #f7f8fa;
  cursor: pointer;
}

.help-hint:hover .v-icon {
  color: rgb(40, 121, 255);
  cursor: pointer;
}

.dropdown-text {
  font-size: 12px;
}

/* expansion toggle style start */
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

.expansion-toggle .v-icon {
  font-size: 20px;
}

.expansion-toggle:hover {
  border-color: #2879ff;
  cursor: pointer;
}

.expansion-toggle:hover .v-icon {
  color: #2879ff;
}
/* expansion toggle style end */
.show-hint {
  position: absolute;
  left: -5px;
  top: -8px;
  background: red;
  animation: colorAnimation 2s infinite;
  z-index: 1000;
  opacity: 0.3;
}
@keyframes colorAnimation {
  from {background-color: red;}
  to{background-color: white;}
}

.follower-list  {
  padding: 16px 20px;
  background-color: #fff;
  width: 120px;
  overflow-y: hidden;
}

.follower-avatar {
  background-color: rgb(185, 204, 79);
  font-size: 13px;
  display: inline-block;
  vertical-align: text-bottom;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  color: #fff;
  line-height: 24px;
  text-align: center;
  background-size: cover;
}

.follower-name {
  margin-left: 8px;
  font-size: 14px;
  color: #3f4755;
  line-height: 24px;
  max-width: 112px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.visit-list {
  padding: 15px 20px;
  background-color: #fff;
}

.visit-title {
  font-size: 12px;
  color: #a4acb9;
}

.visit-avatar {
  background-color: rgb(185, 204, 79);
  font-size: 13px;
  display: inline-block;
  vertical-align: text-bottom;
  height: 32px;
  width: 32px;
  border-radius: 50%;
  color: #fff;
  line-height: 24px;
  text-align: center;
  background-size: cover;
  padding-top: 5px;
}

.visit-name {
  margin-left: 8px;
  font-size: 14px;
  color: #3f4755;
  line-height: 24px;
  max-width: 112px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.visit-name .name {
  font-size: 14px;
  color: #3f4755;
  line-height: 16px;
}

.visit-name .time {
  font-size: 12px;
  color: #89919f;
  line-height: 14px;
}
</style>
