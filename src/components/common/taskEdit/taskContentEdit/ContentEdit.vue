<template>
    <v-sheet class="taskContentEditor_position">
        <v-container d-flex row class="pr_25 m_0">
            <v-layout align-center justify-start row class="width100 m_0 p_0_5">
                <v-flex shrink style="position:relative;">
                    <v-menu offset-y content-class="task-owner">
                        <template v-slot:activator="{ on, attrs }">
                            <ToolTipComponent direction="bottom" tooltipText="转交负责人">
                                <v-avatar v-bind="attrs" v-on="on" color="warning lighten-2 mr_20" size="41">
                                    {{ taskOwner | surename }}
                                </v-avatar>
                            </ToolTipComponent>
                        </template>
                        <v-sheet>
                            <UserPicker @pick="pickUser" />
                        </v-sheet>
                    </v-menu>
                </v-flex>
                <v-flex grow class="task_name_edit">
                    <span v-if="!taskNameEdit" class="task_name width100" @click="showTaskNameEdit">{{ name }}</span>
                    <v-text-field v-if="taskNameEdit" v-model="name" class="width100" hide-details dense v-on:keyup.enter="showSubmitWindow"></v-text-field>
                    <v-dialog v-model="submitEditName" height="63" width="510" persistent overlay-opacity="0" overlay-color="white" content-class="task_edit_name_emit">
                        <v-card>
                            <v-card-actions>
                                <v-layout d-flex align-center justify-end>
                                    <v-flex grow d-flex align-center justify-end><v-btn @click="closeEditWindow">取消</v-btn></v-flex>
                                    <v-flex shrink d-flex align-center justify-end class="ml_10"><v-btn color="primary" @click="submitName">确定</v-btn></v-flex>
                                </v-layout>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-flex>
            </v-layout>
            <v-layout align-center justify-start row class="width100 m_0_12 p_0_8">
                <v-flex shrink class="mr_20_task_edit">
                    <ToolTipComponent v-if="!!content" direction="top" :tooltipText="priority[taskPriority - 1].text">
                        <v-chip :color="priority[taskPriority - 1].chip">
                            <v-icon class="m_0 alarm_name_edit" :color="priority[taskPriority - 1].color">mdi-alarm-light-outline</v-icon>
                            <span class="task_priority_value_name_edit" :style="{color: `${priority[taskPriority - 1].color}`}">{{ taskPriority }}</span>
                            <span class = "priority_name_edit_text" :style="{color: `${priority[taskPriority - 1].color}`}">{{ priority[taskPriority - 1].text }}</span>
                        </v-chip>
                    </ToolTipComponent>
                </v-flex>
                <v-flex shrink class="mr_20_task_edit">
                    <v-chip color="rgba(0,196,203,.1)" :disabled="taskTargetPrice ? 'flase' : true">
                        <v-icon class="mr_3_task_edit" style="color: #00c4cb;">mdi-target</v-icon>
                        <span class="priority_name_edit_text" style="color: #00c4cb;">量化</span>
                    </v-chip>
                </v-flex>
                <v-flex shrink class="mr_20_task_edit">
                    <ToolTipComponent direction="top" tooltipText="任务未设置该属性">
                        <v-chip color="rgba(0,196,203,.1)" :disabled="taskFeedbackTime ? false : true">
                            <v-icon class="mr_3_task_edit" style="color:  #00c4cb;">mdi-alarm</v-icon>
                            <span class="priority_name_edit_text" style="color: #00c4cb;">反馈</span>
                        </v-chip>
                    </ToolTipComponent>
                </v-flex>
                <v-flex shrink class="mr_20_task_edit">
                    <ToolTipComponent direction="top" tooltipText="任务未设置该属性">
                        <v-chip color="rgba(0,196,203,.1)" disabled>
                            <v-icon class="mr_3_task_edit" style="color: #00c4cb;">mdi-account-network-outline</v-icon>
                            <span class="priority_name_edit_text" style="color: #00c4cb;">审批</span>
                        </v-chip>
                    </ToolTipComponent>
                </v-flex>
                <v-flex grow>
                    <ToolTipComponent direction="top" tooltipText="任务未设置该属性">
                        <v-chip color="rgba(0,196,203,.1)" :disabled="content.task_est_worktime ? false : true">
                            <v-icon class="mr_3_task_edit" style="color: #00c4cb;">mdi-timer-outline</v-icon>
                            <span class="priority_name_edit_text" style="color: #00c4cb;">预估</span>
                        </v-chip>
                    </ToolTipComponent>
                </v-flex>    
            </v-layout>
            <v-layout align-center justify-start row class="width100 m_0_12 p_0_8"> 
                <v-flex shrink class="mr_10_task_edit">
                    <v-icon class="task_period_clock">mdi-clock-time-five-outline</v-icon>
                    <span class="task_period_title">起止时间：</span>
                </v-flex>
                <v-flex shrink class="mr_40_task_edit">
                    <!-- <span style="color:#83898F; font-size:14px; margin-right:5px;">{{ startDate }}</span>
                    <span style="color:#83898F; font-size:14px; margin-right:5px;">08:00</span>
                    <span style="color:#83898F; font-size:14px; margin-right:5px;">---</span>
                    <span style="color:#83898F; font-size:14px; margin-right:5px;">{{ endDate }}</span>
                    <span style="color:#83898F; font-size:14px; margin-right:5px;">18:00</span>
                    <ToolTipComponent direction="top" tooltipText="编辑">
                        <span class="cursorPointer edit_task_period" @click="changeTaskPeriod"><v-icon style="color:#83898F; font-size:14px !important; margin-right:5px;">mdi-pencil</v-icon></span>
                    </ToolTipComponent>
                    <Calendar ref="calendarPeriod" @changeDates="handle_changeDates" /> -->
                    <date-range-picker ref="picker" opens="right" 
                        control-container-class="d-flex align-center justify-center task-item-date-picker"
                        :locale-data="{ 
                            firstDay: 1,
                            format: 'yyy/mm/dd HH:mm',
                            applyLabel: '确定',
                            cancelLabel: '取消',
                            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                            monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                        }" 
                        :minDate="minDate" :maxDate="maxDate" 
                        :dateRange="dateRange" 
                        :ranges="false" @update="handle_changeDates"
                        time-picker
                    >
                        <template v-slot:input="picker" >
                            <ToolTipComponent direction="top" tooltipText="编辑">
                                {{ picker.startDate | taskFormatDate }} -- {{ picker.endDate | taskFormatDate }}
                            </ToolTipComponent>
                        </template>
                    </date-range-picker>
                </v-flex>
                <v-flex>
                    <span style="color:#83898F; font-size:14px; margin-right:3px;">剩余</span>
                    <span style="color:#3296fa; font-size:15px; margin-right:3px;">{{ period }}</span>
                    <span style="color:#83898F; font-size:14px; margin-right:3px;">天</span>
                </v-flex>
            </v-layout>
            <DescriptionEdit :description="taskDescription" @taskDescriptionEdit="handle_taskDescriptionEdit" />
            <QuantifyEdit v-if="taskTargetPrice" :taskID="taskID" :task_parent_object="taskParentObject" :target_price="taskTargetPrice" :real_price="taskRealPrice" :unitID="taskUnit" @editTargetPrice="handle_editTargetPrice" @editRealPrice="handle_editRealPrice" @editTaskUnit="handle_editTaskUnit" />
            <RestEdit :task_id="taskID" :task_parent_object="taskParentObject" :task_progress="taskProgress" :target_price="taskTargetPrice" :real_price="taskRealPrice" :feedbackTime="taskFeedbackTime" :estTime="taskEstimationTime" @setFeedbackTime="handle_setFeedbackTime" @setEstTime="handle_setEstTime" />
            <HiddenEdit v-if="contentToggle" :creator="taskCreator" :owner="taskOwner" :approver="taskApprover" :collaborators="taskCollaborators" :connectedWork="taskConnectedWork" :visibleRange="taskVisibleRange" :uploadedFiles="taskUploadedFiles" @setOwner="handle_setOwner" @setApprover="handle_setApprover" @removeApprover="handle_removeApprover" @setCollaborator="handle_setCollaborator" @removeCollaborator = "handle_removeCollaborator" @removeConnectedWork="handle_removeConnectedWork" @setVisibleRange="handle_setVisibleRange" @uploadTaskFile="handle_uploadTaskFile" />
            <v-layout align-center justify-center class="width100 m_0_12 p_0_8">
                <v-flex d-flex align-center justify-center class="width100 cursorPointer" @click="taskContentToggle"><span class="task_content_collapse_text">{{ toggleTexts[toggleIndex].value }}</span><v-icon class="task_content_collapse_icon" :class="contentToggle ? 'collapse_rotate' : ''">mdi-chevron-down</v-icon></v-flex>
            </v-layout>
        </v-container>
    </v-sheet>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ToolTipComponent from '@/components/okrgoal/shared/ToolTipComponent.vue';
