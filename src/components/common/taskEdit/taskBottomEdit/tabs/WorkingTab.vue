<template>
<v-flex class="right_userInfo_layflex_tabs" @click = "displayWorking">
    <v-sheet :class="workingEnable && workHour ? 'right_score_writesheet' : ''">
        <v-icon :class="workingEnable && workHour ? 'r_icon_score' : 'r_icon_mesg'">
            mdi-timer
        </v-icon>
        <span :class="workingEnable && workHour ? 'r_score_writedown' :'right_message'">
            工时
        </span>

    </v-sheet>
</v-flex>
</template>

<script>
export default {
    props: ['workingEnable'],
    data() {
        return {
            workHour: false,
        }
    },
    methods: {
        displayWorking() {
            this.workHour = true;
            this.$emit("displayWorking");
        }
    }
}
</script>

<style>
</style>