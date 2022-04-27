<template>
    <v-container d-flex align-center justify-cener class="task_workingHour">
        <v-layout align-center justify-center row class="width100 m_0">
            <v-flex class="width100 create_task_workingHour">
                <v-container d-flex class="width100 p_0 height100">
                    <v-layout align-center justify-start row class="width100 m_0 height100">
                       <v-flex grow d-flex align-center justify-start grow class="height100 pl_10 border_0">
                            <v-text-field class="task_workingHour_name_input" v-model="taskWorkingHourName" hide-details placeholder="请输入您要安排的工作任务名称"></v-text-field>
                        </v-flex>
                        <v-flex shrink d-flex align-center justify-start shrink class="height100 pr_10 border_0 pl_10">
                           <v-menu
                                ref="workingDate"
                                v-model="workingHourDate"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                                content-class="workingHourDatePicker"
                           >
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on" class="border"><v-icon size="20" color="#1687d9">mdi-calendar-text-outline</v-icon></span>
                                </template>
                                <v-date-picker
                                    v-model="workingDate"
                                    scrollable
                                    locale="zh-cn"
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="workingHourDate = false"
                                    >
                                        取消
                                    </v-btn>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="setWorkingDate"
                                    >
                                        好的
                                    </v-btn>
                                </v-date-picker>
                           </v-menu>
                        </v-flex>
                        <v-flex shrink class="workingHour_pr_10">
                            <v-menu
                                ref="workingTime"
                                v-model="workingHourTime"
                                :close-on-content-click="false"
                                :nudge_right="40"
                                :return-value.sync="workingTime"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="290px"
                                content-class="workingHourTimePicker"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-icon size="20" color="#1687d9">mdi-plus-box-outline</v-icon><span style="color:#647481; margin-left:5px;">工时</span></span>
                                </template>
                                <v-time-picker
                                    v-model="workingTime"
                                    full-width
                                    @click:minute="setWorkingTime"
                                ></v-time-picker>
                            </v-menu>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>
        </v-layout>
        <v-layout v-if="editWindow" align-center justify-start row class="width100 m_0">
            <v-flex><EditorContent v-model="workingDescription" /></v-flex>
        </v-layout>
        <v-layout align-center justify-start row class="width100 m_0 p_10 add_subtask_bottom">
            <v-flex grow>
                <!-- <span class="upload">
                    <v-icon size="18" >mdi-paperclip</v-icon>
                    <span class="file_upload_name">附件</span>
                </span> -->
                <span>
                    <span @click="fileInput" class="upload"><v-icon>mdi-paperclip</v-icon><span class="file_upload_name">附件</span></span>
                    <input type="file" ref="file" style="display:none;" @change="setFileForIntercom">
                </span>
            </v-flex>
            <v-flex shrink>
                <span class="task_workingHour_create_down" @click="showEditWindow"><span v-if="editWindow">收起</span><span v-else>更多信息</span><v-icon color="#647481" size="18" class="mr_10 edit_down" :class="editWindow ? 'edit_down-again' : ''">mdi-chevron-down</v-icon></span>
                <v-btn color="primary" :disabled="!taskWorkingHourName" @click="addTaskWorkingHour">发布</v-btn>
            </v-flex>
            <v-flex v-if="display_files && workingHourFiles.length != 0" class="width100 files_mt_25">
                <v-layout d-flex align-center justify-start row class="width100 m_0">
                    <v-flex v-for="(file, index) in workingHourFiles" :key="index" d-flex align-center justify-start class="width100 files_mt_15" style="padding: 8px 15px !important;">
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
        <v-container d-flex align-center justify-start class="listWorkingTime">
            <v-layout align-center justify-start row class="width100 m_0">
                <v-flex d-flex align-center justify-start grow><span class="title_toggle_list">会计主管:</span><span class="title_toggle_list">任务工时总计</span></v-flex>
                <v-flex d-flex align-center justify-end shrink><span class="total_hour">{{ totalHour }}h</span><span class="toggle" @click="toggleListWorking"><span v-if="!toggleWorkingTime">展开</span><span v-else>收起</span><v-icon class="toggle_icon" :class="toggleWorkingTime ? 'toggle_icon_sec' : ''">mdi-chevron-down</v-icon></span></v-flex>
            </v-layout>
            <!-- <v-layout v-if="toggleWorkingTime" align-center justify-start row class="width100 wt_list wt_mt_30" v-for="wt in workingTimeList" :key="wt.wt_id">
                <v-flex grow><span class="wt_name">{{ wt.wt_name }}</span></v-flex>
                <v-flex shrink>
                    <span class="single_hour">{{ wt.wt_hours }}</span>
                    <span class="single_date">{{ wt.wt_date.split("-")[1] + "/" + wt.wt_date.split("-")[2] }}</span>
                    <span v-if = "wtID === wt.wt_id" class="wt_down" @click="singleWTEdit(0)">收起</span>
                    <span v-else class="wt_down" @click="singleWTEdit(wt.wt_id)">详情</span>
                    <v-icon  class="toggle_icon" :class="wtID === wt.wt_id ? 'toggle_icon_sec' : ''">mdi-chevron-down</v-icon>
                </v-flex>

            </v-layout> -->
            <WorkingHourItem 
                v-if="toggleWorkingTime"
                v-for="wt in workingTimeList" :key="wt.wt_id"
                :content="wt"
                @deleteWorkingTime="handle_deleteWorkingTime"
                @updateWorkingHour="handle_updateWorkingHour"
            />
        </v-container>
    </v-container>
</template>

