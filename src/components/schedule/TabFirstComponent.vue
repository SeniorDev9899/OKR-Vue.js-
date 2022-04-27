<template>
<div>
    <div class="d-flex justify-start" v-if="selectedCycle == -2">
        <div style="max-width: 150px;">
            <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="currentDate"
                offset-y
                min-width="auto"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="currentDate"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker
                    v-model="selectedDate"
                    no-title
                    scrollable
                    @change="selectDate"
                >
                <v-spacer></v-spacer>
                </v-date-picker>
            </v-menu>
        </div>
        <div class="d-flex justify-start px-2 py-4">
            <div class="cycle-container d-flex justify-start align-center">
                <span class="cycle-item" @click="clickDay(0)" :class="currentDay == 0 ? 'active' : ''">周日</span>
                <span class="cycle-item" @click="clickDay(1)" :class="currentDay == 1 ? 'active' : ''">周一</span>
                <span class="cycle-item" @click="clickDay(2)" :class="currentDay == 2 ? 'active' : ''">周二</span>
                <span class="cycle-item" @click="clickDay(3)" :class="currentDay == 3 ? 'active' : ''">周三</span>
                <span class="cycle-item" @click="clickDay(4)" :class="currentDay == 4 ? 'active' : ''">周四</span>
                <span class="cycle-item" @click="clickDay(5)" :class="currentDay == 5 ? 'active' : ''">周五</span>
                <span class="cycle-item" @click="clickDay(6)" :class="currentDay == 6 ? 'active' : ''">周六</span>
            </div>
            <v-spacer></v-spacer>
        </div>
        <v-spacer></v-spacer>
        <div>
            
        </div>
    </div>
    <div class="d-flex justify-space-between align-start pt-4 px-1" v-if="selectedCycle == -1">
        <v-text-field
            placeholder="输入任务名称"
            outlined
            dense
            v-model="pendingTaskName"
        ></v-text-field>
        <v-btn class="release-btn white--text" color="#58c583" @click="createPendingTask">发布</v-btn>
    </div>
    <div class="d-flex justify-start" v-if="selectedCycle == 0">
        <div class="d-flex justify-start px-2 py-4">
            <div class="cycle-container d-flex justify-start align-center">
                <span class="cycle-item" @click="clickCycle(0)" :class="currentCycle == 0 ? 'active' : ''">年度计划</span>
                <span class="cycle-item" @click="clickCycle(1)" :class="currentCycle == 1 ? 'active' : ''">第一季度</span>
                <span class="cycle-item" @click="clickCycle(2)" :class="currentCycle == 2 ? 'active' : ''">第二季度</span>
                <span class="cycle-item" @click="clickCycle(3)" :class="currentCycle == 3 ? 'active' : ''">第三季度</span>
                <span class="cycle-item" @click="clickCycle(4)" :class="currentCycle == 4 ? 'active' : ''">第四季度</span>
            </div>
            <v-spacer></v-spacer>
        </div>
    </div>
    <div class="d-flex justify-start" v-if="selectedCycle >= 1">
        <div class="d-flex justify-start px-2 py-4">
            <div class="cycle-container d-flex justify-start align-center">
                <span class="cycle-item" @click="clickWeek(0)" :class="currentWeek == 0 ? 'active' : ''">{{selectedCycle}}月</span>
                <span class="cycle-item" @click="clickWeek(1)" :class="currentWeek == 1 ? 'active' : ''">第1周</span>
                <span class="cycle-item" @click="clickWeek(2)" :class="currentWeek == 2 ? 'active' : ''">第2周</span>
                <span class="cycle-item" @click="clickWeek(3)" :class="currentWeek == 3 ? 'active' : ''">第3周</span>
                <span class="cycle-item" @click="clickWeek(4)" :class="currentWeek == 4 ? 'active' : ''">第4周</span>
                <span class="cycle-item" @click="clickWeek(5)" :class="currentWeek == 5 ? 'active' : ''">第5周</span>
            </div>
            <v-spacer></v-spacer>
        </div>
    </div>
    <div class="create-task my-4">
        <v-btn color="rgb(40, 121, 255)" class="white--text mx-2" @click="openCreateTask()">创建任务</v-btn>
    </div>
    <div class="action-container d-flex justify-space-between align-center">
        <div class="filters d-flex justify-start align-center">
            <div class="mr-4">
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">
                            状态<v-icon style="font-size: 18px;">mdi-menu-down</v-icon>
                        </span>
                    </template>
                    <v-list>
                        <v-list-item class="status-container">
                            <div class="status-item">
                                <v-checkbox @click="stopEvent" @change="ev => statusFilterChange(ev, 0)" v-model="statusAllCheck" label="全部状态"></v-checkbox>
                            </div>
                            <div class="status-item pl-4">
                                <v-checkbox @click="stopEvent" @change="ev => statusFilterChange(ev, 1)" v-model="statusNotStarted" label="未开始"></v-checkbox>
                            </div>
                            <div class="status-item pl-4">
                                <v-checkbox @click="stopEvent" @change="ev => statusFilterChange(ev, 2)" v-model="statusProcessing" label="进行中"></v-checkbox>
                            </div>
                            <div class="status-item pl-4">
                                <v-checkbox @click="stopEvent" @change="ev => statusFilterChange(ev, 3)" v-model="statusCompleted" label="已完成"></v-checkbox>
                            </div>
                            <div class="status-item pl-4">
                                <v-checkbox @click="stopEvent" @change="ev => statusFilterChange(ev, 4)" v-model="statusDelayed" label="已延迟"></v-checkbox>
                            </div>
                            <div class="status-item pl-4">
                                <v-checkbox @click="stopEvent" @change="ev => statusFilterChange(ev, 5)" v-model="statusCancelled" label="已取消"></v-checkbox>
                            </div>
                            <div class="status-item pl-4">
                                <v-checkbox @click="stopEvent" @change="ev => statusFilterChange(ev, 6)" v-model="statusPaused" label="暂停中"></v-checkbox>
                            </div>
                        </v-list-item>
                        <v-list-item class="mt-4">
                            <v-btn color="#1B6CF1" class="white--text" @click="setStatusFilter">确定</v-btn>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
            <div class="mr-4">
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">
                            范围<v-icon style="font-size: 18px;">mdi-menu-down</v-icon>
                        </span>
                    </template>
                    <v-list>
                        <v-list-item class="status-container">
                            <div class="status-item">
                                <v-checkbox @click="stopEvent" @change="ev => rangeFilterChange(ev, 0)" v-model="rangeAll" label="全部范围"></v-checkbox>
                            </div>
                            <div class="status-item pl-4">
                                <v-checkbox @click="stopEvent" @change="ev => rangeFilterChange(ev, 1)" v-model="rangeResponsible" label="我负责的"></v-checkbox>
                            </div>
                            <div class="status-item pl-4">
                                <v-checkbox @click="stopEvent" @change="ev => rangeFilterChange(ev, 2)" v-model="rangeDistributed" label="我派发的"></v-checkbox>
                            </div>
                            <div class="status-item pl-4">
                                <v-checkbox @click="stopEvent" @change="ev => rangeFilterChange(ev, 3)" v-model="rangeParticipated" label="我参与的"></v-checkbox>
                            </div>
                        </v-list-item>
                        <v-list-item class="mt-4">
                            <v-btn color="#1B6CF1" class="white--text" @click="setRangeFilter">确定</v-btn>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
            <div>
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">
                            系统默认排序<v-icon style="font-size: 18px;">mdi-menu-down</v-icon>
                        </span>
                    </template>
                    <v-list>
                        <v-list-item class="status-container">
                            <div class="status-item" @click="sortTasksBy('default')" :class="sortBy.default == 1 ? 'blue--text' : ''">
                                系统默认排序
                            </div>
                            <div class="status-item my-2 d-flex justify-start" @click="sortTasksBy('startDate')">
                                <span :class="sortBy.startDate != 0 ? 'blue--text' : ''">开始时间</span>
                                <span style="display: block;" class="ml-4">
                                    <v-icon style="display: block;font-size: 14px;margin-top:1px;" :class="sortBy.startDate == 1 ? 'blue--text' : ''">mdi-chevron-up</v-icon>
                                    <v-icon style="display: block;font-size: 14px; margin-top: -5px;":class="sortBy.startDate == 2 ? 'blue--text' : ''">mdi-chevron-down</v-icon>
                                </span>
                            </div>
                            <div class="status-item my-2 d-flex justify-start" @click="sortTasksBy('endDate')">
                                <span :class="sortBy.endDate != 0 ? 'blue--text' : ''">结束时间</span>
                                <span style="display: block;" class="ml-4">
                                    <v-icon style="display: block;font-size: 14px;margin-top:1px;" :class="sortBy.endDate == 1 ? 'blue--text' : ''">mdi-chevron-up</v-icon>
                                    <v-icon style="display: block;font-size: 14px; margin-top: -5px;" :class="sortBy.endDate == 2 ? 'blue--text' : ''">mdi-chevron-down</v-icon>
                                </span>
                            </div>
                            <div class="status-item my-2 d-flex justify-start" @click="sortTasksBy('created')">
                                <span :class="sortBy.created != 0 ? 'blue--text' : ''">创建时间</span>
                                <span style="display: block;" class="ml-4">
                                    <v-icon style="display: block;font-size: 14px;margin-top:1px;" :class="sortBy.created == 1 ? 'blue--text' : ''" >mdi-chevron-up</v-icon>
                                    <v-icon style="display: block;font-size: 14px; margin-top: -5px;" :class="sortBy.created == 2 ? 'blue--text' : ''">mdi-chevron-down</v-icon>
                                </span>
                            </div>
                            <div class="status-item my-2 d-flex justify-start" @click="sortTasksBy('priority')" :class="sortBy.priority != 0 ? 'blue--text' : ''">
                                按优先级排序
                            </div>
                        </v-list-item>
                        <!-- <v-list-item class="mt-4">
                            <v-btn color="#1B6CF1" class="white--text">记住排序</v-btn>
                        </v-list-item> -->
                    </v-list>
                </v-menu>
            </div>
        </div>
        <v-spacer></v-spacer>
        <!-- <div class="actions">
            <v-btn class="ma-2 mr-4" outlined>甘特图</v-btn>
            <v-btn class="ma-2" outlined>打印与导出</v-btn>
        </div> -->
    </div>
    <div class="task-list mt-6">
        <span style="display: none;">{{isToday}}{{cycleValue}}</span>
        <div class="current-task-list py-6" v-if="tasks.length != 0">
            <div class="task-item" :class="currentOpen ? 'expansion-show' : 'expansion-hide'" v-for="task_item in pendingTaskList" :key="task_item.task_id">
                <TaskComponent :task_item="task_item" />
            </div>
        </div>
        <div class="expired-task-list py-6" v-if="tasks.length != 0 && isToday && selectedCycle != -1">
            <div class="line"></div>
            <div class="mb-4 expired-icon d-flex justify-center align-center" @click="toggleExpiredExpansion">
                <span>已过期</span>
                <v-icon style="font-size: 14px;color: #fff;">{{expiredOpen ? 'mdi-chevron-double-up' : 'mdi-chevron-double-down'}}</v-icon>
            </div>
            <div class="task-item" :class="expiredOpen ? 'expansion-show' : 'expansion-hide'" v-for="task_item in expiredTaskList" :key="task_item.task_id">
                <TaskComponent @getAgainTasks="getAgainTasks()" :task_item="task_item" @openEdit="openEdit" />
                <div class="child-task-list pl-10" v-if="task_item.task_tasks.length != 0">
                    <div v-for="task in task_item.task_tasks">
                        <TaskComponent @getAgainTasks="getAgainTasks()" :task_item="task" @openEdit="openEdit" />
                        <div class="child-task-list pl-10" v-if="task.task_tasks.length != 0">
                            <div v-for="task1 in task.task_tasks">
                                <TaskComponent @getAgainTasks="getAgainTasks()" :task_item="task1" @openEdit="openEdit" />
                                <div class="child-task-list pl-10" v-if="task1.task_tasks.length != 0">
                                    <div v-for="task2 in task1.task_tasks">
                                        <TaskComponent @getAgainTasks="getAgainTasks()" :task_item="task2" @openEdit="openEdit" />
                                        <div class="child-task-list pl-10" v-if="task2.task_tasks.length != 0">
                                            <div v-for="task3 in task2.task_tasks">
                                                <TaskComponent @getAgainTasks="getAgainTasks()" :task_item="task3" @openEdit="openEdit" />
                                                <div class="child-task-list pl-10" v-if="task3.task_tasks.length != 0">
                                                    <div v-for="task4 in task3.task_tasks">
                                                        <TaskComponent @getAgainTasks="getAgainTasks()" :task_item="task4" @openEdit="openEdit" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="current-task-list mt-12" v-if="tasks.length != 0 && selectedCycle != -1">
            <div class="line"></div>
            <div class="mb-4 current-icon d-flex justify-center align-center" @click="toggleCurrentExpansion">
                <span>当前任务</span>
                <v-icon style="font-size: 14px;color: #fff;">{{currentOpen ? 'mdi-chevron-double-up' : 'mdi-chevron-double-down'}}</v-icon>
            </div>
            <div class="task-item" :class="currentOpen ? 'expansion-show' : 'expansion-hide'" v-for="task_item in currentTaskList" :key="task_item.task_id">
                <TaskComponent @getAgainTasks="getAgainTasks()" :task_item="task_item" @openEdit="openEdit" />
                <div class="child-task-list pl-10" v-if="task_item.task_tasks.length != 0">
                    <div v-for="task in task_item.task_tasks">
                        <TaskComponent @getAgainTasks="getAgainTasks()" :task_item="task" @openEdit="openEdit" />
                        <div class="child-task-list pl-10" v-if="task.task_tasks.length != 0">
                            <div v-for="task1 in task.task_tasks">
                                <TaskComponent @getAgainTasks="getAgainTasks()" :task_item="task1" @openEdit="openEdit" />
                                <div class="child-task-list pl-10" v-if="task1.task_tasks.length != 0">
                                    <div v-for="task2 in task1.task_tasks">
                                        <TaskComponent @getAgainTasks="getAgainTasks()" :task_item="task2" @openEdit="openEdit" />
                                        <div class="child-task-list pl-10" v-if="task2.task_tasks.length != 0">
                                            <div v-for="task3 in task2.task_tasks">
                                                <TaskComponent @getAgainTasks="getAgainTasks()" :task_item="task3" @openEdit="openEdit" />
                                                <div class="child-task-list pl-10" v-if="task3.task_tasks.length != 0">
                                                    <div v-for="task4 in task3.task_tasks">
                                                        <TaskComponent @getAgainTasks="getAgainTasks()" :task_item="task4" @openEdit="openEdit" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="no-list" v-if="tasks.length == 0">
            暂无数据
        </div>
    </div>
    <CreateTask ref="createTask" @save="createTask" />
    <!-- <Reply /> -->
