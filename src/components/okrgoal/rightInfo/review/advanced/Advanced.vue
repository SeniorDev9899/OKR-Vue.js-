<template>
<v-sheet class = "w100">
    <v-flex class = "w100">
        <v-layout align-center justify-start row class = "m_0 w100">
            <v-flex><span class = "blueStart"></span><span class = "fontSize14 fontColorBlack fontWeight">问题与不足{{ id }}</span></v-flex>
            <ConfirmDialogComponent v-on:click="bool => confirmClick(bool)" :option="option">
                <v-flex d-flex justify-end><span class = "delete">删除</span></v-flex>
            </ConfirmDialogComponent>
        </v-layout>
    </v-flex>
    <v-flex class = "w100 pl_10_review mb_20">
        <v-layout align-center justify-start column>
            <v-flex class = "w100">
                <v-textarea
                    outlined
                    auto-grow
                    hide-details
                    height="70"
                    rows="3"
                    placeholder = "请描述出现的某个问题并针对该问题展开分析"
                    class = "replay_value_harvest_text"
                    v-model = "setProblem"
                    @input = "inputAdvancedProblem"
                >
                </v-textarea>
            </v-flex>
            <v-flex class = "w100 mt_10">
                <span class = "root-cause">根本原因</span>
            </v-flex>
            <v-flex class = "w100">
                <v-textarea
                    outlined
                    auto-grow
                    hide-details
                    height="70"
                    rows="3"
                    placeholder = "请填写问题出现的根本原因"
                    class = "replay_value_harvest_text"
                    v-model = "setReason"
                    @input = "inputAdvancedReason"
                >
                </v-textarea>
            </v-flex>
            <v-flex class = "w100 mt_10">
                <span class = "root-cause">相应解决措施</span>
            </v-flex>
            <v-flex class = "w100">
                <v-textarea
                    outlined
                    auto-grow
                    hide-details
                    height="70"
                    rows="3"
                    placeholder = "请根据上述原因给出可落地的解决措施"
                    class = "replay_value_harvest_text"
                    v-model = "setSolution"
                    @input = "inputAdvancedSolution"
                >
                </v-textarea>
            </v-flex>
        </v-layout>
    </v-flex>
</v-sheet>
</template>

<script>
import ConfirmDialogComponent from '@/components/okrgoal/shared/ConfirmDialogComponent.vue';

export default {
    props: ['id', 'rp_id', 'problem', 'reason', 'solution'],
    components: {
        ConfirmDialogComponent
    },
    created() {
        if(this.problem)
        {
            this.setProblem = this.problem;
        } else {
            this.setProblem = "";
        }
        if(this.reason)
        {
            this.setReason = this.reason;
        } else {
            this.setReason = "";
        }
        if(this.solution)
        {
            this.setSolution = this.solution;
        } else {
            this.setSolution = "";
        }
    },
    data() {
        return {
            setProblem: "",
            setReason: "",
            setSolution: "",
            option: "reviewProblem"
        }
    },
    methods: {
        confirmClick(prop) {
            if(prop == true){
                if(this.rp_id)
                {
                    this.$emit("deleteAdvancedItem", {
                        count: this.id,
                        rp_id: this.rp_id,
                    });
                } else {
                    this.$emit("deleteAdvancedItem", {
                        count: this.id,
                    });
                }
            }
        },
        inputAdvancedProblem(e) {
            if(this.rp_id)
            {
                this.$emit("inputAdvancedProblem", { count: this.id, rp_id: this.rp_id, problem: this.setProblem });
            } else {
                this.$emit("inputAdvancedProblem", { count: this.id, problem: this.setProblem });
            }
        },
        inputAdvancedReason(e) {
            if(this.rp_id)
            {
                this.$emit("inputAdvancedReason", { count: this.id, rp_id: this.rp_id, reason: this.setReason });
            } else {
                this.$emit("inputAdvancedReason", { count: this.id, reason: this.setReason });
            }
        },
        inputAdvancedSolution(e) {
            if(this.rp_id)
            {  
                this.$emit("inputAdvancedSolution", { count: this.id, rp_id: this.rp_id, solution: this.setSolution });
            } else {
                this.$emit("inputAdvancedSolution", { count: this.id, solution: this.setSolution });
            }
        }
    }
}
</script>

<style>
.delete {
    color: rgb(40, 121, 255);
    cursor: pointer;
}
.m_0 {
    margin: 0px;
}
.root-cause {
    margin-top: 3px;
    font-weight: 500;
    color: rgb(86, 94, 102);
    font-size: 16px;
}
.mt_10 {
    margin-top: 10px;
}
.ml_5 {
    margin-left: 5px;
}
.ad_problem_deficience {
    color: rgb(40, 121, 255);
    font-size: 14px;
    font-weight: bold;
}
.ad_problem_deficience_plusIcon {
    font-size: 18px !important;
    color: rgb(40, 121, 255) !important;
    bottom: 2px;
}
.cursorPointer {
    cursor: pointer !important;
}
</style>