<template>
<v-container>
    <v-flex class="right_userInfo_flex">
      <v-layout align-center justify-start class="right_progress_userXiaoMeng">
       <v-flex v-if="!progress_note" class="right_input_progress" :class="progress_note ? 'right_input_progress_remove' : ''" @click="progress_note = true">
          <v-sheet class="right_input_progress_sheet">
            <span class="right_progressText">
              填写进展
            </span>
          </v-sheet>
        </v-flex>
        <v-flex v-if="progress_note" class="noteBook">
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
          </v-sheet> 
        </v-flex>
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
    </v-flex>
    <v-sheet class = "w100 p_10">
      <ProgressListItem 
        v-for = "(prg, i) in progressList"
        :key = "prg.pr_id"
        :value = "prg.pr_description"
        :timestamp = "prg.created_at"
        :prId = "prg.pr_id"
        :key_id = "task_id"
        :prParent = "prg.pr_parent"
        :userName = "authUser.loginName"
        :progress_percent = "prg.pr_percent"
        :progress_start_date = "prg.pr_start_date"
        :progress_end_date = "prg.pr_end_date"
        :files = "prg.pr_files"
      />
      <v-layout v-if = "!limitProgress" align-center justify-center>
        <v-flex>
          <v-btn @click = "progressToggle(true)" class = "toggleBtnPrg">
            <span class = "prgBtn">展开所有进展</span>
            <v-icon class = "prgBtn" style = "font-size: 15px !important;">mdi-chevron-up</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout v-if = "limitProgress" align-center justify-center>
        <v-flex>
          <v-btn @click = "progressToggle(false)" class = "toggleBtnPrg">
            <span class = "prgBtn">放下所有的进步</span>
            <v-icon class = "prgBtn" style = "font-size: 15px !important;">mdi-chevron-down</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-sheet>
</v-container>
</template>

<script>
import ToolTipComponent from '@/components/okrgoal/shared/ToolTipComponent.vue';
import EditorContent from '@/components/okrgoal/rightInfo/editorContent/EditorContent.vue';
import ProgressListItem from './ProgressListItem.vue';
import Calendar from '@/components/okrgoal/rightInfo/userInfo/calendar/Calendar.vue';
import DateRangePicker from 'vue2-daterange-picker';
import { mapGetters, mapActions } from 'vuex';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

export default {
    props: ['task_id'],
    components: {
        ToolTipComponent,
        EditorContent,
        ProgressListItem,
        Calendar,
        DateRangePicker,
    },
    data() {
        return {
          progress_note: false,
          progress_date: false,
          prgValue : "",
          enableSubmitBtn: false,
          showAlertForScoreDescription : false,
          limitProgress: true,
          year: null,
          month: null,
          day: null,
          progressTimeLine: "",
          progress_start_date: null,
          progress_end_date: null,
          minDate: '2018-01-01',
          maxDate: '2050-12-31',
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          progressList: [],
          display_files : false,
          file: null,
        }
    },
    created() {
        this.initFiles({type:"progress"}); 
        this.prgValue = "";
        if(!!this.task_id)
        {
          this.getPrg(this.task_id).then((res) => {
            if(res == "success") {
              if(this.taskProgress.length > 3)
              {
                this.progressList = this.taskProgress.slice(0, 3);
              } else {
                this.progressList = this.taskProgress;
              }
            }
          })
        }
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
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('progress', ['taskProgress']),
        ...mapGetters('fileUpload', ['progressFiles']),
        dateRange: {      
          get: function() {
            let dateRange = {
              startDate: "",
              endDate: "",
            }
            dateRange.startDate = this.year + "/" + this.month + "/" + this.day;
            dateRange.endDate = this.year + "/" + this.month + "/" + this.day;
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
        }
    },
    methods: {
        ...mapActions('progress', ['getProgress', 'addProgress']),
        ...mapActions('fileUpload', ['initFiles', 'fileUpload', 'deleteFileUploadById']),
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
                  "pr_parent" :  this.task_id,
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
                  "pr_parent" :  this.task_id,
                  "pr_parent_type" : 2,
                  "pr_percent" : 0,
                  "pr_status" : 1,
                  "pr_description" : this.prgValue,
                  "pr_start_date" : progressDate,
                  "pr_end_date" : null,
                  "pr_uploaded_file": files.toString(),
                }
              }
              const addedProgress = await this.addProgress({ ...progressValue });
              this.limitProgress = false;
              this.progress_note = false;
              this.prgValue = "";
            }
        },    
        handle_input(prop) {
            this.prgValue = prop.prgValue;
            this.enableSubmitBtn = prop.enableSubmitBtn;
            this.showAlertForScoreDescription = false;
        },
        progressToggle(prop) {
          this.limitProgress = prop;
          if(this.limitProgress == true)
          {
            if(this.taskProgress.length > 3) {
                this.progressList = this.taskProgress.slice(0, 3);
            } else {
                this.progressList = this.taskProgress;
            }
          } else if(this.limitProgress == false)
          {
            this.progressList = this.taskProgress;
          }
        },
        async getPrg(taskId) {
          let prgBody = {
            "pr_parent": taskId, 
            "pr_parent_type": 2
          }
          const res = await this.getProgress(prgBody);
          return res;
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
    }
}
</script>

