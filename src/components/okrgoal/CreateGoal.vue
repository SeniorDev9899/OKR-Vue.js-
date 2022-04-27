<template>
  <v-dialog class="create-modal" v-model="dialog" persistent max-width="620px">
    <div class="hint-text" v-if="objHintHover">
      <div class="hint-title my-2">
        O = 动词+你要做什么/渴望做什么+为了改变什么
      </div>
      <div class="hint-description">
        <div>
          <v-icon style="font-size: 18px;" class="mr-1">mdi-star-outline</v-icon
          >示例
        </div>
        <div class="ml-5 mt-2">
          提高我们年度用户大会的出席率和参与度，为了提高客户的续费率
        </div>
      </div>
      <div class="divider d-flex justify-space-between align-center">
        <span class="divide-line"></span>
        <span class="divide-text">等待输入目标</span>
        <span class="divide-line"></span>
      </div>
      <div class="mt-8">
        <div class="desc-list d-flex justify-start">
          <v-icon style="color: #6f7886;font-size: 18px;"
            >mdi-menu-right</v-icon
          >
          <span>含动词</span>
        </div>
        <div class="desc-list d-flex justify-start">
          <v-icon style="color: #6f7886;font-size: 18px;"
            >mdi-menu-right</v-icon
          >
          <span>不建议包含数字</span>
        </div>
      </div>
      <div class="put-away" @click="() => {objHintHover = false;}">
        <v-icon style="color: #6f7886; font-size: 18px;"
          >mdi-format-vertical-align-center</v-icon
        >收起
      </div>
    </div>
    <div class="hint-text" v-if="krHintHover">
      <div class="hint-title my-2">
        <div>KR1 = 动词+你要追踪的内容+从 X 到 Y/或者具体值</div>
        <div>KR2 = 动词+什么时间节点+达成什么关键成果</div>
      </div>
      <div class="hint-description">
        <div>
          <v-icon style="font-size: 18px;" class="mr-1">mdi-star-outline</v-icon
          >示例
        </div>
        <div class="ml-5 mt-2">将客户续约率从70%提高到90%</div>
      </div>
      <div class="divider d-flex justify-space-between align-center">
        <span class="divide-line"></span>
        <span class="divide-text">等待输入关键成果</span>
        <span class="divide-line"></span>
      </div>
      <div class="mt-8">
        <div class="desc-list d-flex justify-start">
          <v-icon style="color: #74DDB1;font-size: 18px;">mdi-check</v-icon>
          <span>至少含 1 个关键成果</span>
        </div>
        <div class="desc-list d-flex justify-start">
          <v-icon style="color: #74DDB1;font-size: 18px;">mdi-check</v-icon>
          <span>不建议超过 5 个关键成果</span>
        </div>
        <div class="desc-list d-flex justify-start">
          <v-icon style="color: #6f7886;font-size: 18px;"
            >mdi-menu-right</v-icon
          >
          <span>关键成果定量可衡量</span>
        </div>
      </div>
      <div class="put-away" @click="() => {krHintHover = false;}">
        <v-icon style="color: #6f7886; font-size: 18px;"
          >mdi-format-vertical-align-center</v-icon
        >收起
      </div>
    </div>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-if="!textHide"
        color=""
        style="background: rgb(40, 121, 255);border:none;box-shadow:none;"
        dark
        v-bind="attrs"
        v-on="on"
      >
        {{ text }}
      </v-btn>
      <span v-if="textHide" v-bind="attrs" v-on="on"></span>
    </template>
    <v-card style="position: relative;">
      <v-card-title class="d-flex justify-space-between">
        <span class="headline">创建目标</span>
        <span>
          <a class="blue--text text-subtitle-2" dark @click="dialog1 = true">
            <v-icon color="blue">mdi-hand-pointing-right</v-icon>
          从OKR案例库添加
          </a>
          <v-dialog
            v-model="dialog1"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
            scrollable
          >
            <v-card tile>
              <v-toolbar flat dark color="white">
                <v-spacer></v-spacer>
                <v-btn icon dark @click="dialog1 = false">
                  <v-icon style="color:red;">mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <OKRLibrary :create_goal="createGoal" @createGoalLibrary="handle_createGoalLibrary" />
            </v-card>
          </v-dialog>
          <a class="hide-modal-icon" @click="dialog = false">
            <v-icon right dark>mdi-close</v-icon>
          </a>
        </span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <div class="goal-name-container d-flex justify-start" :class="objNameError ? 'obj-error' : ''">
            <div class="first-item">O</div>
            <div class="second-item">
              <input
                type="text"
                placeholder="请输入鼓舞人心的目标"
                name="goalName"
                v-model="goalName"
              />
            </div>
            <div class="logged-user">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on">
                    <span class="user-avatar-icon"
                      ><span>{{
                        ob_owner_name == ""
                          ? authUser.employeeName[0].toUpperCase()
                          : ob_owner_name[0].toUpperCase()
                      }}</span></span
                    >
                    <ToolTipComponent
                      :content="
                        ob_owner_name == ''
                          ? authUser.employeeName.slice(0, 5)
                          : ob_owner_name.slice(0, 5)
                      "
                      direction="top"
                      :tooltipText="
                        ob_owner_name == '' ? authUser.employeeName : ob_owner_name
                      "
                    />
                  </span>
                </template>
                <v-list class="py-0">
                  <v-list-item class="px-0">
                    <UserPicker @pick="(param) => pickObjUser(param)" />
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div class="hint" @click="() => {objHintHover = !objHintHover;krHintHover = false;}">
              <v-icon>mdi-lightbulb-outline</v-icon>
            </div>
          </div>
          <div
            :key="i"
            v-for="(k, i) in krArr"
            class="kr-name-container d-flex justify-start"
            @mouseover="krArr[i].deleteIcon = true"
            @mouseleave="krArr[i].deleteIcon = false"
          >
            <div class="first-item d-flex align-center">
              <a>
                <v-icon
                  v-if="krArr[i].deleteIcon"
                  right
                  dark
                  color="rgba(0, 0, 0, 0.6)"
                  @click="removeKrItem(i)"
                  >mdi-delete</v-icon
                >
              </a>
            </div>
            <div class="second-item d-flex justify-start align-center" :class="krNameError[i] ? 'kr-error' : ''">
              <div class="kr-title">KR{{ i + 1 }}</div>
              <div class="kr-input">
                <input
                  type="text"
                  placeholder="请输入可衡量的关键成果"
                  :value="k.kr_name"
                  @input="(ev) => krNameChange(ev, i)"
                />
              </div>
              <div class="logged-user d-flex align-center">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">
                      <span class="user-avatar-icon"
                        ><span>{{
                          k.kr_owner_name == ""
                            ? authUser.employeeName[0].toUpperCase()
                            : k.kr_owner_name[0].toUpperCase()
                        }}</span></span
                      >
                      <ToolTipComponent
                        :content="
                          k.kr_owner_name == ''
                            ? authUser.employeeName.slice(0, 5)
                            : k.kr_owner_name.slice(0, 5)
                        "
                        direction="top"
                        :tooltipText="
                          k.kr_owner_name == ''
                            ? authUser.employeeName
                            : k.kr_owner_name
                        "
                      />
                    </span>
                  </template>
                  <v-list class="py-0">
                    <v-list-item class="px-0">
                      <UserPicker @pick="(param) => pickKrUser(param, i)" />
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
            <div class="hint kr-hint" @click="() => {objHintHover = false;krHintHover = !krHintHover;}">              
              <v-icon>mdi-lightbulb-outline</v-icon>
            </div>
          </div>
          <div
            class="kr-field-add-container d-flex justify-start"
            @click="addKRField"
          >
            <v-icon color="rgb(40, 121, 255)">mdi-plus</v-icon>
            <a class="d-flex align-center">
              添加 KR
            </a>
          </div>
        </v-container>
        <v-container>
          <div class="setting-title d-flex justify-start align-center">
            <div class="blue-bar"></div>
            <div>更多设置</div>
          </div>
          <v-layout class="flex-wrap">
            <v-flex class="setting-item">
              <div class="label">对齐目标</div>
              <v-btn
                outlined
                class="cycle_btn"
                @click="targetGoalModal"
                color="grey"
              >
                <v-layout align-center justify-start row class="px-2">
                  <v-flex d-flex justify-start align-center grow class="">
                    <v-layout align-center justify-start>
                      <v-flex
                        d-flex
                        justify-start
                        grow
                        class="mrg-5"
                        :class="personalGoalSelected ? 'fontSize13' : ''"
                        ><span>{{ alignTargetValue }}</span></v-flex
                      >
                      <v-flex d-flex align-center justify-end shrink>
                        <v-icon
                          v-if="personalGoalSelected"
                          class="fontSize13_sec closePersonalName"
                          >mdi-close-circle-outline</v-icon
                        >
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex d-flex justify-end shrink>
                    <v-icon style="color: black;">mdi-menu-down</v-icon>
                  </v-flex>
                </v-layout>
              </v-btn>
            </v-flex>
            <v-flex class="setting-item">
              <div class="label">周期</div>
              <v-btn
                outlined
                class="ml-1 cycle_btn"
                @click="showCycleModal"
                color="grey"
              >
                <v-layout align-center justify-start row class="plr-10">
                  <v-flex d-flex justify-start
                    ><span
                      >{{ selected_year }} {{ selected_quarter }}</span
                    ></v-flex
                  >
                  <v-flex d-flex justify-end>
                    <v-icon style="color: black;">mdi-menu-down</v-icon>
                  </v-flex>
                </v-layout>
              </v-btn>
              <v-card class="cycle" :class="show_cycle ? 'cycleModalCard' : ''">
                <v-container align-center justify-center d-flex class="h100">
                  <v-layout align-center justify-start column class="h100">
                    <v-flex class="w100 mt-5">
                      <Calendar @pick="handle_getTimePeriod" :isWhole="false" />
                    </v-flex>
                    <v-flex class="w100 mt-22">
                      <!-- <v-layout align-center justify-start row class="w100 m-0">
                        <v-flex grow class="fontSize11 mr-5 pos-relative-l">
                          <v-layout align-center justify-start row>
                            <v-flex
                              ><span>开始日期:</span
                              ><span>{{ startDate }}</span></v-flex
                            >
                            <v-flex
                              ><span>结束日期:</span
                              ><span>{{ endDate }}</span></v-flex
                            >
                          </v-layout>
                        </v-flex>
                        <v-flex
                          shrink
                          class="pos-relative-l-b"
                          @click="displayCalendarPeriod"
                        >
                          <v-icon class="fontSize20">mdi-chevron-down</v-icon>
                        </v-flex>
                      </v-layout> -->
                      <date-range-picker
                        ref="picker"
                        opens="center"
                        :locale-data="{ 
                            firstDay: 1,
                            format: 'yyyy-mm-dd',
                            applyLabel: '确定',
                            cancelLabel: '取消',
                            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                            monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                        }"
                        :minDate="minDate" :maxDate="maxDate"
                        :dateRange="dateRange"
                        :ranges="false"
                        @update="datePicker"
                      >
                        <template v-slot:input="picker" style="min-width: 350px;">
                          {{ picker.startDate | formatDate }} - {{ picker.endDate | formatDate }}
                        </template>
                      </date-range-picker>
                    </v-flex>
                    <v-flex d-flex justify-end class="w100 mt-5">
                      <v-card-actions>
                        <v-btn @click="closeCycleModal">取消</v-btn>
                        <v-btn color="primary" @click="saveCycleModal"
                          >确定</v-btn
                        >
                      </v-card-actions>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-flex>
            <v-flex class="setting-item">
              <div class="">可见范围</div>
              <div class="visible-text d-flex align-center justify-space-between" @click="showVisibleSelectBox">
                <div>{{selectedVisible}}</div>
                <v-icon class="mr-2" style="font-size: 22px;color:#000;">mdi-menu-down</v-icon>
                <div class="visible-select-box" v-if="isShowVisible" v-click-outside="hideVisibleSelectBox">
                  <div class="py-1 px-3 f-14" @click="selectVisible('全公司')">
                    全公司
                  </div>
                  <div class="py-1 px-3 f-14" @click="selectVisible('仅相关成员')">
                    仅相关成员
                  </div>
                  <div class="py-1 px-3 f-14" @click="selectVisible('仅直接下属')">
                    仅直接下属
                  </div>
                  <div class="py-1 px-3 f-14" @click="selectVisible('指定范围')">
                    指定范围
                  </div>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions class="pb-4">
        <v-spacer></v-spacer>
        <v-btn class="close" text @click="closeDialog" depressed>取消</v-btn>
        <v-btn class="save" text @click="saveGoal" depressed>立即创建</v-btn>
      </v-card-actions>

      <AddSort
        ref="targetGoal"
        :okrObj="okrObjList"
        @setPersonalGoal="handle_setPersonalGoal"
      />
      <UserDepartmentTeamPicker ref="visibilityPicker" @selected="visibilitySelect" />
    </v-card>
  </v-dialog>