import UserPicker from '@/components/common/UserPicker.vue';
import Calendar from '@/components/okrgoal/rightInfo/userInfo/calendar/Calendar.vue';
import DescriptionEdit from '@/components/common/taskEdit/taskContentEdit/DescriptionEdit.vue';
import QuantifyEdit from '@/components/common/taskEdit/taskContentEdit/QuantifyEdit.vue';
import RestEdit from '@/components/common/taskEdit/taskContentEdit/RestEdit.vue';
import HiddenEdit from '@/components/common/taskEdit/taskContentEdit/HiddenEdit.vue';
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import cronstrue from 'cronstrue/i18n';

export default {
    props: ['content'],
    components: {
        ToolTipComponent,
        UserPicker,
        Calendar,
        DescriptionEdit,
        QuantifyEdit,
        RestEdit,
        HiddenEdit,
        DateRangePicker
    },
    data() {
        return {
            taskName: "",
            taskNameEdit: false,
            submitEditName: false,
            priority: [
                {
                    text: '最高',
                    color: 'red',
                    chip: 'rgba(255,62,62,.1)'
                },
                {
                    text: '高',
                    color: 'yellow',
                    chip: '#cfea68',
                },
                {
                    text: '中',
                    color: 'blue',
                    chip: '#7a87e8'
                },
                {
                    text: '低',
                    color: 'green',
                    chip: '#89e098'
                },
                {
                    text: '非常低',
                    color: 'gray',
                    chip: '#bad1d3'
                },
            ],
            start_date: null,
            end_date: null,
            difference_days: null,
            target_price: null,
            real_price: null,
            feedback_time: null,
            estimation_time: null,
            toggleTexts: [{value: "展开"}, {value: "收起"}],
            toggleIndex: 0,
            contentToggle: false,
            taskRelatedOwnerId: null,
            taskRelatedApproverId: null,
            taskCollaborator: [],
            taskWork: null,
            taskWorkParent: null,
            taskRange: 0,
            minDate: '2018-01-01',
            maxDate: '2050-12-31',
            true: true,
            false: false,
        }
    },
    created() {
        if(this.users.length == 0) {
            this.getUsers({});
        }
    },
    watch: {
        content(v) {
            if(this.users.length == 0) {
                this.getUsers({});
            }
        }
    },
    computed: {
        ...mapGetters('user', ['users']),
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('okr', ['okrObj']),
        ...mapGetters('item', ['items']),
        taskID() {
            if(!!this.content) {
                return this.content.task_id;
            }
        },
        taskParentObject() {
            if(!!this.content)  {
                return this.content.task_parent_object;
            }
        },
        name: {
            get: function() {
                if(!!this.content && !!this.content.task_name)
                {
                    return this.content.task_name;
                }
            },
            set: function(newValue) {
                this.taskName = newValue;
            }
        },
        taskPriority() {
            if(!!this.content) {
                return this.content.task_priority;
            }
        },
        dateRange() {
            if(!!this.content) {
                let startDate;
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let hours = date.getHours();
                if(hours < 10) {
                    hours = "0" + hours;
                }
                let minutes = date.getMinutes();
                if(minutes < 10) {
                    minutes = "0" + minutes;
                }
                if(month < 10) {
                    month = "0" + month;
                } 
                let day = date.getDate();
                if(date < 10) {
                    day = "0" + day;
                }
                if(!!this.content.task_start_date) {
                    startDate = this.content.task_start_date.split("-")[0] + "/" + this.content.task_start_date.split("-")[1] + "/" + this.content.task_start_date.split("-")[2];
                } else {
                    startDate = year + "/" + month + "/" + day + " " + hours + ":" + minutes; 
                }
                let endDate;
                if(!!this.content.task_end_date) {
                    endDate = this.content.task_end_date.split("-")[0] + "/" + this.content.task_end_date.split("-")[1] + "/" + this.content.task_end_date.split("-")[2];
                } else {
                    endDate = year + "/" + month + "/" + day + " " + hours + ":" + minutes;
                }
                return {
                    startDate: startDate,
                    endDate: endDate
                }
            } else {
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let hours = date.getHours();
                if(hours < 10) {
                    hours = "0" + hours;
                }
                let minutes = date.getMinutes();
                if(minutes < 10) {
                    minutes = "0" + minutes;
                }
                if(month < 10) {
                    month = "0" + month;
                } 
                let day = date.getDate();
                if(date < 10) {
                    day = "0" + day;
                }
                return {
                    startDate: year + "/" + month + "/" + day + " " + hours + ":" + minutes,
                    endDate: year + "/" + month + "/" + day + " " + hours + ":" + minutes
                }
            }
        },
        period() {
            if(!!this.difference_days)
            {
                return this.difference_days;
            } else if(!!this.content && !!this.content.task_start_date && !!this.content.task_end_date){
                let startDate = new Date(this.content.task_start_date);
                let endDate = new Date(this.content.task_end_date);
                let difference_time = endDate.getTime() - startDate.getTime();
                let difference_days = parseInt(difference_time / (1000 * 3600 * 24));
                return difference_days; 
            }       
        },
        taskDescription() {
            if(!!this.content && !!this.content.task_description)
            {
                return this.content.task_description;
            }
        },
        taskTargetPrice() {
            if(!!this.target_price)
            {
                return this.target_price;
            } else if(!!this.content && !!this.content.task_target_price) {
                return this.content.task_target_price;
            }
        },
        taskProgress() {
            if(!!this.content && !!this.content.task_progress) {
                return this.content.task_progress;
            }
        },
        taskRealPrice() {
            if(!!this.real_price)
            {
                return this.real_price;
            } else if(!!this.content && !!this.content.task_real_price) {
                return this.content.task_real_price;
            } 
        },
        taskUnit() {
            if(!!this.content && !!this.content.task_unit) {
                return this.content.task_unit;
            }
        },
        taskFeedbackTime() {
            if(!!this.content && !!this.content.task_feedback_time) {
                return cronstrue.toString(this.content.task_feedback_time, {use24HourTimeFormat: true, locale: "zh_CN"})
            }
        },
        taskEstimationTime() {
            if(!!this.content && !!this.content.task_est_worktime) {
                return this.content.task_est_worktime;
            } else {
                return "暂未设置";
            }
        },
        taskCreator() {
            if(!!this.content && !!this.content.task_creator) {
                return this.content.task_creator;
            }
        },
        taskOwner() {
            if(!!this.content && !!this.content.task_owner) {
                return this.content.task_owner;
            }
        },
        taskApprover() {
            if(!!this.content && !!this.content.task_approver) {
                return this.content.task_approver;
            }
        },
        taskCollaborators() {
            if(!!this.content && !!this.content.task_collaborator) {
                this.taskCollaborator = this.content.task_collaborator.split(",");
                return this.taskCollaborator;
            }
        },
        taskConnectedWork() {
            if(!!this.taskWork)
            {
                return this.taskWork;
            } else if(!!this.content) 
            {
                if(!!this.content.task_parent_object && !!this.content.task_parent_object_name && !this.content.task_parent_item)
                {
                    this.taskWorkParent = 0;
                    let param = {
                        parent: this.taskWorkParent,
                        id: this.content.task_parent_object_name
                    }
                    return param;
                } else if(!!this.content.task_parent_item && !!this.content.task_parent_item_name )
                {
                    this.taskWorkParent = 1;
                    let param = {
                        parent: this.taskWorkParent,
                        id: this.content.task_parent_item_name
                    }
                }
            }
        },
        taskVisibleRange() {   
            if(!!this.content && !!this.content.task_visible_type) {
                this.taskRange = this.content.task_visible_type;
            } else {
                this.taskRange = 0;
            }
            return this.taskRange;
        },
        taskUploadedFiles() {
            if(!!this.content && !!this.content.task_files) {
                return this.content.task_files;
            } else {
                return [];
            }
        }
    },
    methods: {
        ...mapActions('user', ['getUsers']),
        ...mapActions('task', ['updateTaskOne']),
        pickUser(prop) {
            let task_new_owner = prop.user.id;
            this.updateTaskOne({'task_id' : this.taskID, 'task_parent_object': this.taskParentObject, 'task_owner' : task_new_owner});
        }, 
        showTaskNameEdit() {
            this.taskNameEdit = true;
        },
        showSubmitWindow(prop) {
            this.submitEditName = true;
        },
        closeEditWindow() {
            this.submitEditName = false;
            this.taskNameEdit = false;
        },
        submitName() {
            let param = {
                task_id: this.taskID,
                task_parent_object: this.taskParentObject,
                task_name: this.taskName,
            }
            this.updateTaskOne(param);
            this.submitEditName = false;
            this.taskNameEdit = false;
        },
        changeTaskPeriod() {
            this.$refs.calendarPeriod.open();
        },
        handle_changeDates(prop) {
            let tk_start = new Date(prop.startDate);
            let tk_start_year = tk_start.getFullYear();
            let tk_start_month = tk_start.getMonth() + 1;
            if(tk_start_month < 10) {
                tk_start_month = "0" + tk_start_month;
            }
            let tk_start_day = tk_start.getDate();
            if(tk_start_day < 10) {
                tk_start_day = "0" + tk_start_day;
            }
            let tk_start_hr = tk_start.getHours();
            if(tk_start_hr < 10) {
                tk_start_hr = "0" + tk_start_hr;
            }
            let tk_start_min = tk_start.getMinutes();
            if(tk_start_min < 10) {
                tk_start_min = "0" + tk_start_min;
            }
            let tk_end = prop.endDate;
            let tk_end_year = tk_end.getFullYear();
            let tk_end_month = tk_end.getMonth() + 1;
            if(tk_end_month < 10) {
                tk_end_month = "0" + tk_end_month;
            }
            let tk_end_day = tk_end.getDate();
            if(tk_end_day < 10) {
                tk_end_day = "0" + tk_end_day;
            }
            let tk_end_hr = tk_end.getHours();
            if(tk_end_hr < 10) {
                tk_end_hr = "0" + tk_end_hr;
            }
            let tk_end_min = tk_end.getMinutes();
            if(tk_end_min < 10) {
                tk_end_min = "0" + tk_end_min;
            }
            let full_start, full_end;
            let start, end, difference_days;
            if(new Date(tk_end).getTime() - new Date(tk_start).getTime() >= 0)
            {
                full_start = tk_start_year + "-" + tk_start_month + "-" + tk_start_day + " " + tk_start_hr + ":" + tk_start_min + ":" + "00";
                full_end = tk_end_year + "-" + tk_end_month + "-" + tk_end_day + " " + tk_end_hr + ":" + tk_end_min + ":" + "00";
                difference_days = (new Date(tk_end).getTime() - new Date(tk_start).getTime()) / (1000 * 3600 * 24); 
            } else {
                full_start = tk_end_year + "-" + tk_end_month + "-" + tk_end_day + " " + tk_end_hr + ":" + tk_end_min + ":" + "00";
                full_end = tk_start_year + "-" + tk_start_month + "-" + tk_start_day + " " + tk_start_hr + ":" + tk_start_min + ":" + "00";
                difference_days = parseInt((new Date(tk_start).getTime() - new Date(tk_end).getTime()) / (1000 * 3600 * 24)); 
            }
            this.difference_days = parseInt(difference_days);  
            let param = {
                task_id: this.taskID,
                task_parent_object: this.taskParentObject,
                task_start_date: full_start,
                task_end_date: full_end
            }
            this.updateTaskOne(param);
        },
        handle_taskDescriptionEdit(prop) {
            let param = {
                task_id: this.taskID,
                task_parent_object: this.taskParentObject,
                task_description: prop
            }
            this.updateTaskOne(param);
        },
        handle_editTargetPrice(prop) {
            this.target_price = prop;
            let param = {
                task_id: this.taskID,
                task_parent_object: this.taskParentObject,
                task_target_price: prop
            }
            this.updateTaskOne(param);
        },
        handle_editRealPrice(prop) {
            this.real_price = prop;
            let task_progress = Math.ceil((this.real_price/this.taskTargetPrice) * 100);
            let param = {
                task_id: this.taskID,
                task_parent_object: this.taskParentObject,
                task_real_price: prop,
                task_progress: task_progress
            }
            this.updateTaskOne(param);
        },
        handle_editTaskUnit(prop) {
            let param = {
                task_id: this.taskID,
                task_parent_object: this.taskParentObject,
                task_unit: prop
            }
            this.updateTaskOne(param);
        },
        taskContentToggle() {
            this.contentToggle = !this.contentToggle;
            if(this.contentToggle == true)
            {
                this.toggleIndex = 1;
            } else {
                this.toggleIndex = 0;
            } 
        },
        handle_setFeedbackTime(prop) {
            let param = {
                task_id: this.taskID,
                task_parent_object: this.taskParentObject,
                task_feedback_time: prop
            }
            this.updateTaskOne(param);
        },
        handle_setEstTime(prop) {
            let param = {
                task_id: this.taskID,
                task_parent_object: this.taskParentObject,
                task_est_worktime: prop
            }
            this.updateTaskOne(param);
        }, 
        handle_setOwner(prop) {
            let param = {
                task_id: this.taskID,
                task_parent_object: this.taskParentObject,
                task_owner: prop
            }
            this.updateTaskOne(param);
        },
        handle_setApprover(prop) {
            // this.taskRelatedApproverId = prop;
            let param = {
                task_id: this.taskID,
                task_parent_object: this.taskParentObject,
                task_approver: prop
            }
            this.updateTaskOne(param);
        },
        handle_removeApprover() {
            // this.taskRelatedApproverId = -1;
            let param = {
                task_id: this.taskID,
                task_parent_object: this.taskParentObject,
                task_approver: -1
            }
            this.updateTaskOne(param);
        },
        handle_setCollaborator(prop) {
            this.taskCollaborator.push(prop);            
            let param = {
                task_id: this.taskID,
                task_parent_object: this.taskParentObject,
                task_collaborator: this.taskCollaborator.toString()
            }
            this.updateTaskOne(param);
        },
        handle_removeCollaborator(prop) {
            let index = this.taskCollaborator.findIndex((collaborator) => collaborator == prop);
            if(index != -1)
            {
                this.taskCollaborator.splice(index, 1);
            }
            let param = {
                task_id: this.taskID,
                task_parent_object: this.taskParentObject,
                task_collaborator: this.taskCollaborator.toString()
            }
            this.updateTaskOne(param);
        },
        handle_removeConnectedWork() {
            this.taskWork = {
                parent: "",
                id: 0
            }
            let param;
            if(this.taskWorkParent == 0)
            {
                param = {
                    task_id: this.taskID,
                    task_parent_object: 0,
                }
            } else if(this.taskWorkParent == 1)
            {
                param = {
                    task_id: this.taskID,
                    task_parent_item: 0,
                }
            }
            this.updateTaskOne(param);
        },
        handle_setVisibleRange(prop) {
            this.taskRange = prop.value;
            let param = {
                task_id: this.taskID,
                task_parent_object: this.taskParentObject,
                task_visible_type: this.taskRange,
            }
            this.$emit("updateTaskOne", param);
        },
        handle_uploadTaskFile(prop) {
            let param = {
                task_id: this.taskID,
                task_parent_object: this.taskParentObject,
                task_uploaded_files: prop
            }
            this.$emit("updateTaskOne", param);
        }
    }
}
</script>

