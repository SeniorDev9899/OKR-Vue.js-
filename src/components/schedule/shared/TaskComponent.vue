<template>
    <div class="list-item d-flex justify-space-between align-center">
        <v-icon v-if="isChildren">mdi-plus-box-outline</v-icon>
        <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">
                    <v-icon style="color:#2879ff; font-size: 18px;">{{task_item != undefined ? task_icons[task_item.task_status - 1].icon : ''}}</v-icon>
                </span>
            </template>
            <v-list>
                <v-list-item v-for="status in taskStatus" :key="status.value" @click="changeStatus(status.value)">
                    <v-icon>{{status.icon}}</v-icon>
                    <span>{{status.text}}</span>
                </v-list-item>
            </v-list>
        </v-menu>
        <span class="mr-12 ml-2" :style="task_item != undefined && task_item.isExpired ? {color: '#ff5b5b'} : {color: '#34434e'}" @click="openEdit(task_item)">{{task_item != undefined ? task_item.task_name : ''}}</span>
        <span class="badge1" :style="task_item.isExpired ? {color: '#FF6767', backgroundColor: '#FFEBEB'} : {color: '#479edd', backgroundColor: '#e7f3fb'}" v-if="task_item.task_progress != 0">{{task_item.task_progress}}%</span>
        <span class="badge2" v-if="task_item.task_vice_leader != null">派发</span>
        <span class="badge3" v-if="task_item.task_target_price != null">定量任务</span>
        <span class="edit-action edit-action1 mr-4 ml-4" @click="openCreateTask(task_item)"  v-if="task_item.task_tasks.length != 0">
            <v-icon style="color:#8f9ca6; font-size: 20px;">mdi-checkbox-marked-outline</v-icon>
            <span>0/{{task_item.task_tasks.length}}</span>
        </span>
        <span class="edit-action mr-4 ml-4" @click="openCreateTask(task_item)">
            <v-icon style="color:#8f9ca6; font-size: 20px;">mdi-checkbox-marked-outline</v-icon>
            <v-icon style="color:#8f9ca6; font-size: 14px;" class="plus-addon" v-if="task_item.task_tasks.length == 0">mdi-plus-circle</v-icon>
        </span>
        
        <!-- Add Task Progress -->
        <v-menu offset-y :close-on-content-click="false" v-model="showTaskProgress">
            <template v-slot:activator="{ on, attrs }">
                <span class="edit-action mr-4" v-bind="attrs" v-on="on"> 
                    <v-icon style="color:#8f9ca6; font-size: 20px;">mdi-square-edit-outline</v-icon>
                    <span v-if="taskProgressLength != 0">{{ taskProgressLength }}</span>
                    <v-icon v-if="taskProgressLength == 0" style="color:#8f9ca6; font-size: 14px;" class="plus-addon">mdi-plus-circle</v-icon>
                </span>
            </template>
            <div class="px-4 py-4">
                <v-sheet class="right_progress_notebook">
                    <v-system-bar class="right_progress_notebook_header">
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
                            v-model ="dateRange"
                            :ranges="false"
                            class="progress_time"
                        >
                            <template v-slot:input="picker" style="min-width: 350px;">
                                <ToolTipComponent direction="top" :tooltipText="progressTimeLine">
                                    <span><v-icon class="right_progress_notebook_icon">mdi-calendar-month-outline</v-icon></span>
                                </ToolTipComponent>
                            </template>
                        </date-range-picker>
                    </v-system-bar>
                    <EditorContent v-model = "prgValue" @input = "handle_input" />
                    <v-layout align-center justify-start row class = "progressSubmitLayout">
                        <v-flex>
                            <span>
                                <v-btn @click="fileInput" class="task_file_input p_0_5"><v-icon class="paperClip">mdi-paperclip</v-icon><span class = "annuse">附件</span></v-btn>
                                <input type="file" ref="file" style="display:none;" @change="setFileForProgress">
                            </span>
                        </v-flex>
                        <v-flex d-flex align-center justify-end><v-btn :disabled = "enableSubmitBtn ? false : true" @click = "submitProgress" color = "primary">提交</v-btn></v-flex>
                    </v-layout>
                    <v-layout align-center justify-start class="width100 right_progress_userXiaoMeng">
                        <v-flex v-if="display_files && progressFiles.length != 0" class="width100">
                            <v-layout d-flex align-center justify-start column class="width100 m_0">
                                <v-flex v-for="(file, index) in progressFiles" :key="index" d-flex align-center justify-start class="width100 files_mt_15">
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
                </v-sheet> 
            </div>
        </v-menu>

        <!-- Add Task Intercom -->
        <v-menu offset-y content-class="task_intercom" v-model="showTaskIntercom">
            <template v-slot:activator="{ on, attrs }">
                <span class="edit-action mr-4" v-bind="attrs" v-on="on"> 
                    <v-icon style="color:#8f9ca6; font-size: 20px;">mdi-message-text</v-icon>
                    <span v-if="taskIntercomLength != 0">{{ taskIntercomLength }}</span>
                    <v-icon v-if="taskIntercomLength == 0" style="color:#8f9ca6; font-size: 14px;" class="plus-addon">mdi-plus-circle</v-icon>
                </span>
            </template>
            <div @click="stopEvent">
                <v-form class = "w100">
                    <v-flex ref="intercom" class="progress_bottom" >
                        <v-textarea 
                        ref = "intercom"
                        filled
                        auto-grow
                        hide-details
                        v-model = "ic_desc"
                        @input = "inputIcDescription"
                        >
                        </v-textarea>
                    </v-flex>

                    <v-flex class="progress_bottom">
                        <v-layout align-center justify-start row class="w100 progress_bottom-layout m_0">
                            <v-flex class="btn_2 ic_bottomBtn displayFlex_Interactive_Bottom task_mr_5">
                                <span class="w100 d-flex align-center justify-center">
                                    <v-btn @click="fileInputIntercom" class="task_file_input p_0_5 w100"><v-icon>mdi-paperclip</v-icon><span style="font-size:14px;">附件</span></v-btn>
                                    <input type="file" ref="fileIntercom" style="display:none;" @change="setFileForIntercom">
                                </span>
                            </v-flex>
                            <v-flex class="btn_2 ic_bottomBtn displayFlex_Interactive_Bottom task_mr_5">
                                <v-menu offset-y>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn v-bind="attrs" v-on="on" class="task_file_input p_0_5 w100">
                                            <span>@ 同事</span>
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <UserPicker @pick="pickUserTaskIntercom" />
                                    </v-card>
                                </v-menu>
                            </v-flex>
                            <v-flex class="btn_2 ic_bottomBtn displayFlex_Interactive_Bottom task_mr_5">
                                <v-btn class="task_file_input p_0_5 w100" @click="allMembers">
                                    <span>@ 所有同事</span>
                                </v-btn>
                            </v-flex>
                            <v-flex class="btn_2 ic_bottomBtn displayFlex_Interactive_Bottom task_mr_5">
                                <!-- <span class="btn_2_b icons emoji_picker"> -->
                                    <EmojiPicker @inputEmoji="handle_inputEmoji" />
                                <!-- </span> -->
                            </v-flex>
                            <v-flex class="btn_2 ic_bottomBtn displayFlex_Interactive_Bottom task_mr_5" >
                                <v-btn class="task_file_input p_0_5 w100">
                                    <v-checkbox class="sms" v-model="sms" label="短信通知" hide-details></v-checkbox>
                                </v-btn>
                            </v-flex>
                            <v-flex class = "btn ic_bottomBtn displayFlex_Interactive_Bottom ml_5">
                                <v-btn 
                                color = "primary" 
                                :disabled = "enableIcSubmitBtn ? false : true"
                                @click = "submitIcDescription"
                                >回复</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-form>
                <v-flex v-if="display_files_intercom && intercomFiles.length != 0" class="width100 files_mt_25">
                    <v-layout d-flex align-center justify-start row class="width100 m_0">
                        <v-flex v-for="(file, index) in intercomFiles" :key="index" d-flex align-center justify-start class="width100 files_mt_15">
                            <v-layout d-flex align-center jsutify-start row class="width100 m_0">
                                <v-flex shrink><v-icon color='rgb(73, 185, 221)' style="margin-right: 10px;">mdi-file-upload</v-icon></v-flex>
                                <v-flex d-flex align-center justify-start grow><span style="color:rgb(100, 116, 129);">{{ file.file_name.split(".")[0] }}</span></v-flex>
                                <v-flex shrink><span style="color:rgb(45, 171, 146);margin-right:10px;font-size:12px;">文件上传成功</span></v-flex>
                                <v-flex shrink class="file_remove"><v-icon size="15" color="rgb(169, 184, 191)" style="cursor:pointer;" class="file_remove_close" @click="removeFileIntercom(file.file_id)">mdi-close-circle</v-icon></v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </div>
        </v-menu>

        <v-spacer></v-spacer>

        <v-menu offset-y v-model="targetParentMenu">
            <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">
                    <span v-if="task_item.task_parent_object != null && task_item.task_parent_object != 0">
                        <v-icon style="color:#8f9ca6; font-size: 18px;">mdi-view-grid-outline</v-icon>
                        <span class="ml-1">{{task_item.task_parent_object_name}}</span>
                    </span>
                    <span v-if="task_item.task_parent_item != null && task_item.task_parent_item != 0" class="ml-4">
                        <v-icon style="color:#8f9ca6; font-size: 18px;">mdi-text-box-search-outline</v-icon>
                        <span class="ml-1">{{task_item.task_parent_item_name}}</span>
                    </span>
                </span>
            </template>
            <div class="target-object text-right" @click="stopEvent">
                <span class="clearParent" @click="clearParent">清空已选</span>
                <v-tabs v-model="tab" icons-and-text height="36">
                    <v-tabs-slider></v-tabs-slider>
                    <v-tab href="#tab-1">
                        <span>
                            <span>目标</span>
                        </span>
                    </v-tab>
                    <v-tab href="#tab-2">
                        <span>
                            <span>项目</span>
                        </span>
                    </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab" class="">
                    <v-tab-item id="tab-1" class="text-left">
                        <v-text-field
                            placeholder="Search Key"
                            outlined
                            dense
                            class="mt-4"
                        ></v-text-field>
                        <div class="parent-node" @click="showObj1">
                            <span><v-icon style="font-size: 18px;">mdi-menu-right</v-icon></span>
                            <span>我负责的</span>
                        </div>
                        <div :class="isShowObj1 ? 'child-accordian-open' : 'child-accordian-close'" >
                            <div class="child-node ml-8 my-2" v-for="obj in objResponsibles" :key="obj.ob_id" @click="selectParentObj(obj)">
                                <span><v-icon style="font-size: 18px;">mdi-target</v-icon></span>
                                <span class="ml-2">{{obj.ob_name}}</span>
                            </div>
                        </div>    
                        <div class="parent-node" @click="showObj2">
                            <span><v-icon style="font-size: 18px;">mdi-menu-right</v-icon></span>
                            <span>我参与的</span>
                        </div>
                        <div :class="isShowObj2 ? 'child-accordian-open' : 'child-accordian-close'">
                            <div class="child-node ml-8 my-2" v-for="obj in objParticipants" :key="obj.ob_id" @click="selectParentObj(obj)">
                                <span><v-icon style="font-size: 18px;">mdi-target</v-icon></span>
                                <span class="ml-2">{{obj.ob_name}}</span>
                            </div>
                        </div>
                    </v-tab-item>
                    <v-tab-item id="tab-2" class="text-left">
                        <v-text-field
                            placeholder="Search Key"
                            outlined
                            dense
                            class="mt-4"
                        ></v-text-field>
                        <div class="parent-node" @click="showObj1">
                            <span><v-icon style="font-size: 18px;">mdi-menu-right</v-icon></span>
                            <span>我负责的</span>
                        </div>
                        <div :class="isShowObj1 ? 'child-accordian-open' : 'child-accordian-close'" >
                            <div class="child-node ml-8 my-2" v-for="obj in itemResponsibles" :key="obj.item_id" @click="selectParentItem(obj)">
                                <span><v-icon style="font-size: 18px;">mdi-target</v-icon></span>
                                <span class="ml-2">{{obj.item_name}}</span>
                            </div>
                        </div>    
                        <div class="parent-node" @click="showObj2">
                            <span><v-icon style="font-size: 18px;">mdi-menu-right</v-icon></span>
                            <span>我参与的</span>
                        </div>
                        <div :class="isShowObj2 ? 'child-accordian-open' : 'child-accordian-close'">
                            <div class="child-node ml-8 my-2" v-for="obj in itemParticipants" :key="obj.item_id" @click="selectParentItem(obj)">
                                <span><v-icon style="font-size: 18px;">mdi-target</v-icon></span>
                                <span class="ml-2">{{obj.item_name}}</span>
                            </div>
                        </div>
                    </v-tab-item>
                </v-tabs-items>
            </div>
        </v-menu>
        <span class="deadline ml-12" :style="task_item != undefined && task_item.isExpired ? {color: '#ff5b5b'} : {color: '#34434e'}">
            <date-range-picker
                ref="picker"
                opens="left"
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
                    {{ picker.endDate | formatDate }}
                </template>
            </date-range-picker>
        </span>
        <span class="accounting-manager ml-4">
            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <span
                        v-bind="attrs"
                        v-on="on"
                        class="d-flex justify-start align-center"
                    >
                        {{task_item.task_owner_name}}
                    </span>
                </template>
                <v-list class="py-0">
                    <v-list-item class="px-0">
                    <UserPicker @pick="param => pickUser(param)" />
                    </v-list-item>
                </v-list>
            </v-menu>
        </span>
        <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on" class="priority d-flex justify-center align-center ml-4" :style="{color: palette[task_item.task_priority-1], border: '1px solid '+palette[task_item.task_priority-1]}">
                    <span>
                    {{task_item != undefined ? task_item.task_priority : ''}}
                    </span>
                </span>
            </template>
            <div class="px-4 py-2" style="font-size: 14px;min-width: 100px;">
                <div class="my-4 cursor-pointer" :style="{color: palette[id]}" v-for="(p, id) in priorities" :key="id" @click="changePriority(id)">
                    <span class="circle mr-2" :style="{border: '1px solid '+palette[id]}">{{id + 1}}</span>
                    <span>{{p.text}}</span>
                </div>
            </div>
        </v-menu>
        <CreateTask ref="createTask" @save="createTask" />
    </div>