</template>

<script>
import AddSort from "@/components/common/AddSort.vue";
import Calendar from "@/components/common/Calendar.vue";
import CalendarPeriod from "@/components/okrgoal/rightInfo/userInfo/calendar/Calendar.vue";
import UserPicker from "@/components/common/UserPicker.vue";
import ToolTipComponent from "@/components/okrgoal/shared/ToolTipComponent.vue";
import UserDepartmentTeamPicker from "@/components/common/UserDepartmentTeamPicker.vue";
import { mapGetters, mapActions } from "vuex";
import { constant } from "@/constants/constant.js";
import OKRLibrary from "@/components/library/OKRLibrary.vue";
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';

export default {
  name: "CreateGoal",
  components: {
    AddSort,
    Calendar,
    CalendarPeriod,
    UserPicker,
    ToolTipComponent,
    UserDepartmentTeamPicker,
    OKRLibrary,
    DateRangePicker
  },
  props: {
    text: {
      type: String,
    },
    textHide: {
      type: Boolean,
    },
    okrObjList: {
      type: Array,
    },
  },
  data() {
    return {
      dialog: false,
      dialog1: false,
      visibleRangeValues: ["全公司", "仅相关成员", "仅直接下属", "指定范围"],
      align_target: "全公司",
      goalName: "",
      krArr: [
        {
          order: 1,
          kr_name: "",
          kr_owner: "",
          kr_owner_name: "",
          deleteIcon: false,
        },
      ],
      personalGoal: "",
      personalGoalSelected: false,
      show_cycle: false,
      alignTargetValue: "选择对齐上级目标",
      selected_year: "2021",
      selected_quarter: "年度",
      startDate: "2021/04/01",
      endDate: "2021/06/03",
      calendarPeriod: false,
      objHintHover: false,
      krHintHover: false,
      ob_owner: "",
      ob_owner_name: "",
      today: null,
      cycle: null,
      minDate: '2018-01-01',
      maxDate: '2050-12-31',
      startDateSave: '',
      endDateSave: '',
      cycleSave: '',
      visibleRange: '全公司',
      visibleType: 0,
      parent_obj_id: null,
      objNameError: false,
      krNameError: [],
      currentCycle: '',
      createGoal: true,
      selectedVisible: '全公司',
      isShowVisible: false
    };
  },
  mounted() {
    this.setInitDate();
  },
  computed: {
    ...mapGetters("auth", ["authUser"]),
    dates: function() {
      let start = this.startDate.split("/");
      let end = this.endDate.split("/");
      start = start[0] + "-" + start[1] + "-" + start[2];
      end = end[0] + "-" + end[1] + "-" + end[2];
      return [start, end];
    },
    dateRange: function() {
      let start = this.startDate.split("/");
      let end = this.endDate.split("/");
      start = start[0] + "-" + start[1] + "-" + start[2];
      end = end[0] + "-" + end[1] + "-" + end[2];
      return {
        startDate: start + ' 00:00:00',
        endDate: end + ' 00:00:00'
      }
    }
  },
  methods: {
    ...mapActions("okr", ["addOkr"]),
    setInitDate() {
      // Get current date, quater and set it in period calendar
      // 获取当前日期、季度并将其设置在周期日历中
      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1;
      let start, end;
      if (month >= 1 && month <= 3) {
        month = "/1";
        start = year + "/01/01";
        end = year + "/03/31";
        this.cycle = year + month;
      }
      if (month >= 4 && month <= 6) {
        month = "/2";
        start = year + "/04/01";
        end = year + "/06/30";
        this.cycle = year + month;
      }
      if (month >= 7 && month <= 9) {
        month = "/3";
        start = year + "/07/01";
        end = year + "/09/30";
        this.cycle = year + month;
      }
      if (month >= 10 && month <= 12) {
        month = "/4";
        start = year + "/10/01";
        end = year + "/12/31";
        this.cycle = year + month;
      }
      constant.cycleItems.map((q, i) => {
        if (q.dbformat == month) {
          this.today = i;
          this.selected_year = year;
          this.selected_quarter = q.title;
          this.startDate = start;
          this.endDate = end;
        }
      });
    },
    datePicker(param) {
      let start = param.startDate;
      let end = param.endDate;
      start = new Date(start);
      end = new Date(end);
      start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
      end = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
      this.startDateSave = start;
      this.endDateSave = end;
    },
    pickObjUser(param) {
      this.ob_owner_name = param.user.employeeName;
      this.ob_owner = param.user.id;
    },
    pickKrUser(param, i) {
      this.krArr[i].kr_owner_name = param.user.employeeName;
      this.krArr[i].kr_owner = param.user.id;
    },
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.init();
    },
    iconMouseOver() {
      this.deleteIcon = true;
    },
    addKRField() {
      this.krArr.push({
        order: this.krArr.length + 1,
        kr_name: "",
        kr_owner: "",
        kr_owner_name: "",
        deleteIcon: false,
      });
    },
    removeKrItem(index) {
      this.krArr.splice(index, 1);
      this.krNameError.splice(index, 1);
    },
    goalNameChange(evt) {
      this.goalName = evt.target.value;
    },
    krNameChange(evt, i) {
      this.krArr[i].kr_name = evt.target.value;
    },
    checkFormValidation() {
      this.krNameError = [];
      if(this.goalName == '' || this.goalName == null) {
        this.objNameError = true;
      }else{
        this.objNameError = false;
      }
      this.krArr.map((k, i) => {
        if(k.kr_name == '') {
          this.krNameError.push(true)
        }else{
          this.krNameError.push(false)
        }
      });
      const kEs = this.krNameError.filter(ke => ke == true);
      if(this.objNameError || kEs.length != 0) {
        return true;
      }else{
        return false;
      }
    },
    saveGoal() {
      let isError = this.checkFormValidation();
      let ob_name = this.goalName;
      let ob_owner = this.ob_owner == "" ? this.authUser.id : this.ob_owner;
      let ob_creater = this.authUser.id;
      let ob_parent_object = this.parent_obj_id;
      let ob_company_id = this.authUser.user_company_id;
      let ob_start_date = this.startDate;
      let ob_end_date = this.endDate;
      let ob_status = 0;
      let ob_progress = 0;
      // let ob_visible_type = this.visibleRangeValues.findIndex(
      //   (item) => item == this.align_target
      // );
      
      let ob_cycle;
      if (this.selected_quarter === "全部周期") {
        ob_cycle = "全部周期";
      } else if (this.selected_quarter === "年度") {
        ob_cycle = this.selected_year + "年";
      } else {
        ob_cycle = this.selected_year + "年" + this.selected_quarter;
      }

      // let ob_cycle;
      if (this.selected_quarter === "全部周期") {
        ob_cycle = "全部周期";
      } else if (this.selected_quarter === "年度") {
        ob_cycle = this.selected_year + "年";
      } else {
        ob_cycle = this.selected_year + "年" + this.selected_quarter;
      }
      let keyResults = [];
      this.krArr.map((k) => {
        keyResults.push({
          kr_name: k.kr_name,
          kr_owner: k.kr_owner == "" ? this.authUser.id : k.kr_owner,
          kr_order: k.order,
          kr_confidence: 5,
        });
      });
      let okr_obj = {
        ob_name: ob_name,
        ob_owner: ob_owner,
        ob_creater: ob_creater,
        ob_parent_object: ob_parent_object,
        ob_company_id: ob_company_id,
        ob_start_date: ob_start_date,
        ob_end_date: ob_end_date,
        ob_status: ob_status,
        ob_visible_type: this.visibleType,
        ob_visible_range: this.visibleRange,
        ob_cycle: this.cycleSave == '' ? this.cycle : this.cycleSave,
        ob_results: keyResults,
      };
      if(isError) {

      }else{
        this.addOkr(okr_obj);
        this.$emit("save", okr_obj);
        this.init();
      }
    },
    init() {
      this.dialog = false;
      this.goalName = "";
      this.krArr = [
        {
          order: 1,
          kr_name: "",
          kr_owner_name: "",
          kr_owner: "",
          deleteIcon: false,
        },
      ];
      this.alignTargetValue = "选择对齐上级目标";
      this.align_target = "全公司";
      this.personalGoalSelected = false;
      this.ob_owner = "";
      this.ob_owner_name = "";
      this.objNameError = false;
      this.krNameError = [];
      this.isShowVisible = '全公司';
      // this.selected_year = "2021";
      // this.selected_quarter = "第二季度";
      // this.startDate = "2021/04/01";
      // this.endDate = "2021/06/03";
      this.setInitDate();
    },
    targetGoalModal() {
      this.$refs.targetGoal.openDialog();
    },
    visibilitySelect(data) {
      let visible = '';
      let visibleText = '';
      data.user.map(u => {
          visible += 'u' + u.id + ',';
          visibleText += u.employeeName + ','
      });
      data.depart.map(d => {
          visible += 'd' + d.id + ','
          visibleText += d.departmentOaName + ','
      });
      this.visibleRange = visible;
      this.selectedVisible = visibleText;
    },
    selectVisible(param) {
      let visibleType = constant.visibilityTypeArr.filter(v => v.title == param);
      if(param == '指定范围') {
        this.$refs.visibilityPicker.openDialog();
        this.visibleType = visibleType[0].dbformat;
      }else{
        this.selectedVisible = param;
        this.visibleType = visibleType[0].dbformat;
        this.visibleRange = visibleType[0].title;
      }
      setTimeout(() => {
        this.isShowVisible = false;
      }, 100);
    },
    hideVisibleSelectBox() {
      this.isShowVisible = false;
    },
    showVisibleSelectBox() {
      this.isShowVisible = true;
    },
    handle_setPersonalGoal(prop) {
      this.alignTargetValue = prop.ob_name;
      this.parent_obj_id = prop.ob_id;
      this.personalGoalSelected = true;
    },
    showCycleModal() {
      this.show_cycle = true;
    },
    closeCycleModal() {
      this.show_cycle = false;
    },
    saveCycleModal() {
      this.show_cycle = false;
    },
    displayCalendarPeriod() {
      this.calendarPeriod = true;
      this.$refs.calendarPeriod.displayCalendarPeriod();
    },
    handleChangeDates(prop) {
      this.startDate = prop[0];
      this.endDate = prop[1];
    },
    handle_getTimePeriod(prop) {
      this.cycleSave = prop.cycle;
      let quaters = prop.cycle.split("/");
      let months = prop.cycle.split("-");
      let year, quater, month;
      constant.cycleItems.map((c) => {
        if (c.dbformat == "/" + quaters[1]) {
          quater = c.title;
          year = quaters[0];
          this.startDate = year + c.startDate;
          this.endDate = year + c.endDate;
        }
        if (c.dbformat == "-" + months[1]) {
          month = c.title;
          year = months[0];
          this.startDate = year + c.startDate;
          this.endDate = year + c.endDate;
        }
      });
      this.selected_year = year;
      this.selected_quarter = quaters.length == 2 ? quater : month;
    },
    openVisibility(ev) {
      // let visibleType = constant.visibilityTypeArr.filter(v => v.title == ev);
      // if(ev == '指定范围') {
      //   this.$refs.visibilityPicker.openDialog();
      //   this.visibleType = visibleType[0].dbformat;
      // }else{
      //   this.visibleType = visibleType[0].dbformat;
      //   this.visibleRange = visibleType[0].title;
      // }
    },
    handle_createGoalLibrary(prop) {
      this.dialog1 = false;
      this.goalName = prop.ob_name;
      this.krArr = [];
      prop.ob_results.forEach((item, index) => {
        this.krArr.push({
          order: index + 1,
          kr_name: item.kr_name,
          kr_owner: item.kr_owner,
          kr_owner_name: "",
          deleteIcon: false
        });
      })
    }
  },
};
</script>

