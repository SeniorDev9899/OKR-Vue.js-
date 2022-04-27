<template>
<v-flex class="right_userInfo_layflex_tabs">
      <v-layout align-center justify-start class="right_userInfo_laypadding_tabs">
        <InteractiveTab 
            :interactiveEnable = "interactiveEnable" 
            @displayInteractive = "handle_displayInteractive"
        />
        <SubTaskTab 
            :subTaskEnable = "subTaskEnable"
            @displaySubtask = "handle_displaySubtask"
        />
        <ProgressTab 
            :progressEnable = "progressEnable"
            @displayProgress = "handle_displayProgress"
        />
        <ApproveTab 
            :approveEnable = "approveEnable"
            @displayApprove = "handle_displayApprove"
        />
        <WorkingTab
            :workingEnable = "workingEnable"
            @displayWorking = "handle_displayWorking"
        />
      </v-layout>
</v-flex>
</template>

<script>
import InteractiveTab from './InteractiveTab.vue';
import SubTaskTab from './SubTaskTab.vue';
import ProgressTab from './ProgressTab.vue';
import ApproveTab from './ApproveTab.vue';
import WorkingTab from './WorkingTab.vue';

export default {
    components: {
        InteractiveTab,
        SubTaskTab,
        ProgressTab,
        ApproveTab,
        WorkingTab,
    },
    data() {
        return {
            interactiveEnable: true,
            subTaskEnable: true,
            progressEnable: true,
            approveEnable: true,
            workingEnable: true,
        }
    },
    methods: {
        handle_displayInteractive() {
            this.interactiveEnable = true;
            this.subTaskEnable = false;
            this.progressEnable = false;
            this.approveEnable = false;
            this.workingEnable = false;
            this.$emit("displayInteractiveWindow");
        },
        handle_displaySubtask() {
            this.subTaskEnable = true;
            this.interactiveEnable = false;
            this.progressEnable = false;
            this.approveEnable = false;
            this.workingEnable = false;
            this.$emit("displaySubtaskWindow");
        },
        handle_displayProgress() {
            this.progressEnable = true;
            this.interactiveEnable = false;
            this.subTaskEnable = false;
            this.approveEnable = false;
            this.workingEnable = false;
            this.$emit("displayProgressWindow");
        },
        handle_displayApprove() {
            this.approveEnable = true;
            this.interactiveEnable = false;
            this.subTaskEnable = false;
            this.progressEnable = false;
            this.workingEnable = false;
            this.$emit("displayApproveWindow");
        },
        handle_displayWorking() {
            this.workingEnable = true;
            this.interactiveEnable = false;
            this.subTaskEnable = false;
            this.progressEnable = false;
            this.approveEnable = false;
            this.$emit("displayWorkingWindow");
        }
    }
}
</script>

<style>
.right_userInfo_flex {
  width: 100%;
}
.right_userInfo_laypadding_tabs {
  padding: 10px;
  width: 70%;
}
.right_userInfo_layflex_tabs {
    padding: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer !important;
    width: 100%;

}
.right_score_writesheet2 {
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
</style>