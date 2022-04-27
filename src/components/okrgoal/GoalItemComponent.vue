<template>
  <v-card class="goal-item">
    <v-expansion-panels
      v-model="isExpansionToggle"
      :disabled="isDisableKeyResult"
      multiple
      style="z-index: auto;"
    >
      <v-expansion-panel style="position: relative;">
        <v-expansion-panel-header
          :disable-icon-rotate="true"
          :hide-actions="true"
          class="goal-item-header"
        >
          <v-list class="py-0">
            <v-list-item class="okr-sub-title" v-if="isMoreSeeting && item.ob_status != 1">
              <a @click="openAddAlignDialog">
                <span>
                  <v-icon
                    aria-hidden="false"
                    class="Tian_Jia"
                    style="font-size: 12px;"
                  >
                    mdi-arrow-collapse-up
                  </v-icon>
                </span>
                <span v-if="!parentObjOwnerName">添加对齐</span>
                <span v-if="!!parentObjOwnerName">{{parentObjOwnerName}}</span>
              </a>
            </v-list-item>
            <v-list-item class="okr-title-container justify-start">
              <div class="okr-oitem">
                <div class="okr-oitem-circle"></div>
              </div>
              <a class="okr-title">
                <ToolTipComponent
                  :tooltipText="item.ob_name"
                  direction="top"
                  v-if="!obNameEdit"
                >
                  <router-link
                      class="routing-link"
                      plain
                      text
                      :to="
                        `/home/okr_goal/okr_e_${item.ob_id}&pageItemCount=${pageItemCount}&currentPage=${currentPage}`
                      "
                      color="black"
                    >
                    <span class="text-capitalize text-h6 op_1" @click="selectObject">{{item.ob_name}}</span>
                    <span class="ml-4 end-goal"  v-if="item.ob_status == 1">已结束</span>
                  </router-link>
                </ToolTipComponent>
                <span
                  class=""
                  v-if="obNameEdit"
                  v-click-outside="closeObNameEdit"
                >
                  <input
                    type="text"
                    class="ob-name-edit"
                    :value="item.ob_name"
                    @input="changeObName"
                    v-on:keyup.enter="closeObNameEdit"
                  />
                </span>
                <span @click="nameEdit" v-if="!obNameEdit && item.ob_status != 1 && item.ob_owner == authUser.id">
                  <v-icon aria-hidden="false" style="font-size: 15px;" outlined>
                    mdi-tooltip-edit
                  </v-icon>
                </span>
              </a>
              <div class="actions">
                <v-layout>
                  <div class="obj-score mr-8" v-if="item.ob_score != null">
                    <ToolTipComponent
                      tooltipText="评分"
                      direction="top"
                    >
                      <span v-if="item.ob_score >= 0.7 && item.ob_score <= 1" style="color:rgb(40, 121, 255);background-color:rgba(40, 121, 255, 0.3);">{{item.ob_score}}分</span>
                      <span v-if="item.ob_score < 0.7 && item.ob_score >= 0.4" style="color:rgb(246, 189, 22);background-color:rgba(246, 189, 22, 0.3);">{{item.ob_score}}分</span>
                      <span v-if="item.ob_score < 0.4 && item.ob_score >= 0" style="color:rgb(240, 94, 94);background-color:rgba(240, 94, 94, 0.3);">{{item.ob_score}}分</span>
                    </ToolTipComponent>
                  </div>
                  <div class="user-name">
                    <v-menu offset-y v-if="item.ob_status == 0">
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
                            :content="item.ob_owners.employeeName"
                            direction="top"
                            :tooltipText="item.ob_owners.employeeName"
                          />
                        </span>
                      </template>
                      <v-list class="py-0">
                        <v-list-item class="px-0">
                          <UserPicker @pick="(param) => pickUser(param)" />
                        </v-list-item>
                      </v-list>
                    </v-menu>
                    <div class="confirm-dialog" v-if="owner_modal">
                      <div class="text-left" style="color: rgb(31, 35, 41);">
                        您确定把负责人的权限转交吗?
                      </div>
                      <div class="text-right mt-4">
                        <v-btn class="mr-4" dense @click="closeCycleModal">取消</v-btn>
                        <v-btn dense color="primary" @click="changeObjOwner"
                          >确定</v-btn
                        >
                      </div>
                    </div>
                    <span v-if="item.ob_status == 1">
                      <v-icon
                        aria-hidden="true"
                        class="mdi_accout"
                        style="font-size:18px; color: #89919f;"
                      >
                        mdi-account-outline
                      </v-icon>
                      <ToolTipComponent
                        :content="item.ob_owners.employeeName"
                        direction="top"
                        :tooltipText="item.ob_owners.employeeName"
                      />
                    </span>
                  </div>
                  <div v-if="item.ob_status == 0">
                    <v-progress-linear
                      :value="item.ob_progress"
                      color="rgb(159, 191, 255)"
                      height="14"
                      :rounded="true"
                      class="okr-progress-linear"
                      @click="openPercentDialog"
                    >
                      <template v-slot:default="{ value }">
                        <span>{{ item.ob_progress }}%</span>
                      </template>
                    </v-progress-linear>
                    <div
                      class="progress-description mt-1 d-flex justify-space-between"
                      v-if="item.ob_recent_pr != null"
                    >
                      <span class="left" v-if="item.ob_recent_pr.pr_up_percent != 0">{{pr_up_percent_date}} 更新</span>
                      <span class="right" v-if="item.ob_recent_pr.pr_up_percent > 0">
                        <v-icon
                          aria-hidden="false"
                          style="font-size:14px; color:rgb(90, 216, 166);"
                        >
                          mdi-arrow-up
                        </v-icon>
                        <span :style="item.ob_recent_pr.pr_up_percent > 0 ? 'color:rgb(90, 216, 166)' : ''">{{item.ob_recent_pr.pr_up_percent}}%</span>
                      </span>
                      <span class="right" v-if="item.ob_recent_pr.pr_up_percent < 0">
                        <v-icon
                          aria-hidden="false"
                          style="font-size:14px; color:rgb(240, 94, 94);"
                        >
                          mdi-arrow-down
                        </v-icon>
                        
                        <span :style="item.ob_recent_pr.pr_up_percent < 0 ? 'color:rgb(240, 94, 94)' : ''">{{Math.abs(item.ob_recent_pr.pr_up_percent)}}%</span>
                      </span>
                    </div>
                  </div>
                  <div v-if="item.ob_status == 1">
                    <v-progress-linear
                      :value="item.ob_progress"
                      color="rgb(159, 191, 255)"
                      height="14"
                      :rounded="true"
                      class="okr-progress-linear"
                    >
                      <template v-slot:default="{ value }">
                        <span>{{ item.ob_progress }}%</span>
                      </template>
                    </v-progress-linear>
                    <div
                      class="progress-description mt-1 d-flex justify-space-between"
                      v-if="item.ob_recent_pr != null"
                    >
                      <span class="left">{{pr_up_percent_date}} 更新</span>
                      <span class="right" v-if="item.ob_recent_pr.pr_up_percent > 0">
                        <v-icon
                          aria-hidden="false"
                          style="font-size:14px; color:rgb(90, 216, 166);"
                        >
                          mdi-arrow-up
                        </v-icon>
                        <span :style="item.ob_recent_pr.pr_up_percent > 0 ? 'color:rgb(90, 216, 166)' : ''">{{item.ob_recent_pr.pr_up_percent}}%</span>
                      </span>
                      <span class="right" v-if="item.ob_recent_pr.pr_up_percent < 0">
                        <v-icon
                          aria-hidden="false"
                          style="font-size:14px; color:rgb(240, 94, 94);"
                        >
                          mdi-arrow-down
                        </v-icon>
                        <span :style="item.ob_recent_pr.pr_up_percent < 0 ? 'color:rgb(240, 94, 94)' : ''">{{Math.abs(item.ob_recent_pr.pr_up_percent)}}%</span>
                      </span>
                    </div>
                  </div>
                  <a class="ml-5 action" v-if="item.ob_owner == authUser.id">
                    <v-icon
                      aria-hidden="false"
                      class="edit-dot-icon"
                      style="font-size: 14px;"
                    >
                      mdi-dots-horizontal
                    </v-icon>
                    <div class="popup">
                      <v-list>
                        <!-- <v-list-item v-if="item.ob_status != 1">
                          <span class="mr-2">
                            <v-icon style="font-size: 18px;">mdi-pencil</v-icon>
                          </span>
                          编辑基本信息
                        </v-list-item> -->
                        <v-list-item @click="openAddAlignDialog" v-if="item.ob_status != 1">
                          <span class="mr-2">
                            <v-icon style="font-size: 18px;"
                              >mdi-arrow-collapse-up</v-icon
                            >
                          </span>
                          对齐目标
                        </v-list-item>
                        <v-list-item @click="endGoal" v-if="item.ob_status != 1">
                          <ConfirmDialogComponent option="endGoal" v-on:click="(bool) => endGoal(bool)">
                          <span class="mr-2">
                            <v-icon style="font-size: 18px;"
                              >mdi-power-settings</v-icon
                            >
                          </span>
                          结束目标
                          </ConfirmDialogComponent>
                        </v-list-item>
                        <v-list-item @click="restartGoal" v-if="item.ob_status == 1">
                          <ConfirmDialogComponent option="restartGoal" v-on:click="(bool) => restartGoal(bool)">
                          <span class="mr-2">
                            <v-icon style="font-size: 18px;"
                              >mdi-rotate-left</v-icon
                            >
                          </span>
                          重启目标
                          </ConfirmDialogComponent>
                        </v-list-item>
                        <!-- <v-list-item>
                          <span class="mr-2">
                            <v-icon style="font-size: 18px;"
                              >mdi-content-copy</v-icon
                            >
                          </span>
                          复制目标
                        </v-list-item> -->
                        <v-list-item @click="stop">
                          <ConfirmDialogComponent
                            v-on:click="confirmClick"
                            option="obj"
                          >
                            <span class="mr-2">
                              <v-icon style="font-size: 18px;"
                                >mdi-delete</v-icon
                              >
                            </span>
                            删除目标
                          </ConfirmDialogComponent>
                        </v-list-item>
                      </v-list>
                    </div>
                  </a>
                  <span v-else style="width:40px;"></span>
                </v-layout>
              </div>
            </v-list-item>
            <v-list-item class="okr-sub-title not-hover" v-if="isMoreSeeting">
              <span>
                <v-icon aria-hidden="false" class="" style="font-size: 12px;">
                  mdi-clock-outline
                </v-icon>
                {{itemCycle}}
              </span>
              <span class="ml-3" v-if="!item.ob_owners.employeeName">
                <v-icon aria-hidden="false" class="" style="font-size: 12px;">
                  mdi-clock-outline
                </v-icon>
                对齐我的：{{ item.ob_owners.employeeName }}
              </span>
            </v-list-item>
          </v-list>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="goal-item-content">
          <hr class="okr-list-item-divide" />
          <v-list class="key-result-item-list py-0">
            <draggable
              group="keyresult"
              v-model="item.ob_results"
              @change="dragChange"
            >
              <div v-for="(kr, i) in item.ob_results" :key="kr.kr_id">
                <KeyResultItemComponent
                  :keyResult="kr"
                  :obId="item.ob_id"
                  :obStatus="item.ob_status"
                  @selectKR="selectKR"
                  :isSimple="true"
                  :stopAllEdit="item.ob_status == 1 || item.ob_owner != authUser.id"
                />
              </div>
            </draggable>
          </v-list>
        </v-expansion-panel-content>
        <div class="goal-item-footer">
          <hr class="okr-list-item-divide" />
          <v-layout justify-space-between v-if="!isKeyResult">
            <v-flex class="okr-sub-title d-flex align-center justify-start">
              <a class="d-flex align-center" @click="openQuickKeyResult">
                <v-icon aria-hidden="false" class="" style="font-size: 18px;">
                  mdi-plus
                </v-icon>
                <span>添加KR</span>
              </a>
            </v-flex>
            <v-flex class="d-flex justify-end">
              <!-- <a class="d-flex align-center mr-8">
                <v-icon aria-hidden="false" class="" style="font-size: 18px;">
                  mdi-file-document
                </v-icon>
              </a>
              <a class="d-flex align-center mr-8">
                <v-icon aria-hidden="false" class="" style="font-size: 18px;">
                  mdi-share-variant
                </v-icon>
              </a>
              <a class="d-flex align-center mr-4">
                <v-icon aria-hidden="false" class="" style="font-size: 18px;">
                  mdi-thumb-up-outline
                </v-icon>
              </a>
              <span>0</span> -->
            </v-flex>
          </v-layout>
          <v-layout class="key-result-add" v-if="isKeyResult">
            <v-flex class="key-result-input">
              <input
                type="text"
                v-on:keyup.enter="(ev) => saveKeyResult(ev, item.ob_id)"
              />
            </v-flex>

            <v-flex class="d-flex align-center right">
              <RatingPopupComponent
                :selected="selectedRating"
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
                  <span class="mr-1">{{ selectedRating }}</span>

                  <span>
                    分
                  </span>
                </div>
              </RatingPopupComponent>
            </v-flex>
            <v-flex class="key-result-close">
              <a
                @click="closeQuickKeyResult"
                class="d-flex align-center justify-center"
              >
                <div class="text-center">
                  <span>
                    X
                  </span>
                </div>
              </a>
            </v-flex>
          </v-layout>
        </div>
        <div v-if="item.ob_status == 1 || item.ob_owner != authUser.id" class="overlay1"></div>
      </v-expansion-panel>
    </v-expansion-panels>
    <AddSort ref="addsort" v-on:setPersonalGoal="(param) => setParent(param)" v-on:setUnlink="setUnlink" />
    <!-- <PercentDialogComponent
      ref="percent"
      :isAuto="item.ob_auto_progress"
      :percent="item.ob_progress"
      :autoPercent="autoPercent"
      v-on:savePercentValue="(param) => getPercentValue(param)"
      v-on:saveProgressOption="(param) => saveProgressOption(param)"
    /> -->
    <NewPercentDialogComponent ref="percent" :percent="item.ob_progress" :autoOption="item.ob_auto_progress" @savePercentValue="(param) => getPercentValue(param)" :firstOptionPercentValue="firstValue" :secondOptionPercentValue="secondValue" />
  </v-card>
