<template>
<!-- <v-sheet class="overflow-show rg_tg animate" :class="show ? 'rg_sec_1' : 'rg_sec_2'"> -->
<v-navigation-drawer v-model="show" absolute right temporary width="645" overlay-color="white" overlay-opacity="0" color="rgb(250, 251, 252)" class="kr_editor">

  <RightInfoHeader @closeRightNavigation="close" @deleteKrObject="handle_deleteKrObject" />

  <v-divider></v-divider>

  <v-sheet color="rgb(250, 251, 252)" class="right_sheet mt_10">
    <v-container align-start justify-start d-flex class="p_0">
      <v-layout align-center justify-start column class="p_0">
        <v-flex class="w100">
          <v-layout d-flex align-center justify-start class="right_userInfo_laypadding p_0">
            <v-flex align-center justify-start shrink style="padding-top: 5px;">
              <span class="right_kr2">KR{{ krOrder }}</span>
            </v-flex>
            <v-flex align-center justify-start grow>
              <v-layout d-flex align-center justify-start row class="w100 m_0">
                <v-flex shrink>
                  <span v-if="!krNameEdit" class="r_name">
                    <span v-if="krChangedName.length >30">{{krChangedName.slice(0, 30)}}...</span>
                    <span v-else>{{ krChangedName }}</span>
                  </span>
                  <span v-if="krNameEdit" class="right_title">
                    <input type="text" class="kr_name_edit" :value="krChangedName" @input="changeKrName" v-on:keyup.enter="closeKrNameEdit" />
                  </span>
                </v-flex>
                <v-flex class="edit" grow style="position:relative;display:flex;align-items:center;justify-content: flex-start;">
                  <ToolTipComponent tooltipText="编辑" direction="top">
                    <span :class="krNameEdit ? 'opa_0' : ''" @click="krNameEditEnable" style="position:absolute;top:0px;display:flex;">
                      <v-icon class="pencil cursorPointer">
                        mdi-grease-pencil
                      </v-icon>
                      <!-- <div class="edit_arrow"></div>
                        <span class="editTooltip">编辑</span> -->
                    </span>
                  </ToolTipComponent>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>

    <RightUserInfo :ob_status="obStatus" :kr_id="krId" :kr_owner="krOwner" :kr_name="krName" :kr_percent="krPercent" :kr_confidence="keyResult ? keyResult.kr_confidence : ''" :kr_period="kr_period" :kr="keyResult" @setPercentValue="handle_setPercentValue" @setConfidenceValue="handle_setConfidenceValue" @krDateRangeEmit="handle_krDateRangeEmit" @krNameChanged="handle_krNameChanged" @updateKeyresultOwner="handle_updateKeyresultOwner" />

    <RightKRScore :kr_score="krScore" :kr_score_description="kr_score_description" :kr_ta="kr_ta" @changeKrScore="handle_changeKrScore" @changeKrScoreDescription="handle_changeKrScoreDescription" @KrScoreUpdate="handle_krScoreUpdate" @krScoreUserUpdate="handle_krScoreUserUpdate" />

    <v-container align-center justify-start d-flex class="right_progress_info">
      <v-layout align-center justify-start column>
        <Tabs :progressLength="progress_length" :progressWindow="progressWindow" :interactiveWindow="interactiveWindow" :reviewWindow="reviewWindow" @displayProgressWindow="handle_displayProgressWindow" @displayInteractiveWindow="handle_displayInteractiveWindow" @displayReviewWindow="handle_displayReviewWindow" />
        <v-sheet v-if="progressWindow" class="right_info_progress w100" :class="progressWindow ? 'right_info_progress_add' : ''">
          <Progress :kr_id="krId" @progressLength="handle_progressLength" />
        </v-sheet>
        <!-- @limitProgress = "handle_limitProgress" :prgs = "progressLimitExist ? progressLimit : progress" -->
        <v-sheet v-if="interactiveWindow" class="right_info_progress w100" :class="interactiveWindow ? 'right_info_progress_add' : ''">
          <Interactive :kr_id="krId" />
        </v-sheet>
        <v-sheet v-if="reviewWindow" class="right_info_progress w100" :class="reviewWindow ? 'right_info_progress_add' : ''">
          <Review :kr_id="krId" @displayReviewModal="handle_displayReviewModal" />
        </v-sheet>
        <!-- Review Create Modal -->
        <!-- 查看创建模态 -->
        <ReviewModal ref="replay" />
      </v-layout>
    </v-container>

  </v-sheet>
