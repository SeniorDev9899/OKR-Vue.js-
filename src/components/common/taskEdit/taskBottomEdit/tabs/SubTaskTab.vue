<template>
<v-flex class="right_userInfo_layflex_tabs" @click = "displaySubtask">
    <v-sheet :class="subTaskEnable && sub_task ? 'right_score_writesheet2' : ''">
        <v-icon :class="subTaskEnable && sub_task ? 'r_icon_score' : 'r_icon_mesg'">
            mdi-checkbox-marked-outline
        </v-icon>
        <span :class="subTaskEnable && sub_task ? 'r_score_writedown' :'right_message'">
            子任务
        </span>
    </v-sheet>
</v-flex>
</template>

<script>
export default {
    props: ['subTaskEnable'],
    data() {
        return {
            sub_task: false,
        }
    },
    methods: {
        displaySubtask() {
            this.sub_task = true;
            this.$emit("displaySubtask");
        }
    }
}
</script>

<style>
</style>