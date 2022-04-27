<template> 
    <v-layout d-flex align-center justify-start column class="width100 workinghour_detail">
        <v-flex class="width100 m_0">
            <v-layout d-flex align-center justify-start row class="width100 m_0" :class="edit_working_description ? 'height_190' : ''">
                <v-flex d-flex align-start justify-center shrink style="height:100%;padding:5px 0px;"><span class="working_desciption_edit_title">备注</span></v-flex>
                <v-flex d-flex align-center justify-start grow style="padding:3px 10px 0px 0px;" >
                    <v-layout d-flex align-center justify-start column class="width100 m_0">
                        <EditorContent v-if="edit_working_description" v-model="workingDescription" @input="editWorkingDescription" />
                        <span v-if="!edit_working_description" class="working_description_edit_value" @click="editDescription">{{workingHourDescription}}</span>
                        <v-layout v-if="edit_working_description" d-flex align-center justify-end class="width100 pt_10 desc_submit">
                            <v-flex v-if="edit_working_description" grow d-flex align-center justify-end><v-btn style="margin-right:10px;" @click="edit_working_description=false">取消</v-btn></v-flex>
                            <v-flex v-if="edit_working_description" shrink><v-btn color="primary" :disabled="!workingDescription ? true : false" @click="submitWorkingHourDescription">确定</v-btn></v-flex>
                        </v-layout>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-flex>
        <v-flex class="width100" :class="edit_working_description ? 'mt_60' : 'mt_20'">
            <v-layout d-flex align-center justify-start row class="width100 m_0">
                <v-flex shrink><span class="working_desciption_edit_title">附件</span></v-flex>
                <v-flex d-flex align-center justify-start grow>
                    <span>
                        <span @click="fileInput" class="working_file_upload">点击添加</span>
                        <input type="file" ref="file" style="display:none;" @change="setFileForIntercom">
                    </span>
                </v-flex> 
            </v-layout>
        </v-flex>
        <v-flex class="width100 m_0">
            <v-layout d-flex align-center justify-start row class="width100 m_0" column>
                <v-flex v-for="(file, index) in workingHourFiles" :key="index" d-flex align-center justify-start class="width100 files_mt_15">
                    <v-layout d-flex align-center jsutify-start row class="width100 m_0">
                        <v-flex shrink><v-icon color='rgb(73, 185, 221)' style="margin-right: 10px;">mdi-file-upload</v-icon></v-flex>
                        <v-flex d-flex align-center justify-start grow>
                            <!-- <span style="color:rgb(100, 116, 129);">{{ file.file_name.split(".")[0] }}</span> -->
                            <a :href="fileDownloadEndPoint + '/' + file.file_id" download>{{ file.file_name.split(".")[0] }}</a>
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
import EditorContent from '@/components/okrgoal/rightInfo/editorContent/EditorContent.vue';
import * as endPoint from "@/config/endpoints";
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['content'],
    data() {
        return {
            edit_working_description: false,
            workingDescription: null,
            file: null,
            true: true, 
            false: false,
            workingHourFileIds: [],
        }
    },
    created() {
        this.initFiles({ type: "workinghour" });
        if(!!this.content.wt_upload_files) {
            this.workingHourFileIds = this.content.wt_upload_files.split(",");
        }
        if(!!this.content.wt_upload_files) {
            this.content.wt_upload_files.split(",").forEach((f) => {
                this.getFiles({ type:"workinghour", file_id: f.file_id });
            });
        }
    },
    watch: {
        content(v) {
            if(!!v.wt_upload_files) {
                this.workingHourFileIds = v.wt_upload_files.split(",");
            }
            if(!!v.wt_upload_files) {
                v.wt_upload_files.split(",").forEach((f) => {
                    this.getFiles({ type:"workinghour", file_id: f.file_id })
                });
            }
        }
    },
    components: {
        EditorContent,
    },
    computed: {
        ...mapGetters('fileUpload', ['workingHourFiles']),
        workingHourDescription() {
            return this.content.wt_description.replace(/<[^>]+>/g, '');
        },
        fileDownloadEndPoint() {
            return endPoint.FILE_DOWNLOAD;
        }
    },
    methods: {
        ...mapActions('fileUpload', ['initFiles', 'getFiles', 'fileUpload', 'deleteFileUploadById']),
        removeFile(id) {
          this.deleteFileUploadById({ type:"workinghour", file_id: id });
          let certainIndex = this.workingHourFileIds.findIndex((f) => f == id);
          this.workingHourFileIds.splice(certainIndex, 1);
          this.$emit("updateWorkingHour", {"wt_id":this.content.wt_id, "wt_upload_files":this.workingHourFileIds.toString()});
        },
        editDescription() {
            this.edit_working_description = true;
        },
        fileInput() {
          this.$refs.file.click();
        },
        async setFileForIntercom(e) {
          this.file = e.target.files[0];
          var formData = new FormData();
          formData.append("files", this.file);
          const res = await this.fileUpload({type: "workinghour", value: formData});
          if(res == "success") {
              this.workingHourFileIds.push(this.workingHourFiles[this.workingHourFiles.length - 1].file_id);
              this.$emit("updateWorkingHour", {"wt_id":this.content.wt_id, "wt_upload_files":this.workingHourFileIds.toString()});
          }
        },
        editWorkingDescription(prop) {
            this.workingDescription = prop.prgValue;
        },
        submitWorkingHourDescription() {
            this.$emit("updateWorkingHour", {"wt_id":this.content.wt_id, "wt_description":this.workingDescription});
            this.edit_working_description = false;
        }
    }
}
</script>

<style>
.workinghour_detail {
    margin-top: 20px !important;
    padding: 10px 0 10px 20px;
    color: #555;
    background-color: rgba(194,224,255,.15);
    border-radius: 2px;
}
.working_desciption_edit_title {
    color: #647481;
    font-size: 12px;
    margin-right: 30px;
}
.working_description_edit_value {
    color: #191515;
    font-size: 12px;
    width: 100%;
}
.working_file_upload {
    color:#7777cc;
    cursor: pointer;
}
.mt_20 {
    margin-top: 20px;
}
.mt_60 {
    margin-top: 60px;
}
.pt_10 {
    padding-top: 10px;
}
.height_190 {
    height: 190px !important;
}
.desc_submit {
    border: 1px solid #a7b4b5;
    border-top: 0px;
    padding-bottom: 5px;
    padding-right: 5px;
    background-color: white;
}
</style>