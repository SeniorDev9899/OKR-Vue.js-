<template>
<div v-if="selectedObj">
  <div class="mt-4"></div>
  <KeyResultListComponent :disableEdit="disableEdit" :object_id="object_id" :okrObj="okrObj" @selectKR="selectKR" :isSimple="false" />
  <div class="mt-4"></div>
  <!-- add quick kr -->
  <div class="okr-sub-title d-flex align-center justify-start py-4 " v-if="!isKeyResult">
    <a class="d-flex align-center" @click="openQuickKeyResult">
      <v-icon aria-hidden="false" class="" style="font-size: 18px;">
        mdi-plus
      </v-icon>
      <span>添加KR</span>
    </a>
  </div>
  <v-layout class="key-result-add mt-6 mb-4" v-else>
    <v-row class="align-center">
      <v-text-field class="mt-6 mx-1" outlined dense v-on:keyup.enter="ev => saveKeyResult(ev, selectedObj.ob_id)"></v-text-field>
      <RatingPopupComponent class="mx-1" :selected="selectedRating" v-on:selectRating="param => selectRating(param)">
        <div>
          <v-icon aria-hidden="false" class="mr-1" style="font-size: 18px; color: #FFCA2A;">
            mdi-heart
          </v-icon>
          <span class="mr-1">{{selectedRating}}分</span>
        </div>
      </RatingPopupComponent>
      <v-icon class="mx-1" small @click="closeQuickKeyResult">
        mdi-close
      </v-icon>
    </v-row>
  </v-layout>
  <div class="thickness"></div>
  <!-- add parent and show children -->
  <v-container fluid>
    <v-row>
      <div class="add-target-text my-4">向上对齐的目标</div>
    </v-row>
    <!-- add parent button -->
    <v-row v-if="!selectedObj.ob_parent_objects">
      <v-btn @click="openAddAlignDialog" small text><span class="text-subtitle-1 mr-1">+</span>添加</v-btn>
    </v-row>
    <v-row v-else class="align-center">
      <v-chip class="mx-2 blue lighten-4 blue--text" small>O</v-chip>
      <div @click="selectObject(selectedObj.ob_parent_objects.ob_id)" style="cursor:pointer;">{{ selectedObj.ob_parent_objects.ob_name }}</div>
      <v-spacer></v-spacer>
      <v-col cols=1>
        <v-progress-linear height="8" rounded :value="selectedObj.ob_parent_objects.ob_progress"></v-progress-linear>
      </v-col>
      <div style="width:40px;" class="text-caption mx-1">{{ selectedObj.ob_parent_objects.ob_progress}}%</div>
      <v-menu offset-y left>
        <template v-slot:activator="{attrs, on}">
          <v-icon class="mx-1" v-bind="attrs" v-on="on" small>mdi-dots-horizontal</v-icon>
        </template>
        <v-list>
          <v-btn @click="openAddAlignDialog" block small text>
            <v-icon class="mr-2" small>mdi-pencil-outline</v-icon>修改对齐
          </v-btn>
          <v-btn @click="removeParent" block small text>
            <v-icon class="mr-2" small>mdi-arrow-collapse-up</v-icon>取消对齐
          </v-btn>
        </v-list>
      </v-menu>
    </v-row>
    <!-- show children objects -->
    <v-row>
      <div class="my-4">对齐我的目标<span v-if="selectedObj.ob_child_objects.length>0" class="ml-2">({{ selectedObj.ob_child_objects.length }})</span></div>
    </v-row>
    <v-row class="my-2" v-for="(child, i) in selectedObj.ob_child_objects" :key="child.ob_id">
      <v-container fluid>
        <v-row class="mb-4">
          <v-chip class="mx-2 blue lighten-4 blue--text" small>O</v-chip>
          <div @click="selectObject(child.ob_id)" style="cursor:pointer;">{{ child.ob_name }}</div>  
        </v-row>
        <v-row class="pl-10 align-center">
          <v-icon>mdi-account-outline</v-icon>
          <div class="text-caption mx-2">{{ child.ob_owner | username }}</div>
          <v-icon>mdi-clock-outline</v-icon>
          <div class="text-caption mx-2">{{ translate(child.ob_cycle) }}</div>
          <v-spacer></v-spacer>
          <v-col cols="1">
            <v-progress-linear height="8" rounded :value="child.ob_progress"></v-progress-linear>
          </v-col>
          <div style="width:40px;" class="text-caption mx-1">{{ child.ob_progress }}%</div>
        </v-row>
        <v-row >
          <v-divider></v-divider>
        </v-row>        
      </v-container>
    </v-row>
  </v-container>
  <PercentDialogComponent ref="percent" :isAuto="selectedObj.ob_auto_progress" :percent="selectedObj.ob_progress" :autoPercent="autoPercent" v-on:savePercentValue="param => getPercentValue(param)" v-on:saveProgressOption="param => saveProgressOption(param)" />
  <AddSort ref="addsort" :okrObj="okrObjList" v-on:setPersonalGoal="param => setParent(param)" v-on:setUnlink="setUnlink" />
