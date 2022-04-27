<template>
   <v-dialog
      v-model="dialog"
      scrollable
      width = "663px"
      persistent
      :retain-focus="false"
      content-class = "replay_kr"
    >
        <v-card>
          <v-system-bar class = "replay_kr_header" height = "40px">
            <v-container d-flex align-center justify-start class = "p_0">
              <v-layout align-center justify-start>
                <v-flex><span class = "fontColorWhite fontSize17">复盘KR</span></v-flex>
                <v-flex class = "replay_kr_flex"><v-icon class = "fontColorWhite fontSize20" @click = "closeDialog">mdi-close</v-icon></v-flex>
              </v-layout>
            </v-container>
          </v-system-bar>

          <v-card-text class = "replay_kr_content">
            <v-container d-flex align-center justify-start class = "p_0 w100">
              <v-layout column class = "w100 m_0">
                <v-flex class = "mb_20">
                  <v-layout>
                    <v-flex shrink>
                      <span class = "blueStart"></span>
                      <span class = "fontSize14 fontColorBlack fontWeight">复盘对象</span>
                    </v-flex>
                    <v-flex class = "pl_15">
                      <span v-if="kr_name != ''">
                        <span class = "fontSize14 mr_3 krNumber">KR{{kr_order}}</span>
                        <span class = "fontSize14 fontColorLightBlack">{{kr_name}}</span>
                      </span>
                      <span v-if="object_name != ''">
                        <v-icon color="rgb(131, 186, 90)" size="20">mdi-target</v-icon>
                        <span style="color: rgb(3, 16, 26);">{{ object_name }}</span>
                      </span>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex>
                  <v-layout d-flex align-center justify-center column>
                    <v-flex class = "w100">
                      <span class = "blueStart"></span>
                      <span class = "fontSize14 fontColorBlack fontWeight">价值与收获</span>
                    </v-flex>
                    <v-flex class = "w100 pl_10_review mb_20 rehearsal h_70">
                      <v-textarea
                        outlined
                        auto-grow
                        hide-details
                        height="70"
                        rows="3"
                        class = "replay_value_harvest_text rehearsal_textarea"
                        v-model = "rehearsal"
                        @input = "hidePlaceholder"
                      >
                      </v-textarea>  
                      <div class = "placeholder" v-if = "placeholder" @click = "placeholder = false">                    
                        <p style = "margin-bottom: 0px;" >我们从过程中学到了什么新东西？</p>
                        <p>如果有人要进行同样的行动，我会给他什么建议？</p>
                      </div>
                    </v-flex>
                    <v-sheet v-if = "advanced" class ="w100">
                      <Advanced 
                        v-for = "(ad_item, index) in advancedItems" 
                        :key = "ad_item.index"
                        :id = "index + 1" 
                        :rp_id = "ad_item.rp_id ? ad_item.rp_id : '' "
                        :problem = "ad_item.problem"
                        :reason = "ad_item.reason"
                        :solution = "ad_item.solution" 
                        @deleteAdvancedItem = "handle_deleteAdvancedItem"
                        @inputAdvancedProblem = "handle_inputAdvancedProblem"
                        @inputAdvancedReason = "handle_inputAdvancedReason"
                        @inputAdvancedSolution = "handle_inputAdvancedSolution"
                      />
                    </v-sheet>
                    <Normal 
                      v-else 
                      :problem = "problem" 
                      @inputNormalProblem = "handle_inputNormalProblem"
                    />

                    <v-flex v-if = "advanced" class = "w100 mb_20 ml_5 cursorPointer" @click = "increaseAdvancedItems">
                        <v-icon class = "ad_problem_deficience_plusIcon">mdi-plus</v-icon>
                        <span class = "ad_problem_deficience cursorPointer">添加问题与不足</span>
                    </v-flex>
                    <v-flex class = "w100 mb_5">
                      <span class = "blueStart"></span>
                      <span class = "fontSize14 fontColorBlack fontWeight">改进计划</span>
                    </v-flex>
                    <v-flex class = "w100 pl_10_review mb_5 mt_5" v-for="(task, index) in newTask" :key="index">
                      <v-icon class="squareIcon cursorPointer">mdi-square-rounded-outline</v-icon>
                      <span class="taskName cursorPointer">{{ task.task_name }}</span>
                    </v-flex>
                    <v-flex class = "w100 pl_3_review mb_20">
                      <v-btn class = "createNewActionPaln" height = "26px" @click="openCreateTask()">
                        <v-icon style = "margin-right: 5px; font-size: 20px;">mdi-plus</v-icon>
                        <span style = "font-size: 13px; letter-spacing: initial;">创建行动计划</span>
                      </v-btn>
                    </v-flex>
                    <v-flex class = "w100">
                      <span class = "blueStart"></span>
                      <span class = "fontSize14 fontColorBlack fontWeight">参与人员</span>
                    </v-flex>
                    <v-flex class = "w100 pl_10_review mb_20">
                      <v-menu offset-y content-class="review_add_members">
                        <template v-slot:activator="{on, attrs}">
                          <v-sheet width = "100%" height = "55" outlined class = "participants">
                            <span style="margin-right:5px;">
                              <v-avatar style="cursor:pointer;" @click="removeUser(i)" class="white--text mt-1 mx-1" color="orange" size="24" v-for="(user, i) in collaborators" :key="i">{{ user | surename }}</v-avatar>
                            </span>
                            <span class = "participants_plus" v-bind="attrs" v-on="on">
                              <v-icon style = "font-size: 25px; color: rgb(160, 167, 173);">mdi-plus</v-icon>
                            </span>
                          </v-sheet>
                        </template>
                        <v-card>
                          <UserPicker @pick="addMember" />
                        </v-card>
                      </v-menu>
                    </v-flex>                      
                                    
                    <v-flex class = "w100 d-flex">
                      <span class = "cursorPointer" @click = "advanced = !advanced">
                        <v-icon style = "color: rgb(40, 121, 255);font-size: 17px;">mdi-repeat</v-icon>
                        <span style = "color: rgb(40, 121, 255);">高级模式</span>
                      </span>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-container d-flex align-center justify-start>
              <v-layout align-center justify-start row>
                <v-flex><v-btn color = "primary" width = "100px">保存草稿</v-btn></v-flex>
                <v-flex class = "replay_kr_flex">
                  <v-btn width = "100px" class = "mr_10" @click = "cancel">取消</v-btn>
                  <v-btn v-if = "advanced" :disabled = "placeholder == true || advancedProblemDisable && advancedReasonDisable && advancedSolutionDisable ? true : false" width = "100px" @click = "addReviewInfo">确定</v-btn>
                  <v-btn v-else :disabled = "placeholder == true || normalProblemDisable ? true : false" width = "100px" @click = "addReviewInfo">确定</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-actions>
        </v-card>
        <CreateTask ref="createTask" @save="setTask" /> 
    </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Normal from './normal/Normal.vue';
