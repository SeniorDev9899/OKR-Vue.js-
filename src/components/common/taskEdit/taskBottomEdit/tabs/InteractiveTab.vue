<template>
<v-flex class="right_userInfo_layflex_tabs" @click = "displayInteractive">
    <v-sheet :class="interactiveEnable && progress_interactive ? 'right_score_writesheet2' : ''">
        <v-icon :class="interactiveEnable && progress_interactive ? 'r_icon_score' : 'r_icon_mesg'">
            mdi-message-processing-outline
        </v-icon>
        <span :class="interactiveEnable && progress_interactive ? 'r_score_writedown' :'right_message'">
            互动
        </span>
    </v-sheet>
</v-flex>
</template>

<script>
export default {
    props: ['interactiveEnable'],
    data() {
        return {
            progress_interactive: true,
        }
    },
    methods: {
        displayInteractive() {
            this.progress_interactive = true;
            this.$emit("displayInteractive");
        }
    }
}
</script>

<style>
</style>