<style scoped>
.create-modal {
  margin: 0;
  font-size: 14px;
}

.v-card__title {
  padding: 16px 32px;
  font-size: 18px;
  font-weight: bold;
  line-height: 28px;
  border-bottom: 1px solid rgb(233, 236, 240);
  color: rgb(20, 28, 40);
  text-align: left;
}

.headline {
  font-size: 14px !important;
  font-weight: 600;
}

.headline-link {
  color: rgb(40, 121, 255);
  font-weight: 400;
  font-size: 14px;
  margin-right: 14px;
  transition: color 0.5s ease 0s;
}

.headline-link:before {
  content: "\eeab";
}

.hide-modal-icon i {
  font-size: 17px;
  font-weight: bold;
  transition: color 0.3s ease-in 0s;
  color: rgb(20, 28, 40);
}

.hide-modal-icon i:hover {
  color: rgb(247, 105, 100);
}

.obj-error {
  border: 1px solid #f00;
}

.goal-name-container {
  position: relative;
  height: 48px;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgb(127 145 180 / 15%);
  margin-top: 24px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: -apple-system, BlinkMacSystemFont, Arial, Verdana, Helvetica Neue,
    Helvetica, sans-serif;
  /* width: 525px; */
  width: 99%;
}

.hint {
  position: absolute;
  right: -32px;
}

