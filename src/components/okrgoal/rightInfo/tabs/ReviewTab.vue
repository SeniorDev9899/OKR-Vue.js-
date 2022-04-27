<template>
<v-flex class="right_userInfo_layflex_tabs" @click = "displayReview">
    <v-sheet class="right_score_writesheet" :class="reviewEnable && review ? 'right_score_writesheet_add_1' : ''">
        <v-icon :class="reviewEnable && review ? 'r_icon_score' : 'r_icon_mesg'">
            mdi-notebook-edit-outline
        </v-icon>
        <span :class="reviewEnable && review ? 'r_score_writedown' :'right_message'">
            复盘
        </span>
    </v-sheet>
</v-flex>
</template>

<script>
export default {
    props: ['reviewEnable'],
    data() {
        return {
            review: false,
        }
    },
    created() {
        this.review = false;
    },
    methods: {
        displayReview() {
            this.review = true;
            this.$emit("displayReview");
        }
    }
}
</script>

<style>
</style>