</template>

<script>
import ToolTipComponent from "@/components/okrgoal/shared/ToolTipComponent.vue";
import KeyResultItemComponent from "@/components/okrgoal/shared/KeyResultItemComponent.vue";
import AddSort from "@/components/common/AddSort.vue";
import PercentDialogComponent from "@/components/okrgoal/shared/PercentDialogComponent.vue";
import NewPercentDialogComponent from "@/components/okrgoal/shared/NewPercentDailogComponent.vue";
import RatingPopupComponent from "@/components/okrgoal/shared/RatingPopupComponent.vue";
import ConfirmDialogComponent from "@/components/okrgoal/shared/ConfirmDialogComponent.vue";
import UserPicker from "@/components/common/UserPicker.vue";
import { constant } from "@/constants/constant.js";
import draggable from "vuedraggable";
import { mapGetters, mapActions } from "vuex";
import { getUser } from '@/utils/authUser.service';

export default {
  props: ["item", "okrObj", "pageItemCount", "currentPage"],
  components: {
    ToolTipComponent,
    KeyResultItemComponent,
    AddSort,
    PercentDialogComponent,
    NewPercentDialogComponent,
    RatingPopupComponent,
    Notification,
    ConfirmDialogComponent,
    UserPicker,
    draggable,
  },
  data() {
    return {
      okr_edit: false,
      percent: 0,
      isKeyResult: false,
      selectedRating: 5,
      obNameEdit: false,
      obNameChangeValue: "",
      isDisableKeyResult: false,
      krArr: this.item.ob_results,
      owner_modal: false,
      owner_obj: null
    };
  },
  computed: {
    // watcher: function() {
    //   return getUser().id;
    // },
    ...mapGetters('auth', ['authUser']),
    pr_up_percent_date: function() {
      const date = new Date(this.item.ob_recent_pr.created_at);
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month < 10 ? '0' + month : month;
      return month + '/' + day;
    },
    parentObjOwnerName: function() {
      if(!!this.item.ob_parent_objects) {
        return this.item.ob_parent_objects.ob_owners.employeeName
      }else{
        return null;
      }
    },
    itemCycle: function() {
      let cycles = this.item.ob_cycle.split("/");
      if(cycles.length == 1) {
        cycles = this.item.ob_cycle.split("-");
        let result = constant.cycleItems.filter(c => c.dbformat == ('-'+cycles[1]));
        return result[0].title;
      }else{
        let result = constant.cycleItems.filter(c => c.dbformat == ('/'+cycles[1]));
        return result[0].title;        
      }
    },
    okrObjList: function() {
      let okrObjList = [];
      this.okrObj.map((obj) => {
        let obc = obj.ob_cycle;
        let year = obj.ob_start_date + "-" + obj.ob_end_date;
        let cycle = "";
        let goal = "全部状态";
        let quater = "";
        if (obc.includes("/")) {
          quater = "/" + obc.split("/")[1];
        }
        if (obc.includes("-")) {
          quater = "-" + obc.split("-")[1];
        }
        constant.cycleItems.map((c) => {
          if (c.dbformat == quater) {
            cycle = c.title;
          }
        });
        constant.statusItems.map((s) => {
          if (s.dbformat == obj.ob_status) {
            goal = s.title;
          }
        });
        let tmp = {
          id: obj.ob_id,
          cycle: cycle,
          content: obj.ob_name,
          year: year,
          goal: goal,
          parent: this.item.ob_parent_object === obj.ob_id ? true : false,
        };
        if (obj.ob_id !== this.item.ob_id) {
          okrObjList.push(tmp);
        }
      });
      return okrObjList;
    },
    isExpansionToggle: {
      get() {
        if(this.item.ob_results != 0) {
          return this.$store.getters["app/isExpansionToggle"];
        }else{
          return [1];
        }
      },
      set(newValue) {
        // return this.setExpansionToggle();
      },
    },
    isMoreSeeting: {
      get() {
        return this.$store.getters["app/isMoreSeeting"];
      },
      set(newValue) {},
    },
    autoPercent: function() {
      let value = 0;
      let len = this.item.ob_results.length;
      this.item.ob_results.map((result) => {
        value += result.kr_completion;
      });
      return Math.floor(value / len);
    },
    firstValue: function() {
      let value = 0;
      let len;
      if(!!this.item.ob_results) {
        len = this.item.ob_results.length;
        this.item.ob_results.map((result) => {
          value += result.kr_completion;
        });
      }
      if(value != 0 && len != 0) {
        return Math.floor(value / len).toFixed(0);
      }else {
        return 0;
      }
    },
    secondValue: function() {
      let value = 0;
      let len;
      if(!!this.item.ob_child_objects) {
        len = this.item.ob_child_objects.length;
        this.item.ob_child_objects.map((result) => {
          value += result.ob_progress;
        });
      }
      if(value != 0 && len != 0) {
        return Math.floor(value / len).toFixed(0);
      }else {
        return 0;
      }
    },
  },
  methods: {
    ...mapActions("okr", [
      "updateOkr",
      "createKeyResult",
      "deleteOkr",
      "updateKeyResult",
      "getOkrs"
    ]),
    ...mapActions("progress", ["addProgress"]),
    ...mapActions("app", ["setExpansionToggle"]),
    stop(ev) {
      ev.stopPropagation();
    },
    changeObjOwner(ev) {
      ev.stopPropagation();
      this.owner_modal = false;
      let obj = {
        ob_id: this.item.ob_id,
        ob_owner: this.owner_obj.user.id,
      };
      this.updateOkr(obj);
      this.item.ob_owners.employeeName = this.owner_obj.user.employeeName;
    },
    closeCycleModal(ev) {
      ev.stopPropagation();
      this.owner_modal = false;
    },
    restartGoal(bool) {
      let obj = {
        ob_id: this.item.ob_id,
        ob_status: 0,
      };
      if(this.item.ob_status == 1 && bool) {
        this.updateOkr(obj);
      }
      // ev.stopPropagation()
    },
    endGoal(bool) {
      let obj = {
        ob_id: this.item.ob_id,
        ob_status: 1,
      };
      if(this.item.ob_status !== 1 && bool) {
        this.updateOkr(obj);
      }
      // ev.stopPropagation()
    },
    openAddAlignDialog(ev) {
      ev.stopPropagation();
      this.$refs.addsort.openDialog();
    },
    openPercentDialog(ev) {
      ev.stopPropagation();
      this.$refs.percent.openDialog();
    },
    selectKR(data) {
      this.$emit("selectKR", data);
    },
    nameEdit(ev) {
      ev.stopPropagation();
      this.obNameEdit = true;
    },
    setParent(param) {
      let obj = {
        ob_id: this.item.ob_id,
        ob_parent_object: param.ob_id,
      };
      this.updateOkr(obj);
    },
    getPercentValue(param) {
      const pr_change = param.pr_percent - this.item.ob_progress;
      this.item.ob_recent_pr.pr_up_percent = pr_change;
      param.pr_parent = this.item.ob_id;
      let obj = {
        ob_id: this.item.ob_id,
        ob_progress: param.pr_percent,
        ob_auto_progress: param.option,
        ob_recent_pr: this.item.ob_recent_pr
      };
      this.updateOkr(obj);
      this.addProgress(param);
      if(!!this.item.ob_parent_object && this.item.ob_parent_object != 0) {
        this.getOkrs({});
      }
    },
    openQuickKeyResult() {
      this.isKeyResult = true;
    },
    closeQuickKeyResult() {
      this.isKeyResult = false;
      this.selectedRating = 5;
    },
    selectRating(param) {
      this.selectedRating = param;
    },
    saveKeyResult(ev, ob_id) {
      ev.stopPropagation();
      let order = this.item.ob_results.length;
      let kr_obj = {
        kr_name: ev.target.value,
        kr_owner: getUser().id,
        kr_parent_object: ob_id,
        kr_order: order + 1,
        kr_completion: 0,
        kr_confidence: this.selectedRating,
        kr_score: 0,
        kr_score_description: null,
        kr_ta: null,
        kr_start_date: this.item.ob_start_date,
        kr_end_date: this.item.ob_end_date,
      };
      if(ev.target.value != '') {
        this.createKeyResult(kr_obj);
      }
      this.isKeyResult = false;
    },
    closeObNameEdit(ev) {
      ev.stopPropagation();
      let obj = {
        ob_id: this.item.ob_id,
        ob_name: this.obNameChangeValue,
      };
      if (this.obNameChangeValue !== "") {
        this.updateOkr(obj);
      }
      this.obNameEdit = false;
    },
    changeObName(ev) {
      ev.stopPropagation();
      this.obNameChangeValue = ev.target.value;
    },
    confirmClick(param) {
      let obj = {
        ob_id: this.item.ob_id,
        ob_status: param
      }
      this.deleteOkr(obj);
    },
    saveProgressOption(param) {
      let obj = {
        ob_id: this.item.ob_id,
        ob_auto_progress: param,
      };
      this.updateOkr(obj);
    },
    setUnlink() {
      let obj = {
        ob_id: this.item.ob_id,
        ob_parent_object: 0,
      };
      this.updateOkr(obj);
    },
    pickUser(param) {
      this.owner_modal = true;
      this.owner_obj = param;
    },
    dragChange(ev) {
      this.item.ob_results.map((kr, i) => {
        kr.kr_order = i + 1;
        let obj = {
          kr_id: kr.kr_id,
          kr_order: i + 1,
        };
        let payload = {
          obj: obj,
          kr: kr,
        };
        if(ev.moved.oldIndex > ev.moved.newIndex) {
          if(i >= ev.moved.newIndex && i <= ev.moved.oldIndex) {
            this.updateKeyResult(payload);
          }
        }else{
          if(i <= ev.moved.newIndex && i >= ev.moved.oldIndex) {
            this.updateKeyResult(payload);
          }
        }
      });
    },
    selectObject() {
      this.$emit("selectObject");
    }
  },
};
</script>

