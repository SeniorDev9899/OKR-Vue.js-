<template>
    <v-sheet class="right_task">
        <v-container align-center justify-start d-flex>
            <v-layout align-center justify-start column>
                <Tabs @displayInteractiveWindow="handle_displayInteractiveWindow" @displaySubtaskWindow="handle_displaySubtaskWindow" @displayProgressWindow="handle_displayProgressWindow" @displayApproveWindow="handle_displayApproveWindow" @displayWorkingWindow="handle_displayWorkingWindow"/>
                <Interactive v-if="interactiveWindow" :task_id="content.task_id" />
                <SubTask v-if="subTasksWindow" :task_id="content.task_id" :sub_tasks="content.task_tasks" @showSubTaskEditor="handle_showSubTaskEditor" />
                <Progress v-if="progressWindow" :task_id="content.task_id" />
                <Approve v-if="approveWindow" />
                <WorkingHour v-if="workingWindow" :task_id="content.task_id" />
            </v-layout>
        </v-container>
    </v-sheet>
</template>

<script>
import Tabs from '@/components/common/taskEdit/taskBottomEdit/tabs/Tabs.vue';
import Interactive from '@/components/common/taskEdit/taskBottomEdit/interactive/Interactive.vue';
import Progress from '@/components/common/taskEdit/taskBottomEdit/progress/Progress.vue';
import SubTask from '@/components/common/taskEdit/taskBottomEdit/subtask/Subtask.vue';
import Approve from '@/components/common/taskEdit/taskBottomEdit/approve/Approve.vue';
import WorkingHour from '@/components/common/taskEdit/taskBottomEdit/workingHour/WorkingHour.vue';

export default {
    props: ['content'],
    data() {
        return {
            // State to store status of interactiveWindow
            interactiveWindow: true, 
             
            // State to store status of subtasksWindow
            subTasksWindow: false,

            // State to store status of progress
            progressWindow: false,

            // State to store status of Approve
            approveWindow: false,

            // State to store status of Working 
            workingWindow: false,
        }
    },
    components: {
        Tabs,
        Interactive,
        Progress,
        SubTask,
        Approve,
        WorkingHour,
    },
    methods: {
        // Handle Interactive Window Display
        handle_displayInteractiveWindow() {
            this.interactiveWindow = true;
            this.subTasksWindow = false;
            this.progressWindow = false;
            this.approveWindow = false;
            this.workingWindow = false;
        },
        // Handle Sub Task Window Display
        handle_displaySubtaskWindow() {
            this.subTasksWindow = true;
            this.interactiveWindow = false;
            this.progressWindow = false;
            this.approveWindow = false;
            this.workingWindow = false;
        },
        // Handle Progress Window Display
        handle_displayProgressWindow() {
            this.progressWindow = true;
            this.interactiveWindow = false;
            this.subTasksWindow = false;
            this.approveWindow = false;
            this.workingWindow = false;
        },
        // Handle Approve Window Display
        handle_displayApproveWindow() {
            this.approveWindow = true;
            this.interactiveWindow = false;
            this.subTasksWindow = false;
            this.progressWindow = false;
            this.workingWindow = false;
        },
        // Handle Working Hour Window Display
        handle_displayWorkingWindow() {
            this.workingWindow = true;
            this.approveWindow = false;
            this.interactiveWindow = false;
            this.subTasksWindow = false;
            this.progressWindow = false;
        },
        // Handle SubTaskEditor Window Display
        handle_showSubTaskEditor(prop) {
            this.$emit("showSubTaskEditor", prop);
        }
    }
}
</script>

<style>
.right_task {
  background-color: white;
  margin-top: 50px;
}
</style>