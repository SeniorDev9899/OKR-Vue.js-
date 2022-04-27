<template>
    <v-dialog v-model="show" width="300" overlay-opacity=0 overlay-color="white" :content-class="taskTargetPrice ? 'task_target_modal' : 'unit_modal'">
        <v-card-text>
            <v-radio-group row v-model="unit" style="margin:0px;">
                <v-radio v-for="(unit, i) in units"  :key="i" :value="i+1" :label="unit.value"></v-radio>
            </v-radio-group>
        </v-card-text>
        <v-card-actions>
            <v-layout d-flex align-center justify-start row style="width:100%;margin:0px;padding:0px 10px;">
                <v-flex align-center justify-start grow><span class="unit_action_text">(目标值单位可联系管理员设置)</span></v-flex>
                <v-flex align-center justify-end shrink @click="submitUnit"><v-btn color="primary">确认</v-btn></v-flex>
            </v-layout>
        </v-card-actions>
    </v-dialog>
</template>

<script>
export default {
    data() {
        return {
            show: false,
            unit: 1,
            units: [
                {value: "元"},
                {value: "个"},
            ],
            taskTargetPrice: false,
        }
    },
    methods: {
        open(prop) {
            this.show = true;
            if(!!prop.type) {
                if(prop.type == "target_price") {
                    this.taskTargetPrice = true;
                }
            }
        },
        submitUnit() {
            this.$emit("unitSubmit", this.unit);
            this.show = false;
        }
    }
}
</script>

<style>
.unit_action_text {
    color: rgb(191, 195, 199);
    font-size: 14px;
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,Arial,sans-serif;
}
.unit_modal {
    position: absolute;
    top: 391px;
    right: 70px;
    overflow: hidden;
    background-color: white;
}
.task_target_modal {
    position: absolute;
    top: 210px;
    right: 290px;
    overflow: hidden;
    background-color: white;
}
</style>