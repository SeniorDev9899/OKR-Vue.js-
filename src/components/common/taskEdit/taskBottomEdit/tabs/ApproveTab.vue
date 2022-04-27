<template>
<v-flex class="right_userInfo_layflex_tabs" @click = "displayApprove">
    <v-sheet :class="approveEnable && approve ? 'right_score_writesheet2' : ''">
        <v-icon :class="approveEnable && approve ? 'r_icon_score' : 'r_icon_mesg'">
            mdi-camera-control
        </v-icon>
        <span :class="approveEnable && approve ? 'r_score_writedown' :'right_message'">
            审批
        </span>
    </v-sheet>
</v-flex>
</template>

<script>
export default {
    props: ['approveEnable'],
    data() {
        return {
            approve: false,
        }
    },
    methods: {
        displayApprove() {
            this.approve = true;
            this.$emit("displayApprove");
        }
    }
}
</script>

<style>
</style>