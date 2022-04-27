<template>
<v-container fluid>
  <RightEditor ref="rightKrEditor" />
  <CreateProjectDlg @create="createNewItem" ref="createItemDlg" />
  <CreateTask ref="createTask" @save="createTask" />
  <div v-for="kr in currentOkr.ob_results" :key="kr.kr_id">
    <v-row class="d-flex">
      <span class="blue--text ma-2">kr{{ kr.kr_order }}</span>
      <span @click="openKrEditor(kr)" style="cursor: pointer;" class="text-subtitle-1">{{ kr.kr_name }}</span>
      <v-spacer></v-spacer>
      <div class="text-center">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" v-bind="attrs" v-on="on" text small>+新建</v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title>
                <v-btn @click="openCreateTask(kr)" small plain>
                  添加任务
                </v-btn>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                <v-btn @click="createItem(kr)" small plain>添加项目</v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div class="text-center">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" small text dark v-bind="attrs" v-on="on">
              关联
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title>
                <v-btn @click="assignTaskForKr(kr)" small plain>关联任务</v-btn>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                <v-btn @click="assignItemForKr(kr)" small plain>关联项目</v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-row>
    <div v-if="kr.kr_items.length==0 && kr.kr_tasks.length==0" class="yellow--text text-caption my-4">用「任务/项目」来支撑，OKR 落地更有保障 💪</div>
    <!-- show items, 显示项目 -->
    <v-row class="mx-3 align-center" v-for="(itm, i) in kr.kr_items" :key="itm.item_id">
      <v-btn :to="`${routes.ITEM_DETAIL_PAGE}?id=${itm.item_id}`" small text>
        <v-icon class="mr-3">mdi-calendar-clock</v-icon>
        <span class="pt-2 text-subtitle-2">{{ itm.item_name }}</span>
      </v-btn>
      <v-spacer></v-spacer>
      <!-- chage user, 更改用户 -->
      <v-icon>mdi-account-outline</v-icon>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="mt-1 justify-start" v-bind="attrs" width="100" v-on="on" small text>{{ itm.item_owner | username }}</v-btn>
        </template>
        <v-card>
          <UserPicker @pick="changeItemOwner($event, itm.item_id)" />
        </v-card>
      </v-menu>
      <!-- date range picker of item, 项目的日期范围选择器 -->
      <div style="width:60px;">
        <date-range-picker ref="picker" opens="left" control-container-class="mt-2 small-date-picker" :locale-data="{ 
              firstDay: 1,
              format: 'yyyy-mm-dd',
              applyLabel: '确定',
              cancelLabel: '取消',
              daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
              monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
          }" :minDate="minDate" :maxDate="maxDate" :dateRange="{startDate: itm.item_start_date, endDate: itm.item_end_date}" :ranges="false" @update="changeItemDate($event, itm.item_id)">
          <template v-slot:input="picker" style="min-width: 350px;border:none;">
            {{ getDate(picker.endDate) }}
          </template>
        </date-range-picker>
      </div>
      <!-- item progerss -->
      <v-progress-circular class="mr-5" color="primary" :size="20" :value="itm.item_progress"><span class="text-caption">{{ itm.item_progress }}%</span></v-progress-circular>
      <!-- unlink kr item -->
      <v-icon @click="unlinkKrItem(itm)" small>mdi-link-off</v-icon>
    </v-row>
    <!-- show tasks, 显示任务 -->
    <v-row class="mx-3 align-center" v-for="(task, i) in kr.kr_tasks" :key="i">
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab class="mt-2" small text v-bind="attrs" v-on="on">
            <v-icon small>{{taskStatus[task.task_status-1].icon}}</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="state in taskStatus" :key="state.value">
            <v-list-item-title>
              <v-btn @click="changeStatus(task.task_id, state.value)" small text>
                <v-icon small>{{ state.icon }}</v-icon>{{ state.text }}
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <!-- task priority menu, 任务优先级菜单 -->
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="mt-2" :color="palette[task.task_priority-1]" fab small text v-bind="attrs" v-on="on">
            p{{ task.task_priority }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item :key="i" v-for="(pr, i) in priority">
            <v-list-item-title>
              <v-btn @click="changePriority(i+1, task.task_id)" :color="pr.color" small text><span class="mr-3 pb-1">p{{i+1}}</span><span class="pb-1">{{ pr.text }}</span></v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <span class="pt-2">{{ task.task_name }}</span>
      <v-spacer></v-spacer>
      <!-- chage user, 更改用户 -->
      <v-icon>mdi-account-outline</v-icon>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="mt-1 justify-start" v-bind="attrs" width="100" v-on="on" small text>{{ task.task_owner | username }}</v-btn>
        </template>
        <v-card>
          <UserPicker @pick="changeOwner($event, task.task_id)" />
        </v-card>
      </v-menu>
      <!-- date range picker of task, 任务的日期范围选择器 -->
      <div style="width:60px;">
        <date-range-picker ref="picker" opens="left" control-container-class="mt-2 small-date-picker" :locale-data="{ 
              firstDay: 1,
              format: 'yyyy-mm-dd',
              applyLabel: '确定',
              cancelLabel: '取消',
              daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
              monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
          }" :minDate="minDate" :maxDate="maxDate" :dateRange="{startDate: task.task_start_date, endDate: task.task_end_date}" :ranges="false" @update="changeTaskDate($event, task.task_id)">
          <template v-slot:input="picker" style="min-width: 350px;border:none;">
            {{ getDate(picker.endDate)  }}
          </template>
        </date-range-picker>
      </div>
      <!-- task progerss -->
      <v-progress-circular class="mr-5" color="primary" :size="20" :value="task.task_progress"><span class="text-caption">{{ task.task_progress }}%</span></v-progress-circular>
      <!-- task unlink -->
      <v-icon @click="unlinkTask(task)" small>mdi-link-off</v-icon>
    </v-row>
    <v-row class="my-7">
      <v-divider></v-divider>
    </v-row>
  </div>
  <v-row class="my-3">
    <span class="text-subtitle-1">目标下的其他执行</span>
    <v-spacer></v-spacer>
    <div class="text-center">
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" v-bind="attrs" v-on="on" text small>+新建</v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>
              <v-btn @click="openObjectTask" small plain>
                添加任务
              </v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              <v-btn @click="openObjectItem" small plain>添加项目</v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div class="text-center">
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" small text dark v-bind="attrs" v-on="on">
            关联
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>
              <v-btn @click="assignTaskForObject" small plain>关联任务</v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              <v-btn @click="assignItemForObject" small plain>关联项目</v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-row>

  <!-- show items, 显示项目 -->
  <v-row class="mx-3 align-center" v-for="(itm, i) in currentOkr.ob_items" :key="itm.item_id">
    <v-btn :to="`${routes.ITEM_DETAIL_PAGE}?id=${itm.item_id}`" small text>
      <v-icon class="mr-3">mdi-calendar-clock</v-icon>
      <span class="pt-2 text-subtitle-2">{{ itm.item_name }}</span>
    </v-btn>
    <v-spacer></v-spacer>
    <!-- chage user, 更改用户 -->
    <v-icon>mdi-account-outline</v-icon>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="mt-1 justify-start" v-bind="attrs" width="100" v-on="on" small text>{{ itm.item_owner | username }}</v-btn>
      </template>
      <v-card>
        <UserPicker @pick="changeItemOwner($event, itm.item_id)" />
      </v-card>
    </v-menu>
    <!-- date range picker of item, 项目的日期范围选择器 -->
    <div style="width:60px;">
      <date-range-picker ref="picker" opens="left" control-container-class="mt-2 small-date-picker" :locale-data="{ 
              firstDay: 1,
              format: 'yyyy-mm-dd',
              applyLabel: '确定',
              cancelLabel: '取消',
              daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
              monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
          }" :minDate="minDate" :maxDate="maxDate" :dateRange="{startDate: itm.item_start_date, endDate: itm.item_end_date}" :ranges="false" @update="changeItemDate($event, itm.item_id)">
        <template v-slot:input="picker" style="min-width: 350px;border:none;">
          {{ getDate(picker.endDate) }}
        </template>
      </date-range-picker>
    </div>
    <!-- item progerss -->
    <v-progress-circular class="mr-5" color="primary" :size="20" :value="itm.item_progress"><span class="text-caption">{{ itm.item_progress }}%</span></v-progress-circular>
    <!-- unlink object item -->
    <v-icon @click="unlinkObjectItem(itm)" small>mdi-link-off</v-icon>
  </v-row>

  <!-- show tasks, 显示任务 -->
  <v-row class="mx-3 align-center" v-for="(task, i) in currentOkr.ob_tasks" :key="i">
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn fab class="mt-2" small text v-bind="attrs" v-on="on">
          <v-icon small>{{taskStatus[task.task_status-1].icon}}</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="state in taskStatus" :key="state.value">
          <v-list-item-title>
            <v-btn @click="changeStatus(task.task_id, state.value)" small text>
              <v-icon small>{{ state.icon }}</v-icon>{{ state.text }}
            </v-btn>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <!-- task priority menu, 任务优先级菜单 -->
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="mt-2" :color="palette[task.task_priority-1]" fab small text v-bind="attrs" v-on="on">
          p{{ task.task_priority }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item :key="i" v-for="(pr, i) in priority">
          <v-list-item-title>
            <v-btn @click="changePriority(i+1, task.task_id)" :color="pr.color" small text><span class="mr-3 pb-1">p{{i+1}}</span><span class="pb-1">{{ pr.text }}</span></v-btn>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <span class="pt-2">{{ task.task_name }}</span>
    <v-spacer></v-spacer>
    <!-- chage user, 更改用户 -->
    <v-icon>mdi-account-outline</v-icon>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="mt-1 justify-start" v-bind="attrs" width="100" v-on="on" small text>{{ task.task_owner | username }}</v-btn>
      </template>
      <v-card>
        <UserPicker @pick="changeOwner($event, task.task_id)" />
      </v-card>
    </v-menu>
    <!-- date range picker of task, 任务的日期范围选择器 -->
    <div style="width:60px;">
      <date-range-picker ref="picker" opens="left" control-container-class="mt-2 small-date-picker" :locale-data="{ 
              firstDay: 1,
              format: 'yyyy-mm-dd',
              applyLabel: '确定',
              cancelLabel: '取消',
              daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
              monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
          }" :minDate="minDate" :maxDate="maxDate" :dateRange="{startDate: task.task_start_date, endDate: task.task_end_date}" :ranges="false" @update="changeTaskDate($event, task.task_id)">
        <template v-slot:input="picker" style="min-width: 350px;border:none;">
          {{ getDate(picker.endDate)  }}
        </template>
      </date-range-picker>
    </div>
    <!-- task progerss -->
    <v-progress-circular class="mr-5" color="primary" :size="20" :value="task.task_progress"><span class="text-caption">{{ task.task_progress }}%</span></v-progress-circular>
    <!-- unlink task of object button -->
    <v-icon @click="unlinkObjectTask(task)" small>mdi-link-off</v-icon>
  </v-row>
  <TaskPicker ref="taskPicker" />
  <ItemPicker ref="itemPicker" />
