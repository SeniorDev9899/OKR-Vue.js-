<template>
  <v-row class="h100">
  <!-- banner -->
    <div class="object-container d-flex justify-space-between align-center mb-4 mt-12">
      <UserAvatar :name="authUser.employeeName.charAt(0)" width='50px' height = '50px' />
      <div class="mx-4 obj-editable">
          <div class="object-name">
          <span v-if="!obNameEdit">
              {{object_name}}
          </span>
          <span class="input-container" v-if="obNameEdit">
              <input type="text" class="ob-name-edit" ref="ob_name_form" :value="object_name" @input="changeObName"  v-on:keyup.enter="closeObNameEdit" />
          </span>
          <span @click="nameEdit"  v-if="!obNameEdit && !disableEdit">
              <v-icon aria-hidden="false" style="font-size: 15px;" outlined>
              mdi-tooltip-edit
              </v-icon>
          </span>
          </div>
          <div class="cycle-container obj-cycle mt-2 ml-2 d-flex justify-start align-center" @click="openCycleDatePicker">
              <v-icon style="font-size: 16px;">mdi-clock-outline</v-icon>
              <span>{{cycle}} <span class="ml-1">({{startDate}}~{{endDate}})</span></span>
              <div class="cyclePicker" v-if="showCycleDatePicker">
                  <Calendar @pick="handle_getTimePeriod" :isWhole="false"/>
                  <v-divider class="my-2"></v-divider>
                  <date-range-picker
                      ref="picker"
                      opens="center"
                      :locale-data="{ 
                          firstDay: 1,
                          format: 'yyyy-mm-dd',
                          applyLabel: '确定',
                          cancelLabel: '取消',
                          daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                          monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
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
                  <div class="mt-4 d-flex justify-end align-center">
                      <v-spacer></v-spacer>
                      <v-btn class="close mr-4" text @click="closeCyclePicker" dense depressed>取消</v-btn>
                      <v-btn class="save" text @click="updateCycle" dense depressed>确定</v-btn>
                  </div>
              </div>
              <div class="overlay" v-if="disableEdit" @click="ev => ev.stopPropagation()"></div>
          </div>
      </div>
      
      <div style="position: relative;width:150px;">
          <span style="cursor: pointer;">
            <v-progress-linear :value="selectedObj.ob_progress" color="rgb(159, 191, 255)" width="50" height="14" :rounded="true" class="okr-progress-linear" @click="openPercentDialog">
                <template v-slot:default="{ value }">
                    <span>{{value}}%</span>
                </template>
            </v-progress-linear>
          </span>
          <div class="progress-description mt-1 d-flex justify-space-between">
              <!-- <span class="left">06/22 04:37 更新</span> -->
              <span class="right" v-if="!!selectedObj.ob_recent_pr && selectedObj.ob_recent_pr.pr_up_percent > 0">
                  <v-icon aria-hidden="false" style="font-size:14px; color:rgb(90, 216, 166);">
                  mdi-arrow-up
                  </v-icon>
                  <span style="color:rgb(90, 216, 166);">
                      {{!!selectedObj.ob_recent_pr && selectedObj.ob_recent_pr.pr_up_percent}}%
                  </span>
              </span>
              <span class="right" v-if="!!selectedObj.ob_recent_pr && selectedObj.ob_recent_pr.pr_up_percent < 0">
                  <v-icon aria-hidden="false" style="font-size:14px; color:rgb(240, 94, 94);">
                  mdi-arrow-down
                  </v-icon>
                  <span style="color:rgb(240, 94, 94);">
                      {{Math.abs(!!selectedObj.ob_recent_pr && selectedObj.ob_recent_pr.pr_up_percent)}}%
                  </span>
              </span>
          </div>
          <div class="overlay" v-if="disableEdit" @click="ev => ev.stopPropagation()"></div>
      </div>
    </div>
    <!-- Top bar start -->
    <div class="top-bar d-flex align-center justify-start h_64">
      <div class="detail-title mr-4">
        个人目标
      </div>
      <div class="mr-auto">
        <TabComponent :tabs="tabItems" @clickTab="tabShow" />
      </div>
      <div class="d-flex align-center justify-end">
        <!-- <span class="setting-title d-flex align-center mr-2">
          <ToolTipComponent direction="bottom" tooltipText="提醒上级查看">
            <a>提醒上级查看</a>
          </ToolTipComponent>
        </span> -->
        <!-- <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <span
              class="settings-icon d-flex align-items justify-center"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon aria-hidden="false">mdi-hexagon-outline</v-icon>
            </span>
          </template>
          <v-list class="setting-menu-bar">
            <v-list-item v-for="(item, index) in settings" :key="index">
              <v-list-item-title class="setting-list">{{
                item
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu> -->
      </div>
    </div>
    <div class="content-container h164" color="white">
      <div class="tab-1" v-if="tabIndex == 0">
        <OKRsComponent @select="selectObject" :object_id="object_id" />
      </div>
      <div class="tab-2" v-if="tabIndex == 1">
        <ExecuteComponent :object_id="object_id"/>
      </div>
      <div class="tab-3" v-if="tabIndex == 2">
        <ProgressComponent :object_id="object_id"/>
      </div>
      <div class="tab-4 h100" v-if="tabIndex == 3">
        <InteractiveComponent :object_id="object_id" :goal="goal" />
      </div>
      <div class="tab-5" v-if="tabIndex == 4">
        <EWeeklyComponent />
      </div>
      <div class="tab-6" v-if="tabIndex == 5">
        <ReplayComponent :object_id="object_id" />
      </div>
      <div class="tab-7" v-if="tabIndex == 6">
        <BasicInfoComponent :object_id="object_id"/>
      </div>
    </div>
    <NewPercentDialogComponent ref="percent" :percent="selectedObj.ob_progress" :autoOption="selectedObj.ob_auto_progress" @savePercentValue="(param) => getPercentValue(param)" :firstOptionPercentValue="firstValue" :secondOptionPercentValue="secondValue" />
  </v-row>
</template>

<script>
import TabComponent from "@/components/okrgoal/okrDetail/shared/TabComponent.vue";
import ToolTipComponent from "@/components/okrgoal/shared/ToolTipComponent.vue";
import BasicInfoComponent from '@/components/okrgoal/okrDetail/Basic-Information/BasicInfoComponent.vue';
import ExecuteComponent from '@/components/okrgoal/okrDetail/E-execute/ExecuteComponent.vue';
import EWeeklyComponent from '@/components/okrgoal/okrDetail/E-weekly/EWeeklyComponent.vue';
import InteractiveComponent from '@/components/okrgoal/okrDetail/Interactive/InteractiveComponent.vue';
import OKRsComponent from '@/components/okrgoal/okrDetail/OKRs/OKRsComponent.vue';
import ProgressComponent from '@/components/okrgoal/okrDetail/Progress/ProgressComponent.vue';
import ReplayComponent from '@/components/okrgoal/okrDetail/Replay/ReplayComponent.vue';
import { mapGetters, mapActions } from 'vuex';
import { getUser } from '@/utils/authUser.service';
import { constant } from '@/constants/constant.js';
import UserAvatar from '@/components/common/UserAvatar.vue';
import Calendar from '@/components/common/Calendar.vue';
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import NewPercentDialogComponent from "@/components/okrgoal/shared/NewPercentDailogComponent.vue";

export default {
  name: "OkrDetailComponent",
  props: ['object_id', 'tab_index'],
  components: {
    TabComponent,
    ToolTipComponent,
    BasicInfoComponent,
    ExecuteComponent,
    EWeeklyComponent,
    InteractiveComponent,
    OKRsComponent,
    ProgressComponent,
    ReplayComponent,
    UserAvatar,
    Calendar,
    DateRangePicker,
    NewPercentDialogComponent
  },
  data() {
    return {
      settings: ["复制目标", "结束目标", "删除目标"],
      tabItems: [
        "OKR",
        "E-执行",
        "进展",
        "互动",
        "E周报",
        "复盘",
        "基本信息"
      ],
      tabIndex: 0,
      goal: true,
      obNameEdit: false,
      showCycleDatePicker: false,
      selectedObj: Object,
      minDate: '2018-01-01',
      maxDate: '2050-12-31',
      dateRange: {},
      saveCycle: null,
      saveRange: null
    };
  },
  created() {
    if(!!this.$route.params.ob_id) {
      if(this.isTab) {
        this.object_id = this.obj_id;
        this.getUsers();
      }else{
        let param = this.$route.params.ob_id.split('&');
        if(param[2].split("=")[1] == 1)
        {
          this.$emit("ShowSubMenu", false);
        }
        let currentPage = this.currentPage ? this.currentPage : param[2].split("=")[1];
        let pageItemCount = this.pageItemCount ? this.pageItemCount : param[1].split("=")[1];
        this.object_id = this.obj_id ? this.obj_id : param[0].split("_")[2];
        this.getOkrs({filter: {ob_owner: getUser().id}});
        this.getUsers();
      }
    }else{
      if(this.isTab) {
        this.object_id = this.obj_id;
        this.getUsers();
      }
    }
  },
  computed: {
    ...mapGetters('okr', ['okrObj', 'OkrObjForAddsort']),
    ...mapGetters('auth', ['authUser']),
    object_name: function() {
      if(this.okrObj.length !== 0) {
        const selectedObj = this.okrObj.filter(obj => obj.ob_id == this.object_id);                
        this.selectedObj = selectedObj[0];
        return selectedObj[0].ob_name;
      }else{                
        return [];
      }
    },
    // dateRange: function() {
    //   let start = this.selectedObj.ob_start_date;
    //   let end = this.selectedObj.ob_end_date;
    //   return {
    //     startDate: start,
    //     endDate: end
    //   }
    // },
    disableEdit: function() {
      if(!!this.currentOkr) {
        return this.currentOkr.ob_status == 1 || getUser().id != this.currentOkr.ob_owner
      }else {
        return false;
      }
    },
    // percent_update: function() {
    //   if(!!this.currentOkr && !!this.currentOkr.ob_recent_pr) {
    //     return this.currentOkr.ob_recent_pr.pr_up_percent;
    //   }else{
    //     return 0;
    //   }
    // },
    currentOkr: function () {
      const index = this.okrObj.findIndex(item => item.ob_id == this.object_id)
      return this.okrObj[index];
    },
    cycle: function() {
      let cycle = this.selectedObj.ob_cycle;
      if(cycle != undefined) {
        cycle += '';
        let tmp = cycle.split('/');
        if(tmp.length == 2) {
          let year = tmp[0];
          let quater = '/' + tmp[1];
          let result = constant.cycleItems.filter(c => c.dbformat == quater);
          return year + '年' + result[0].title;
        }else{
          tmp = cycle.split('-');
          let year = tmp[0];
          let month = '-' + tmp[1];
          let result = constant.cycleItems.filter(c => c.dbformat == month);
          return year + '年' + result[0].title;
        }
      }
    }, 
    startDate: function() {
      let start = this.selectedObj.ob_start_date;
      let startDate = new Date(start+' 00:00:00');
      let month = startDate.getMonth() + 1;
      let day = startDate.getDate();
      return month + '/' + day;
    },
    endDate: function() {
      let end = this.selectedObj.ob_end_date;
      let endDate = new Date(end+' 00:00:00');
      let month = endDate.getMonth() + 1;
      let day = endDate.getDate();
      return month + '/' + day;
    },
    firstValue: function() {
      let value = 0;
      let len;
      if(!!this.selectedObj.ob_results) {
        len = this.selectedObj.ob_results.length;
        this.selectedObj.ob_results.map((result) => {
          value += result.kr_completion;
        });
      }
      if(value != 0 && len != 0) {
        return Math.floor(value / len).toFixed(0);
      }else {
        return 0;
      }
    },
    secondValue: function() {
      let value = 0;
      let len;
      if(!!this.selectedObj.ob_child_objects) {
        len = this.selectedObj.ob_child_objects.length;
        this.selectedObj.ob_child_objects.map((result) => {
          value += result.ob_progress;
        });
      }
      if(value != 0 && len != 0) {
        return Math.floor(value / len).toFixed(0);
      }else {
        return 0;
      }
    },
  },
  watch: {
    tab_index(v) {
      this.tabIndex = v;
    }
  },
  methods: {
    ...mapActions('okr', ['getOkrs', 'updateOkr']),
    ...mapActions('user',['getUsers']),
    selectKR(data) {
      this.$emit("selectKR", data);
    },
    tabShow(index) {
      if(index == 3)
      {
        this.$emit("interactiveTab", {index: index});
      } else {
        this.$emit("interactiveTab", {index: index});
      }
    },
    handle_displayHiddenBtns(prop) {
      this.$emit("displayHiddenBtns", prop);
    },
    datePicker(param) {
      let start = param.startDate;
      let end = param.endDate;
      start = new Date(start);
      end = new Date(end);
      start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
      end = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
      this.saveRange = { startDate: start, endDate: end }      
    },
    changeObName(ev) {
      ev.stopPropagation();
      this.obNameChangeValue = ev.target.value;
    },
    closeObNameEdit(ev) {
      ev.stopPropagation();
      let obj = {
        ob_id: this.object_id,
        ob_name: this.obNameChangeValue
      }
      if(this.obNameChangeValue !== '') {
        this.updateOkr(obj);
      }
      this.obNameEdit = false;
    },
    getPercentValue(param) {
      param.pr_parent = this.selectedObj.ob_id;
      let obj = {
        ob_id: this.selectedObj.ob_id,
        ob_progress: param.pr_percent
      }
      const pr_change = param.pr_percent - this.selectedObj.ob_progress;
      this.selectedObj.ob_recent_pr.pr_up_percent = pr_change;
      this.updateOkr(obj);
      this.addProgress(param);
    },
    openPercentDialog() {
      this.$refs.percent.openDialog();
    },
    nameEdit(ev) {
      ev.stopPropagation();
      this.obNameEdit = true;
    },
    openCycleDatePicker() {
      this.showCycleDatePicker = true;
      this.dateRange = { startDate: this.selectedObj.ob_start_date, endDate: this.selectedObj.ob_end_date};
      this.saveCycle = this.selectedObj.ob_cycle
    },  
    updateCycle(ev) {
      let obj = {}
      if(!!this.saveRange) {
        obj = {
          ob_id: this.object_id,
          ob_cycle: this.saveCycle,
          ob_start_date: this.saveRange.startDate,
          ob_end_date: this.saveRange.endDate
        }
      } else {
        obj = {
          ob_id: this.object_id,
          ob_cycle: this.saveCycle,
          ob_start_date: this.dateRange.startDate,
          ob_end_date: this.dateRange.endDate
        }
      }
      if(obj.ob_cycle == '' || obj.ob_start_date == '' || obj.ob_end_date == '') {

      }else{
        this.updateOkr(obj);
      }
      ev.stopPropagation();
      this.showCycleDatePicker = false;
    },
    handle_getTimePeriod(data) {
      this.saveCycle = data.cycle;
      //quarter start and end date
      if(data.cycle.includes('/')) {
        const cycle = data.cycle.split('/');
        const year = cycle[0];
        const quarter = cycle[1];
        let start = new Date(year, (quarter-1)*3, 1)
        let end = new Date(year,start.getMonth() + 3, 0)
        start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
        end = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
        this.dateRange = { startDate: start, endDate: end}
      }
      // month start and end date
      if(data.cycle.includes('-')) {
        const cycle = data.cycle.split('-');
        const year = cycle[0];
        const month = cycle[1];
        let start = new Date(year, month-1, 1)
        let end = new Date(year, month, 0)
        start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
        end = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
        this.dateRange = { startDate: start, endDate: end}
      }
    },
    closeCyclePicker(ev) {
      ev.stopPropagation();
      this.showCycleDatePicker = false;
    },
    selectObject(e) {
      this.$emit('select', e)
    }
  },
};
</script>

<style scoped>
.top-bar {
  font-size: 14px;
  margin: 0 15px;
  padding: 20px 10px;
  padding-bottom: 0;
  border-bottom: 2px dashed #e9eaeb;
  width: 100%;
}
.ob_map_detail {
  position:sticky;
  top:41px;
  background: white;
  z-index:10;
}
.detail-title {
  font-size: 20px;
  font-weight: 600;
  color: #3e484e;
  white-space: nowrap;
  margin-bottom: 5px;
}

.setting-title {
  background-color: #e7eef3;
  padding: 6px 10px;
  margin-bottom: 5px;
}

.setting-title a {
  color: #adb8c0;
}

.settings-icon {
  width: 32px;
  height: 32px;
  box-shadow: 0 2px 4px 0 rgb(40 121 255 / 16%);
  background: #fff;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 10px;
}

.settings-icon .v-icon {
  font-size: 18px;
  color: #333;
}

.setting-list {
  line-height: 30px;
  color: #667580 !important;
  font-size: 12px;
  padding: 0 32px;
}

.setting-list:hover {
  background-color: #f0f7fc;
  cursor: pointer;
}

.setting-menu-bar .v-list-item {
  padding: 0;
  min-height: 32px;
}

.content-container {
  padding: 10px 50px;
  width: 100%;
}

.add-target-text {
  font-weight: 500;
  color: #a4acb9;
  height: 22px;
  font-size: 14px;
  font-family: -apple-system,Arial,Verdana,Helvetica Neue,Helvetica,sans-serif;
  line-height: 22px;
}
.ob-interactive-right {
  position: relative;
  top: 40px;
  width: 100%;
  margin: 0px;
  margin-top: 10px;
}
.top-bar {
  font-size: 14px;
  margin: 0 15px;
  padding: 20px 10px;
  padding-bottom: 0;
  border-bottom: 2px dashed #e9eaeb;
  width: 100%;
}

.detail-title {
  font-size: 20px;
  font-weight: 600;
  color: #3e484e;
  white-space: nowrap;
  margin-bottom: 5px;
}

.setting-title {
  background-color: #e7eef3;
  padding: 6px 10px;
  margin-bottom: 5px;
}

.setting-title a {
  color: #adb8c0;
}

.settings-icon {
  width: 32px;
  height: 32px;
  box-shadow: 0 2px 4px 0 rgb(40 121 255 / 16%);
  background: #fff;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 10px;
}

.settings-icon .v-icon {
  font-size: 18px;
  color: #333;
}

.setting-list {
  line-height: 30px;
  color: #667580 !important;
  font-size: 12px;
  padding: 0 32px;
}

.setting-list:hover {
  background-color: #f0f7fc;
  cursor: pointer;
}

.setting-menu-bar .v-list-item {
  padding: 0;
  min-height: 32px;
}

.content-container {
  padding: 10px 50px;
  width: 100%;
}

.add-target-text {
  font-weight: 500;
  color: #a4acb9;
  height: 22px;
  font-size: 14px;
  font-family: -apple-system,Arial,Verdana,Helvetica Neue,Helvetica,sans-serif;
  line-height: 22px;
}
.thickness {
  width: 100%;
  height: 10px;
  background-color: #f0f2f5;
}
.h100 {
  height: 100%;
}
.h164 {
  height: calc(100% - 64px);
}
.h_64 {
  height: 64px;
}
.cycle-container {
    position: relative;
}

.cycle-container:hover {
    cursor: pointer;
}

.cyclePicker {
    position: absolute;
    top: 30px;
    left: 0;
    border: 1px solid #aaa;
    padding: 10px 30px;
    border-radius: 5px;
    background-color: #fff;
    z-index: 12;
}

.object-name input {
    box-sizing: border-box;
    position: relative;
    background: rgb(255, 255, 255);
    cursor: text;
    border: 1px solid rgb(233, 236, 240);
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 7px 7px;
    transition: border 0.2s ease 0.2s, box-shadow 0.2s ease 0.2s;
    color: #3f4755 !important;
}

.object-name input:focus {
    outline: none;
    border: 1px solid rgb(40, 121, 255);
    box-shadow: rgb(40 121 255 / 30%) 0px 0px 6px 0px inset;
}

.input-container {
    width: 100%;
}

.input-container input {
    width: 100%;
}

.object-name .v-icon {
    cursor: pointer;
}


.obj-editable {
    width: 100%;
}

.obj-cycle {
  word-break: break-all;
  white-space: nowrap;
  font-family: -apple-system,Arial,Verdana,Helvetica Neue,Helvetica,sans-serif;
  color: #89919f;
  font-size: 12px;
  line-height: 18px;
}

.object-name {
    color: #141c28;
    font-size: 20px;
    line-height: 24px;
    font-family: -apple-system,Arial,Verdana,Helvetica Neue,Helvetica,sans-serif;
    vertical-align: middle;
    word-break: break-all;
    font-weight: 600;
    margin-right: 8px;
    width: 100%;
}

.key-result-input input {
    box-sizing: border-box;
    position: relative;
    background: rgb(255, 255, 255);
    cursor: text;
    border: 1px solid rgb(233, 236, 240);
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 7px 7px;
    transition: border 0.2s ease 0.2s, box-shadow 0.2s ease 0.2s;
    color: #3f4755 !important;
}

.key-result-input input:focus {
    outline: none;
    border: 1px solid rgb(40, 121, 255);
    box-shadow: rgb(40 121 255 / 30%) 0px 0px 6px 0px inset;
}

.aligned-target {
    width: 100%;
}

.obj-symbol {
    height: 16px;
    width: 32px;
    padding: 6px;
    box-sizing: border-box;
    background: rgba(40,121,255,.1);
    border-radius: 12px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: rgb(40,121,255);
}

.align-action:hover {
    cursor: pointer;
    background: #eee;
}

.overlay {
    width: 100%;
    height: 100%;
    background: transparent;
    /* background: rgba(0, 0, 0, 0.2); */
    position: absolute;
    top: 0;
    right: 0px;
    z-index: 100000;
}

.object-container {
  width: 100%;
  padding: 0 50px;
}
</style>

<style>
.thickness {
  width: 100%;
  height: 10px;
  background-color: #f0f2f5;
}
</style>