import Advanced from './advanced/Advanced.vue';

export default {
    data() {
        return {
            mode: null,
            kr_id : null,
            kr_order: "",
            kr_name: "",
            object_id : '',
            object_name: '',
            dialog: false,
            placeholder: true,
            advanced: false,
            advancedItems: [{count: 1, problem: "", reason: "", solutoin: ""}],
            setAdvancedItems: [{count: 1, problem: "", reason: "", solution: ""}],
            rehearsal: "",
            problem: "",
            normalProblem: "",
            normalProblemDisable: true,
            advancedProblemDisable: true,
            advancedProblems: "",
            advancedReasonDisable: true,
            advancedReasons: "",
            advancedSolutionDisable: true,
            advancedSolutions: "",
            updateReviewInfo: false,
            reviewId: "",
            reviewMode: "",
            newTask: [],
            collaborators: [],
        }
    },
    components: {
      Normal,
      Advanced,
      CreateTask: () => import('@/components/common/CreateTask.vue'),
      UserPicker: () => import('@/components/common/UserPicker.vue'),
    },
    computed: {
      ...mapGetters('user', ['users']),
      collaboratorsToString: function() {
        return this.collaborators.toString();
      }
    },
    methods: {
      ...mapActions('review', ['addReview', 'updateReview', 'deleteProblem']),
        init() {
          this.rehearsal = "";
          this.problem = "";
          this.advancedItems = [{count: 1, problem: "", reason: "", solutoin: ""}];
          this.setAdvancedItems = [{count: 1, problem: "", reason: "", solution: ""}];
          this.normalProblem = "";
          this.newTask = [];
          this.collaborators = [];
          return "success";
        },
        async open(prop) {
          const res = await this.init();
          if(res == "success") {
            this.mode = prop.type;
            this.kr_order = prop.kr_order;
            if(!!prop.kr_name) {
              this.kr_name = prop.kr_name;
              this.object_name = '';
            }
            if(!!prop.ob_name) {
              this.object_name = prop.ob_name;
              this.kr_name = '';
            }
            let val = prop.value;
            // Get keyresult id or object id
            if(!!val.kr_id)
            {
              this.kr_id = val.kr_id;
            } else if(!!val.object_id)
            {
              this.object_id = val.object_id;
            }
            // Get Review Mode(Normal or Advanced)
            this.reviewMode = val.mode;
            // Update Review Mode(Normal or Advanced)
            this.updateReviewInfo = val.updateReview;
            // Get review id
            this.reviewId = val.id;
            // Get review tasks
            if(!!val.tasks)
            {
              this.newTask = val.tasks;
            }
            // Get review collaborators
            if(!!val.collaborators) {
              this.collaborators = val.collaborators.split(",");
            }
            if(val.problems.length != 0)
            {
              this.advanced = true;
              this.advancedItems = [];
              this.setAdvancedItems = [];
              for(let i = 0; i < val.problems.length; i++)
              {
                this.advancedItems.push({
                  count: i+1,
                  rp_id: val.problems[i].rp_id,
                  problem: val.problems[i].rp_problem,
                  reason: val.problems[i].rp_reason,
                  solution: val.problems[i].rp_solution
                });
                this.setAdvancedItems.push({
                  count: i+1,
                  rp_id: val.problems[i].rp_id,
                  problem: val.problems[i].rp_problem,
                  reason: val.problems[i].rp_reason,
                  solution: val.problems[i].rp_solution
                });
              }
            } else if(val.problems.length == 0)
            {
              this.advanced = false;
              this.problem = val.problem;
            }
            this.rehearsal = val.description;
            if(this.rehearsal != "")
            {
              this.placeholder = false;
            } else {
              this.placeholder = true;
            }
            this.dialog = true;
          }
        },
        async closeDialog() {
          const res = await this.init();
          if(res == "success") {
            this.dialog = false;
          }
        },
        hidePlaceholder(e) {
          if(e) {
            this.placeholder = false;
          } else {
            this.placeholder = true;
          }
        },
        increaseAdvancedItems() {
          this.number = this.advancedItems.length + 1;
          let reviewInfo = {
              count: this.number,
              problem: "",
              reason: "",
              solution: "",
          }
          this.advancedItems.push(reviewInfo);
          this.setAdvancedItems.push(reviewInfo);
        },
        handle_deleteAdvancedItem(prop) {
          var items = [];
          let index;
          index = this.advancedItems.findIndex((e) => e.count == prop.count);
          if(prop.rp_id)
          {
            if(this.mode == "kr") {
              this.deleteProblem({ param: {rp_id: prop.rp_id}, mode: "kr"});
            } else if(this.mode == "object"){
              this.deleteProblem({ param: {rp_id: prop.rp_id}, mode: "object"});
            }
            this.advancedItems.splice(index, 1);
            this.setAdvancedItems.splice(index, 1);
          } else {
            this.advancedItems.splice(index, 1);
            this.setAdvancedItems.splice(index, 1);
          }
        },
        cancel() {
          this.dialog = false;
        },
        handle_inputNormalProblem(prop) {
          if(prop)
          {
            this.normalProblemDisable = false;
            this.normalProblem = prop;
          } else {
            this.normalProblemDisable = true;
          }
        },
        handle_inputAdvancedProblem(prop) {
          if(!!prop.problem)
          {
            this.advancedProblemDisable = false;
            for(let i = 0; i<this.setAdvancedItems.length; i++)
            {
              if(prop.rp_id)
              {
                if(this.setAdvancedItems[i].count == prop.count && this.setAdvancedItems[i].rp_id == prop.rp_id)
                {
                  this.setAdvancedItems[i].problem = prop.problem;
                  this.advancedItems[i].problem = prop.problem;
                }
              } else {
                if(this.setAdvancedItems[i].count == prop.count)
                {
                  this.setAdvancedItems[i].problem = prop.problem;
                  this.advancedItems[i].problem = prop.problem;
                }
              }
            }
          } else {
            this.advancedProblemDisable = true;
          }
        },
        handle_inputAdvancedReason(prop) {
          if(prop.reason != "")
          {
            this.advancedReasonDisable = false;
            for(let i = 0; i<this.setAdvancedItems.length; i++)
            {
              if(prop.rp_id)
              {
                if(this.setAdvancedItems[i].count == prop.count && this.setAdvancedItems[i].rp_id == prop.rp_id)
                {
                  this.setAdvancedItems[i].reason = prop.reason;
                  this.advancedItems[i].reason = prop.reason;
                } 
              } else {
                if(this.setAdvancedItems[i].count == prop.count)
                {
                  this.setAdvancedItems[i].reason = prop.reason;
                  this.advancedItems[i].reason = prop.reason;
                }
              }
            }
          } else {
            this.advancedReasonDisable = true;
          }
        },
        handle_inputAdvancedSolution(prop) {
          if(prop.solution != "")
          {
            this.advancedSolutionDisable = false;
            for(let i = 0; i<this.setAdvancedItems.length; i++)
            {
              if(prop.rp_id)
              {
                if(this.setAdvancedItems[i].count == prop.count && this.setAdvancedItems[i].rp_id == prop.rp_id)
                {
                  this.setAdvancedItems[i].solution = prop.solution;
                  this.advancedItems[i].solution = prop.solution;
                }
              } else {
                if(this.setAdvancedItems[i].count == prop.count)
                {
                  this.setAdvancedItems[i].solution = prop.solution;
                  this.advancedItems[i].solution = prop.solution;
                }
              }
            }
          } else {
            this.advancedSolutionDisable = true;
          }
        },
        openCreateTask() {
          if(!!this.object_id) {
            this.$refs.createTask.open({ ob_id : this.object_id });
          } else if(!!this.kr_id) {
            this.$refs.createTask.open({ kr_id : this.kr_id });
          } 
        },
        setTask(task) {
          this.newTask.push(task);
        },
        addMember(e) {
          this.collaborators.push(e.user.id);
        },
        removeUser(index) {
          this.collaborators.splice(index, 1);
        },
        async addReviewInfo() {
          if(this.updateReviewInfo)
          { 
            if(this.advanced) {
              var re_problems = [];
              for(let i = 0; i<this.setAdvancedItems.length; i++)
              {
                if(this.setAdvancedItems[i].rp_id)
                {
                  re_problems.push({
                    "rp_id": this.setAdvancedItems[i].rp_id,
                    "rp_problem" : this.setAdvancedItems[i].problem,
                    "rp_reason" : this.setAdvancedItems[i].reason,
                    "rp_solution" : this.setAdvancedItems[i].solution,
                  });
                } else {
                  re_problems.push({
                    "rp_problem" : this.setAdvancedItems[i].problem,
                    "rp_reason" : this.setAdvancedItems[i].reason,
                    "rp_solution" : this.setAdvancedItems[i].solution,
                  });
                }
              }
              let reviewInfo;
              if(!!this.kr_id)
              {
                reviewInfo = {
                  "re_id" : this.reviewId,
                  "re_parent" : this.kr_id,
                  "re_parent_type" : 1,
                  "re_description" : this.rehearsal,
                  "re_problem" : "",
                  "re_tasks" : this.newTask,
                  "re_collaborators" : this.collaboratorsToString,
                  "re_problems" : re_problems
                }
              } else if(!!this.object_id)
              {
                reviewInfo = {
                  "re_id" : this.reviewId,
                  "re_parent" : this.object_id,
                  "re_parent_type" : 0,
                  "re_description" : this.rehearsal,
                  "re_problem" : "",
                  "re_tasks" : this.newTask,
                  "re_collaborators" : this.collaboratorsToString,
                  "re_problems" : re_problems
                }
              }
              this.updateReview(reviewInfo);
            } else {
              let reviewInfo;
              if(!!this.kr_id)
              {
                reviewInfo = {
                  "re_id" : this.reviewId,
                  "re_parent" : this.kr_id,
                  "re_parent_type" : 1,
                  "re_description" : this.rehearsal,
                  "re_problem" : this.normalProblem,
                  "re_tasks" : this.newTask,
                  "re_collaborators" : this.collaboratorsToString,
                  "re_problems" : [],
                }
              } else if(this.object_id)
              {
                reviewInfo = {
                  "re_id" : this.reviewId,
                  "re_parent" : this.object_id,
                  "re_parent_type" : 0,
                  "re_description" : this.rehearsal,
                  "re_problem" : this.normalProblem,
                  "re_tasks" : this.newTask,
                  "re_collaborators" : this.collaboratorsToString,
                  "re_problems" : [],
                }
              }
              if(this.reviewMode = "advanced")
              {
                if(this.mode == "kr") {
                  this.deleteProblem({ param: {re_parent: this.kr_id, re_parent_type: 1}});
                } else if(this.mode == "object") {
                  this.deleteProblem({ param: {re_parent: this.object_id, re_parent_type: 0}});
                }
              }
              this.updateReview(reviewInfo);
            }
          } else {
              if(this.advanced) {
              var re_problems = [];
              for(let i = 0; i<this.setAdvancedItems.length; i++)
              {
                re_problems.push({
                  "rp_id" : this.setAdvancedItems[i].rp_id,
                  "rp_problem" : this.setAdvancedItems[i].problem,
                  "rp_reason" : this.setAdvancedItems[i].reason,
                  "rp_solution" : this.setAdvancedItems[i].solution,
                });
              }
              let reviewInfo;
              if(!!this.kr_id)
              {
                reviewInfo = {
                  "re_parent" : this.kr_id,
                  "re_parent_type" : 1,
                  "re_description" : this.rehearsal,
                  "re_problem" : "",
                  "re_tasks" : this.newTask,
                  "re_collaborators" : this.collaboratorsToString,
                  "re_problems" : re_problems
                }
              } else if(!!this.object_id)
              {
                reviewInfo = {
                  "re_parent" : this.object_id,
                  "re_parent_type" : 0,
                  "re_description" : this.rehearsal,
                  "re_problem" : "",
                  "re_tasks" : this.newTask,
                  "re_collaborators" : this.collaboratorsToString,
                  "re_problems" : re_problems
                }
              }
              this.addReview(reviewInfo);
            } else {
              let reviewInfo;
              if(!!this.kr_id)
              {
                reviewInfo = {
                  "re_parent" : this.kr_id,
                  "re_parent_type" : 1,
                  "re_description" : this.rehearsal,
                  "re_problem" : this.normalProblem,
                  "re_tasks" : this.newTask,
                  "re_collaborators" : this.collaboratorsToString,
                  "re_problems" : [],
                }
              } else if(!!this.object_id)
              {
                reviewInfo = {
                  "re_parent" : this.object_id,
                  "re_parent_type" : 0,
                  "re_description" : this.rehearsal,
                  "re_problem" : this.normalProblem,
                  "re_tasks" : this.newTask,
                  "re_collaborators" : this.collaboratorsToString,
                  "re_problems" : [],
                }
              }
              this.addReview(reviewInfo);
            }
          }
          const res = await this.init();
          if(res == "success") {
            this.dialog = false;
          }
        },
    }
}
</script>

