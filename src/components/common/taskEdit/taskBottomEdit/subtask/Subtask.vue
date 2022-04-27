<template>
    <v-container d-flex align-center justify-cener class="sub_task_creation">
        <v-layout align-center justify-center row class="width100 m_0" @click="displaySubtaskDetailWindow"> 
            <v-flex class="width100 create_subtask">
                <v-container d-flex class="width100 p_0 height100">
                    <v-layout align-center justify-start row class="width100 m_0 height100">
                        <v-flex d-flex align-center justify-start grow class="height100 pl_10 border_0">
                            <v-icon color="#1687d9" size="18" style="margin-right:5px;">mdi-checkbox-marked-outline</v-icon>
                            <v-text-field class="subtask_name_input" v-model="subTaskName" hide-details placeholder="请输入您要安排的工作任务名称"></v-text-field>
                        </v-flex>
                        <v-flex d-flex align-center justify-start shrink class="height100 pr_10 border_0">
                            <v-menu>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on" class="subtask_right"><span v-if="subTaskOwner" style="font-size:14px;color:#647481;margin-right:5px;">{{ subTaskOwner | username }}</span><span v-else style="font-size:14px;color:#647481;margin-right:5px;">会计主管</span><span style="font-size:14px;color:#647481;">负责</span></span>
                                </template>
                                <v-sheet>
                                    <UserPicker @pick="pickUser" />
                                </v-sheet>
                            </v-menu :close-on-content-click="false" offset-y>
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
                                :dateRange="{startDate: subTask_start_date, endDate: subTask_end_date}"
                                :ranges="false"
                                @update="datePicker"
                                class="subtask_range"
                            >     
                                <template v-slot:input="picker">
                                    <ToolTipComponent direction="top" :tooltipText="subTaskTimeLine">
                                        <span><v-icon color="#1687d9" size="18">mdi-calendar-text-outline</v-icon></span>
                                    </ToolTipComponent>
                                </template>                       
                            </date-range-picker>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on" class="subtask_right_alarm" :style="{color: `${priority[task.task_priority - 1].color}`}">
                                        <ToolTipComponent
                                            direction="top"
                                            tooltipText="最高"
                                        >
                                            <v-icon :color="priority[task.task_priority - 1].color" size="25">mdi-alarm-light-outline</v-icon>
                                            <span class="subtask_right_alarm_number" :style="{color: `${priority[task.task_priority - 1].color}`}">{{ task.task_priority }}</span>
                                        </ToolTipComponent>
                                    </span>
                                </template>
                                <v-list>
                                    <v-list-item v-for="(item, i) in [1,2,3,4,5]" :key="i">
                                        <v-list-item-title>
                                            <v-btn small small plain @click="selectPriority(item)">
                                                <v-icon class="item_alarm" :color="priority[i].color">mdi-alarm-light-outline</v-icon>
                                                <span class="item_alarm_priority" :style="{color: `${priority[i].color}`}">{{ item}}</span>
                                                <span class="ml-2">{{ priority[i].text }}</span>
                                            </v-btn>
                                        </v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu> 
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>
        </v-layout>
        <SubTaskDetail v-if="subTaskWindow" @setTargetPrice="handle_setTargetPrice" @setCron="handle_setCron" @setApprover="handle_setApprover" @setParent="handle_setParent" @setViceLeader="handle_setViceLeader" @setTaskCollaborator="handle_setTaskCollaborator" @removeoneCollaborator="handle_removeoneCollaborator" @setDescription="handle_setDescription" />
        <v-layout align-center justify-start row class="width100 m_0 p_10 add_subtask_bottom">
            <v-flex grow>
                <!-- <span class="upload">
                    <v-icon size="18" >mdi-paperclip</v-icon>
                    <span class="file_upload_name">附件</span>
                </span> -->
                <span class="upload">
                    <span @click="fileInput" ><v-icon>mdi-paperclip</v-icon><span style="font-size:14px;">附件</span></span>
                    <input type="file" ref="file" style="display:none;" @change="setFileForIntercom">
                </span>
            </v-flex>
            <v-flex shrink><span class="subtask_create_down"><span>更多信息</span><v-icon color="#647481" size="18" class="mr_10">mdi-chevron-down</v-icon></span><v-btn color="primary" :disabled="!subTaskName" @click="createSubTask">发布</v-btn></v-flex>
            <v-flex v-if="display_files && subTaskFiles.length != 0" class="width100 files_mt_25">
                <v-layout d-flex align-center justify-start row class="width100 m_0">
                    <v-flex v-for="(file, index) in subTaskFiles" :key="index" d-flex align-center justify-start class="width100 files_mt_15" style="padding:8px 15px !important;">
                        <v-layout d-flex align-center jsutify-start row class="width100 m_0">
                            <v-flex shrink><v-icon color='rgb(73, 185, 221)' style="margin-right: 10px;">mdi-file-upload</v-icon></v-flex>
                            <v-flex d-flex align-center justify-start grow><span style="color:rgb(100, 116, 129);">{{ file.file_name.split(".")[0] }}</span></v-flex>
                            <v-flex shrink><span style="color:rgb(45, 171, 146);margin-right:10px;font-size:12px;">文件上传成功</span></v-flex>
                            <v-flex shrink class="file_remove"><v-icon size="15" color="rgb(169, 184, 191)" style="cursor:pointer;" class="file_remove_close" @click="removeFile(file.file_id)">mdi-close-circle</v-icon></v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-container v-if="!!sub_tasks && sub_tasks.length != 0">
            <SubTaskItem
                v-for="(subTask, index) in sub_tasks" 
                :key="subTask.task_id"
                :task_id="task_id"
                :content="subTask"
                @showSubTaskEditor="handle_showSubTaskEditor"
            />
        </v-container>
    </v-container>