</template>

<script>
import { constant } from "@/constants/constant.js";
import { mapGetters, mapActions } from "vuex";
import { getUser } from '@/utils/authUser.service';
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import UserPicker from '@/components/common/UserPicker.vue';
import EditorContent from '@/components/okrgoal/rightInfo/editorContent/EditorContent.vue';
import ToolTipComponent from '@/components/okrgoal/shared/ToolTipComponent.vue';
import EmojiPicker from '@/components/common/EmojiPicker.vue';

export default {
    name: 'TaskComponent',
    components: {
        DateRangePicker,
        EditorContent,
        ToolTipComponent,
        UserPicker,
        CreateTask: () => import('@/components/common/CreateTask.vue'),
        EmojiPicker,
    },
    props: ['task_item'],
    data() {
        return {
            tab: null,
            targetParentMenu: false,
            select_responsible: [],
            select_participant: [],
            isShowObj1: false,
            isShowObj2: false,
            isShowItem1: false,
            isShowItem2: false,
            minDate: '2018-01-01',
            maxDate: '2050-12-31',
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            prgValue : "",
            enableSubmitBtn: false,
            showAlertForScoreDescription : false,
            file: null,
            file_intercom: null,
            display_files: false,
            display_files_intercom: false,
            progress_date: false,
            progress_start_date: null,
            progress_end_date: null,
            progressTimeLine: "",
            year: null,
            month: null,
            day: null,
            ic_desc: "",
            enableIcSubmitBtn : false,
            id: "",
            taskProgressLength: 0,
            taskIntercomLength: 0,
            sms: false,
            showTaskProgress: false,
            showTaskIntercom: false,
        }
    },
    created() {
        this.initFiles({type:"progress"});
        this.initFiles({type:"intercom"});
        this.id = this.authUser.id;
        this.getPrg({ 'pr_parent' : this.task_item.task_id, 'pr_parent_type': 2 }).then((res) => {
            if(res == "success") {
                this.taskProgressLength = this.taskProgress.length;
            }
        });
        this.getInc({ 'ic_parent' : this.task_item.task_id, 'ic_parent_type': 2 }).then((res) => {
            if(res == "success") {
                this.taskIntercomLength = this.taskIntercom.length;
            }
        });
    },
    mounted() {
      const time = new Date(Date.now());
      this.year = time.getFullYear();
      this.month = time.getMonth() + 1;
      if(this.month < 10)
      {
        this.month = "0" + this.month.toString();
      }
      this.day = time.getDate();
      if(this.day < 10)
      {
        this.day = "0" + this.day.toString();
      }
      this.progressTimeLine = this.year + "/" + this.month + "/" + this.day + "-" + this.year + "/" + this.month + "/" + this.day;
    },
    watch: {
        task_item(v) {
            this.getPrg({ 'pr_parent' : v.task_id, 'pr_parent_type': 2 }).then((res) => {
            if(res == "success") {
                this.taskProgressLength = this.taskProgress.length;
            }
            });
            this.getInc({ 'ic_parent' : v.task_id, 'ic_parent_type': 2 }).then((res) => {
                if(res == "success") {
                    this.taskIntercomLength = this.taskIntercom.length;
                }
            });
        }
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('okr', ['filteredOkrObj']),
        ...mapGetters('item', ['items']),
        ...mapGetters('fileUpload', ['intercomFiles', 'progressFiles']),
        ...mapGetters('progress', ['taskProgress']),
        ...mapGetters('intercom', ['taskIntercom']),
        priorities: function() {
            return constant.priority;
        },
        dateRange: {      
          get: function() {
            let dateRange = {
              startDate: "",
              endDate: "",
            }
            dateRange.startDate = this.task_item.task_start_date;
            dateRange.endDate = this.task_item.task_end_date;
            return dateRange;
          },
          set: function(newValue) 
          {
            const start = newValue.startDate.toString().split(' ');
            const end = newValue.endDate.toString().split(' ');
            let startMonth = this.months.findIndex((m) => m == start[1]) + 1;
            if(startMonth < 10)
            {
              startMonth = "0" + startMonth;
            }
            let endMonth = this.months.findIndex((m) => m == end[1]) + 1;
            if(endMonth < 10)
            {
              endMonth = "0" + endMonth;
            }
            let startDate = start[3] + "/" + startMonth + "/" + start[2];
            let endDate = end[3] + "/" + endMonth + "/" + end[2];
            this.progress_start_date = startDate;
            this.progress_end_date = endDate;
            this.progressTimeLine = this.progress_start_date + "-" + this.progress_end_date;
            this.progress_date = true;
          }
        },
        taskStatus: function() {
            return constant.taskStatus;
        },
        task_icons: function() {
            return constant.taskStatus;
        },
        palette: function() {
            return constant.palette;
        },
        isChildren: function() {
            // return this.task_item != undefined && this.task_item.tasks.length != 0
            return false
        },
        endDate: function() {
            const date = this.task_item.task_end_date.split('-');
            return date[1] + '/' + date[2];
        },
        objResponsibles: function() {
            return this.filteredOkrObj.filter(obj => obj.ob_owner == getUser().id && this.task_item.task_parent_object != obj.ob_id);
        },
        objParticipants: function() {
            let tmp = [];
            this.filteredOkrObj.map(obj => {
                if(obj.ob_participant != null) {
                    let str = obj.ob_participant.split(',');
                    let len = str.filter(s => s == getUser().id);
                    if(len != 0 && this.task_item.task_parent_object != obj.ob_id) {
                        tmp.push(obj)
                    }
                }   
            });
            return tmp;
        },
        itemResponsibles: function() {
            return this.items.filter(obj => obj.item_owner == getUser().id && this.task_item.task_parent_item != obj.item_id);
        },
        itemParticipants: function() {
            let tmp = [];
            this.items.map(obj => {
                if(obj.item_participant != null) {
                    let str = obj.item_participant.split(',');
                    let len = str.filter(s => s == getUser().id);
                    if(len != 0 && this.task_item.task_parent_item != obj.item_id) {
                        tmp.push(obj)
                    }
                }   
            });
            return tmp;
        }
    },
    methods: {
        ...mapActions('progress', ['getProgress', 'addProgress']),
        ...mapActions('intercom', ['getIntercom', 'addIntercom']),
        ...mapActions('task', ['updateTaskByField', 'addChildTask']),
        ...mapActions('fileUpload', ['initFiles', 'fileUpload', 'deleteFileUploadById']),
        createTask(e) {
            this.newTask = e
            this.taskMenu = false
            this.addChildTask(this.newTask)
            this.$emit('getAgainTasks');
        },
        openCreateTask(task) {
            this.$refs.createTask.open({task_id: task.task_id});
        },
        openEdit(task) {
            this.$emit('openEdit', task)
        },
        changePriority(id) {
            let payload = {
                task_id: this.task_item.task_id,
                task_priority: id + 1
            }
            this.updateTaskByField(payload);
        },
        pickUser(param) {
            let obj = {
                task_id: this.task_item.task_id,
                task_owner: param.user.id
            }
            this.updateTaskByField(obj);
            this.task_item.task_owner_name = param.user.employeeName;
        },
        datePicker(param) {
            let start = param.startDate;
            let end = param.endDate;
            start = new Date(start);
            end = new Date(end);
            start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
            end = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
            let payload = {
                task_id: this.task_item.task_id,
                task_start_date: start,
                task_end_date: end
            }
            this.updateTaskByField(payload);
        },
        selectParentItem(obj) {
            let payload = {
                task_id: this.task_item.task_id,
                task_parent_item: obj.item_id,
                task_parent_object: 0,
                task_parent_item_name: obj.item_name
            }
            this.updateTaskByField(payload);
            this.targetParentMenu = false;
        },
        showObj1() {
            this.isShowObj1 = !this.isShowObj1;
        },
        showObj2() {
            this.isShowObj2 = !this.isShowObj2;
        },
        selectParentObj(obj) {
            let payload = {
                task_id: this.task_item.task_id,
                task_parent_object: obj.ob_id,
                task_parent_item: 0,
                task_parent_object_name: obj.ob_name
            }
            this.updateTaskByField(payload);
            this.targetParentMenu = false;
        },
        clearParent() {
            let payload = {
                task_id: this.task_item.task_id,
                task_parent_object: 0,
                task_parent_item: 0
            }
            this.updateTaskByField(payload);
            this.targetParentMenu = false;
        },
        changeStatus(param) {
            let payload = {
                task_id: this.task_item.task_id,
                task_status: param
            }
            this.updateTaskByField(payload);
        },
        stopEvent(ev) {
            ev.stopPropagation();
        },
        handle_input(prop) {
            this.prgValue = prop.prgValue;
            this.enableSubmitBtn = prop.enableSubmitBtn;
            this.showAlertForScoreDescription = false;
        },
        async submitProgress() { 
            let files = [];
            this.progressFiles.forEach((f) => {
            files.push(f.file_id);
            });
            this.display_files = false;
            this.initFiles({type:"progress"}); 
            if(this.prgValue == "")
            {
                this.showAlertForScoreDescription = true;
            } else {
                let progressValue;
                if(this.progress_date == true) {
                    progressValue= {
                        "pr_creator" : 1,
                        "pr_parent" :  this.task_item.task_id,
                        "pr_parent_type" : 2,
                        "pr_percent" : 0,
                        "pr_status" : 1,
                        "pr_description" : this.prgValue,
                        "pr_start_date" : this.progress_start_date,
                        "pr_end_date" : this.progress_end_date,
                        "pr_uploaded_file": files.toString(),
                    }
                } else if(this.progress_date == false) {
                        let date = new Date();
                        let year = date.getFullYear();
                        let month = date.getMonth() + 1;
                        if(month < 10) {
                            month = "0" + month;
                        }
                        let day = date.getDate();
                        if(day < 10) {
                            day = "0" + day;
                        }
                        let progressDate = year + "/" + month + "/" + day;
                        progressValue= {
                            "pr_creator" : 1,
                            "pr_parent" :  this.task_item.task_id,
                            "pr_parent_type" : 2,
                            "pr_percent" : 11,
                            "pr_status" : 1,
                            "pr_description" : this.prgValue,
                            "pr_start_date" : progressDate,
                            "pr_end_date" : null,
                            "pr_uploaded_file": files.toString(),
                        }
                    }
                    const res = await this.addProgress({ ...progressValue });
                    if(res.pr_parent_type == 2) {
                        this.taskProgressLength = this.taskProgress.length;
                    }
                    this.progress_note = false;
                    this.prgValue = "";
                    this.showTaskProgress = false;
            }
        },
        fileInput() {
          this.$refs.file.click();
        },
        setFileForProgress(e) {
          this.display_files = true;
          this.file = e.target.files[0];
          var formData = new FormData();
          formData.append("files", this.file);
          this.fileUpload({type: "progress", value: formData});
        },
        removeFile(id) {
          this.deleteFileUploadById({ type:"progress", file_id: id });
        },
        inputIcDescription(e) {
            if(e === "")
            { 
                this.enableIcSubmitBtn = false;
            } else {
                this.enableIcSubmitBtn = true;
            }
        },
        async submitIcDescription() {
            let files = [];
            this.intercomFiles.forEach((f) => {
                files.push(f.file_id);
            });
            this.display_files_intercom = false;
            this.initFiles({type:"intercom"});   
            let ic_add;
            ic_add = {
                "ic_description": this.ic_desc,
                "ic_parent_type": 2,
                "ic_parent": this.task_item.task_id,
                "ic_reply_ic": null,
                "ic_thumbup": null,
                "ic_uploaded_file": files.toString(),
            }
            const res = await this.addIntercom(ic_add);
            if(res == "success") {
                this.taskIntercomLength = this.taskIntercom.length;
            }
            this.ic_desc = "";
            this.inputIcDescription(this.ic_desc);
            this.intercomArray = this.intercom;
            this.showTaskIntercom = false;
        },
        fileInputIntercom() {
          this.$refs.fileIntercom.click();
        },
        setFileForIntercom(e) {
          this.display_files_intercom = true;
          this.file_intercom = e.target.files[0];
          var formData = new FormData();
          formData.append("files", this.file_intercom);
          this.fileUpload({type: "intercom", value: formData});
        },
        removeFileIntercom(id) {
          this.deleteFileUploadById({ type:"intercom", file_id: id });
        },
        pickUserTaskIntercom(param) {
          this.ic_desc += "@[" + param.user.user_post_address + "]";
          this.enableIcSubmitBtn = true;
        },
        allMembers() {
          this.ic_desc += "@[所有同事:all_members]"; 
        },
        handle_inputEmoji(e) {
          this.ic_desc += e;
        },
        async getPrg(param) {
            const res = await this.getProgress(param);
            return res;
        },
        async getInc(param) {
            const res = await this.getIntercom(param);
            return res;
        }
    }
}
</script>