<style>
.goal-item {
  box-shadow: none !important;
  background: #c00;
}
.routing-link {
  text-decoration: none;
}
.goal-item-header {
  padding: 12px 20px 12px 48px !important;
  position: relative;
  z-index: 1;
}
.goal-item-header .ob-name-edit {
  width: 98%;
}
.not-hover a {
  color: #6f7886 !important;
  cursor: auto;
}
.okr-sub-title {
  font-size: 12px;
  min-height: 24px;
  padding: 0px;
}
.okr-sub-title a {
  color: #6f7886;
}
.okr-sub-title:hover a {
  color: #2879ff;
}
.okr-sub-title:hover a .Tian_Jia {
  color: #2879ff;
}
.okr-title-container {
  padding: 0px;
  min-height: 30px;
}
.okr-title {
  font-size: 16px;
  font-weight: bold;
  width: 100%;
}
.okr-title {
  color: rgb(20, 28, 40) !important;
}
.okr-title i {
  display: none !important;
}
.okr-title:hover i {
  display: inline-block !important;
}
.okr-title:hover {
  color: #2879ff !important;
}
.okr-sub-title span {
  color: #6f7886;
}
.actions {
  margin-left: auto;
}
.actions .action {
  position: relative;
}
.actions .action:hover .popup {
  display: block;
  z-index: 30;
}
.actions .action .popup:hover {
  display: block;
}
.actions .action .popup {
  display: none;
  position: absolute;
  top: 20px;
  right: 0;
  width: 158px;
  padding: 0px;
  padding-top: 5px;
  border: 1px solid rgb(240, 242, 245);
  background-color: #fff;
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
}
.actions .action .popup .v-list-item {
  min-height: 24px;
  margin-bottom: 0px;
  padding: 5px 24px;
  font-size: 14px;
  line-height: 22px;
  transition: all 0.3s ease-in 0s;
  color: rgb(63, 71, 85);
  cursor: pointer;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  white-space: nowrap;
}
.actions .action .popup .v-list-item:hover {
  color: rgb(40, 121, 255) !important;
  background: rgba(240, 242, 245, 0.3);
}
.user-name {
  display: inline-block;
  color: #89919f;
  width: 75px;
  /* overflow: hidden;
  text-overflow: ellipsis; */
  word-break: break-all;
  white-space: nowrap;
  vertical-align: middle;
  font-size: 13px;
  line-height: 18px;
  margin-right: 40px;
  position: relative;
}
.confirm-dialog {
  width: 300px;
  height: 100px;
  position: absolute;
  top: 20px;
  right: -50px;
  border: 1px solid #fff;
  box-shadow: 1px 1px 10px #eee;
  padding: 16px 20px;
  border-radius: 4px;
  box-shadow: rgb(31 35 41 / 11%) 0px 0px 28px 0px;
  background: rgb(255, 255, 255);
}
.okr-progress-linear {
  width: 160px;
  font-size: 12px;
  z-index: 10;
}
.progress-description {
  font-size: 12px;
  color: rgb(137, 145, 159);
}
.progress-description .left {
}
.progress-description .right {
  /* color: rgb(90, 216, 166); */
}
.edit-dot-icon {
  font-weight: bold;
  padding: 2px;
}
.edit-dot-icon:hover {
  background: rgb(164, 172, 185);
  border-radius: 50%;
  cursor: pointer;
}
.okr-oitem {
  height: 24px;
  width: 24px;
  padding: 6px;
  box-sizing: border-box;
  background: rgba(40, 121, 255, 0.1);
  border-radius: 12px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  margin-left: -32px;
  cursor: pointer;
}
.okr-oitem-circle {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid #2879ff;
}
.goal-item-content {
  padding: 0;
  padding-bottom: 12px;
}
.goal-item-content .v-expansion-panel-content__wrap {
  padding: 0px 20px 0px 48px;
}
.okr-list-item-divide {
  margin-bottom: 16px;
}
.key-result-item-list {
  font-size: 14px;
  min-height: 36px;
}
.goal-item-footer {
  padding: 0px 20px 12px 48px;
}
.key-result-add {
}
.key-result-add .right {
  margin-left: -72px;
  z-index: 20;
}
.key-result-input {
  width: 95%;
}
.key-result-input input {
  min-height: 36px;
  width: 100%;
}
.goal-content input {
  box-sizing: border-box;
  position: relative;
  background: rgb(255, 255, 255);
  cursor: text;
  border: 1px solid rgb(233, 236, 240);
  border-radius: 4px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  padding: 7px 7px;
  transition: border 0.2s ease 0.2s, box-shadow 0.2s ease 0.2s;
  color: #3f4755 !important;
}
.goal-content input:focus {
  outline: none;
  border: 1px solid rgb(40, 121, 255);
  box-shadow: rgb(40 121 255 / 30%) 0px 0px 6px 0px inset;
}
.key-result-close {
  width: 50px;
}
.key-result-close a {
  height: 100%;
}
.key-result-close a div {
  height: 26px;
  width: 26px;
  font-size: 12px;
  background-color: rgb(141, 200, 234);
  color: rgb(255, 255, 255);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ky-result-close a div span {
  text-align: center;
}
.op_1 {
  opacity: 1 !important;
  color: black;
}

.obj-score span {
  border-radius: 5px;
  padding: 2px 4px;
  font-size: 12px;
  display: inline-block;
  width: 40px;
}

.end-goal {
  height: 18px;
  margin-left: 6px;
  padding: 2px 8px;
  font-size: 12px;
  line-height: 14px;
  border-radius: 9px;
  background: #f7f8fa;
  box-sizing: border-box;
  color: #a4acb9;
  display: inline-block;
  white-space: nowrap;
}

.overlay1 {
  width: 320px;
  height: 100%;
  background: transparent;
  /* background: #c00; */
  position: absolute;
  top: 0;
  right: 50px;
  z-index: 2;
}
</style>
