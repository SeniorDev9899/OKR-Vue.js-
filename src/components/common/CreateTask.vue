<template>
<v-dialog width="852" v-model="dialog">
  <v-toolbar width="850" height="25">
    <v-container class="d-flex pa-0 justify-end">
      <v-icon small @click="dialog = false">mdi-close</v-icon>
    </v-container>
  </v-toolbar>
  <v-card width="850" tile class="pa-1" >
    <v-container fluid>
      <v-row class="first-row px-0">
        <v-icon color="blue">mdi-checkbox-marked-outline</v-icon>
        <input class="input-name mx-0" v-model="newTask.task_name" placeholder="请输入您要安排的工作任务名称" />

        <!-- owner -->
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn tag="div" elevation="0" class="btn-owner" v-bind="attrs" v-on="on">{{ newTask.task_owner | username }} 负责</v-btn>
          </template>
          <v-card>
            <UserPicker @pick="pickUser" />
          </v-card>
        </v-menu>
        <!-- date range -->
        <date-range-picker ref="picker" opens="left" control-container-class="blue lighten-5 task-date-picker" :locale-data="{ 
                            firstDay: 1,
                            format: 'yyyy-mm-dd',
                            applyLabel: '确定',
                            cancelLabel: '取消',
                            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                            monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                        }" :minDate="minDate" :maxDate="maxDate" :dateRange="{startDate: newTask.task_start_date, endDate: newTask.task_end_date}" :ranges="false" @update="datePicker">
          <template v-slot:input="picker">
            {{ picker.startDate | formatDate }} - {{ picker.endDate | formatDate }}
          </template>
        </date-range-picker>
        <!-- priority -->
        <v-menu offset-y>        
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" tag="div" tile class="btn-priority" elevation="0" height="40"><v-chip small outlined :color="priority[newTask.task_priority-1].color">{{ newTask.task_priority }}</v-chip></v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, i) in [1,2,3,4,5]" :key="i">
              <v-list-item-title>
                <v-btn small @click="newTask.task_priority=item" small plain >
                  <v-chip small outlined :color="priority[i].color">{{ item }}</v-chip>
                  <span class="ml-2">{{ priority[i].text }}</span>
                </v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
      <v-row class="form-row px-0 ">
        <span class="text-subtitle-2 label ">任务要求</span>
        <span class="mt-2">目标值 :</span>
        <!-- price -->
        <input class="input-price" placeholder="请输入数字" v-model="newTask.task_target_price" />
        <!-- unit -->
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn tile tag="div" class="btn-unit" elevation="0" color="#E0E0E0" v-bind="attrs" v-on="on" height="40">({{ unit[newTask.task_unit-1]}})<v-icon color="grey">mdi-menu-down</v-icon></v-btn>
          </template>
          <v-card>
            <v-radio-group class="pa-3" v-model="newTask.task_unit" row>
              <v-radio value="1">
                <template v-slot:label>
                  <span class="text-caption">元</span>
                </template>
              </v-radio>
              <v-radio value="2">
                <template v-slot:label>
                  <span class="text-caption">个</span>
                </template>
              </v-radio>
            </v-radio-group>
          </v-card>
        </v-menu>
        <!-- feedback -->
        <v-menu v-model="feedbackMenu" :close-on-content-click="false" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn tile v-bind="attrs" tag="div" elevation="0" class="btn-feedback" width="180" v-on="on" height="40">进展反馈：<span style="width:100px;">{{ cronText }}</span></v-btn>
          </template>
          <SetTaskCron @set="setCron" @close="feedbackMenu=false" />
        </v-menu>
        <!-- approver -->
        <v-menu offset-y content-class="object_task_add">
          <template v-slot:activator="{ on, attrs }">
            <v-btn tile class="btn-approver" elevation="0" v-bind="attrs" width="150" v-on="on" height="40">管控审批人：<span style="width:60px;">{{ newTask.task_approver | username }}</span></v-btn>
          </template>
          <v-card>
            <UserPicker @pick="setApprover" />
          </v-card>
        </v-menu>
        <v-spacer></v-spacer>
        <v-btn tile color="primary" text @click="moreInput=!moreInput" width="79" height="40">更多属性<v-icon>mdi-chevron-double-down</v-icon>
        </v-btn>
      </v-row>
      <!-- more input, 更多输入 -->
      <v-row v-if="moreInput" class="form-row d-flex justify-start">
        <span class="label text-subtitle-2">任务属性</span>
        <!-- target -->
        <v-menu :close-on-content-click="false" v-model="targetMenu" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn tile v-bind="attrs" elevation="0" class="btn-target" tag="div" width="20" v-on="on" height="40">任务关联</v-btn>
          </template>
          <MyObjectPicker @pick="inputTarget" />
        </v-menu>
        <span class="pl-2 pt-1 parent-chip" >
          <v-chip @click:close="removeParent" v-if="!!parent" label close>{{ getParentName(parent) }}</v-chip>
        </span>
        <!-- labels -->
        <span class="label text-subtitle-2">预估工时</span>
        <input class="input-hours" v-model="newTask.task_est_worktime" />
        <span class="label-time text-subtitle-2">(小时)</span>
        <!-- vice leader -->
        <v-menu offset-y content-class="object_task_add">
          <template v-slot:activator="{ on, attrs }">
            <v-btn tile elevation="0"  v-bind="attrs" v-on="on" height="40">代领导发起: <span>{{ newTask.task_vice_leader | username }}</span></v-btn>
          </template>
          <v-card>
            <UserPicker @pick="setViceLeader" />
          </v-card>
        </v-menu>
      </v-row>
      <v-row v-if="moreInput" class="form-row">
        <span class="label text-subtitle-2">相关成员</span>
        <span class="label text-subtitle-2">参与人</span>
        <v-menu offset-y >
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on" class="ml-3" color="green">mdi-plus</v-icon>
          </template>
          <v-card>
            <UserPicker @pick="addMember" />
          </v-card>
        </v-menu>
        <span>
          <v-avatar style="cursor:pointer;" @click="removeUser(i)" class="white--text mt-2 mx-1" color="orange" size="24" v-for="(user, i) in newTask.task_collaborator" :key="i">{{ user | surename }}</v-avatar>
        </span>
      </v-row>
      <!-- description -->
      <v-row>
        <EditorContent v-model="newTask.task_description" />
      </v-row>
      <v-row class="justify-end">
        <v-btn @click="onSave" color="primary" :disabled="!newTask.task_name">发布</v-btn>
      </v-row>
    </v-container>
  </v-card>
