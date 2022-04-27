<template>
<v-sheet class = "w100">
<v-flex class="flex_contain">
    <v-layout align-center justify-start row class="flex_contain-layout">
        <v-flex grow class="replay">复盘 ({{ year }}/{{ month }}/{{ day }})</v-flex>
        <v-flex shrink class="cursor replay_edit" style="margin-right: 20px;position:relative;bottom:1px;" @click = "updateReviewInfo">
            <v-icon style="color: rgb(29, 134, 240) !important; font-size: 19px !important;bottom:2px;">mdi-square-edit-outline</v-icon>
            编辑
        </v-flex>
        <!-- <v-flex shrink class="cursor replay_edit">
            查看详情
            <v-icon style="color: rgb(29, 134, 240) !important; font-size: 15px !important;bottom:2px;">mdi-chevron-right-circle-outline</v-icon>
        </v-flex> -->
    </v-layout>
</v-flex>
</v-sheet>
</template>

<script>

export default {
    props: ['id', 'key_id', 'object_id', 'reviewInfo', 'timestamp'],
    data() {
        return {
            year: null,
            month: null,
            day: null,
            hr: null,
            min: null,
            mode: "normal",
        }
    },
    created() {
        const time = new Date(this.timestamp);
        this.year = time.getFullYear();
        this.month = time.getMonth() + 1;
        if(this.month < 10)
        {
            this.month = "0" + this.month.toString();
        }
        this.day = time.getDate();
        if(this.day < 10)
        {
            this.day = "0" + this.day.toString();
        }
        this.hr = time.getHours();
        if(this.hr < 10)
        {
            this.hr = "0" + this.hr.toString();
        }
        this.min = time.getMinutes();
        if(this.min < 10)
        {
            this.min = "0" + this.min.toString();
        }
        if(this.reviewInfo.re_problems.length != 0)
        {
            this.mode = "advanced";
        }
    },
    methods: {
        updateReviewInfo() {
            let reviewInfo;
            if(!!this.key_id)
            {
                reviewInfo = {
                    id: this.id,
                    kr_id: this.key_id,
                    description: this.reviewInfo.re_description,
                    problem: this.reviewInfo.re_problem,
                    problems: this.reviewInfo.re_problems,
                    updateReview: true,
                    mode: this.mode,
                    tasks: this.reviewInfo.re_tasks,
                    collaborators: this.reviewInfo.re_collaborators,
                }
            } else if(!!this.object_id)
            {
                reviewInfo = {
                    id: this.id,
                    object_id: this.object_id,
                    description: this.reviewInfo.re_description,
                    problem: this.reviewInfo.re_problem,
                    problems: this.reviewInfo.re_problems,
                    updateReview: true,
                    mode: this.mode,
                    tasks: this.reviewInfo.re_tasks,
                    collaborators: this.reviewInfo.re_collaborators,
                }
            }   
            this.$emit("displayReviewModal", reviewInfo);
        }
    }
}
</script>

<style>
</style>