</v-navigation-drawer>
<!-- </v-sheet> -->
</template>

<script>
import RightInfoHeader from '@/components/okrgoal/rightInfo/header/RightInfoHeader.vue';
import RightUserInfo from '@/components/okrgoal/rightInfo/userInfo/RightUserInfo.vue';
import RightKRScore from '@/components/okrgoal/rightInfo/krScore/RightKRScore.vue';
import Tabs from '@/components/okrgoal/rightInfo/tabs/Tabs.vue';
import Progress from '@/components/okrgoal/rightInfo/progress/Progress.vue';
import Interactive from '@/components/okrgoal/rightInfo/interactive/Interactive.vue';
import Review from '@/components/okrgoal/rightInfo/review/Review.vue';
import ReviewModal from '@/components/okrgoal/rightInfo/review/ReviewModal.vue';
import ToolTipComponent from "@/components/okrgoal/shared/ToolTipComponent.vue";
import {
  mapGetters,
  mapActions
} from "vuex";

export default {
  name: 'RightEditor',
  props: {
    kr: {
      type: Object
    },
  },
  components: {
    RightInfoHeader,
    RightUserInfo,
    RightKRScore,
    Tabs,
    Progress,
    Interactive,
    Review,
    ReviewModal,
    ToolTipComponent,
  },
  data() {
    return {
      // State for Right Editor Component Show
      show: false,

      // State to store Object ID
      obId: null,

      // State to store Object Status
      obStatus: null,

      // State to store KeyResult Info
      keyResult: null,

      // State to store Keyresult ID
      krId: null,

      // State to store Keyresult Owner
      krOwner: null,

      // State to store Keyresult Name
      krName: "",

      krChangedName: "",

      krNameEdit: false,

      // State to store Keyresult Order
      krOrder: 0,

      // State for User Info
      krPercent: null,
      kr_start_date: null,
      kr_end_date: null,
      kr_period: null,

      // State for KR Score
      krScore: "评分",
      kr_score_description: "请输入评分说明",
      kr_ta: null,

      // State to store Progress's Length
      progress_length: 0,

      // State to store KR Progress and status
      progressLimitExist: false,
      progressLimit: [],

      // State to store status of progressWindow
      progressWindow: true,

      // State to store status of interactiveWindow
      interactiveWindow: false,

      // State to store status of reviewWindow
      reviewWindow: false,
    }
  },
  created() {
    this.krNameEdit = false;
    this.progressWindow = true;
    this.interactiveWindow = false;
    this.reviewWindow = false;
  },
  computed: {
    ...mapGetters('progress', ['progress']),
  },
  methods: {
    // Vuex Store Functions
    ...mapActions("okr", ["updateKeyResult", "updateKeyResultByRating", "deleteKeyResult"]),
    ...mapActions('progress', ['getProgress', 'addProgress']),

    // Close Right Panel
    close() {
      this.show = false;
    },

    // Open Right Editor Component
    open(prop) {
      this.show = true;
      this.progressWindow = true;
      this.interactiveWindow = false;
      this.reviewWindow = false;
      this.krNameEdit = false;
      this.keyResult = prop.krObj;
      this.obId = prop.obId;
      this.obStatus = prop.obStatus;
      this.krId = this.keyResult.kr_id;
      this.krOwner = this.keyResult.kr_owner;
      // this.getPrg(this.krId);
      this.krChangedName = this.keyResult.kr_name;
      this.krPercent = this.keyResult.kr_completion;
      this.krOrder = this.keyResult.kr_order;
      if (this.keyResult.kr_score) {
        this.krScore = this.keyResult.kr_score;
      } else {
        this.krScore = "0";
      }
      if (this.keyResult.kr_score_description) {
        this.kr_score_description = this.keyResult.kr_score_description;
      } else {
        this.kr_score_description = "";
      }
      if (this.keyResult.kr_ta) {
        this.kr_ta = this.keyResult.kr_ta;
      } else {
        this.kr_ta = null;
      }
      this.kr_start_date = this.keyResult.kr_start_date;
      this.kr_end_date = this.keyResult.kr_end_date;
      this.kr_period = {
        start_date: this.kr_start_date,
        end_date: this.kr_end_date,
      }
    },

    // Get All Progress with Keyresult ID    
    // getPrg(krId) {
    //   let prgBody = {
    //     "pr_parent": krId,
    //     "pr_parent_type": 1
    //   }
    //   this.getProgress(prgBody);
    // },

    // Delete OKR
    handle_deleteKrObject(prop) {
      if (prop == true) {
        this.deleteKeyResult(this.keyResult);
        this.show = false;
      }
    },

    // Handle User Info Percent Value
    handle_setPercentValue(prop) {
      this.keyResult.kr_completion = prop.pr_percent;
      prop.pr_parent = this.keyResult.kr_id;
      this.krPercent = this.keyResult.kr_completion;
      let obj = {
        kr_id: this.keyResult.kr_id,
        kr_completion: prop.pr_percent
      }
      let payload = {
        obj: obj,
        kr: this.keyResult
      }

      this.updateKeyResult(payload);
      this.addProgress(prop);
    },

    // Handle Keyresult Owner
    handle_updateKeyresultOwner(prop) {
      this.keyResult.kr_owner = prop;
      this.krOwner = prop;
      let obj = {
        kr_id: this.keyResult.kr_id,
        kr_owner: prop
      };
      let payload = {
        obj: obj,
        kr: this.keyResult,
      }
      this.updateKeyResult(payload);
    },

    // Handle User Info Confidence Value
    handle_setConfidenceValue(prop) {
      this.keyResult.kr_confidence = prop;
      this.updateKeyResultByRating(this.keyResult);
    },

    // Handle User Info Start and End Date
    handle_krDateRangeEmit(prop) {
      this.kr_period = {
        start_date: prop.startDate,
        end_date: prop.endDate,
      };
      let obj = {
        kr_id: this.keyResult.kr_id,
        kr_start_date: prop.startDate,
        kr_end_date: prop.endDate,
      }
      this.keyResult.kr_start_date = prop.startDate;
      this.keyResult.kr_end_date = prop.endDate;
      let payload = {
        obj: obj,
        kr: this.keyResult,
      }
      this.updateKeyResult(payload);
    },

    // Handle Right KR Score Value Change
    handle_changeKrScore(prop) {
      this.krScore = prop;
    },

    // Handle Right KR Score Description Value Change
    handle_changeKrScoreDescription(prop) {
      if (prop == " ") {
        this.kr_score_description = "暂无评分说明";
      } else {
        this.kr_score_description = prop;
      }
    },

    // Handle KR Score Values Update
    handle_krScoreUpdate(prop) {
      this.krScore = parseFloat(prop.kr_score).toFixed(2);
      this.kr_score_description = prop.kr_desc;
      let obj = {
        kr_id: this.keyResult.kr_id,
        kr_score: prop.kr_score,
        kr_score_description: prop.kr_desc
      }
      this.keyResult.kr_score = parseFloat(prop.kr_score).toFixed(2);
      this.keyResult.kr_score_description = prop.kr_desc;
      let payload = {
        obj: obj,
        kr: this.keyResult
      }
      this.updateKeyResult(payload);
    },

    // Handle KR Progress limit
    handle_limitProgress(prop) {
      this.progressLimitExist = prop;
      if (this.progress.length > 5) {
        this.progressLimit = this.progress.slice(0, 5);
      } else {
        this.progressLimit = this.progress;
      }
    },

    // Handle Interactive Window Display
    handle_displayInteractiveWindow() {
      this.interactiveWindow = true;
      this.progressWindow = false;
      this.reviewWindow = false;
    },

    // Handle Progress Window Display
    handle_displayProgressWindow() {
      this.progressWindow = true;
      this.interactiveWindow = false;
      this.reviewWindow = false;
    },

    // Handle Review Window Display
    handle_displayReviewWindow() {
      this.reviewWindow = true;
      this.progressWindow = false;
      this.interactiveWindow = false;
    },

    // Handle Review Modal Display
    handle_displayReviewModal(prop) {
      let param = {
        kr_order: this.krOrder,
        kr_name: this.krChangedName,
        type: prop.mode,
        value: prop.value,
      }
      this.$refs.replay.open(param);
    },

    // Handle Keyresult Name Change
    handle_krNameChanged(prop) {
      this.krName = prop
    },
    changeKrName(ev) {
      this.krChangedName = ev.target.value;
    },
    closeKrNameEdit() {
      if (this.krChangedName !== "") {
        this.keyResult.kr_name = this.krChangedName;
        let obj = {
          kr_id: this.keyResult.kr_id,
          kr_name: this.krChangedName,
        };
        let payload = {
          obj: obj,
          kr: this.keyResult,
        };
        this.updateKeyResult(payload);
      }
      this.krNameEdit = false;
    },
    krNameEditEnable() {
      this.krNameEdit = true;
    },
    handle_krScoreUserUpdate(prop) {
      this.keyResult.kr_ta = prop;
      this.kr_ta = prop;
      let obj = {
        kr_id: this.keyResult.kr_id,
        kr_ta: this.keyResult.kr_ta
      }
      let payload = {
        obj: obj,
        kr: this.keyResult
      }
      this.updateKeyResult(payload);
    },
    handle_progressLength(prop) {
      this.progress_length = prop;
    }
  }
}
</script>

