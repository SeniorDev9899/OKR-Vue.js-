<template>
<v-flex class="progress_bottom_replay-flex">
    <v-layout align-center justify-start column class="progress_bottom_replay-flex-layout">

        <v-flex class="flex_contain" style="margin-bottom: 15px;">
            <v-layout align-center justify-start row class="flex_contain-layout">
                <v-flex class="btn_2_replay cursor" @click = "replayKR" >
                  <v-icon class = "addReview addReview_plus" style="">mdi-plus</v-icon>
                  <span class = "addReview">添加复盘</span>
                </v-flex>
                <v-flex v-if = "reviewArray.length != 0" class="btn_2_replay_end cursor end">
                  <!-- 时间筛选
                  <v-icon style="font-size: 14px;">
                    mdi-calendar-month-outline
                  </v-icon> -->
                  <!-- <date-range-picker
                      ref="picker"
                      opens="center"
                      class="review_date_picker"
                      :locale-data="{ 
                        firstDay: 1, 
                        format: 'yyyy-mm-dd',
                        applyLabel: '确定',
                        cancelLabel: '取消',
                        daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                        monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                      }"
                      :minDate="minDate" :maxDate="maxDate"
                      v-model="dateRange"
                      :ranges="false"
                  >
                      <template v-slot:input="picker" style="min-width: 350px;">
                        <span>时间筛选<v-icon style="font-size: 14px;">mdi-calendar-month-outline</v-icon></span>
                      </template>
                  </date-range-picker> -->
                </v-flex>
            </v-layout>
        </v-flex>
        <ReviewItem 
            v-if = "reviewArray.length != 0" 
            v-for = "item in reviewArray"
            :key = "item.re_id"
            :id = "item.re_id"
            :key_id = "kr_id"
            :object_id = "object_id"
            :reviewInfo = "item"
            :timestamp = "item.created_at"
            @displayReviewModal = "handle_displayReviewModal"
        />
        <!-- <v-layout class = "w100" v-if = "(kr_id && review.length != 0 && !limitReview) || (object_id && objectReview.length != 0 && !limitReview)" align-center justify-center>
            <v-flex>
                <v-btn @click = "reviewToggle(true)" class = "toggleBtnPrg">
                  <span class = "prgBtn">展开所有进展</span>
                  <v-icon class = "prgBtn" style = "font-size: 15px !important;">mdi-chevron-up</v-icon>
                </v-btn>
              </v-flex>
        </v-layout>
        <v-layout class = "w100" v-if = "(kr_id && review.length != 0 && limitReview) || (object_id && objectReview.length != 0 && limitReview)" align-center justify-center>
            <v-flex>
                <v-btn @click = "reviewToggle(false)" class = "toggleBtnPrg">
                  <span class = "prgBtn">放下所有的进步</span>
                  <v-icon class = "prgBtn" style = "font-size: 15px !important;">mdi-chevron-down</v-icon>
                </v-btn>
            </v-flex>
        </v-layout> -->

        <v-flex v-if = "(kr_id && review.length == 0) || (object_id && objectReview.length == 0)" class = "emptyReview">
            <v-layout align-center justify-center column>
                <v-flex><span style = "color: rgb(191, 195, 199);font-size: 20px;">尚未复盘过</span></v-flex>
                <v-flex class = "mt_5" style = "left: 7px;position: relative;"><v-icon style = "font-size: 18px;background-color:rgb(40, 121, 255);top:1px;border-radius:50%;color:white;">mdi-progress-question</v-icon><span class = "mr_5" style = "color:rgb(40, 121, 255);font-size:14px;letter-spacing:-1px;">了解复盘的重要性</span></v-flex>
            </v-layout>
        </v-flex>

    </v-layout>
</v-flex>
</template>

<script>
import ReviewItem from './ReviewItem.vue';
import DateRangePicker from 'vue2-daterange-picker';
import { mapGetters, mapActions } from 'vuex';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

