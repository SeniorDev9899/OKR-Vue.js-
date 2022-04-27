<template>
<v-flex class="w100">
<v-sheet class = "w100">
    <v-flex class = "w100">
        <span class = "blueStart"></span>
        <span class = "fontSize14 fontColorBlack fontWeight">问题与不足</span>
    </v-flex>
    <v-flex class = "w100 pl_10_review mb_20">
        <v-textarea
            outlined
            auto-grow
            hide-details
            height="70"
            rows="3"
            placeholder = "请描述出现的某个问题并针对该问题展开分析"
            class = "replay_value_harvest_text"
            v-model = "deficience"
            @input = "inputNormalProblem"
        >
        </v-textarea>
    </v-flex>
</v-sheet>
</v-flex>
</template>

<script>
export default {
    props: ['problem'],
    data() {
        return {
            deficience: ""
        }
    },
    created() {
        this.deficience = this.problem;
        if(this.deficience == "")
        {
            this.$emit("inputNormalProblem", "");
        }
    },
    watch: {
        problem(v) {
            this.deficience = v;
        }
    },
    methods: {
        inputNormalProblem() {
            this.$emit("inputNormalProblem", this.deficience);
        }
    }
}
</script>

<style>
</style>