<style>
.taskContentEditor_position {
    position: relative;
    top: 60px;
}
.p_0_5 {
    padding: 0px 5px;
}
.pr_25 {
    padding-right: 25px !important;
}
.mr_20 {
    margin-right: 20px;
}
.ml_10 {
    margin-left: 10px;
}
.m_0_12 {
    margin: 12px 0px 0px 0px !important;
}
.p_0_8 {
    padding: 0px 8px;
}
.mr_3_task_edit {
    margin-right: 3px;
    font-size: 17px !important;
}
.mr_20_task_edit {
    margin-right: 20px;
}
.mr_10_task_edit {
    margin-right: 10px;
}
.mr_40_task_edit {
    margin-right: 40px;
}
.task_name_edit {
    border-bottom: 1px solid white;
}
.task_name_edit:hover {
    border-bottom: 1px solid #a6b3b5;
}
.task_name {
    font-size: 20px;
    line-height: 36px;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",STHeitiSC,sans-serif;
}
.taskNameInput {
    border: 0px !important;
    border-bottom:2px solid #8686e4 !important;
}
.taskNameInput:focus {
    border: 0px !important;
    border-bottom:2px solid #8686e4 !important;
}
.task_edit_name_emit {
    position: absolute;
    top: 125px;
    right: -10px;
}
.alarm_name_edit {
    font-size: 23px !important;
}
.task_priority_value_name_edit {
    position: relative !important;
    right: 11px !important;
    top: 2px !important;
    font-size: 11px !important;
    font-weight: bold !important;
}
.priority_name_edit_text {
    position: relative;
    top: 1px;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",STHeitiSC,sans-serif;
}
.task_period_clock {
    margin-right: 6px;
    font-size: 16px !important;
    color: #83898f !important;
    position: relative !important;
    bottom: 1px;
}
.task_period_title {
    font-size: 14px;
    color: #83898f;
}
.edit_task_period {
    opacity: 0;
    transition: all ease .5s;
}
.mr_40_task_edit:hover .edit_task_period {
    opacity: 1;
}
.task_content_collapse_text {
    transition: all ease .5s;
    font-size: 12px;
    color: #1d86f0;
}
.collapse_rotate {
    transform: rotate(180deg);
}
.task_content_collapse_icon {
    font-size: 16px !important;
    color: #1d86f0 !important;
}
.task-owner {
    position: absolute !important;
    left: calc(100% - 705px) !important;
    top: 162px !important;
}
.task-item-date-picker {
  margin-bottom: 5px;
  margin-top: 5px;
}
.task_item-date-picker span {
    color: #83898f !important;
}
</style>