.kr-hint {
  right: -29px;
  top: 7px;
}

.hint .v-icon {
  color: #f6bf1e;
}

.hint .v-icon:hover {
  cursor: pointer;
}

.hint-text {
  position: absolute;
  top: 250px;
  left: calc(50% + 310px);
  border: 1px solid #f6bf1e;
  width: 240px;
  background-color: #fff;
  border-radius: 5px;
  height: 497px;
  padding: 10px;
}

.hint-title {
  font-size: 17px;
  font-weight: 500;
  color: #f6bd16;
  line-height: 24px;
  padding: 10px 18px;
  padding-top: 28px;
}

.hint-description {
  font-size: 12px;
  color: #6f7886;
  line-height: 18px;
  margin-bottom: 24px;
  padding: 10px 0px;
}

.hint-description .v-icon {
  color: #f6bf1e;
}

.divider {
  margin-top: 50px;
}

.divide-line {
  width: 25%;
  height: 1px;
  border-bottom: 1px dotted #f6bd16;
}

.divide-text {
  font-size: 12px;
  color: #f6bd16;
  line-height: 18px;
}

.desc-list {
  font-size: 12px;
  color: #6f7886;
  line-height: 18px;
}

.put-away {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 14px;
}

.put-away:hover {
  cursor: pointer;
  color: #2879ff;
}

