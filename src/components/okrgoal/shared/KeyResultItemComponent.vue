<template>
  <v-list-item class="key-result-item px-0" ref="krRef">
    <div class="kr-indicator-item">
      <v-icon aria-hidden="false" class="" style="font-size: 14px;">
        mdi-menu
      </v-icon>
    </div>
    <v-layout>
      <v-flex class="kr-item-container d-flex justify-start align-center">
        <div class="d-flex justify-start align-center">
          <a class="kr-index"> KR{{ keyResult.kr_order }} </a>
          <a class="kr-name-edit d-flex justify-start">
            <span class="kr-name d-flex align-center justify-start" v-if="!krNameEdit" @click="selectKR(keyResult)"
              ><ToolTipComponent
                :content="keyResult.kr_name"
                :tooltipText="keyResult.kr_name"
                direction="top"
            /></span>
            <v-icon
              v-if="!krNameEdit && !stopAllEdit"
              aria-hidden="false"
              style="font-size: 16px;"
              outlined
              @click="krNameEditEnable"
            >
              mdi-tooltip-edit
            </v-icon>
            <span class="kr-edit-container" v-if="krNameEdit">
              <input
                type="text"
                class=""
                :value="keyResult.kr_name"
                @input="changeKrName"
                v-on:keyup.enter="closeKrNameEdit"
              />
            </span>
          </a>
        </div>
        <div class="actions">
          <v-layout class="d-flex justify-start align-center">
            <div class="user-name">
              <span v-if="stopAllEdit">
                <v-icon
                  aria-hidden="true"
                  class="mdi_accout"
                  style="font-size:18px; color: #89919f;"
                >
                  mdi-account-outline
                </v-icon>
                <ToolTipComponent
                  :content="keyResult.kr_owner | username"
                  direction="top"
                  :tooltipText="keyResult.kr_owner | username"
                />
              </span>
              <v-menu offset-y v-if="!stopAllEdit">
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on">
                    <v-icon
                      aria-hidden="true"
                      class="mdi_accout"
                      style="font-size:18px; color: #89919f;"
                    >
                      mdi-account-outline
                    </v-icon>
                    <ToolTipComponent
                      :content="keyResult.kr_owner | username"
                      direction="top"
                      :tooltipText="keyResult.kr_owner | username"
                    />
                  </span>
                </template>
                <v-list class="py-0">
                  <v-list-item class="px-0">
                    <UserPicker @pick="(param) => pickUser(param)" />
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div class="date-range" v-if="!isSimple && !stopAllEdit">
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
                :dateRange="dateRange"
                :ranges="false"
                @update="saveCycle"
                @change="changeCycle"
              >
                <template v-slot:input="picker" style="min-width: 350px;">
                  {{ picker.startDate | formatDate }} - {{ picker.endDate | formatDate }}
                </template>
              </date-range-picker>
            </div>
            <div
              class="rating-progress-container d-flex justify-space-between align-center"
            >
              <span v-if="!stopAllEdit">
                <ToolTipComponent
                  content=""
                  direction="top"
                  tooltipText="修改信心指数"
                >
                  <RatingPopupComponent
                    :selected="keyResult.kr_confidence"
                    v-on:selectRating="(param) => selectRating(param)"
                  >
                    <div class="rating d-flex align-center">
                      <v-icon
                        aria-hidden="false"
                        class="mr-1"
                        style="font-size: 18px; color: #FFCA2A;"
                      >
                        mdi-heart
                      </v-icon>
                      <span class="mr-1">{{ keyResult.kr_confidence }}</span>
                      <span>
                        分
                      </span>
                    </div>
                  </RatingPopupComponent>
                </ToolTipComponent>
              </span>
              <span v-else>
                <ToolTipComponent
                  content=""
                  direction="top"
                  tooltipText="修改信心指数"
                >
                  <div class="rating d-flex align-center">
                    <v-icon
                      aria-hidden="false"
                      class="mr-1"
                      style="font-size: 18px; color: #FFCA2A;"
                    >
                      mdi-heart
                    </v-icon>
                    <span class="mr-1">{{ keyResult.kr_confidence }}</span>
                    <span>
                      分
                    </span>
                  </div>
                </ToolTipComponent>
              </span>
              
              <ToolTipComponent
                content=""
                direction="top"
                tooltipText="更新KR完成度"
              >
                <div class="progress">
                <a
                  class="d-flex justify-space-between align-center"
                  @click="openDialog"
                >
                  <v-progress-circular
                    :value="0"
                    color="rgb(40, 121, 255)"
                    size="20"
                    v-if="keyResult.kr_completion_status != 0 && keyResult.kr_completion_status != 1 && keyResult.kr_completion_status != 2"
                  ></v-progress-circular>
                  <v-progress-circular
                    :value="keyResult.kr_completion"
                    color="rgb(40, 121, 255)"
                    size="20"
                    v-if="keyResult.kr_completion_status == 0"
                  ></v-progress-circular>
                  <v-progress-circular
                    :value="keyResult.kr_completion"
                    color="rgb(246, 189, 22)"
                    size="20"
                    v-if="keyResult.kr_completion_status == 1"
                  ></v-progress-circular>
                  <v-progress-circular
                    :value="keyResult.kr_completion"
                    color="rgb(240, 94, 94)"
                    size="20"
                    v-if="keyResult.kr_completion_status == 2"
                  ></v-progress-circular>
                  <span class="ml-2">{{ keyResult.kr_completion }}%</span>
                </a>
              </div>
              </ToolTipComponent>
            </div>
            <div class="score-content" v-if="!isSimple">
              <div class="" @click="showScoreModal" v-if="keyResult.kr_score == null">
                <v-icon
                  aria-hidden="true"
                  class="mdi_accout mr-1"
                  style="font-size:18px; color: #89919f;"
                >
                  mdi-circle-outline
                </v-icon>
                <span style="font-size:12px;cursor: pointer;">评分</span>
              </div>
              <div @click="showScoreModal" v-if="keyResult.kr_score != null">
                <span 
                  v-if="keyResult.kr_score >= 0.7 && keyResult.kr_score <= 1" 
                  style="
                    color:rgb(40, 121, 255);
                    background-color:rgba(40, 121, 255, 0.3);
                    padding:2px 4px;
                    border-radius:5px;
                    cursor: pointer;
                  "
                >
                  {{keyResult.kr_score}}分
                </span>
                <span 
                  v-if="keyResult.kr_score < 0.7 && keyResult.kr_score >= 0.4" 
                  style="
                    color:rgb(246, 189, 22);
                    background-color:rgba(246, 189, 22, 0.3);
                    padding:2px 4px;
                    border-radius:5px;
                    cursor: pointer;
                  "
                >
                  {{keyResult.kr_score}}分
                </span>
                <span
                  v-if="keyResult.kr_score < 0.4 && keyResult.kr_score >= 0" 
                  style="
                    color:rgb(240, 94, 94);
                    background-color:rgba(240, 94, 94, 0.3);
                    padding:2px 4px;
                    border-radius:5px;
                    cursor: pointer;
                  "
                >
                  {{keyResult.kr_score}}分
                </span>
              </div>
              <div class="score-modal">
                <div v-if="isScoreModal">
                  <div class="d-flex justify-space-between align-center kr-score-header">
                    <span>
                      @ta查看，ta可以通过系统通知修改kr分数
                    </span>
                    <span @click="closeScoreModal" style="cursor: pointer;">
                      <v-icon>mdi-close</v-icon>
                    </span>
                  </div>
                  <div class="px-6 py-4">
                    <div class="d-flex justify-space-between align-center my-2">
                      <span class="left">评分</span>
                      <span class="right">
                        <input type="text" :class="scoreValError ? 'input-error' : ''" placeholder="请输入0-1间的数字，支持小数点后两位" v-model="scoreValue" @input="scoreChange" />
                      </span>
                    </div>
                    <div class="d-flex justify-space-between align-center my-2">
                      <span class="left">说明</span>
                      <span class="right">
                        <input type="text" placeholder="请输入评分说明" v-model="scoreComment" />
                      </span>
                    </div>
                    <div class="d-flex justify-start align-center my-2 pt-2">
                      <span class="mr-2">@ta查看</span>
                      <span v-for="user in scoreUsers" :key="user.id" class="mx-1">
                        <UserAvatar :name="user.loginName.substring(0, 1)" width='20px' height = '20px' />
                      </span>
                      <span class="ml-2">
                        <v-menu offset-y>
                          <template v-slot:activator="{ on, attrs }">
                            <span v-bind="attrs" v-on="on">
                              <v-icon>mdi-plus</v-icon>
                            </span>
                          </template>
                          <v-list class="py-0">
                            <v-list-item class="px-0">
                              <UserPicker @pick="(param) => pickScoreUser(param)" />
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </span>
                    </div>
                    <div class="d-flex justify-start align-center mt-2">
                      <v-spacer></v-spacer>
                      <v-btn class="close mr-4" text @click="closeScoreModal" depressed>取消</v-btn>
                      <v-btn class="save" text @click="saveScore" depressed>确定</v-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span class="ml-5" v-if="!stopAllEdit && keyResult.kr_owner == authUser.id">
              <ConfirmDialogComponent option="kr" v-on:click="(bool) => confirmClick(bool)">
                <v-icon
                  aria-hidden="false"
                  class="edit-dot-icon"
                  style="font-size: 14px;"
                >
                  mdi-delete
                </v-icon>
              </ConfirmDialogComponent>
            </span>
            <span v-else style="width:38px;"></span>
          </v-layout>
        </div>
      </v-flex>
    </v-layout>
    <!-- <PercentDialogComponent
      ref="percent"
      :percent="keyResult.kr_completion"
      :isAuto="0"
      v-on:savePercentValue="(param) => getPercentValue(param)"
    /> -->
    <NewPercentDialogComponent ref="percent" :percent="keyResult" :autoOption="0" @savePercentValue="(param) => getPercentValue(param)" :firstOptionPercentValue="firstValue" :secondOptionPercentValue="secondValue" />
  </v-list-item>