</template>

<script>
import ToolTipComponent from '@/components/okrgoal/shared/ToolTipComponent.vue';
import DateRangePicker from 'vue2-daterange-picker';
import UserPicker from '@/components/common/UserPicker.vue';
import EditorContent from '@/components/okrgoal/rightInfo/editorContent/EditorContent.vue';
import SubTaskDetail from '@/components/common/taskEdit/taskBottomEdit/subtask/SubTaskDetail.vue';
import SubTaskItem from './SubTaskItem.vue';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['task_id', 'sub_tasks'],
    components: {
        ToolTipComponent,
        UserPicker,
        DateRangePicker,
        EditorContent,
        SubTaskDetail,
        SubTaskItem,
    },
    data() {
        return {
            subTaskName: null,
            subTaskOwner: null,
            subTaskTimeLine: "",
            subTask_start_date: null,
            subTask_end_date: null,
            subTaskPrice: null,
            subTaskCron: null,
            subTaskUnit: null,
            subTaskApprover: null,
            subTaskParent: null,
            subTaskViceLeader: null,
            subTaskEstTime: null,
            subTaskCollaborator: [],
            subTaskDescription: null,
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
            task: {
                task_priority: 1
            },
            subTaskWindow: false,
            subTask: {},
            display_files: false,
            file: null,
            subTaskFileIds: [],
        }
    },
    created() {
        let start = this.dateRange.startDate;
        let end = this.dateRange.endDate;
        start = new Date(start);
        end = new Date(end);
        start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
        end = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
        this.subTask_start_date = start
        this.subTask_end_date = end
        this.subTaskTimeLine = this.subTask_start_date + "-" + this.subTask_end_date;
        this.subTaskOwner = this.authUser.id;
        this.subTask.task_owner = this.authUser.id;
        this.initFiles({type:"subtask"});    
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('fileUpload', ['subTaskFiles']),
        dateRange: function () {
            let now = new Date();
            let quarter = Math.floor((now.getMonth() / 3));
            let start = new Date(now.getFullYear(), quarter * 3, 1);
            let end = new Date(start.getFullYear(), start.getMonth() + 3, 0);
            return {
                startDate: start,
                endDate: end
            }
        },
    },
    methods: {        
        ...mapActions('task', ['addSubTask']),
        ...mapActions('fileUpload', ['initFiles', 'fileUpload', 'deleteFileUploadById']),
        pickUser(prop) {
            this.subTaskOwner = prop.user.id
        },
        selectPriority(prop) {
            this.task.task_priority = prop;
        },
        displaySubtaskDetailWindow() {
            this.subTaskWindow = true;
        },
        datePicker(param) {
            let start = param.startDate;
            let end = param.endDate;
            start = new Date(start);
            end = new Date(end);
            start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
            end = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
            this.subTask_start_date = start
            this.subTask_end_date = end
            this.subTaskTimeLine = this.subTask_start_date + "-" + this.subTask_end_date;
        },
        handle_setTargetPrice(e) {
            this.subTaskPrice = e;
        },
        handle_setCron(e) {
            this.subTaskCron = e.feedbackTime;
            this.subTaskUnit = e.unit;
        },
        handle_setApprover(e) {
            this.subTaskApprover = e;
        },
        handle_setParent(e) {
            this.subTaskParent = e;
        },
        handle_setViceLeader(e) {
            this.subTaskViceLeader = e.viceLeader;
            this.subTaskEstTime = e.estimationTime;
        },
        handle_setTaskCollaborator(e) {
            this.subTaskCollaborator = e;
        },
        handle_removeoneCollaborator(e) {
            this.subTaskCollaborator = e;
        },
        handle_setDescription(e) {
            this.subTaskDescription = e;
        },
        createSubTask() {
            this.subTask.task_parent_task = this.task_id;
            this.subTask.task_creator = this.authUser.id;
            this.subTask.task_name = this.subTaskName;
            this.subTask.task_owner = this.subTaskOwner;
            this.subTask.task_priority = this.task.task_priority;
            this.subTask.task_start_date = this.subTask_start_date;
            this.subTask.task_end_date = this.subTask_end_date;
            this.subTask.task_unit = this.subTaskUnit;
            this.subTask.task_target_price = this.subTaskPrice;
            this.subTask.task_feedback_time = this.subTaskCron;
            this.subTask.task_vice_leader = this.subTaskViceLeader;
            this.subTask.task_est_worktime = this.subTaskEstTime;
            this.subTask.task_collaborator = this.subTaskCollaborator.toString();
            this.subTask.task_description = !!this.subTaskDescription ? this.subTaskDescription.toString() : '';
            this.subTaskFiles.forEach((f) => {
                this.subTaskFileIds.push(f.file_id);
            });
            this.subTask.task_uploaded_files = this.subTaskFileIds.toString();
            if(!!this.subTaskParent) {
                if(Object.keys(this.subTaskParent).includes('ob_id')) {
                this.subTask.task_parent_object = this.subTaskParent.ob_id
                } else if (Object.keys(this.subTaskParent).includes('item_id')) {
                this.subTask.task_parent_item = this.subTaskParent.item_id
                }
            }
            this.addSubTask(this.subTask);
            this.subTaskName = "";
            this.subTaskWindow = false;
            this.initFiles({type:"subtask"});
        },
        handle_showSubTaskEditor(prop) {
            this.$emit("showSubTaskEditor", prop);
        },
        fileInput() {
          this.$refs.file.click();
        },
        setFileForIntercom(e) {
          this.display_files = true;
          this.file = e.target.files[0];
          var formData = new FormData();
          formData.append("files", this.file);
          this.fileUpload({type: "subtask", value: formData});
        },
        removeFile(id) {
          this.deleteFileUploadById({ type:"subtask", file_id: id });
        },
    }
}
</script>