.goal-name-container input {
  border: none;
  outline: none;
  flex: 1;
  color: #141c28;
  font-weight: 600;
  font-size: 16px;
  margin-right: 8px;
}

.goal-name-container .first-item {
  font-size: 18px;
  line-height: 22px;
  padding-left: 12px;
  padding-right: 10px;
  color: #2879ff;
  font-weight: 600;
}

.goal-name-container .second-item {
  width: 74%;
  height: 100%;
}

.goal-name-container .second-item input {
  height: 100%;
  width: 100%;
}

.logged-user .user-avatar-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  text-align: center;
  background-color: rgb(141, 200, 234);
  color: rgb(255, 255, 255);
  margin-right: 10px;
}

.kr-error {
  border-bottom: 1px solid #f00 !important;
}

.kr-name-container {
  position: relative;
  margin-top: 1rem;
  margin-right: 2px;
}

.kr-name-container:hover {
}

.kr-name-container .first-item {
  width: 35px;
}

.kr-name-container .first-item a i {
  transition: color 0.3s ease-in 0s;
}

.kr-name-container .first-item a:hover i {
  color: rgb(247, 105, 100) !important;
}

.kr-name-container .second-item {
  width: 100%;
  border-bottom: 1px solid #e9ecf0;
  height: 44px;
}