<style scoped>
.animate {
  transition: all 1s ease;
}

.m_0 {
  margin: 0px;
}

.p_0 {
  padding: 0px !important;
}

.rg_tg {
  position: absolute;
  z-index: 100;
  right: -5rem;
  height: 100%;
  over-flow-y: hidden;
  padding: 0px 10px 0px 20px;
}

.rg_sec_1 {
  width: 37rem !important;
  right: 0rem !important;
}

.rg_sec_2 {
  width: 0rem !important;
}

.right_sheet {
  padding: 0px 10px 0px 20px;
}

.right_kr2 {
  background: rgb(227, 244, 255);
  text-align: center;
  color: rgb(29, 134, 240);
  border-radius: 22px;
  line-height: 12px;
  padding: 5px 10px;
  margin-right: 12px;
  height: 12px;
}

.right_title {
  font-size: 18px;
}

.right_heart_two {
  color: rgb(227, 230, 232);
}

.r_score_value {
  color: rgb(12, 201, 145);
  font-size: 12px;
}

.r_score {
  color: #9aa6b2;
  font-size: 12px;
}

.r_icon {
  color: #9aa6b2;
  margin-right: 3px;
  font-size: 13px;
}

.interactiveList {
  width: 100%;
  cursor: pointer;
}

.interactiveList:hover .listItems {
  color: blue !important;
}

