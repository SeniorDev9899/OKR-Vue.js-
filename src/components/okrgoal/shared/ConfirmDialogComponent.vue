<template>
    <v-menu 
        offset-y 
        z-index = 202
        left
    >
        <template v-slot:activator = "{ on, attrs }">
            <span v-bind="attrs" v-on = "on">
                <slot></slot>
            </span>
        </template>
        <v-list class = "">
            <v-list-item v-if="option == 'endGoal'">
                确认要结束目标吗？
            </v-list-item>
            <v-list-item v-if="option == 'restartGoal'">
                确认要重新开启该目标？
            </v-list-item>
            <v-list-item v-if="option == 'kr'">
                该关键成果将被删除不可恢复！请谨慎操作
            </v-list-item>
            <v-list-item v-if="option == 'obj'">
                目标删除操作不可恢复！请谨慎操作
            </v-list-item>
            <v-list-item v-if="option == 'obj'">
                <v-radio-group v-model="ob_status" @click="stop">
                    <v-radio @click="stop" :value="0" label="不删除目标下的任务"></v-radio>
                    <v-radio @click="stop" :value="1" label="同时删除目标下所有任务"></v-radio>
                    <v-radio @click="stop" :value="2" label="同时删除我负责的，我参与的，我派发的任务"></v-radio>
                </v-radio-group>
            </v-list-item>
            <v-list-item v-if="option == 'progress'">
                此操作不可恢复，您确定删除吗？
            </v-list-item>
            <v-list-item v-if="option == 'intercom'">
                此操作不可恢复，您确定删除吗？
            </v-list-item>
            <v-list-item v-if="option == 'task_remove'">
                该事项将被删除不可恢复！请谨慎操作
            </v-list-item>
            <v-list-item v-if="option == 'task'">
                您确定删除目标值和实际值吗，删除后会影响关联任务的实际值统计！
            </v-list-item>
            <v-list-item v-if="option == 'subtask'">
                此操作不可恢复，您确定删除吗？
            </v-list-item>
            <v-list-item v-if="option == 'workinghour'">
                此操作不可恢复，您确定删除吗？
            </v-list-item>
            <v-list-item v-if="option == 'reviewProblem'">
                确定删除整个问题与不足1吗？
            </v-list-item>
            <v-list-item class="d-flex justify-end">
                <v-btn depressed class="mr-4">
                    取消
                </v-btn>
                <v-btn
                    depressed
                    color="primary"
                    @click="clickEvent"
                >
                    提交
                </v-btn>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
export default {
    name: 'ConfirmDialogComponent',
    props: ['option'],
    data() {
        return {
            ob_status: 0
        }
    },
    methods: {
        clickEvent(ev) {
            if(this.option == 'obj') {
                this.$emit('click', this.ob_status);    
            }else{
                this.$emit('click', true);
            }
        },
        stop(ev) {
            ev.stopPropagation();
        }
    }
}
</script>