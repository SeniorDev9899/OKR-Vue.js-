<template>
<v-flex class="right_userInfo_layflex_tabs" @click = "displayProgress">
    <v-sheet :class="progressEnable && progress ? 'right_score_writesheet2' : ''">
        <v-icon :class="progressEnable && progress ? 'r_icon_score' : 'r_icon_mesg'">
            mdi-notebook-edit-outline
        </v-icon>
        <span :class="progressEnable && progress ? 'r_score_writedown' :'right_message'">
            进展
        </span>
    </v-sheet>
</v-flex>
</template>

<script>
export default {
    props: ['progressEnable'],
    data() {
        return {
            progress: false,
        }
    },
    methods: {
        displayProgress() {
            this.progress = true;
            this.$emit("displayProgress");
        }
    }
}
</script>

<style>
</style>