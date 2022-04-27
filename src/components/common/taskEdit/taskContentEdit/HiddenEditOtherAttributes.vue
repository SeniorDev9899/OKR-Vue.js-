<template>
    <v-layout d-flex align-center justify-start column class="width100 m_0">
        <v-flex class="width100 m_0"><span class="taskOthers_title">其他属性</span></v-flex>
        <v-flex class="width100 m_20_0 p_0_6">
            <v-layout align-center justify-start row class="width100 m_0 task_others_work">
                <v-flex shrink class="mr_35"><v-icon class="others_icon">mdi-lock-open-variant</v-icon><span class="others_title">可见范围</span></v-flex>
                <v-flex shrink class="mr_15">
                    <span class="task_rest_work_title">{{ taskVisibleRange }}</span>
                </v-flex>
                <v-flex shrink class="mr_15">
                    <ToolTipComponent direction="top" tooltipText="编辑">
                        <span class="cursorPointer task_others_pencil" @click="showVisibilityModal"><v-icon style="color:#83898F; font-size:14px !important; margin-right:5px;">mdi-pencil</v-icon></span>
                    </ToolTipComponent>
                    <VisibilityModal ref="visibleShow" @setVisibleRange="handle_setVisibleRange" />
                </v-flex>
            </v-layout>
        </v-flex>
        <v-flex class="width100 m_20_0 p_0_6">
            <v-layout align-center justify-start row class="width100 m_0 task_attribute_rest">
                <v-flex shrink class="mr_35"><v-icon class="rest_icon">mdi-link-variant</v-icon><span class="rest_title">任务附件</span></v-flex>
                <v-flex shrink class="mr_15">
                    <span class="w100 d-flex align-center justify-center">
                        <span @click="fileInput" class="add_click">点击添加</span>
                        <input type="file" ref="fileIntercom" style="display:none;" @change="setFileForIntercom">
                    </span>
                </v-flex>
            </v-layout>
            <v-layout align-center justify-center column class="width100 m_0">
                <v-flex v-for="(file, index) in taskAllFiles" :key="index" d-flex align-center justify-start class="width100 files_mt_15">
                    <v-layout d-flex align-center jsutify-start row class="width100 m_0">
                        <v-flex shrink><v-icon color='rgb(73, 185, 221)' style="margin-right: 10px;">mdi-file-upload</v-icon></v-flex>
                        <v-flex d-flex align-center justify-start grow>
                            <a :href="fileDownloadEndPoint + '/' + file.file_id" download style="color:rgb(100, 116, 129);">{{ file.file_name.split(".")[0] }}</a>
                        </v-flex>
                        <v-flex shrink><span style="color:rgb(45, 171, 146);margin-right:10px;font-size:12px;">文件上传成功</span></v-flex>
                        <v-flex shrink class="file_remove"><v-icon size="15" color="rgb(169, 184, 191)" style="cursor:pointer;" class="file_remove_close" @click="removeFile(file.file_id)">mdi-close-circle</v-icon></v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
import ToolTipComponent from '@/components/okrgoal/shared/ToolTipComponent.vue';
import VisibilityModal from '@/components/common/taskEdit/header/VisibilityModal.vue';
import { constant } from '@/constants/constant.js';
import * as endPoint from "@/config/endpoints";
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['visibleRange', 'uploadedFiles'],
    components: {
        ToolTipComponent,
        VisibilityModal,
    },
    data() {
        return {
            display_files: false,
            file: null,
            taskFileUploadIds: [],
            taskAllFiles: [],
        }
    },
    created() {
        this.initFiles({ type: "task" });
        this.taskAllFiles = this.uploadedFiles;
        this.uploadedFiles.forEach((f) => {
            this.taskFileUploadIds.push(f.file_id);
        });
    },
    watch: {
        uploadedFiles(v) {
            if(this.taskAllFiles.length == 0) {
                this.taskAllFiles = v;
            } else {
                this.taskAllFiles.concat(v);
            }
            this.taskFileUploadIds = [];
            v.forEach((f) => {
                this.taskFileUploadIds.push(f.file_id);
            });
        }
    },
    computed: {
        ...mapGetters('fileUpload', ['taskFiles']),
        taskVisibleRange() {
            return constant.taskVisibility.filter((t) => t.value == this.visibleRange)[0].text;
        },
        // taskUploadedFiles() {
        //     if(!!this.uploadedFiles && this.uploadedFiles.length != 0) {
        //         return this.uploadedFiles;
        //     } else {
        //         return [];
        //     }
        // },
        fileDownloadEndPoint() {
            return endPoint.FILE_DOWNLOAD;
        },
        listToMatric(list, elementsPerSubArray) {
            var matrix = [], i, k;
            for(i = 0, k = -1; i < list.length; i++) {
                if(i % elementsPerSubArray == 0) {
                    k++;
                    matrix[k] = [];
                }
                matrix[k].push(list[i]);
            }
            return matrix;
        }
    },
    methods: {
        ...mapActions('fileUpload', ['initFiles', 'fileUpload', 'deleteFileUploadById']),
        showVisibilityModal() {
            this.$refs.visibleShow.openVisibility({task_rest_attribute: true, value: this.visibleRange});
        },
        handle_setVisibleRange(prop) {
            this.$emit("setVisibleRange", prop);
        },
        fileInput() {
          this.$refs.fileIntercom.click();
        },
        async setFileForIntercom(e) {
          this.display_files = true;
          this.file = e.target.files[0];
          var formData = new FormData();
          formData.append("files", this.file);
          const res = await this.fileUpload({type: "task", value: formData});
          if(res == "success") {    
                this.taskAllFiles.push(this.taskFiles[this.taskFiles.length-1]);
                this.taskFileUploadIds.push(this.taskFiles[this.taskFiles.length - 1].file_id);
                this.$emit("uploadTaskFile", this.taskFileUploadIds.toString());
          }
        },
        async removeFile(id) {
            const res = await this.deleteFileUploadById({ type:"task", file_id: id });
            if(res == "success") {
                let certainIndex = this.taskAllFiles.findIndex((f) => f.file_id == id);
                this.taskAllFiles.splice(certainIndex, 1);
                this.taskFileUploadIds = [];
                this.taskAllFiles.forEach((f) => this.taskFileUploadIds.push(f.file_id));
                this.$emit("uploadTaskFile", this.taskFileUploadIds.toString());   
            }
        },
    }
}
</script>

<style>
.taskOthers_title {
    position: relative;
    right: 19px;
    width: 175px;
    height: 26px;
    font-size: 14px;
    color: #565e66;
    background: #fbf2df;
    border-radius: 0 15px 15px 0;
    text-align: center;
    padding: 10px 10px 10px 10px;
}
.others_icon {
    color: #83898f;
    font-size: 14px !important;
    margin-right: 5px;
}
.others_title {
    font-size: 13px; 
    color: #83898f;
}
.task_others_pencil {
    opacity: 0;
    transition: all ease .5s;
    position: relative;
    bottom: 1px;
}
.task_others_work:hover .task_others_pencil {
    opacity: 1;
}
.add_click {
    color: #005999;
    font-size: 16px;
    font-family: "Helvetica Neue",Helvetica,arial,"Hiragino Sans GB",\5b8b\4f53,sans-serif;
    cursor: pointer;
}
</style>