</template>

<script>
import ToolTipComponent from "@/components/okrgoal/shared/ToolTipComponent.vue";
import RatingPopupComponent from "@/components/okrgoal/shared/RatingPopupComponent.vue";
import PercentDialogComponent from "@/components/okrgoal/shared/PercentDialogComponent.vue";
import NewPercentDialogComponent from "@/components/okrgoal/shared/NewPercentDailogComponent.vue";
import ConfirmDialogComponent from "@/components/okrgoal/shared/ConfirmDialogComponent";
import UserPicker from '@/components/common/UserPicker.vue';
import UserAvatar from '@/components/common/UserAvatar.vue';
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import { mapGetters, mapActions } from "vuex";

export default {
  name: "KeyResultItemComponent",
  props: ["keyResult", "obId", "obStatus", "isSimple", "stopAllEdit", "disableEdit"],
  components: {
    ToolTipComponent,
    RatingPopupComponent,
    PercentDialogComponent,
    NewPercentDialogComponent,
    ConfirmDialogComponent,
    UserPicker,
    DateRangePicker,
    UserAvatar
  },
  data: () => ({
    percentValue: 0,
    krNameEdit: false,
    krChangedName: "",
    minDate: '2018-01-01',
    maxDate: '2050-12-31',
    isScoreModal: false,
    scoreValue: '',
    scoreComment: '',
    scoreUsers: [],
    scoreValError: false
  }),
  created() {},
  computed: {
    ...mapGetters('auth', ['authUser']),
    progressStatus: function() {
      // this.keyResult.kr_completion
    },
    dateRange: function() {
      return {
        startDate: this.keyResult.kr_start_date + ' 00:00:00',
        endDate: this.keyResult.kr_end_date + ' 00:00:00'
      }
    },
    firstValue: function() {
      // let value = 0;
      // let len = this.keyResult.ob_results.length;
      // this.keyResult.ob_results.map((result) => {
      //   value += result.kr_completion;
      // });
      // if(value != 0 && len != 0) {
      //   return Math.floor(value / len).toFixed(0);
      // }else {
      //   return 0;
      // }
      return 0;
    },
    secondValue: function() {
      // let value = 0;
      // let len = this.keyResult.ob_child_objects.length;
      // this.keyResult.ob_child_objects.map((result) => {
      //   value += result.ob_progress;
      // });
      // if(value != 0 && len != 0) {
      //   return Math.floor(value / len).toFixed(0);
      // }else {
      //   return 0;
      // }
      return 0;
    },
  },
  methods: {
    ...mapActions("okr", [
      "updateKeyResult",
      "updateKeyResultByRating",
      "deleteKeyResult",
      "getOkrs"
    ]),
    ...mapActions("progress", ["addProgress"]),
    scoreChange() {
      if(this.scoreValue != '' && this.scoreValue >= 0 && this.scoreValue <= 1) {
        this.scoreValError = false;
      }else{
        this.scoreValError = true;
      }
    },
    pickScoreUser(param) {
      this.scoreUsers.push(param.user);
    },
    saveScore() {
      let payload = {
        kr: this.keyResult,
        obj: {
          kr_id: this.keyResult.kr_id,
          kr_score: this.scoreValue,
          kr_score_description: this.scoreComment
        }
      }
      if(this.scoreValue != '' && this.scoreValue >= 0 && this.scoreValue <= 1) {
        this.updateKeyResult(payload);
        this.closeScoreModal();
      }else{
        this.scoreValError = true;
      }
    },
    closeScoreModal() {
      this.isScoreModal = false;
      this.scoreValError = false;
    },
    showScoreModal() {
      this.isScoreModal = true;
    },
    saveCycle(param) {
      let start = param.startDate;
      let end = param.endDate;
      start = new Date(start);
      end = new Date(end);
      start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
      end = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
      let obj = {
        kr_id: this.keyResult.kr_id,
        kr_start_date: start,
        kr_end_date: end,
      }
      let payload = {
        kr: this.keyResult,
        obj: obj
      }
      this.updateKeyResult(payload);
    },
    changeCycle(data) {
    },
    krNameEditEnable() {
      this.krNameEdit = true;
    },
    getPercentValue(param) {
      this.keyResult.kr_completion = param.pr_percent;
      param.pr_parent = this.keyResult.kr_id;
      let obj = {
        kr_id: this.keyResult.kr_id,
        kr_auto_completion: param.option,
        kr_completion: param.pr_percent,
      };
      let payload = {
        obj: obj,
        kr: this.keyResult,
      };
      this.keyResult.kr_completion_status = param.pr_status;
      this.updateKeyResult(payload);
      this.addProgress(param);
      this.getOkrs({});
    },
    confirmClick(bool) {
      this.deleteKeyResult(this.keyResult);
      this.getOkrs({})
    },
    closeKrNameEdit() {
      if (this.krChangedName !== "") {
        this.keyResult.kr_name = this.krChangedName;
        let obj = {
          kr_id: this.keyResult.kr_id,
          kr_name: this.keyResult.kr_name,
        };
        let payload = {
          obj: obj,
          kr: this.keyResult,
        };
        this.updateKeyResult(payload);
      }
      this.krNameEdit = false;
    },
    changeKrName(ev) {
      this.krChangedName = ev.target.value;
    },
    selectRating(param) {
      this.keyResult.kr_confidence = param;
      this.updateKeyResultByRating(this.keyResult);
    },
    openDialog() {
      if(!this.stopAllEdit) {
        this.$refs.percent.openDialog("kr_mode");
      }
    },
    selectKR(kr) {
      let KeyResult = {
        obId: this.obId,
        obStatus: this.obStatus,
        krObj: kr,
      };
      this.$emit("selectKR", KeyResult);
    },
    pickUser(param) {
      let obj = {
        kr_id: this.keyResult.kr_id,
        kr_parent_object: this.keyResult.kr_parent_object,
        kr_owner: param.user.id
      }
      this.keyResult.kr_owner = param.user.id;
      let payload = {
        obj: obj,
        kr: this.keyResult,
      };
      this.updateKeyResult(payload);
      this.keyResult.kr_owners.employeeName = param.user.employeeName;
    }
  }
}