.kr-name-container .second-item {
  height: 100%; 
}

.kr-name-container .kr-title {
  margin-right: 10px;
  font-weight: 600;
  font-size: 17px;
}

.kr-name-container .kr-input {
  width: 73.5%;
}

.kr-name-container .kr-input input {
  width: 100%;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #6f7886;
  line-height: 22px;
  border: none;
  outline: none;
  flex: 1;
  min-height: 42px;
}

.kr-field-add-container {
  height: 44px;
  padding-left: 30px;
}

.kr-field-add-container a {
  color: rgb(40, 121, 255);
  margin-top: 4px;
}

.setting-title {
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  color: #3f4755;
  line-height: 22px;
  margin-bottom: 10px;
  margin-top: 16px;
}

.blue-bar {
  background: linear-gradient(90deg, rgb(78, 144, 255), rgb(40, 121, 255));
  width: 4px;
  height: 16px;
  border-radius: 2px;
  margin-right: 6px;
}

.setting-item {
  width: 50%;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, Arial, Verdana, Helvetica Neue,
    Helvetica, sans-serif;
  font-weight: 400;
  color: #89919f;
  line-height: 20px;
  margin-bottom: 6px;
  flex: none;
}

.save {
  min-width: 90px;
  height: 36px;
  padding: 0px 18px;
  font-size: 14px;
  font-weight: 400;
  background: rgb(40, 121, 255);
  color: rgb(255, 255, 255);
}