</v-container>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import {
  Routes
} from '@/constants/routes'
export default {
  name: 'ExecuteComponent',
  components: {
    CreateTask: () => import('@/components/common/CreateTask.vue'),
    UserPicker: () => import('@/components/common/UserPicker.vue'),
    CreateProjectDlg: () => import('@/components/common/CreateProjectDlg.vue'),
    DateRangePicker,
    TaskPicker: () => import('./TaskPicker.vue'),
    ItemPicker: () => import('./ItemPicker.vue'),
    RightEditor: () => import('@/components/okrgoal/rightInfo/RightEditor.vue'),
  },
  props: ['object_id'],
  watch: {
    object_id: function() {
      this.getDetail(this.object_id)
    }
  },
  computed: {
    ...mapGetters('okr', ['okrDetail']),
    ...mapGetters('user', ['users']),
    currentOkr: function () {
      return this.okrDetail
    }
  },
  data() {
    return {
      routes: Routes,
      taskMenu: false,
      newTask: {},
      palette: [
        'red', 'yellow', 'blue', 'green', 'gray'
      ],
      priority: [{
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
      taskStatus: [{
          icon: 'mdi-check',
          text: '已完成',
          value: 1
        },
        {
          icon: 'mdi-timer-sand-empty',
          text: '进行中',
          value: 2
        },
        {
          icon: 'mdi-close',
          text: '已取消',
          value: 3
        },
        {
          icon: 'mdi-clock-outline',
          text: '已延迟',
          value: 4
        },
        {
          icon: 'mdi-pause',
          text: '暂停中',
          value: 5
        },
        {
          icon: 'mdi-checkbox-blank-outline',
          text: '未开始',
          value: 6
        }
      ],
      minDate: '2018-01-01',
      maxDate: '2050-12-31',
    }
  },
  methods: {
    ...mapActions('task', ['addTask', 'updateTaskDetail', 'removeTaskParent']),
    ...mapActions('okr', ['getDetail']),
    ...mapActions('item', ['addItem', 'updateItem', 'removeItemParent']),
    createTask(e, kr) {
      this.newTask = e
      this.newTask = {
        ...this.newTask,
        task_parent_object: this.object_id
      }
      this.taskMenu = false
      this.addTask(this.newTask)
    },
    changeOwner(e, id) {
      const payload = {
        task_id: id,
        task_parent_object: this.object_id,
        task_owner: e.user.id
      }
      this.updateTaskDetail(payload)
    },
    changePriority(value, id) {
      const payload = {
        task_id: id,
        task_parent_object: this.object_id,
        task_priority: value
      }
      this.updateTaskDetail(payload)
    },
    changeStatus(id, value) {
      const payload = {
        task_id: id,
        task_parent_object: this.object_id,
        task_status: value
      }
      this.updateTaskDetail(payload)
    },
    createItem(kr) {
      this.$refs.createItemDlg.open({
        kr_id: kr.kr_id
      })
    },
    createNewItem(newItem) {
      const payload = Object.assign(newItem,{item_parent_object: this.object_id})
      this.addItem(payload)
    },
    changeItemOwner(e, id) {
      const payload = {
        item_id: id,
        item_parent_object: this.object_id,
        item_owner: e.user.id
      }
      this.updateItem(payload)
    },
    changeTaskDate(param, id) {
      let start = param.startDate;
      let end = param.endDate;
      start = new Date(start);
      end = new Date(end);
      start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
      end = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
      const payload = {
        task_id: id,
        task_parent_object: this.object_id,
        task_start_date: start,
        task_end_date: end
      }
      this.updateTaskDetail(payload)
    },
    changeItemDate(param, id) {
      let start = param.startDate;
      let end = param.endDate;
      start = new Date(start);
      end = new Date(end);
      start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
      end = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
      const payload = {
        item_id: id,
        item_parent_object: this.object_id,
        item_start_date: start,
        item_end_date: end
      }
      this.updateItem(payload)
    },
    getDate(date) {
      let temp = new Date(date)
      return (temp.getMonth() + 1) + '/' + (temp.getDate())
    },
    openCreateTask(kr) {
      this.$refs.createTask.open(kr)
    },
    openObjectTask() {
      this.$refs.createTask.open()
    },
    openObjectItem() {
      this.$refs.createItemDlg.open()
    },
    unlinkTask(task) {
      this.removeTaskParent({
        task_id: task.task_id,
        task_parent_object: this.object_id,
        task_parent_kr: 0
      }).then(() => {
        this.getDetail(this.object_id)
      })
    },
    unlinkKrItem(item) {
      this.removeItemParent({
        item_id: item.item_id,
        item_parent_kr: 0,
        item_parent_object: 0
      }).then(() => {
        this.getDetail(this.object_id)
      })
    },
    unlinkObjectTask(task) {
      this.removeTaskParent({
        task_id: task.task_id,
        task_parent_object: 0
      }).then(() => {
        this.getDetail(this.object_id)
      })
    },
    unlinkObjectItem(item) {
      this.removeItemParent({
        item_id: item.item_id,
        item_parent_object: 0
      }).then(() => {
        this.getDetail(this.object_id)
      })
    },
    assignTaskForObject() {
      this.$refs.taskPicker.open({
        task_parent_object: this.object_id
      })
    },
    assignTaskForKr(kr) {
      this.$refs.taskPicker.open({
        task_parent_kr: kr.kr_id,
        task_parent_object: this.object_id
      })
    },
    assignItemForObject() {
      this.$refs.itemPicker.open({
        item_parent_object: this.object_id
      })
    },
    assignItemForKr(kr) {
      this.$refs.itemPicker.open({
        item_parent_object: this.object_id,
        item_parent_kr: kr.kr_id
      })
    },
    openKrEditor(kr) {
      this.$refs.rightKrEditor.open({
        obId: this.object_id,
        krObj: kr
      })
    }
  },
  mounted() {
    this.getDetail(this.object_id)
  }
}
</script>

<style lang="css">
.small-date-picker {
  font-size: 14px;
  cursor: pointer;
}
</style>