</script>

<style scoped>
.key-result-item {
  min-height: 40px;
  margin-left: -28px;
  font-size: 14px;
}

.key-result-item:hover .kr-indicator-item {
  visibility: visible;
}
.key-result-item:hover .edit-dot-icon {
  background: rgb(164, 172, 185);
  border-radius: 50%;
}

.key-result-item .kr-indicator-item {
  visibility: hidden;
  margin-right: 14px;
}

.key-result-item .kr-indicator-item:hover {
  cursor: pointer;
}

.key-result-item a {
  color: rgb(63, 71, 85);
}

.key-result-item a i {
  display: none !important;
}

.key-result-item a:hover {
  color: #2879ff;
}

.key-result-item a:hover i {
  display: inline-block !important;
}

.key-result-item a.kr-index {
  color: #2879ff;
  margin-right: 10px;
}

.key-result-item .actions {
  margin-left: auto;
}

.key-result-item .rating-progress-container {
  width: 160px;
}

.key-result-item .rating-progress-container .rating {
  color: rgb(137, 145, 159);
  padding: 3px 6px;
  border: 1px solid #fff;
}

.key-result-item .rating-progress-container .rating:hover {
  border-radius: 4px;
  border: 1px solid #e9ecf0;
  cursor: pointer;
}

.key-result-item .rating-progress-container .progress {
  width: 62px;
  color: rgb(137, 145, 159);
}