</v-dialog>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import EditorContent from '@/components/okrgoal/rightInfo/editorContent/EditorContent.vue';
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
export default {
  name: 'CreateTask',
  components: {
    UserPicker: () => import('@/components/common/UserPicker.vue'),
    EditorContent,
    DateRangePicker,
    MyObjectPicker: () => import('@/components/common/MyObjectPicker.vue'),
    SetTaskCron: () => import('@/components/common/SetTaskCron.vue')
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('user', ['users']),
    ...mapGetters('okr', ['okrObj']),
    ...mapGetters('item', ['items']),
  },
  data() {
    return {
      feedbackMenu: false,
      cronText: '',
      currentUser: null,
      newTask: {},
      minDate: '2018-01-01',
      maxDate: '2050-12-31',
      priority: [
        {
          text: '最高',
          color: 'red'
        },
        {
          text: '高',
          color: 'yellow'
        },
        {
          text: '中',
          color: 'blue'
        },
        {
          text: '低',
          color: 'green'
        },
        {
          text: '非常低',
          color: 'gray'
        },
      ],
      unit: ['元', '个'],
      moreInput: false,
      dialog: false,
      targetMenu: false,
      parent: null
    }
  },
  methods: {
    pickUser(e) {
      this.newTask.task_owner = e.user.id
    },
    setApprover(e) {
      this.newTask.task_approver = e.user.id
    },
    setViceLeader(e) {
      this.newTask.task_vice_leader = e.user.id
    },
    inputDescription(e) {
      this.newTask.taskDescription = e.prgValue
    },
    addMember(e) {
      this.newTask.task_collaborator.push(e.user.id)
    },
    removeUser(index) {
      this.newTask.task_collaborator.splice(index, 1)
    },
    onSave() {
      this.newTask.task_collaborator = this.newTask.task_collaborator.toString()
      this.newTask.task_description = !!this.newTask.task_description ? this.newTask.task_description.prgValue.toString() : ''
      if(!!this.parent) {
        if(Object.keys(this.parent).includes('ob_id')) {
          this.newTask.task_parent_object = this.parent.ob_id
        } else if (Object.keys(this.parent).includes('item_id')) {
          this.newTask.task_parent_item = this.parent.item_id
        }
      }
      this.$emit('save', this.newTask)
      this.dialog = false
    },
    datePicker(param) {
      let start = param.startDate;
      let end = param.endDate;
      start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
      end = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
      this.newTask.task_start_date = start
      this.newTask.task_end_date = end
    },
    open(parent) {
      this.newTask = {
        task_name: '',
        task_owner: this.authUser.id,
        task_start_date: null,
        task_end_date: null,
        task_priority: 3,
        task_target_price: null,
        task_unit: 1,
        task_approver: null,
        task_est_worktime: null,
        task_vice_leader: null,
        task_collaborator: [],
        task_description: null,
        task_creator: this.authUser.id
        // task_parent_kr: kr.kr_id,
      }
      if(!!parent) {
        if(Object.keys(parent).includes('kr_id')) {
          this.newTask.task_parent_kr = parent.kr_id
        } else if (Object.keys(parent).includes('ob_id')) {
          this.newTask.task_parent_object = parent.ob_id
        } else if (Object.keys(parent).includes('task_id')) {
          this.newTask.task_parent_task = parent.task_id
        }
      }
      let today = new Date()
      today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      this.newTask.task_start_date = today
      this.newTask.task_end_date = today
      this.dialog = true
    },
    inputTarget(e) {
      this.targetMenu = false
      this.parent = e
    },
    getParentName(value) {
      if(Object.keys(value).includes('ob_id')) {
        const index = this.okrObj.findIndex(item => item.ob_id == value.ob_id);
        return `${this.okrObj[index].ob_name.slice(0, 10)}...`
      }else if (Object.keys(value).includes('item_id')) {
        const index = this.items.findIndex(item => item.item_id == value.item_id);
        return `${this.items[index].item_name.slice(0, 10)}...`
      }
    },
    removeParent() {
      this.parent = null
    },
    setCron(e) {
      this.newTask.task_feedback_time = e.value
      this.cronText = e.text
      this.feedbackMenu = false
    }
  },
}
</script>