<script>
import EditorContent from '@/components/okrgoal/rightInfo/editorContent/EditorContent.vue';
import WorkingHourItem from './WorkingHourItem.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['task_id'],
    components: {
        EditorContent,
        WorkingHourItem,
    },
    data() {
        return {
            taskWorkingHourName: null,
            workingHourDate: false,
            workingDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            workingHourTime: false,
            workingTime: null,
            workingDescription: null,
            editWindow: false,
            toggleWorkingTime: false,
            wtID: 0,
            display_files: false,
            file: null,
            workingFiles: [],
        }
    },
    created() {
        if(!!this.task_id) {
            this.getWorkingTimeByTaskID({ "wt_parent_task" : this.task_id });
        }
        this.initFiles({type:"workinghour"});    
    },
    computed: {
        ...mapGetters('workingTime', ['workingTimeList']),
        ...mapGetters('fileUpload', ['workingHourFiles']),
        totalHour() {
            if(!!this.workingTimeList && this.workingTimeList.length != 0)
            {
                let total_hour = 0;
                this.workingTimeList.map((wt) => {
                    total_hour += wt.wt_hours;
                });
                return parseFloat(total_hour).toFixed(2);
            } else {
                return 0;
            }
        }
    },
    methods: {
        ...mapActions('workingTime', ['addWorkingTime', 'getWorkingTimeByTaskID', 'updateWorkingTime', 'deleteWorkingTime']),
        ...mapActions('fileUpload', ['initFiles', 'fileUpload', 'deleteFileUploadById']),
        setWorkingDate() {
            this.$refs.workingDate.save(this.workingDate);
            this.workingHourDate = false;
        },
        setWorkingTime() {
            this.$refs.workingTime.save(this.workingTime);
            this.workingHourTime = false;
        },
        showEditWindow() {
            this.editWindow = !this.editWindow;
        },
        singleWTEdit(id) {
            this.wtID = id;
        },
        addTaskWorkingHour() {
            let hour = parseInt(this.workingTime.split(":")[0]) + "." + parseFloat(parseInt(this.workingTime.split(":")[1], 10)/60).toFixed(1).split(".")[1];
            this.workingHourFiles.forEach((f) => {
                this.workingFiles.push(f.file_id);
            })
            let param = {
                "wt_parent_task": this.task_id,
                "wt_date" : this.workingDate,
                "wt_description" : this.workingDescription.prgValue.toString(),
                "wt_hours" : parseFloat(hour).toFixed(2),
                "wt_name" : this.taskWorkingHourName,
                "wt_upload_files" : this.workingFiles.toString(),
            }
            this.addWorkingTime(param);
            this.initFiles({type:"workinghour"});
            this.editWindow = false;
            this.taskWorkingHourName = "";
        },
        handle_deleteWorkingTime(id) {
            this.deleteWorkingTime({ "wt_id" : id });
        },
        handle_updateWorkingHour(prop) {
            this.updateWorkingTime(prop);
        },
        toggleListWorking() {
            this.toggleWorkingTime = !this.toggleWorkingTime;
        },
        fileInput() {
          this.$refs.file.click();
        },
        setFileForIntercom(e) {
          this.display_files = true;
          this.file = e.target.files[0];
          var formData = new FormData();
          formData.append("files", this.file);
          this.fileUpload({type: "workinghour", value: formData});
        },
        removeFile(id) {
          this.deleteFileUploadById({ type:"workinghour", file_id: id });
        },
    }
}
</script>

<style>
.task_workingHour {
    flex-direction: column;
}
.create_task_workingHour {
    border: 1px solid #a9b8bf;
    height: 42px;
}
.add_task_workingHour_bottom {
    background-color: #f5f8fa;
}
.task_workingHour_create_down {
    color: #647481;
    font-size: 12px;
    cursor: pointer;
}
.task_workingHour_name_input {
    padding: 0px !important;
    margin: 0px !important;
}
.workingHourDatePicker {
    position: absolute;
    left: 1292px !important;
}
.workingHour_pr_10 {
    padding-right: 10px;
    cursor: pointer;
}
.border {
    padding: 5px;
    border-left: 1px solid rgb(207 187 187) !important;
    border-right: 1px solid rgb(207 187 187) !important;
}
.workingHourTimePicker {
    position: absolute;
}
.task_workingHour_create_down:hover {
    color: #00599b;
}
.edit_down {
    transition: all ease .7s;
}
.edit_down-again {
    transform: rotate(180deg);
}
.listWorkingTime {
    padding: 15px 45px !important;
    flex-direction: column;
}
.title_toggle_list {
    font-size: 17px;
    color: #83898F;
}
.total_hour {
    margin-right: 14px;
    margin-top: 5px;
    height: 20px;
    padding: 0 10px;
    font-size: 12px;
    border-radius: 3px;
    font-family: Arial;
    color: #fff;
    background-color: #f5b333;
}
.single_hour {
    margin-right: 14px;
    margin-top: 5px;
    height: 20px;
    padding: 0 10px;
    font-size: 12px;
    border-radius: 3px;
    font-family: Arial;
    color: #fff;
    background-color: #f5b333;
}
.toggle {
    font-size: 12px;
    cursor: pointer;
    color: #99a3ad;
}
.wt_down {
    font-size: 12px;
    cursor: pointer;
    color: #99a3ad;
}
.toggle_icon {
    transition: all ease .5s;
    font-size: 15px !important;
    cursor: pointer !important;
    color: #99a3ad !important;
}
.toggle_icon_sec {
    transform: rotate(180deg);
}
.single_date {
    font-size: 12px;
    color: #3b4247;
    margin-right: 5px;
}
.wt_name {
    font-size: 12px;
    color: #35434c;
}
.single_date:hover {
    color: #1687d9;
}
.wt_mt_30 {
    margin-top: 30px !important;
}
</style>