<template>
    <v-dialog
        v-model="targetPriceModal"
        width="320"
        overlay-opacity=0
        overlay-color="white"
        content-class="target-price-set"
    >
        <v-card>
            <v-card-title class="target_price_p_10">
                <span class="target-price-set-title">请设置目标值</span>
            </v-card-title>
            <v-card-text class="target_price_p_10 d-flex align-center justify-start" style="padding-top:0px !important;">
                <span class="d-flex align-center justify-start mr_7" @click="displayTargetPriceUnit">
                    <span>目标值({{ units[unit-1].value }})</span><v-icon size="17">mdi-arrow-down-thick</v-icon>
                </span>
                <UnitModal ref="taskUnit" @unitSubmit="handle_unitSubmit" />
                <v-text-field v-model="targetPrice" type="number" hide-details single-line solo></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-layout d-flex align-center justify-end row class="width100 m_0">
                    <v-flex grow d-flex align-center justify-end class="mr_10"><v-btn @click="targetPriceModal = false">取消</v-btn></v-flex>
                    <v-flex shrink><v-btn color="primary" @click="determineTargetPrice">确定</v-btn></v-flex>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import UnitModal from '@/components/common/taskEdit/taskContentEdit/UnitModal.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    data() {
        return {
            taskId: null,
            taskParentObject: null,
            targetPriceModal: false,
            targetPrice: null,
            unit: 1,
            units: [
                {value: "元"},
                {value: "个"},
            ],
        }
    },
    components: {
        UnitModal,
    },
    methods: {
        ...mapActions('task', ['updateTaskOne']),
        show(prop) {
            this.taskId = prop['task_id'];
            this.taskParentObject = prop['task_parent_object'];
            this.targetPriceModal = true;
        },
        determineTargetPrice() {
            this.updateTaskOne({
                'task_id' : this.taskId,
                'task_parent_object' : this.taskParentObject,
                'task_target_price' : parseFloat(this.targetPrice).toFixed(2),
                'task_real_price' : 0,
                'task_unit' : this.unit,
                'task_progress' : 0
            });
            this.targetPriceModal = false;
        },
        displayTargetPriceUnit() {
            this.$refs.taskUnit.open({type: "target_price"});
        },
        handle_unitSubmit(prop) {
            this.unit = prop;
        }
    }
}
</script>

<style>
.target-price-set {
    position: absolute;
    right: 310px;
    top: 50px;
}
.target_price_p_10 {
    padding: 10px 10px !important;
}
.target-price-set-title {
    font-size: 18px;
    color: #1b1818;
}
.mr_7 {
    margin-right:7px;
    cursor: pointer;
}
</style>