<style lang="css">
.input-name {
  outline: none;
  width: 400px;
  padding-left: 10px;
}

.input-hours {
  outline: none;
  width: 70px;
  padding-left: 10px;
}

.form-row {
  border: 1px solid grey;
  border-bottom: none;
}
.parent-chip {
  border-right: 1px solid grey;
  width: 150px;
}
.first-row {
  border: 1px solid grey;
  border-bottom: none;
}

.input-price {
  outline: none;
  width: 90px;
  padding-left: 10px;
}

.task-date-picker {
  padding-top: 10px;
  width: 200px;
  height: 40px;
  padding-left: 10px;
}

.btn-owner {
  width: 150px;
  height: 40px !important;
  background-color: white !important;
  border-radius: 0;
  border-left: 1px solid grey;
  border-right: 1px solid grey;
}

.btn-priority {
  width: 65px;
  background-color: white !important;
  border-left: 1px solid grey;
}

.label {
  background-color: #EEEEEE;
  width: 60px;
  height: 30px;
  margin: 5px;
  padding-top: 5px;
  padding-left: 2px;
}

.label-time {
  background-color: #EEEEEE;
  width: 40px;
  height: 30px;
  margin: 5px;
  padding-top: 5px;
  padding-left: 1px;
}

.btn-unit {
  width: 40px;
  background-color: white !important;  
}

.btn-feedback {
  background-color: white !important;
  border-right: 1px solid grey;
}

.btn-approver {
  background-color: white !important;
}

.btn-target {
  background-color: white !important;
  border-left: 1px solid grey;
}

.btn-viceleader {
  background-color: white !important;
  border-top: 1px solid grey;
}
.object_task_add {
  min-width: 50px !important;
}
</style>