.key-result-item .rating-progress-container .progress:hover {
  cursor: pointer;
}

.key-result-item input {
    box-sizing: border-box;
    position: relative;
    background: rgb(255, 255, 255);
    cursor: text;
    border: 1px solid rgb(233, 236, 240);
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 7px 7px;
    transition: border 0.2s ease 0.2s, box-shadow 0.2s ease 0.2s;
    color: #3f4755 !important;
}

.input-error {
  border: 1px solid rgb(240, 25, 10) !important;
  box-shadow: rgb(240 25 10 / 30%) 0px 0px 6px 0px inset !important;
}

.key-result-item input:focus {
  outline: none;
  border: 1px solid rgb(40, 121, 255);
  box-shadow: rgb(40 121 255 / 30%) 0px 0px 6px 0px inset;
}

.kr-name-edit {
  width: 100%;
}

.kr-name-edit .v-icon {
  display: none;
}

.kr-name-edit:hover .v-icon {
  display: inline-block;
}

.kr-name-edit input {
  width: 95%;
}

.date-range {
  width: 230px;
}

.score-content {
  width: 60px;
  margin-left: 40px;
  position: relative;
}

.score-modal {
  position: absolute;
  top: 30px;
  right: 0;
  background-color: #fff;
  z-index: 100;
  min-width: 350px;
  box-shadow: rgb(0 0 0 / 21%) 0px 2px 4px 0px;
}

.kr-score {

}

.kr-score-header {
  background-image: linear-gradient(90deg, rgb(29, 134, 240) 6%, rgb(92, 173, 255) 94%);
  height: 32px;
  box-sizing: border-box;
  padding: 0px 16px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.kr-score-header span {
  font-size: 12px;
}

.left {
  width: 15%;
}

  .left input {
    width: 100%;
  }

.right {
  width: 80%;
}

  .right input {
    width: 100%;
  }

.user-name {
  min-width: 100px;
  max-width: 100px;
  overflow: hidden;
}

.kr-name {
  /* max-width: 400px;
  line-height: 18px;
  overflow: hidden;
  display: inline-block; */
}

.kr-edit-container {
  width: 100%;
}
</style>