<style scoped>
.v-menu__content {
    overflow: visible;
    contain: none;
}

.edit-action:hover .v-icon {
    color: #53C6C6 !important;
}

.list-item .edit-action {
    position: relative;
    display: none;
}

.list-item .edit-action1 {
    display: inline-block !important;
}

.list-item:hover .edit-action {
    display: inline-block;
}

.plus-addon {
    position: absolute;
    bottom: 0;
    right: -7px;
}

.badge1 {
    /* background-color: #FFEBEB;
    color: #FF6767; */
    padding-left: 6px;
    padding-right: 6px;
    height: 18px;
    border-radius: 12px;
    margin-right: 10px;
    text-align: center;
    font-size: 12px;
    line-height: 19px;
}
.badge2 {
    color: #479edd;
    background: #e7f3fb;
    margin-right: 10px;
    width: 64px;
    text-align: center;
    padding: 2px 0;
    border-radius: 12px;
}
.badge3 {
    color: #00c4cb;
    background: rgba(0,196,203,.1);
    margin-right: 10px;
    width: 64px;
    text-align: center;
    padding: 2px 0;
    border-radius: 12px;
}

.list-item {
    border-bottom: 1px solid #e3ecf1;
    padding: 10px 10px;
}

.list-item:hover {
    background-color: #f5f8fa;
    cursor: pointer;
}