</div>
</template>

<script>
// import CreateTask from '@/components/schedule/CreateTask.vue';
import { constant } from "@/constants/constant.js";
import TaskComponent from '@/components/schedule/shared/TaskComponent.vue';
import Reply from '@/components/schedule/Reply.vue';
import { mapGetters, mapActions } from 'vuex';
import { getUser } from '@/utils/authUser.service';

export default {
    name: 'TabFirstComponent',
    components: {
        // CreateTask,
        TaskComponent,
        Reply,
        CreateTask: () => import('@/components/common/CreateTask.vue'),
    },
    props: ['selectedCycle', 'selectedYear'],
    data() {
        return {
            menu: false,
            // main letiable
            cycle: -1,
            expiredOpen: true,
            currentOpen: true,
            statusAllCheck: false,
            statusNotStarted: true,
            statusProcessing: false,
            statusCompleted: false,
            statusDelayed: false,
            statusCancelled: false,
            statusPaused: false,
            rangeAll: false,
            rangeResponsible: true,
            rangeDistributed: false,
            rangeParticipated: false,
            task_status: "",
            currentCycle: 0,
            currentWeek: 0,
            selectedDate: this.dateFormatter(new Date()),
            filter: {
                task_owner: getUser().id
            },
            sortBy: {
                default: 0,
                startDate: 0,
                endDate: 0,
                created: 0,
                priority: 0
            },
            pendingTaskName: ''
        }
    },
    computed: {
        ...mapGetters('task', ['tasks']),
        pendingTaskList: function() {
            if(this.tasks.length != 0) {
                let tmp = [];
                this.tasks.map(t => {
                    if(t.task_start_date == null && t.task_end_date == null) {
                        tmp.push(t)
                    }
                });
                return tmp;
            }else{
                return [];
            }
        },
        expiredTaskList: function() {
            if(this.tasks.length != 0) {
                let tmp = [];
                this.tasks.map(t => {
                    let today = new Date(this.currentDate);
                    let end_date = new Date(t.task_end_date);
                    if(today.getTime() > end_date.getTime() && t.task_end_date != null) {
                        Object.assign(t, {isExpired: true});
                        tmp.push(t)
                    }
                });
                return tmp;
            }else{
                return [];
            }
        },
        currentTaskList: function() {
            if(this.tasks.length != 0) {
                let tmp = [];
                this.tasks.map(t => {
                    let today = new Date(this.currentDate);
                    let end_date = new Date(t.task_end_date);
                    if(today.getTime() <= end_date.getTime()) {
                        tmp.push(t)
                    }
                });
                return tmp;
            }else{
                return [];
            }
        },
        isToday: function() {
            let today = new Date();
            today.setHours(0,0,0,0);
            let date1 = new Date(this.currentDate + ' 00:00');
            date1.setHours(0,0,0,0);
            if(today.getTime() == date1.getTime()) {
                this.setStartEndDateOfMonthAsFilter();
                return true;
            }else{
                this.setStartEndDateOfMonthAsFilter(this.currentDate, this.currentDate);
                return false;
            }
        },
        currentDate: {
            get: function() {
                if(this.selectedDate != '') {
                    let date = new Date(this.selectedDate + ' 00:00');
                    date.setFullYear(this.selectedYear);
                    return this.dateFormatter(date);
                    // return this.selectedDate;
                }else{
                    // return this.dateFormatter(today);
                }
            },
            set: function(newValue) {
                this.selectedDate = newValue;
            }
        },
        currentDay: function() {
            let today = new Date(this.currentDate + ' 00:00');
            let day = today.getDay();
            return day;
        },
        cycleValue: function() {
            if(this.selectedCycle == -1) {
                this.setStartEndDateOfMonthAsFilter('null', 'null')
            }
            if(this.selectedCycle == 0) {
                let start = this.selectedYear + constant.cycleWithDates[this.currentCycle].startDate;
                let end = this.selectedYear + constant.cycleWithDates[this.currentCycle].endDate;
                this.setStartEndDateOfMonthAsFilter(new Date(start), new Date(end));
                return this.currentCycle;
            }else if(this.selectedCycle >= 1) {
                if(this.currentWeek == 0) {
                    let date = new Date();
                    date.setFullYear(this.selectedYear);
                    let y = date.getFullYear();
                    let m = this.selectedCycle;
                    let firstDay = new Date(y, m -1, 1);
                    let lastDay = new Date(y, m, 0);
                    this.setStartEndDateOfMonthAsFilter(firstDay, lastDay);
                    return this.selectedCycle;
                }
                if(this.currentWeek == 1) {
                    let date = new Date();
                    date.setMonth(this.selectedCycle - 1);
                    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                    let lastDay = new Date(date.getFullYear(), date.getMonth(), 1 + 6);
                    this.setStartEndDateOfMonthAsFilter(firstDay, lastDay);
                    return this.selectedCycle;
                }
                if(this.currentWeek == 2) {
                    let date = new Date();
                    date.setMonth(this.selectedCycle - 1);
                    let firstDay = new Date(date.getFullYear(), date.getMonth(), 8);
                    let lastDay = new Date(date.getFullYear(), date.getMonth(), 8 + 6);
                    this.setStartEndDateOfMonthAsFilter(firstDay, lastDay);
                    return this.selectedCycle;
                }
                if(this.currentWeek == 3) {
                    let date = new Date();
                    date.setMonth(this.selectedCycle - 1);
                    let firstDay = new Date(date.getFullYear(), date.getMonth(), 15);
                    let lastDay = new Date(date.getFullYear(), date.getMonth(), 15 + 6);
                    this.setStartEndDateOfMonthAsFilter(firstDay, lastDay);
                    return this.selectedCycle;
                }
                if(this.currentWeek == 4) {
                    let date = new Date();
                    date.setMonth(this.selectedCycle - 1);
                    let firstDay = new Date(date.getFullYear(), date.getMonth(), 22);
                    let lastDay = new Date(date.getFullYear(), date.getMonth(), 22 + 6);
                    this.setStartEndDateOfMonthAsFilter(firstDay, lastDay);
                    return this.selectedCycle;
                }
                if(this.currentWeek == 5) {
                    let date = new Date();
                    date.setMonth(this.selectedCycle - 1);
                    let firstDay = new Date(date.getFullYear(), date.getMonth(), 29);
                    let lastDay = new Date(date.getFullYear(), date.getMonth()+1, 0);
                    this.setStartEndDateOfMonthAsFilter(firstDay, lastDay);
                    return this.selectedCycle;
                }
            }else{
                return '';
            }      
        }
    },
    created() {
        Object.assign(this.filter, {task_status: '1,'});
    },
    mounted() {
        let today = new Date();
        if(this.selectedCycle == -2 && this.selectedYear == today.getFullYear()) {
            // this.setStartEndDateOfMonthAsFilter();
        }
        // set current quater
        this.currentCycle = this.getQuarter();
        // get objects by owner
        this.getFilteredOkrs({filter: {ob_owner: getUser().id, ob_participant: getUser().id}});
        // get items by owner
        this.getItems({item_owner: getUser().id, item_participant: getUser().id});
    },
    methods: {
        ...mapActions('task', ['getTasks', 'addTask']),
        ...mapActions("okr", ["getFilteredOkrs"]),
        ...mapActions("item", ['getItems']),
        createPendingTask() {
            this.addTask({
                task_approver: null,
                task_collaborator: "",
                task_creator: getUser().id,
                task_description: "",
                task_end_date: null,
                task_est_worktime: null,
                task_name: this.pendingTaskName,
                task_owner: getUser().id,
                task_priority: 3,
                task_start_date: null,
                task_target_price: null,
                task_unit: 1,
                task_vice_leader: null,
            })
            this.pendingTaskName = '';
            this.getTasksByFilter();
        },
        openEdit(task) {
            this.$emit('openEdit', task)
        },
        sortTasksBy(param) {            
            if(param == 'default') {
                Object.assign(this.sortBy, { endDate: 0 }, { created: 0 }, { priority: 0 });
                Object.assign(this.sortBy, { default: this.sortBy.default == 0 ? 1 : 0 });
                delete this.filter.task_sortby;
            }
            if(param == 'startDate') {
                if(this.sortBy.startDate == 0) {
                    Object.assign(this.sortBy, { default: 0 }, { endDate: 0 }, { created: 0 }, { priority: 0 });
                    Object.assign(this.sortBy, { startDate: 1 });
                    Object.assign(this.filter, { task_sortby: 'task_start_date ASC' })
                }else{
                    Object.assign(this.sortBy, { default: 0 }, { endDate: 0 }, { created: 0 }, { priority: 0 });
                    Object.assign(this.sortBy, { startDate: this.sortBy.startDate == 1 ? 2 : 1 });
                    Object.assign(this.filter, { task_sortby: 'task_start_date DESC' })
                }
            }
            if(param == 'endDate') {
                if(this.sortBy.endDate == 0) {
                    Object.assign(this.sortBy, { endDate: 1 });
                    Object.assign(this.sortBy, { default: 0 }, { startDate: 0 }, { created: 0 }, { priority: 0 });
                    Object.assign(this.filter, { task_sortby: 'task_end_date ASC' })
                }else{
                    Object.assign(this.sortBy, { default: 0 }, { startDate: 0 }, { created: 0 }, { priority: 0 });
                    Object.assign(this.sortBy, { endDate: this.sortBy.endDate == 1 ? 2 : 1 });
                    Object.assign(this.filter, { task_sortby: 'task_end_date DESC' })
                }
            }
            if(param == 'created') {
                if(this.sortBy.created == 0) {
                    Object.assign(this.sortBy, { default: 0 }, { startDate: 0 }, { endDate: 0 }, { priority: 0 });
                    Object.assign(this.sortBy, { created: 1 });
                    Object.assign(this.filter, { task_sortby: 'created_at ASC' })
                }else{
                    Object.assign(this.sortBy, { default: 0 }, { startDate: 0 }, { endDate: 0 }, { priority: 0 });
                    Object.assign(this.sortBy, { created: this.sortBy.created == 1 ? 2 : 1 });
                    Object.assign(this.filter, { task_sortby: 'created_at DESC' })
                }    
            }
            if(param == 'priority') {
                Object.assign(this.sortBy, { default: 0 }, { startDate: 0 }, { endDate: 0 }, { created: 0 });
                Object.assign(this.sortBy, { priority: this.sortBy.priority == 0 ? 1 : 0 });
                Object.assign(this.filter, { task_sortby: 'priority DESC' })
            }
            this.getTasksByFilter();
        },
        createTask(e) {
            this.newTask = e
            this.taskMenu = false
            this.addTask(this.newTask)
        },
        openCreateTask() { 
            this.$refs.createTask.open();
        },
        clickWeek(param) {
            this.currentWeek = param;
        },
        clickCycle(param) {
            this.currentCycle = param;
        },
        setStartEndDateOfMonthAsFilter(start = '', end = '') {
            // get start date and end date of current month
            let date = new Date();
            let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            if(start == '') {
                Object.assign(this.filter, { task_start_date: firstDay }, { task_end_date: lastDay });
            }else{
                Object.assign(this.filter, { task_start_date: start }, { task_end_date: end });
            }
            this.getTasksByFilter();
        },
        dateFormatter(date) {
            return date.getFullYear() + '-' + (date.getMonth() < 9 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1) + '-' + ('0' + date.getDate()).slice(-2)
        },
        clickDay(pickedDay) {
            let target = this.getCurrentDateFromDay(pickedDay);
            this.selectedDate = this.dateFormatter(target);
        },
        getCurrentDateFromDay(pickedDay) {
            let curr = new Date(this.selectedDate); // get picked date
            let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
            let targetDate = first + pickedDay; // last day is the first day + 6
            return new Date(curr.setDate(targetDate));
        },
        pickUser: function() {
            return this.date;
        },
        toggleExpiredExpansion: function() {
            this.expiredOpen = !this.expiredOpen;
        },
        toggleCurrentExpansion: function() {
            this.currentOpen = !this.currentOpen;
        },
        getQuarter: function() {
            let today = new Date();
            let m = Math.floor(today.getMonth()/3) + 1;
            return m > 4? m - 4 : m;
        },
        getWeek(date) {
            let monthStart = new Date(date);
            monthStart.setDate(0);
            let offset = (monthStart.getDay() + 1) % 7 - 1; // -1 is for a week starting on Monday
            return Math.ceil((date.getDate() + offset) / 7);
        },
        statusFilterChange: function(ev, param) {
            if(param == 0) {
                if(ev) {
                    this.statusAllCheck = true;
                    this.statusNotStarted = true;
                    this.statusProcessing = true;
                    this.statusCompleted = true;
                    this.statusDelayed = true;
                    this.statusCancelled = true;
                    this.statusPaused = true;
                    this.task_status = "1,2,3,4,5,6,";
                }else{
                    this.statusAllCheck = false;
                    this.statusNotStarted = false;
                    this.statusProcessing = false;
                    this.statusCompleted = false;
                    this.statusDelayed = false;
                    this.statusCancelled = false;
                    this.statusPaused = false;
                    this.task_status = "";
                }
            }
            if(param == 1) {
                this.statusAllCheck = this.statusNotStarted && this.statusProcessing && this.statusCompleted && this.statusDelayed && this.statusCancelled && this.statusPaused;
                if(!this.task_status.includes('1') && ev) {
                    this.task_status += '1,'
                }
                if(this.task_status.includes('1') && !ev) {
                    this.task_status = this.task_status.replace('1,','');
                }
            }
            if(param == 2) {
                this.statusAllCheck = this.statusNotStarted && this.statusProcessing && this.statusCompleted && this.statusDelayed && this.statusCancelled && this.statusPaused;
                if(!this.task_status.includes('2') && ev) {
                    this.task_status += '2,'
                }
                if(this.task_status.includes('2') && !ev) {
                    this.task_status = this.task_status.replace('2,','');
                }
            }
            if(param == 3) {
                this.statusAllCheck = this.statusNotStarted && this.statusProcessing && this.statusCompleted && this.statusDelayed && this.statusCancelled && this.statusPaused;
                if(!this.task_status.includes('3') && ev) {
                    this.task_status += '3,'
                }
                if(this.task_status.includes('3') && !ev) {
                    this.task_status = this.task_status.replace('3,','');
                }
            }
            if(param == 4) {
                this.statusAllCheck = this.statusNotStarted && this.statusProcessing && this.statusCompleted && this.statusDelayed && this.statusCancelled && this.statusPaused;
                if(!this.task_status.includes('4') && ev) {
                    this.task_status += '4,'
                }
                if(this.task_status.includes('4') && !ev) {
                    this.task_status = this.task_status.replace('4,','');
                }
            }
            if(param == 5) {
                this.statusAllCheck = this.statusNotStarted && this.statusProcessing && this.statusCompleted && this.statusDelayed && this.statusCancelled && this.statusPaused;
                if(!this.task_status.includes('5') && ev) {
                    this.task_status += '5,'
                }
                if(this.task_status.includes('5') && !ev) {
                    this.task_status = this.task_status.replace('5,','');
                }
            }
            if(param == 6) {
                this.statusAllCheck = this.statusNotStarted && this.statusProcessing && this.statusCompleted && this.statusDelayed && this.statusCancelled && this.statusPaused;
                if(!this.task_status.includes('6') && ev) {
                    this.task_status += '6,'
                }
                if(this.task_status.includes('6') && !ev) {
                    this.task_status = this.task_status.replace('6,','');
                }
            }
        },
        setStatusFilter: function(ev) {
            // ev.stopPropagation()
            Object.assign(this.filter, {task_status : ''+this.task_status+''});
            this.getTasksByFilter();
        },
        stopEvent: function(ev) {
            ev.stopPropagation();
        },
        rangeFilterChange: function(ev, param) {
            if(param == 0) {
                if(ev) {
                    this.rangeResponsible = true;
                    this.rangeDistributed = true;
                    this.rangeParticipated = true;
                    Object.assign(this.filter, {task_owner: getUser().id}, {task_vice_leader: getUser().id}, {task_collaborator: getUser().id});
                }else{
                    this.rangeResponsible = false;
                    this.rangeDistributed = false;
                    this.rangeParticipated = false;
                    delete this.filter.task_owner;
                    delete this.filter.task_vice_leader;
                    delete this.filter.task_collaborator;
                }
            }
            if(param == 1) {
                this.rangeAll = this.rangeResponsible && this.rangeDistributed && this.rangeParticipated;
                if(ev) {
                    Object.assign(this.filter, {task_owner: getUser().id})
                }else{
                    delete this.filter.task_owner;
                }                
            }
            if(param == 2) {
                this.rangeAll = this.rangeResponsible && this.rangeDistributed && this.rangeParticipated;
                if(ev) {
                    Object.assign(this.filter, {task_vice_leader: getUser().id})
                }else{
                    delete this.filter.task_vice_leader;
                }                
            }
            if(param == 3) {
                this.rangeAll = this.rangeResponsible && this.rangeDistributed && this.rangeParticipated;
                if(ev) {
                    Object.assign(this.filter, {task_collaborator: getUser().id})
                }else{
                    delete this.filter.task_collaborator;
                }                
            }
        },
        setRangeFilter(ev) {
            // ev.stopPropagation();
            this.getTasksByFilter();
        },
        getTasksByFilter() {
            this.getTasks(this.filter);
        },
        selectDate() {
            this.$refs.menu.save(this.selectedDate);
        },
        getAgainTasks(ev) {
            this.getTasksByFilter();
        }
    }
}
</script>