</div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex';
import KeyResultItemComponent from '@/components/okrgoal/shared/KeyResultItemComponent.vue';
import KeyResultListComponent from '@/components/okrgoal/okrDetail/OKRs/KeyResultListComponent.vue';
import UserAvatar from '@/components/common/UserAvatar.vue';
import Calendar from '@/components/common/Calendar.vue';
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import PercentDialogComponent from '@/components/okrgoal/shared/PercentDialogComponent.vue';
import RatingPopupComponent from '@/components/okrgoal/shared/RatingPopupComponent.vue';
import AddSort from '@/components/common/AddSort.vue';
import {
  constant
} from '@/constants/constant.js';
import {
  getUser
} from '@/utils/authUser.service';

export default {
  name: 'OKRsComponent',
  props: ['object_id'],
  components: {
    UserAvatar,
    KeyResultListComponent,
    Calendar,
    DateRangePicker,
    PercentDialogComponent,
    RatingPopupComponent,
    AddSort
  },
  data() {
    return {
      obNameEdit: false,
      obNameChangeValue: '',
      selected_year: '',
      selected_quarter: '',
      startDateSave: '',
      endDateSave: '',
      saveCycle: '',
      minDate: '2018-01-01',
      maxDate: '2050-12-31',
      isKeyResult: false,
      selectedRating: 5,
      showCycleDatePicker: false,
      alignTarget: false,
      alignedTargetObj: Object
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('okr', ['OkrObjForAddsort', 'okrObj']),
    selectedObj: function () {
      const selectedObj = this.okrObj.filter(obj => obj.ob_id == this.object_id);
      return selectedObj[0]
    },
    disableEdit: function () {
      if (!!this.currentOkr) {
        return this.currentOkr.ob_status == 1 || getUser().id != this.currentOkr.ob_owner
      } else {
        return false;
      }
    },
    percent_update: function () {
      if (!!this.currentOkr && !!this.currentOkr.ob_recent_pr) {
        return this.currentOkr.ob_recent_pr.pr_up_percent;
      } else {
        return 0;
      }
    },
    currentOkr: function () {
      // const index = this.OkrObjForAddsort.findIndex(item => item.ob_id == this.object_id)
      // return this.OkrObjForAddsort[index]
      const index = this.okrObj.findIndex(item => item.ob_id == this.object_id)
      return this.okrObj[index];
    },
    object_name: function () {
      if (this.okrObj.length !== 0) {
        const selectedObj = this.okrObj.filter(obj => obj.ob_id == this.object_id);
        this.selectedObj = selectedObj[0];
        return selectedObj[0].ob_name;
      } else {
        return [];
      }
    },
    dateRange: function () {
      let start = this.selectedObj.ob_start_date;
      let end = this.selectedObj.ob_end_date;
      return {
        startDate: start,
        endDate: end
      }
    },
    startDate: function () {
      let start = this.selectedObj.ob_start_date;
      let startDate = new Date(start + ' 00:00:00');
      let month = startDate.getMonth() + 1;
      let day = startDate.getDate();
      return month + '/' + day;
    },
    endDate: function () {
      let end = this.selectedObj.ob_end_date;
      let endDate = new Date(end + ' 00:00:00');
      let month = endDate.getMonth() + 1;
      let day = endDate.getDate();
      return month + '/' + day;
    },
    cycle: function () {
      let cycle = this.selectedObj.ob_cycle;
      if (cycle != undefined) {
        cycle += '';
        let tmp = cycle.split('/');
        if (tmp.length == 2) {
          let year = tmp[0];
          let quater = '/' + tmp[1];
          let result = constant.cycleItems.filter(c => c.dbformat == quater);
          return year + '年' + result[0].title;
        } else {
          tmp = cycle.split('-');
          let year = tmp[0];
          let month = '-' + tmp[1];
          let result = constant.cycleItems.filter(c => c.dbformat == month);
          return year + '年' + result[0].title;
        }
      }
    },
    autoPercent: function () {
      let value = 0;
      if (this.selectedObj.ob_results != undefined) {
        let len = this.selectedObj.ob_results.length;
        this.selectedObj.ob_results.map(result => {
          value += result.kr_completion;
        });
        return Math.floor(value / len);
      }
    },
    okrObjList: function () {
      let okrObjList = [];
      this.OkrObjForAddsort.map(obj => {
        let obc = obj.ob_cycle;
        let year = obj.ob_start_date + '-' + obj.ob_end_date;
        let cycle = '';
        let goal = '全部状态';
        let quater = '';
        if (obc.includes('/')) {
          quater = '/' + obc.split('/')[1];
        }
        if (obc.includes('-')) {
          quater = '-' + obc.split('-')[1];
        }

        constant.cycleItems.map(c => {
          if (c.dbformat == quater) {
            cycle = c.title;
          }
        });
        constant.statusItems.map(s => {
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
          parent: this.selectedObj.ob_parent_object === obj.ob_id ? true : false
        }
        if (obj.ob_id !== this.selectedObj.ob_id) {
          okrObjList.push(tmp);
        }
      });
      return okrObjList;
    },
    alignedTargetCycle: function () {
      let cycles = this.alignedTargetObj.ob_cycle.split("/");
      if (cycles.length == 1) {
        cycles = this.alignedTargetObj.ob_cycle.split("-");
        let result = constant.cycleItems.filter(c => c.dbformat == ('-' + cycles[1]));
        return result[0].title;
      } else {
        let result = constant.cycleItems.filter(c => c.dbformat == ('/' + cycles[1]));
        return result[0].title;
      }
    },
    alignedTargetYear: function () {
      let cycles = this.alignedTargetObj.ob_cycle.split("/");
      if (cycles.length == 1) {
        cycles = this.alignedTargetObj.ob_cycle.split("-");
        return cycles[0];
      } else {
        return cycles[0];
      }
    }
  },
  methods: {
    ...mapActions("okr", ["updateOkr", "createKeyResult", "updateOkrAndGet", "getOkrsForAddsort"]),
    ...mapActions("progress", ["addProgress"]),
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
    updateCycle(ev) {
      let obj = {
        ob_id: this.object_id,
        ob_cycle: this.saveCycle,
        ob_start_date: this.startDateSave,
        ob_end_date: this.endDateSave
      }
      if (obj.ob_cycle == '' || obj.ob_start_date == '' || obj.ob_end_date == '') {

      } else {
        this.updateOkr(obj);
      }
      ev.stopPropagation();
      this.showCycleDatePicker = false;
    },
    closeCyclePicker(ev) {
      ev.stopPropagation();
      this.showCycleDatePicker = false;
    },
    openCycleDatePicker() {
      this.showCycleDatePicker = true;
    },
    openQuickKeyResult() {
      if (!this.disableEdit) {
        this.isKeyResult = true;
      }
    },
    saveKeyResult(ev, ob_id) {
      ev.stopPropagation();
      let order = this.selectedObj.ob_results.length;
      let kr_obj = {
        "kr_name": ev.target.value,
        "kr_owner": getUser().id,
        "kr_parent_object": ob_id,
        "kr_order": order + 1,
        "kr_completion": 0,
        "kr_confidence": this.selectedRating,
        "kr_score": 0,
        "kr_score_description": null,
        "kr_ta": null,
        "kr_start_date": "2021-02-01",
        "kr_end_date": "2021-03-01"
      }
      this.createKeyResult(kr_obj);
      this.isKeyResult = false;
    },
    closeQuickKeyResult() {
      this.isKeyResult = false;
      this.selectedRating = 5;
    },
    selectRating(param) {
      this.selectedRating = param;
    },
    openAddAlignDialog() {
      if(!this.disableEdit) {
        this.$refs.addsort.openDialog();
      }           
    },
    setParent(param) {
      this.alignedTargetObj = param;
      this.alignTarget = true;
      let obj = {
        ob_id: this.selectedObj.ob_id,
        ob_parent_object: param.ob_id
      }
      this.updateOkrAndGet(obj);
    },
    setUnlink() {
      let obj = {
        ob_id: this.selectedObj.ob_id,
        ob_parent_object: 0
      }
      this.updateOkr(obj);
      this.alignTarget = false;
    },
    saveProgressOption(param) {
      let obj = {
        ob_id: this.selectedObj.ob_id,
        ob_auto_progress: param
      }
      this.updateOkr(obj);
    },
    getPercentValue(param) {
      param.pr_parent = this.selectedObj.ob_id;
      let obj = {
        ob_id: this.selectedObj.ob_id,
        ob_progress: param.pr_percent
      }
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
      if (this.obNameChangeValue !== '') {
        this.updateOkr(obj);
      }
      this.obNameEdit = false;
    },
    selectKR(data) {
      this.$emit('selectKR', data)
    },
    handle_getTimePeriod(data) {
      this.saveCycle = data.cycle;
    },
    removeParent() {
      this.updateOkrAndGet({
        ob_id: this.selectedObj.ob_id,
        ob_parent_object: 0
      })
    },
    translate(text) {
      if(text.includes('/')) {
        const temp = text.split('/')
        return `${temp[0]}年 第${temp[1]}季度`
      } else if (text.includes('-')) {
        const temp = text.split('-')
        return `${temp[0]}年 第${temp[1]}月`
      }
    },
    selectObject(id) {
      this.$emit('select', id)
    }
  },
  mounted() {
    this.getOkrsForAddsort({
      ob_company_id: this.authUser.user_company_id,
      ob_status: "",
      ob_owner: this.authUser.id,
    });
  }
}
</script>

<style scoped>
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
  font-family: -apple-system, Arial, Verdana, Helvetica Neue, Helvetica, sans-serif;
  color: #89919f;
  font-size: 12px;
  line-height: 18px;
}

.object-name {
  color: #141c28;
  font-size: 20px;
  line-height: 24px;
  font-family: -apple-system, Arial, Verdana, Helvetica Neue, Helvetica, sans-serif;
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
  background: rgba(40, 121, 255, .1);
  border-radius: 12px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: rgb(40, 121, 255);
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
</style>