export default {
    props: ['kr_id', 'object_id'],
    components: {
        ReviewItem,
        DateRangePicker
    },
    data() {
        return {
            reviewArray: [],
            limitReview: true,
            // minDate: '2018-01-01',
            // maxDate: '2050-12-31',
            // months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],      
            startDate: null,
            endDate: null,
        }
    },
    created() {
        if(!!this.kr_id)
        {
          this.initReview({ mode: "kr" });
          this.fetchReview({ mode: "kr" , id: this.kr_id }).then((res) => {
            if(res == "success") {
              // if(this.review.length > 5)
              // {
              //     this.reviewArray = this.review.slice(0, 5);
              // } else {
                  this.reviewArray = this.review;
              // }
            }
          })
        } else if(!!this.object_id) {
          this.initReview({ mode: "ob" });
          this.fetchReview({ mode: "ob" , id: this.object_id }).then((res) => {
            if(res == "success") {
              // if(this.objectReview.length > 5)
              // {
              //     this.reviewArray = this.objectReview.slice(0, 5);
              // } else {
                  this.reviewArray = this.objectReview;
              // }
            }
          })
        }
        let date = new Date();
        let startMonth = date.getMonth() + 1;
        if(startMonth > 3) {
          startMonth = startMonth - 2;
        } else {
          startMonth = startMonth;
        }
        if(startMonth < 10) {
          startMonth = "0" + startMonth;
        }
        let endMonth = date.getMonth() + 2;
        if(this.endDate > 12) {
          endMonth = endMonth - 3;
        } else {
          endMonth = endMonth;
        }
        if(endMonth < 10) {
          endMonth = "0" + endMonth;
        }
        let day = date.getDate();
        if(day < 10) {
          day = "0" + day;
        }
        this.startDate = date.getFullYear() + "-" + startMonth + "-" + day;
        this.endDate = date.getFullYear() + "-" + endMonth + "-" + day;
    },
    computed: {
        ...mapGetters('review', ['review', 'objectReview']),
    },
    methods: {
        ...mapActions('review', ['initReview', 'getReview']),
        replayKR() {
          let reviewInfo;
          if(!!this.kr_id)
          {
            reviewInfo = {
                kr_id: this.kr_id,
                description: "",
                problem: null,
                problems: [],
                collaborators: null
            }
          } else if(!!this.object_id)
          {
            reviewInfo = {
                object_id: this.object_id,
                description: "",
                problem: null,
                problems: [],
                collaborators: null
            }
          }
          this.$emit("displayReviewModal", {value: reviewInfo});
        },
        handle_displayReviewModal(prop) {
          if(!!this.kr_id) {
            this.$emit("displayReviewModal", { mode: "kr", value: prop }); 
          } else if(!!this.object_id) {
            this.$emit("displayReviewModal", { mode: "object", value: prop }); 
          }
        },
        reviewToggle(prop) {
            this.limitReview = prop;
            if(this.limitReview == true)
            {
              if(this.review.length > 5)
              {
                this.reviewArray = this.review.slice(0, 5);
              } else {
                this.reviewArray = this.review;
              }
            } else {
                this.reviewArray = this.review;
            }
        },
        async fetchReview(prop) {
          let reviewInfo;
          if(prop.mode == "kr")
          {
            reviewInfo = {
                "re_parent" : prop.id,
                "re_parent_type" : 1,
            }
          } else if(prop.mode == "ob")
          {
            reviewInfo = {
              "re_parent" : prop.id,
              "re_parent_type" : 0,
            }
          }
          const res = await this.getReview(reviewInfo);
          return res;
        },
    }
}
</script>

<style>
.right_progress_info {
  background-color: white;
  margin-top: 20px;
}
.right_userInfo_flex {
  width: 100%;
}
.right_userInfo_laypadding {
  padding: 10px;
  width: 100%;
}
.right_userInfo_layflex {
  padding-right: 50px;
  cursor: pointer !important;
}
.right_score_writesheet {
  background-color: rgb(56, 186, 115) !important;
  border-radius: 30px !important;
  padding: 1px 10px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.r_icon_score {
  font-size: 15px !important;
  color: white !important;
}
.r_icon_mesg {
  font-size: 15px !important;
  color: #9aa6b2 !important;
}
.r_score_writedown {
  font-size: 15px !important;
  color: white;
}
.right_message {
  font-size: 15px !important;
  color: #9aa6b2 !important;
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
}
.right_progress_notebook_icon:hover  {
  background: rgb(222 249 249);
  border-radius: 2px;
  padding: 7px;
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
.card_text {
  padding: 3px !important;
  font-size: 12px;
}
.progress_bottom_like {
  font-size: 12px;
  color: rgb(102, 117, 127);
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
.warningScoreDesc {
  font-size: 14px;
  color: red;
  float: right;
}
.w100 {
  width: 100%;
}
.p_10 {
  padding: 10px;
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
  font-size: 1.2em !important; 
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
.review_date_picker .daterangepicker {
  position: absolute !important;
  left: -172px !important;
  margin: 0px;
}
.review_date_picker .daterangepicker.openscenter:after, .review_date_picker .daterangepicker.openscenter:before {
  left: 0;
  right: 0;
  width: 0;
  margin-left: auto;
  margin-right: auto;
}
</style>