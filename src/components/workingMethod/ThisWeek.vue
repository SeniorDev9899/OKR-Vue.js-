<template>
<div class="top-left this-week-task">
    <div class="header d-flex justify-space-between py-3 px-4">

        <span class="left" v-if="!chkSettingDate">本周工作</span>
        <span :class="(chkSettingDate) ? 'drange left pt-2':'drange right pt-2'">
            <v-icon color="blue darken-2">
                mdi-timetable
            </v-icon>
            <date-range-picker ref="picker" opens="center" :locale-data="{ 
                        firstDay: 1, 
                        format: 'yyyy-mm-dd',
                        applyLabel: '确定',
                        cancelLabel: '取消',
                        daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                        monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                    }" :minDate="minDate" :maxDate="maxDate" :dateRange="dateRange1" :ranges="false" @update="dateFilter">
                <template v-slot:input="picker" style="min-width: 350px;">
                    {{ picker.startDate | formatDate }} - {{ picker.endDate | formatDate }}
                </template>

                <!--    footer slot-->
                <div slot="footer" slot-scope="data" class="slot">
                    <v-card class="d-flex justify-space-between pa-3">
                        <v-btn color="primary" @click="restoreFilter(data)">
                            恢复
                        </v-btn>

                        <v-card class="d-flex " style="box-shadow: none;">
                            <div class="mr-4">
                                {{ data.rangeText }}
                            </div>

                            <v-btn class="mr-4 pa-2" @click="data.clickCancel">
                                取消
                            </v-btn>

                            <v-btn class="pa-2" color="primary" @click="data.clickApply" v-if="!data.in_selection">
                                确定
                            </v-btn>
                        </v-card>
                    </v-card>
                </div>
                <!--footer slot   -->
            </date-range-picker>
        </span>
    </div>
    <div class="action d-flex justify-start mb-2 px-4">
        <a @click="openCreateTask()">
            <v-icon style="color: rgb(40, 121, 255); font-size: 18px;">mdi-plus</v-icon>创建任务
        </a>
    </div>
    <v-divider></v-divider>
    <span v-for="task in taskList" :key="task.task_id">
        <div class="task-container d-flex justify-space-between align-center px-4 py-2" @click="openTaskEdit(task)">
            <v-icon style="color:#2879ff; font-size: 18px;">{{task_icons[task.task_status-1].icon}}</v-icon>
            <span class="task-name ml-3">{{task.task_name}}</span>
            <v-spacer></v-spacer>
            <span class="task-priority" :style="{color: palette[task.task_priority-1]}">p{{task.task_priority}}</span>
            <span class="mr-6 ml-3" :class="task.remaining ? 'task-day-grey' : 'task-day-red'"> {{task.remaining ? '剩余' : '过期' }} {{task.days}} 天</span>
            <!-- <span class="task-day-grey mr-6 ml-3"> 1 天</span>
                <span class="task-day-grey mr-6 ml-3">07/30 截止</span> -->
            <UserAvatar :name="task.task_owner | surename" width='30px' height='30px' />
        </div>
        <v-divider></v-divider>
    </span>
    <CreateTask ref="createTask" @save="createTask" />
    <TaskEdit ref="taskEditor" />
</div>
</template>

<script>
import UserAvatar from '@/components/common/UserAvatar.vue';
import TaskEdit from '@/components/common/taskEdit/TaskEdit.vue';
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import {
    mapGetters,
    mapActions
} from 'vuex';
import {
    constant
} from "@/constants/constant.js";

export default {
    name: 'ThisWeek',
    components: {
        UserAvatar,
        DateRangePicker,
        CreateTask: () => import('@/components/common/CreateTask.vue'),
        TaskEdit,
    },
    props: ['selectedObj'],
    mounted() {
        // get the first and last date of current week
        this.dateRange1 = Object.assign({}, this.getCurrentWeek());
        this.filterDate = Object.assign({}, this.getCurrentWeek());
    },
    data() {
        return {
            dateRange1: {
                startDate: '2021-07-06 00:00:00',
                endDate: '2021-07-12 00:00:00'
            },
            minDate: '2018-01-01',
            maxDate: '2050-12-31',
            chkSettingDate: false,
            filterDate: {}
        }
    },
    computed: {
        ...mapGetters("okr", ["okrDetail"]),
        taskList: function () {
            if (Object.keys(this.okrDetail).length != 0 && !!this.filterDate) {
                // compare picked date range with task's date range of object
                let start = new Date(this.filterDate.startDate);
                let end = new Date(this.filterDate.endDate);
                let today = new Date();
                let tmpArr = [];
                this.okrDetail.ob_tasks.map(t => {
                    let startDate = new Date(t.task_start_date);
                    let endDate = new Date(t.task_end_date);
                    if (end < startDate || start > endDate) {

                    } else {
                        let diffDays = '';
                        let tEnd = new Date(t.task_end_date);
                        if (today >= tEnd) {
                            let diffTime = Math.abs(today - tEnd);
                            diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            t = Object.assign(t, {
                                remaining: false,
                                days: diffDays
                            });
                        } else {
                            let diffTime = Math.abs(today - tEnd);
                            diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            t = Object.assign(t, {
                                remaining: true,
                                days: diffDays
                            });
                        }
                        tmpArr.push(t);
                    }
                });
                return tmpArr;
            } else {
                return this.okrDetail.ob_tasks;
            }
        },
        task_icons: function () {
            return constant.taskStatus;
        },
        palette: function () {
            return constant.palette;
        },
    },
    methods: {
        ...mapActions('task', ['addTask']),
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
        createTask(e) {
            this.newTask = e
            this.taskMenu = false
            this.addTask(this.newTask)
        },
        openCreateTask() {
            this.$refs.createTask.open({
                ob_id: this.selectedObj.ob_id
            });
        },
        dateFilter(param) {
            this.chkSettingDate = true;
            this.filterDate = param;
        },
        restoreFilter(param) {
            this.chkSettingDate = false;
            this.dateRange1 = Object.assign({}, this.getCurrentWeek());
            param.clickCancel();
            this.filterDate = this.dateRange1;
        },
        openTaskEdit(prop) {
            this.$refs.taskEditor.openTaskEditor(prop);
        }
    }
}
</script>

<style scoped>
.top-left {
    width: 50%;
    border-right: 2.5px solid rgb(0 0 0 / 5%);
    border-bottom: 2.5px solid rgb(0 0 0 / 5%);
    overflow-y: auto;
    height: 50%;
}

.header span.left {
    font-size: 20px;
}

.header span.right {
    font-size: 16px;
}

.action a {
    font-size: 12px;
    color: rgb(40, 121, 255);
    display: inline-block;
    line-height: 20px;
}

.task-name {
    font-size: 12px;
    color: #33383d;
}

.task-priority {
    font-size: 12px;
}

.task-day-red {
    color: rgb(255, 105, 82);
    font-size: 12px;
}

.task-day-grey {
    color: rgb(51, 56, 61);
    font-size: 12px;
}

.task-container:hover {
    cursor: pointer;
    background: #f2f8ff;
}
</style><style>
span.drange {
    transition: all ease 1s;
}

.this-week-task .right .daterangepicker.openscenter {
    left: -40% !important;
}

.this-week-task .left .daterangepicker.openscenter {
    left: 110% !important;
}
</style>