.interactiveList:hover .icon_down {
  color: blue !important;
}

.listItems {
  font-size: 12px;
  color: grey;
}

.icon_down {
  font-size: 13px;
  transition: all .5s ease;
}

.icon_down_rotate {
  transform: rotate(180deg);
}

.interactiveListContentFirst {
  width: 100%;
}

.mon_day {
  font-size: 10px;
  color: grey;
}

.hr_min {
  font-size: 14px;
}

.r_name {
  color: rgb(51, 56, 61) !important;
  font-size: 20px !important;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, \\5FAE\8F6F\96C5\9ED1, Arial, sans-serif;
}

.w100 {
  width: 100%;
}

.right_progress_info {
  background-color: white;
  margin-top: 20px;
}

.kr_name_edit {
  border: 1px solid rgb(199 215 218);
  padding: 0px 5px;
  border-radius: 4px;
  width: 500px;
}

.opa_0 {
  display: none !important;
}

.pencil {
  font-size: 10px !important;
  margin-left: 5px;
  color: #aa9797;
  position: relative;
  opacity: 0;
  width: 23px;
  height: 23px;
  padding: 2px;
}

.pencil:hover {
  border-radius: 10px;
  background-color: #f2f6f6;
}

.edit_arrow {
  position: relative;
  bottom: 15px;
  right: 12px;
  width: 0px;
  height: 0px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid rgb(100, 100, 100);
  opacity: 0;
  transition: all .3s ease;
}

.editTooltip {
  opacity: 0;
  position: relative;
  bottom: 29px;
  right: 38px;
  transition: all .3s ease;
  padding: 0px 7px;
}

.right_userInfo_laypadding:hover .pencil {
  display: flex !important;
}

.right_userInfo_laypadding {
  padding: 10px;
  width: 100%;
}

.edit {}

.displayFlex {
  display: flex !important;
  align-items: center;
}

.edit:hover .editTooltip {
  opacity: 1;
  background-color: rgb(100, 100, 100);
  border-radius: 3px;
}

.edit:hover .edit_arrow {
  opacity: 1 !important;
}

.kr_editor {
  box-shadow: none;
  border: 3px solid;
  height: calc(100% - 40px) !important;
  position: fixed;
  top: 40px !important;
  z-index: 10;
}

.right_info_progress {
  transition: visibility 0s, opacity 1s linear;
  visibility: hidden;
  opacity: 0;
}

.right_info_progress_add {
  visibility: visible;
  opacity: 1;
}
</style>
