<template>
    <v-dialog
        v-model="visibility"
        width="365"
        overlay-opacity=0
        overlay-color="white"
        :content-class="task_rest_attribute ? 'rest_visibility' : 'visibility'"
    >
        <v-card-title class="p_0">
            <v-system-bar height="32" class="p_0 width100">
                <v-container d-flex align-center justify-start class="p_0 height100">
                    <v-layout row class="width100 m_0 visibility_header height100 p_3_10">
                        <v-flex grow class="visibility_header_title"><span>修改可见范围</span></v-flex>
                        <v-flex shrink @click="visibility=false"><v-icon class="visibility_header_close">mdi-close</v-icon></v-flex>
                    </v-layout>
                </v-container>    
            </v-system-bar>
        </v-card-title>
        <v-card-text class="p_15_15"> 
            <v-layout d-flex align-center justify-start row class="width100 m_0">
                <v-flex shrink><span>可见范围：</span></v-flex>
                <v-flex grow>
                    <v-radio-group v-model="visible" row hide-details class="m_0 p_0">
                        <v-radio v-for="(range, index) in visibilityRanges" :key="index" :label="range.text" :value="index" class="customClass"></v-radio>
                    </v-radio-group>
                </v-flex>
            </v-layout>
        </v-card-text>   
        <v-card-actions>
            <v-layout d-flex align-center justify-end row class="width100 m_0">
                <v-flex grow d-flex align-center justify-end class="mr_10"><v-btn @click="visibility = false">取消</v-btn></v-flex>
                <v-flex shrink><v-btn color="primary" @click="determinVisibilityRange">确定</v-btn></v-flex>
            </v-layout>
        </v-card-actions>
    </v-dialog>
</template>

<script>
import {constant} from '@/constants/constant.js';

export default {
    data() {
        return {
            visibility: false,
            visible: 1,
            task_rest_attribute: false,
            task_visible_value: null,
            visibilityRanges: null,
            taskVisible: null,
        }
    },
    created() {
        this.visibilityRanges = constant.taskVisibility;
    },
    methods: {
        openVisibility(prop) {
            if(!!prop) 
            {
                if(prop.task_rest_attribute == true)
                {
                    this.task_rest_attribute = true;
                    this.task_visible_value = prop.value;
                    this.taskVisible = this.visibilityRanges.filter((f) => f.value == prop.value)[0];
                    this.visible = this.taskVisible.value;
                }
                this.taskVisible = this.visibilityRanges.filter((f) => f.value == prop.value)[0];
                this.visible = this.taskVisible.value;
            }
            this.visibility = true;
        },
        determinVisibilityRange() {
            this.$emit("setVisibleRange", this.visibilityRanges[this.visible]);
            this.visibility = false;
        },
    }
}
</script>

<style>
.visibility_header {
    background-image: linear-gradient(90deg,#1D86F0 6%,#5CADFF 94%);
}
.visibility {
    position: absolute;
    top: 80px;
    right: 90px;
    height: 141px !important;
    background-color: white;
}
.rest_visibility {
    position: absolute;
    bottom: 170px;
    right: 150px;
    height: 141px !important;
    background-color: white;
}
.height100 {
    height: 100%;
}
.p_3_10 {
    padding: 3px 10px;
}
.p_15_15 {
    padding: 15px !important;
}
.mr_10 {
    margin-right: 10px;
}
.visibility_header_title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: white;
}
.visibility_header_close {
    color: white !important;
    cursor: pointer;
}
.customClass {
    margin-right: 10px !important;
}
.customClass .v-input--selection-controls__input {
    margin-right: 2px !important;
}
.customClass .v-input--selection-controls__ripple {
    border-radius: 50% !important;
    cursor: pointer !important;
    height: 17px !important;
    position: absolute !important;
    transition: inherit !important;
    width: 17px !important;
    left: -4px !important;
    top: calc(50% - 16px) !important;
    margin: 7px !important;
}
.customClass i {
    font-size: 16px !important;
}
.customClass label {
    font-size: 12px !important;
}
</style>