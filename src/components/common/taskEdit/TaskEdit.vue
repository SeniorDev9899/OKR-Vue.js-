<template>
    <v-navigation-drawer v-model="show" absolute right temporary width="720" overlay-color="white" overlay-opacity="0" color="rgb(250, 251, 252)" class="task-editor">
        <TaskEditHeader v-if="!!taskInfo" :content="taskInfo" @closeTaskEditor="handle_closeTaskEditor" @selectPriority="handle_selectPriority" />
        <TaskContentEdit v-if="!!taskInfo" :content="taskInfo" @updateTaskOne="handle_updateTaskOne" />
        <BottomEdit v-if="!!taskInfo" :content="taskInfo" @showSubTaskEditor="handle_showSubTaskEditor" />
    </v-navigation-drawer>
</template>

<script>
import TaskEditHeader from '@/components/common/taskEdit/header/TaskEditHeader.vue';
import TaskContentEdit from '@/components/common/taskEdit/taskContentEdit/ContentEdit.vue';
import BottomEdit from '@/components/common/taskEdit/taskBottomEdit/BottomEdit.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    components: {
        TaskEditHeader,
        TaskContentEdit,
        BottomEdit,
    },
    data() {
        return {
            show: false,
            taskID: null,
            taskInfo: null,
        }
    },
    computed: {
        ...mapGetters('task', ['task']),
    },
    methods: {
        ...mapActions('task', ['getTaskById']),
        ...mapActions('task', ['updateTaskOne']),
        async openTaskEditor(prop) {
            this.show = true;
            const res = await this.getTaskById({"task_id" : prop.task_id});
            if(res == "success") {
                this.taskInfo = this.task;
            }
        },
        handle_closeTaskEditor() {
            this.show = false;
        },
        handle_selectPriority(prop) {
            this.priorityValue = prop;
        },
        async handle_showSubTaskEditor(prop) {
            this.show = true;
            const res = await this.getTaskById({"task_id" : prop});
            if(res == "success") {
                this.taskInfo = this.task;
            }
        },
        async handle_updateTaskOne(prop) {
            const res = await this.updateTaskOne(prop);
            if(res == "success") {
                const res = await this.getTaskById({"task_id" : prop.task_id});
                if(res == "success") {
                    this.taskInfo = this.task;
                }
            }
        }
    }
}
</script>

<style>
.task-editor {
    z-index: 12;
}
</style>