<style>
.replay_kr {
  min-height: 595px !important;
  max-height: 725px !important;
  border-radius: 8px;
}
.replay_kr_header {
  background-image: linear-gradient(270deg, rgb(133, 194, 255) 0%, rgb(40, 121, 255) 100%);
  border-radius: 0px !important;
  padding-left: 22px;
  padding-right: 22px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.fontColorWhite {
  color: white !important;
}
.fontSize17 {
  font-size: 17px !important;
}
.fontSize20 {
  font-size: 20px !important;
}
.p_0 {
  padding: 0px;
}
.replay_kr_flex {
  display: flex;
  justify-content: flex-end;
}
.mr_10 {
  margin-right: 10px;
}
.replay_kr_content {
  padding: 20px 46px 15px 42px !important;
}
.w100 {
  width: 100%;
}
.m_0 {
  margin: 0px;
}
.fontSize14 {
  font-size: 14px;
}
.fontColorBlack {
  color: rgb(3, 16, 26);
}
.fontColorLightBlack {
  color: rgb(3, 16, 26);
}
.fontWeight {
  font-weight: bold;
}
.blueStart {
  font-size: 10px;
  border: 2px solid rgb(40, 121, 255);
  border-radius: 2px;
  position: relative;
  bottom: 1px;
  margin-right: 4px;
}
.pl_15 {
  padding-left: 15px;
}
.mr_3 {
  margin-right: 3px;
}
.krNumber {
  margin-right: 3px;
  padding: 1px 10px;
  border-radius: 22px;
  color: rgb(40, 121, 255);
  background-color: rgb(227, 244, 255);
}
.pl_10_review {
  padding-left: 10px;
}
.pl_3_review {
  padding-left: 3px;
}
.rehearsal:hover .rehearsal_textarea {
  z-index: 2;
}
.rehearsal_textarea {
  transition: all 2s ease;
}
.replay_value_harvest {
  font-size: 12px;
  color: rgb(194, 203, 209);
  position: absolute;
  left: 60px;
  top: 133px;
}
.reply_value_harvest_textarea {
  transition: all 2s ease;
}
.mb_20 {
  margin-bottom: 20px;
}
.mb_5 {
  margin-bottom: 5px;
}
.mt_5 {
  margin-top: 5px;
}
.placeholder {
  position: relative;
  bottom: 60px;
  left: 15px;
  opacity: 0.5;
}
.createNewActionPaln  {
  margin: 12px 0px 5px 8px;
  padding: 0px 10px;
  font-size: 12px !important;
  color: rgb(255, 255, 255) !important;
  border-radius: 2px;
  background: rgb(40, 121, 255) !important;
  width: 109px;
}
.participants {
  height: 55px;
  width: 100%;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 10px;
}
.participants_plus {
  padding: 0px;
  border-radius: 50%;
  border: 1px solid rgb(160, 167, 173);
  cursor: pointer;
}
.d-flex {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.cursorPointer {
  cursor: pointer;
}
.h_70 {
  height: 70px;
}
.squareIcon {
  font-size: 14px !important;
  margin-right: 3px;
  color: rgb(40, 121, 255) !important;
}
.taskName {
  font-size: 14px;
  color: rgb(3, 16, 26);
}
.review_add_members {
  min-width: 300px !important;
}
</style>