.save:hover {
  background-color: rgb(92, 142, 255);
  border: none;
}

.close {
  min-width: 90px;
  height: 36px;
  padding: 0px 18px;
  font-size: 14px;
  font-weight: 400;
  box-sizing: border-box;
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  color: rgb(111, 120, 134);
  cursor: pointer;
  outline: none;
  transition: color 0.3s ease 0s, border 0.3s ease 0s;
  background: transparent;
  border-radius: 3px;
  border: 1px solid rgb(233, 236, 240);
}

.close:hover {
  color: rgb(40, 121, 255);
  border-color: rgb(40, 121, 255);
}

.personalGoalName {
  width: 100%;
  margin: 0px;
  padding: 0px 38px 0px 10px;
  position: relative;
  bottom: 56px;
}

.fontSize13 {
  font-size: 13px !important;
  cursor: pointer;
  color: black !important;
}

.fontSize13_sec {
  font-size: 11px !important;
}

.closePersonalName {
  font-size: 13px !important;
  background-color: rgb(100, 100, 100);
  border-radius: 50%;
  color: white;
  cursor: pointer;
}

.cycle_btn {
  width: 98%;
}

.plr-10 {
  padding: 0px 10px;
}

.mrg-5 {
  margin-right: 7px;
}

.cycle {
  transition: all 0.8s ease;
  display: none;
  position: absolute;
  padding-top: 10px;
  bottom: 9px;
  right: 36px;
  width: 260px;
  height: 170px;
  z-index: 1;
}

