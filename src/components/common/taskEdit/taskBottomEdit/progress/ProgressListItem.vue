<template>
<v-sheet class = "w100 bg_color_grey" :class = "removeItem ? 'displayNone' : ''" v-click-outside = "onClickOutside" >
    <v-flex class="right_yellow_userInfo_flex">
      <v-layout align-center justify-start column class="right_yellow_useraccount">
        <v-flex class="right_xiaomeng">
          <v-icon class="right_progress_useraccount">
            mdi-account
          </v-icon>
          <span class="right_progress_xiaoMeng">填写人:{{ userName }}</span>
          <span class = "editDelete" >
                <v-icon class = "mr_15 edit_delete" @click = "editProgress = true">mdi-pencil</v-icon>
                <ConfirmDialogComponent v-on:click="bool => confirmClick(bool)" :option="taskProgress"> 
                  <v-icon class = "edit_delete">mdi-delete</v-icon>
                </ConfirmDialogComponent>
          </span>
        </v-flex>
        
        <v-flex class="right_yellow_useraccount_time">
          <span class="time_user">{{ year }}/{{ month }}/{{ day }} {{ hr }}:{{ min }}</span>
          <span class="title_user">添加了进展</span>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex class="right_yellow_userInfo_flex">
      <v-layout align-center justify-start column class="right_yellow_useraccount">
        <v-flex class="right_xiaomeng" v-if = "!editProgress">
          <span class="right_test_xiaoMeng" v-html = "value"></span>
        </v-flex>

        <EditorContent v-if = "editProgress" :content = "value" @input = "handle_input" />
        <v-flex v-if = "editProgress" class = "pt_2 pb_2 pr_2 w100" style = "padding: 6px 6px 6px 0px;border: 1px solid #a9b8bf;border-top: 0px;" d-flex align-center justify-end>
            <v-btn
                @click = "closeEditProgressWindow"
                style = "margin-right: 5px;"
            >
                取消
            </v-btn>
            <v-btn 
                color = "primary"
                :disabled = "enableSubmitBtn ? false : true"
                @click = "submitProgress"
            >提交</v-btn>
        </v-flex>

        <v-flex class="right_yellow_useraccount_time">
          <v-layout align-center justify-start row class="right_yellow_test_progress">

            <!-- <v-flex>
              <span class="time_user_progress">KR当前进度为{{ progress_percent }}%</span>
            </v-flex> -->

            <v-flex v-if="!!startDate && !!endDate">
              <span class="title_user">进展日期:{{ startDate }} - {{ endDate }}</span>
            </v-flex>
            <v-flex v-if="!!startDate && !endDate">
                <span class="title_user">进展日期:{{ startDate }}</span>
            </v-flex>

          </v-layout>
        </v-flex>

      </v-layout>
    </v-flex>

    <v-flex d-flex align-center justify-start v-if="files.length != 0" style="padding:10px;">
        <v-layout d-flex align-center justify-start column class="width100 m_0" style="padding:0px 10px;">
            <v-flex d-flex align-center justify-start class="width100" v-for="(file, index) in files" :key="index">
                    <v-icon v-if="file != ''" color='rgb(73, 185, 221)' style="margin-right: 10px;">mdi-file-upload</v-icon>
                    <a :href="fileDownloadEndPoint + '/' + file.file_id" download>{{ file.file_name.split(".")[0] }}</a>
            </v-flex>
        </v-layout>
    </v-flex>
</v-sheet>
</template>