<style scoped>
.cycle-item {
    color: #647481;
    display: block;
    min-width: 42px;
    text-align: center;
    background-color: #ddd;
    border-radius: 20px;
    margin-left: 8px;
    margin-right: 8px;
    padding: 5px 10px;
}

.cycle-item:hover {
    cursor: pointer;
}

.no-list {
    width: 100%;
    border: 1px dashed #ddd;
    text-align: center;
    padding: 30px 0px;
    font-size: 24px;
    color: #ddd;
}

.expired-icon {
    background-color: #f68a87;
    cursor: pointer;
    border-radius: 10px;
    padding: 0 21px;
    width: 92px;
    height: 21px;
    display: inline-block;
    color: #fff;
    font-size: 12px;
    line-height: 21px;
    margin: 0 auto;
}

.current-icon {
    background: #c5c5c5;
    cursor: pointer;
    border-radius: 10px;
    padding: 0 21px;
    width: 112px;
    height: 21px;
    display: inline-block;
    color: #fff;
    font-size: 12px;
    line-height: 21px;
    margin: 0 auto;
}

.expansion-hide {
    display: none;
}

.expansion-show {
    display: block;
}

.line {
    border-top:1px solid #e4ebf0;
    width: 100%;
    margin-bottom: -12px;
}

.active {
    background-color: #2879FF !important;
    color: #fff;
}

.status-container {
    display: block;
}

.status-item {
    max-height: 18px;
}

.release-btn {
    margin-left: -72px;
    margin-top: 1.5px;
    margin-right: 2px;
}

.status-item:hover {
    cursor: pointer;
}

.blue--text {
    color: rgb(40, 121, 255);
}
</style>