<style>
.right_userInfo_flex {
  width: 100%;
}
.right_progress_userXiaoMeng {
  padding: 10px;
}
.right_input_progress {
  padding: 10px;
  cursor: pointer !important;
  width: 100%;
  padding-left: 0px;
  padding-right: 0px;
}
.right_input_progress_remove {
  display: none !important;
}
.right_input_progress_sheet {
  border: 1px solid #9aa6b2 !important;
  padding: 10px;
}
.right_progressText {
  font-size: 14px !important;
  color : rgb(162 157 157) !important;
}
.noteBook {
  width: 100% !important;
  height: 290px;
}
.right_progress_notebook {
  height: 100% !important;
  border: 0px solid #aca6a6 !important;
}
.right_progress_notebook_header {
  height: 40px !important;
  background-color: white !important;
  padding: 0px 5px !important;
  border: 1px solid #a9b8bf;
  border-bottom: 0px !important;
}
.right_progress_notebook_icon {
  font-size: 20px !important;
  color: #1687d9 !important;
  cursor: pointer;
  padding: 7px;
}
.progressSubmitLayout {
  width: 100%;
  margin: 0px;
  position: relative;
  top: 10px;
  background-color: #f5f8fa;
  padding: 6px 8px 8px 8px;
}
.paperClip {
  color: #647481 !important;
  font-size: 18px !important; 
}
.annuse {
  color: #647481;
  font-size: 15px;
}
.warningScoreDesc {
  font-size: 14px;
  color: red;
  float: right;
}
.toggleBtnPrg {
  width: 100%;
  background-color: #f2f8fd !important;
  box-shadow: none;
  border-radius: 30px;
  color: #8a8a8a;
  height: 30px;
  margin: 10px 0 20px 0;
  line-height: 30px;
}
.prgBtn {
  color: #8a8a8a !important;
  font-size: 12px !important;
}
.right_progress_info {
  background-color: white;
  margin-top: 20px;
}
.right_progress_notebook_icon:hover  {
  background: rgb(222 249 249);
  border-radius: 2px;
}
.right_progress_notebook_menu {
  box-shadow: none !important;
  border-bottom: 1px solid #d1d7d7 !important;
  border-left: 1px solid blue !important;
  border-right: 1px solid blue !important;
  border-top: 1px solid blue !important;
}
.right_progress_toolbarItems {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  border-bottom: 1px solid #d0d6d8;
}
.right_progress_toolbarItems_btn {
  background-color: white !important;
  width: 38px !important;
  font-size: 14px !important;
  color: grey !important;
  box-shadow: none !important;
}
.right_progress_toolbarItems_btn:hover {
  background-color: #dee9ea !important;
}
.right_progress_textField {
  height: calc(100% - 70px) !important;
  border-left: 1px solid blue !important;
  border-right: 1px solid blue !important;
  border-bottom: 1px solid blue !important;
}
.right_progress_textarea {
  padding: 10px !important;
  margin: 0px !important;
  padding-bottom: 0px !important;
  height: 100%;
}
.right_yellow_userInfo_flex {
  width: 100%;
  padding: 10px;
}
.right_yellow_useraccount {
  padding: 10px;
  padding-top: 0px;
  padding-bottom: 0px;
}
.right_yellow_useraccount_time {
  width: 100%;
}
.right_xiaomeng {
  width: 100%;
}
.right_progress_useraccount {
  color: #f5b333 !important;
}
.right_progress_xiaoMeng {
  color: #f5b333;
  font-size: 15px;
}
.time_user {
  margin-right: 10px;
  font-size: 12px;
  color: #aeadad;
}
.time_user_progress {
  font-size: 14px;
  color: grey;
}
.title_user {
  font-size: 14px;
  color: grey !important;
}
.right_test_xiaoMeng {
  font-size: 15px;
  color: #010101;
}
.right_yellow_test_progress {
  padding: 14px;
}
.progress_menu_icons {
  font-size: 18px !important;
}
.limitOperators {
  width: 100%;
}
.limitOperators:hover .listItems {
  color: blue !important;
}
.limitOperators:hover .icon_down {
  color: blue !important;
}
.listItems {
  font-size: 12px;
  color: grey;
}
.icon_down {
  font-size: 13px !important;
  transition: all .5s ease;
}
.icon_down_rotate {
  transform: rotate(180deg);
}
.card_text {
  padding: 3px !important;
  font-size: 12px;
}
.card_text_pre {
  padding: 3px !important;
}
.progress_bottom_like {
  font-size: 12px;
  color: rgb(102, 117, 127);
}
.btn_2_replay {
  color: rgb(5 90 176) !important;
  font-size: 14px !important;
}
.btn_2_replay:hover .addReview {
  cursor: pointer;
  color: rgb(29, 134, 240) !important;
}
.addReview_plus {
  font-size: 18px !important;
  color: rgb(5 90 176) !important;
}
.btn_2_replay:hover .addReview_plus {
  color: rgb(29, 134, 240) !important;
}
.btn_2_replay_end {
  font-size: 14px !important;
}
.progress_bottom_replay-flex {
  width: 100%;
}
.progress_bottom_replay-flex-layout {
  width: 100%;
  margin: 0px;
  height: 100%;
}
.flex_contain {
  width: 100%;
  margin-bottom: 30px;
}
.flex_contain-layout {
  width: 100%;
  margin: 0px;
  padding: 0px 5px;
  height: 100%;
}
.cursor {
  cursor: pointer;
}
.end {
  display: flex;
  justify-content: flex-end;
}
.replay {
  font-size: 15px;
  font-weight: 600;
  color: rgb(59, 66, 71)
}
.replay_edit {
  font-size: 15px !important;
  color: rgb(29, 134, 240);
}
.prgSubmitBtn {
  position: relative;
  bottom: 45px;
  left: 295px;
}
.pleft-10 {
  padding-left: 10px;
}
.w100 {
  width: 100%;
}
.p_10 {
  padding: 10px;
}
.toggleBtnPrg {
  width: 100%;
  background-color: #f2f8fd !important;
  box-shadow: none;
  border-radius: 30px;
  color: #8a8a8a;
  height: 30px;
  margin: 10px 0 20px 0;
  line-height: 30px;
}
.prgBtn {
  color: #8a8a8a !important;
  font-size: 12px !important;
}
.p_0 {
  padding: 0px;
}
.content {
  box-shadow: inset 0 1px 2px rgb(10 10 10 / 10%);
  border-top: 1px solid #f1f1f1 !important;
  border: 1px solid #a9b8bf;
  display: block;
  max-width: 100%;
  min-width: 100%;
  padding: 0.625em;
  resize: vertical;
  background-color: white;
  height: 160px;
  overflow: auto;
}
.content .ProseMirror {
  outline: none;
}
.textEditorIcon {
  font-size: 1.1em !important; 
  color: #83909a !important;
}
.textEditorSpan {
  font-size: .9em !important; 
  color: #83909a !important;
}
.pr_10 {
  padding-right: 10px;
  border: 1px solid #a9b8bf;
  border-bottom: 0px !important;
}
.pl_10 {
  padding-left: 10px;
  border: 1px solid #a9b8bf;
  border-bottom: 0px !important;
}
.mr_5 {
  margin-right: 5px;
  transition: all .5s ease;
  padding: 2px;
}
.mr_5:hover {
  background-color: #d9e0e5;
}
.emptyReview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 20px) !important;
  padding: 20px 0px;
  border: 1px dashed rgb(197, 197, 197);
  margin: 6px auto 0px;
  height: 89px;
}
.mt_5 {
  margin-top: 5px;
}
.mr_5 {
  margin-right: 5px;
}
.progress_time .form-control{
  height: 100%;
  border: 0px;
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.progress_time .daterangepicker {
  position: absolute;
  left: 234px !important;
}
</style>