<script>
import ToolTipComponent from '@/components/okrgoal/shared/ToolTipComponent.vue';
import ConfirmDialogComponent from "@/components/okrgoal/shared/ConfirmDialogComponent";
import EditorContent from '@/components/okrgoal/rightInfo/editorContent/EditorContent.vue';
import * as endPoint from "@/config/endpoints";
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['value', 'userName', 'progress_percent', 'prId', 'prParent', 'timestamp', 'key_id', 'progress_start_date', 'progress_end_date', 'files'],
    components: {
        ToolTipComponent,
        ConfirmDialogComponent,
        EditorContent,
    },
    data() {
        return {
            year : null,
            month : null,
            day : null,
            hr : null,
            min : null,
            editProgress: false,
            enableSubmitBtn: false,
            items: [
                {
                    key: 0,
                    name: "Bold",
                    icon: "mdi-alpha-b"
                },
                {
                    key: 1,
                    name: "Text Color",
                    icon: "mdi-alpha-a"
                },
                {
                    key: 2,
                    name: "Image",
                    icon: "mdi-image"
                },
                {
                    key: 3,
                    name: "Quote",
                    icon: "mdi-format-quote-close"
                },
                {
                    key: 4,
                    name: "Font",
                    icon: "mdi-alpha-a-box"
                },
                {
                    key: 5,
                    name: "Font Size",
                    icon: "mdi-format-size"
                },
                {
                    key: 6,
                    name: "Unordered List",
                    icon: "mdi-format-list-bulleted"
                }
            ],
            progressUpdate: null,
            removeItem: false,
            year: null,
            month: null,
            day: null,
            hr: null,
            min: null,
            taskProgress: "progress",
        }
    },
    created() {
        const time = new Date(this.timestamp);
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
        this.hr = time.getHours();
        if(this.hr < 10)
        {
            this.hr = "0" + this.hr.toString();
        }
        this.min = time.getMinutes();
        if(this.min < 10)
        {
            this.min = "0" + this.min.toString();
        }
    },
    computed: {
        startDate() {
            if(!!this.progress_start_date)
            {
                let date = this.progress_start_date.split("-");
                let year = date[0];
                let month = date[1];
                let day = date[2];
                return year + "/" + month + "/" + day;
            } 
        },
        endDate() {
            if(!!this.progress_end_date) 
            {
                let date = this.progress_end_date.split("-");
                let year = date[0];
                let month = date[1];
                let day = date[2];
                return year + "/" + month + "/" + day;
            }
        },
        fileDownloadEndPoint() {
            return endPoint.FILE_DOWNLOAD;
        }
    },
    methods: {
        ...mapActions('progress', ['updateProgress', 'deleteProgress']),
        onClickOutside() {
           this.editProgress = false;
        },
        enablePrgSubmitBtn(e) {
            if(e) {
                this.enableSubmitBtn = true;
            } else {
                this.enableSubmitBtn = false;
            } 
        },
        submitProgress() {
            let updateField = {
                "pr_id": this.prId,
                "pr_creator": 2,
                "pr_parent": this.prParent,
                "pr_parent_type": 2,
                "pr_percent": this.progress_percent,
                "pr_status": 1,
                "pr_description": this.progressUpdate
            }
            this.updateProgress(updateField);
            this.editProgress = false;
        },
        closeEditProgressWindow() {
            this.editProgress = false;
        },
        confirmClick(prop) {
            if(prop == true)
            {
                this.deleteProgress({ "pr_id" : this.prId, "pr_parent_type": 2 });
                this.removeItem = true;
            }
        }, 
        handle_input(prop) {
            this.progressUpdate = prop.prgValue;
            this.enableSubmitBtn = prop.enableSubmitBtn;
        },
        handleKeepEditorWindow() {
            this.editProgress = true;
        }
    }
}
</script>

<style>
.w100 {
    width: 100% !important;
}
.bg_color_grey {
    background-color: rgba(189,222,255,.1) !important;
    margin-bottom: 10px;
}
.edit_delete {
    font-size: 18px !important;
    color: #68979a !important;
    cursor: pointer;
    padding: 3px;
    transition: all .3s ease;
    padding: 3px;
}
.edit_delete:hover {
    background-color: #78dad9;
    border-radius: 50%;
}
.mr_15 {
    margin-right: 5px;
}
.editDelete {
    position: relative;
    left: 256px;
    top: 30px;
    opacity: 0;
    transition: all .5s ease;
}
.bg_color_grey:hover .editDelete {
    opacity: 1;
}
.pt_2 {
    padding-top: 2px;
}
.pb_2 {
    padding-bottom: 2px;
}
.pr_2 {
    padding-right: 2px;
}
.displayNone {
    display: none !important;
}
</style>