.priority {
    width: 20px;
    height: 20px;
    padding-top: 2px;
    border-radius: 50%;
}

.target-object {
    font-size: 14px;
    min-width: 350px;
    max-height: 500px;
}

.clearParent:hover {
    cursor: pointer;
}

.v-menu__content {
    background: #fff;
}

.parent-node:hover {
    cursor: pointer;
}

.child-node:hover {
    cursor: pointer;
    background: #f5f8fa;
}

.child-accordian-open {
    height: auto;
}

.child-accordian-close {
    max-height: 0 !important;
    overflow: hidden;
}

.circle {
    display: inline-block;
    width: 20px;
    height: 22px;
    text-align: center;
    border-radius: 50%;
}

.circle:hover {
    background: #f5f8fa;
}

.cursor-pointer {
    cursor: pointer;
}
</style>

<style>
.target-object {
    padding: 20px;
    background: #fff;
}

.form-control {
    border: none !important;
}
.task_intercom {
    width: 680px;
}
.task_mr_5 {
    margin-right: 5px;
}
.task_file_input {
    background-color: #f5f5f5 !important;
    box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%) !important;
    border-radius: 5px !important;
}
.task_file_input:hover {
    background-color: rgb(240, 240, 240) !important;
}
.files_mt_15 {
  margin-top: 15px;
  padding: 8px 5px;
  background-color: rgb(245, 248, 250);
}
.file_remove {
  transition: all ease .5s;
  opacity: 0;
}
.files_mt_15:hover .file_remove {
  opacity: 1;
}
.file_remove_close:hover {
  color: red !important;
}
.width100 {
    width:100%;
}
</style>