.cycleModalCard {
  display: block !important;
}

.h100 {
  height: 100%;
}

.w100 {
  width: 100%;
}

.m-0 {
  margin: 0px;
}

.fontSize11 {
  font-size: 11px !important;
}

.fontSize20 {
  font-size: 20px !important;
}

.mr-5 {
  margin-right: 5px;
}

.mt-5 {
  margin-top: 5px !important;
}

.mt-22 {
  margin-top: 22px;
}

.pos-relative-l {
  position: relative;
  left: 12px;
}

.pos-relative-l-b {
  position: relative;
  left: 9px;
  bottom: 2px;
}

.h-0 {
  height: 0px;
}

.visible-text {
  position: relative;
  width: 100%;
  height: 40px;
  padding: 0px 10px;
  word-break: break-word;
  border: 1px solid #9e9e9e;
  border-radius: 5px;
  /* overflow: hidden; */
}

.visible-select-box {
  position: absolute;
  left: 0;
  top: 5px;
  border: 1px solid #fff;
  border-radius: 5px;
  background: #fff;
  box-shadow: 1px 1px 5px #ddd;
  width: 100%;
  font-size: 14px;
}

.visible-select-box div:hover {
  cursor: pointer;
  background:#eee;
}

.f-14 {
  font-size: 14px !important;
}
</style>