<style>
.sub_task_creation {
    flex-direction: column;
}
.create_subtask {
    border: 1px solid #a9b8bf;
    height: 42px;
}
.height100 {
    height: 100%;
}
.pl_10 {
    padding-left: 10px;
}
.pr_10 {
    padding-right: 10px;
}
.border_0 {
    border: 0px !important;
}
.subtask_name_input {
    padding: 0px !important;
    margin: 0px !important;
}
.subtask_right {
    padding-left: 5px;
    padding-right: 5px;
    border-left: 1px dotted #a9b8bf;
    border-right: 1px dotted #a9b8bf;
}
.subtask_right_calendar {
    padding-left: 5px;
    padding-right: 5px;
    border-right: 1px dotted #a9b8bf;
}
.subtask_right_alarm {
    padding-left: 5px;
    position: relative;
    cursor: pointer;
}
.subtask_right_alarm_number {
    font-size: 12px;
    position: absolute;
    left: 14px;
    top: 6px;
}
.subtask_range {
    min-width: 20px !important;
    border-right: 1px dotted #a9b8bf;
}
.subtask_range .reportrange-text {
    border: 0px;
    padding: 0px;
    /* padding-left: 5px; */
    /* padding-right: 5px; */
}
.subtask_range .daterangepicker {
    position: absolute !important;
    left: -196px !important;
}
.item_alarm {
    font-size: 26px;
}
.item_alarm_priority {
    position: relative;
    right: 17px;
}
.upload {
    padding: 10px; 
    cursor: pointer;   
}
.upload:hover{
    background-color: rgb(214 237 238) !important;
    border-radius: 5px;
}
.upload:hover .file_upload {
    color: #005999 !important;
}
.upload:hover .file_upload_name {
    color: #005999;
}
.file_upload {
    margin-right: 5px;
}
.file_upload_name {
    color: #647481;
    font-size: 14px;
}
.subtask_create_down {
    color: #647481;
    font-size: 12px;
    cursor: pointer;
}
.subtask_create_down:hover {
    color: #00599b !important;
}
.subtask_create_down:hover .mr_10 {
    color: #00599b !important;
}
.p_10 {
    padding: 10px;
}
.add_subtask_bottom {
    background-color: #f5f8fa;
}
.subtask-sand-timer {
    color: #1687d9 !important;
    font-size: 18px !important;
}
.subtask_mr_5 {
    margin-right: 5px;
}
.subtask_name {
    color: #eb4447;
    font-size: 14px;
    cursor: pointer;
}
.subtask_mr_35 {
    margin-right: 35px;
}
.subtask_desc {
    color: #00c4cb;
    font-size: 14px;
    background: rgba(0,196,203,.1);
    border-radius: 5px;
    padding: 5px 7px;
}
.subtask_end_date {
    display: flex;
    align-items: center;
    color: #fe8282;
    font-size: 12px;
    margin-right: 20px;
}
.subtask_owner {
    font-size: 12px;
    display: flex;
    align-items: center;
    margin-right: 10px;
}
.subtask_alarm {
    font-size: 25px;
}
.subtask_priority {
    position: relative;
    margin-right: 5px;
}
.subtask_priority_value {
    font-size: 11px;
    position: absolute;
    right: 9px;
    top: 6px;
}
.subtask_delete {
    opacity: 0;
}
.subtask_delete .delete {
    font-size: 12px;
    cursor: pointer;
}
.subtask_item {
    margin-bottom: 5px !important;
}
.subtask_item:hover {
    background-color:#f5f8fa;
}
.subtask_item:hover .subtask_delete {
    opacity: 1;
}
.subtask_item_edit {
    padding-left: 20px;
}
.edit-value {
    color: rgb(172 166 166);
    font-size: 14px;
}
</style>