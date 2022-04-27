<template>
<div class="text-center">
    <v-dialog v-model="dialog" width="600">
        <v-card>
            <v-card-title class="text-h5 lighten-2 d-flex justify-space-between align-center">
                <span class="title" v-if="mode == 'kr_mode'">更新 KR 完成度</span>
                <span class="title" v-else>更新目标完成度</span>
                <v-spacer></v-spacer>
                <span>
                    <v-icon @click="dialog = false">
                        mdi-close
                    </v-icon>
                </span>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="pt-4">
                <v-layout class="first-line  justify-start">
                    <v-flex class="left">
                        <InputComponent :percentValue="auto_switch ? autoPercent : percent" :disable="auto_switch" v-on:inputValue="param => getPercentValue(param)"></InputComponent>
                    </v-flex>
                    <v-flex style="width: 50%;">
                        <template class="right d-flex align-center" v-if="!auto_switch">
                            <v-icon class="mr-2" style="font-size: 16px; color: #f6bd16;">mdi-thumb-up-outline</v-icon>
                            <span style="color: #f6bd16;">推荐</span>
                            <span class="progress-hint">（KR完成度11%） </span>
                        </template>
                        <!-- <template  v-if="auto_switch">
                            系统根据KR完成度和权重自动计算
                        </template> -->
                    </v-flex>
                </v-layout>
                <v-layout class="second-line my-4">
                    <v-flex class="left text-right">
                        <label>状态</label>
                    </v-flex>
                    <v-flex class="right d-flex justify-start">
                        <a class="d-flex justify-space-between align-center mr-2" @click="() => selectColor('blue')">
                            <div class="blue-circle mr-2">
                                <div v-if="blue_stick" class="inner-circle"></div>
                            </div>
                            <span class="mt-1">正常</span>
                        </a>
                        <a class="d-flex justify-space-between align-center mr-2" @click="() => selectColor('yellow')">
                            <div class="yellow-circle mr-2">
                                <div v-if="yellow_stick" class="inner-circle"></div>
                            </div>
                            <span class="mt-1">有风险</span>
                        </a>
                        <a class="d-flex justify-space-between align-center" @click="() => selectColor('red')">
                            <div class="red-circle mr-2">
                                <div v-if="red_stick" class="inner-circle"></div>
                            </div>
                            <span class="mt-1">已延期</span>
                        </a>
                    </v-flex>
                </v-layout>
                <v-layout class="third-line">
                    <v-flex class="left text-right">
                        <label>进展</label>
                    </v-flex>
                    <v-flex class="right">
                        <textarea v-model="comment"></textarea>
                    </v-flex>
                </v-layout>
                <v-container class="goal-complete mt-4">
                    <v-row class="d-flex justify-right">
                        <a v-if="!goalCompleteOpen" @click="goalCompleteOpen = !goalCompleteOpen">
                            目标完成度自动更新设置
                            <v-icon style="font-size: 20px;">
                                mdi-chevron-down
                            </v-icon>
                        </a>
                    </v-row>
                    <v-row>
                        <v-col cols="7">
                            <span class="mr-auto" v-if="goalCompleteOpen">
                                <div class="remember d-flex align-center justify-start">
                                    <div class="blue-stick mr-2"></div>
                                    设置目标完成度自动更新
                                    <v-switch class="ml-4 mx-0 my-0 pt-0" color="#2879ff" @click="autoSwitch"></v-switch>
                                </div>
                                <span class="remember-description" v-if="auto_switch">
                                    <v-layout justify-start class="py-2 cursor-pointer" @click="rememberChange(1)">
                                        <div class="d-flex align-center justify-start mr-2">
                                            <div class="blue-circle">
                                                <div v-if="remember_option == 1" class="inner-circle"></div>
                                            </div>
                                        </div>
                                        <div class="d-flex align-center">
                                            根据关键成果KR完成度自动更新
                                        </div>
                                        <div class="d-flex align-center ml-4">
                                            <ToolTipComponent tooltipText="tooltip text here" direction="top">
                                                <v-icon>
                                                    mdi-comment-question-outline
                                                </v-icon>
                                            </ToolTipComponent>
                                        </div>
                                    </v-layout>
                                    <v-layout justify-start @click="rememberChange(2)">
                                        <div class="d-flex align-center justify-start mr-2">
                                            <div class="blue-circle ">
                                                <div v-if="remember_option == 2" class="inner-circle"></div>
                                            </div>
                                        </div>
                                        <div class="d-flex align-center">
                                            根据子目标完成度自动更新
                                        </div>
                                        <div>
                                            <ToolTipComponent tooltipText="tooltip text here" direction="top">
                                                <v-icon>
                                                    mdi-comment-question-outline
                                                </v-icon>
                                            </ToolTipComponent>
                                        </div>
                                    </v-layout>
                                </span>
                            </span>
                        </v-col>

                        <v-col class="d-flex justify-right">
                            <a v-if="goalCompleteOpen" @click="goalCompleteOpen = !goalCompleteOpen">
                                收起
                                <v-icon style="font-size: 20px;">
                                    mdi-chevron-up
                                </v-icon>
                            </a>
                        </v-col>

                    </v-row>
                </v-container>
                <!-- <div class="goal-complete d-flex justify-end mt-8">
                    <a v-if="!goalCompleteOpen" @click="goalCompleteOpen = !goalCompleteOpen">
                        目标完成度自动更新设置
                        <v-icon style="font-size: 20px;">
                            mdi-chevron-down
                        </v-icon>
                    </a>
                    <span class="mr-auto" v-if="goalCompleteOpen">
                        <div class="remember d-flex align-center justify-start">
                            <div class="blue-stick mr-2"></div>
                            设置目标完成度自动更新
                            <v-switch
                                class="ml-4 mx-0 my-0 pt-0"
                                color="#2879ff"
                                @click="autoSwitch"
                            ></v-switch>
                        </div>
                        <span class="remember-description" v-if="auto_switch">
                            <v-layout justify-start class="py-2 cursor-pointer" @click="rememberChange(1)">
                                <v-flex class="d-flex align-center justify-start mr-2">
                                    <div class="blue-circle">
                                        <div v-if="remember_option == 1" class="inner-circle"></div>
                                    </div>
                                </v-flex>
                                <v-flex class="d-flex align-center">
                                    根据关键成果KR完成度自动更新
                                </v-flex>
                                <v-flex class="d-flex align-center ml-4">
                                    <ToolTipComponent tooltipText="tooltip text here" direction="top">
                                        <v-icon>
                                            mdi-comment-question-outline
                                        </v-icon>
                                    </ToolTipComponent>
                                </v-flex>
                            </v-layout>
                            <v-layout justify-start  @click="rememberChange(2)">
                                <v-flex class="d-flex align-center justify-start mr-1">
                                    <div class="blue-circle ">
                                        <div v-if="remember_option == 2" class="inner-circle"></div>
                                    </div>
                                </v-flex>
                                <v-flex class="d-flex align-center">
                                    根据子目标完成度自动更新
                                </v-flex>
                                <v-flex>
                                    <ToolTipComponent tooltipText="tooltip text here" direction="top">
                                        <v-icon>
                                            mdi-comment-question-outline
                                        </v-icon>
                                    </ToolTipComponent>
                                </v-flex>
                            </v-layout>
                        </span>
                    </span>
                    <a v-if="goalCompleteOpen" @click="goalCompleteOpen = !goalCompleteOpen">
                        收起
                        <v-icon style="font-size: 20px;">
                            mdi-chevron-up
                        </v-icon>
                    </a>
                </div> -->
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="close" text @click="closeDialog" outlined>取消</v-btn>
                <v-btn class="save" text @click="saveProgress">确定</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
import InputComponent from '@/components/okrgoal/shared/InputComponent.vue';
import ToolTipComponent from '@/components/okrgoal/shared/ToolTipComponent.vue';
import {
    mapGetters,
    mapActions
} from "vuex";

export default {
    name: 'PercentDialogComponent',
    props: ['percent', 'autoPercent', 'isAuto'],
    components: {
        InputComponent,
        ToolTipComponent
    },
    data() {
        return {
            dialog: false,
            mode: '',
            goalCompleteOpen: this.isAuto !== 0 && !!this.isAuto ? true : false,
            auto_switch: this.isAuto !== 0 && !!this.isAuto ? true : false,
            blue_stick: true,
            yellow_stick: false,
            red_stick: false,
            remember_option: 1,
            percentValue: 0,
            comment: '',
            changed: false
        }
    },
    mounted() {},
    computed: {
        ...mapGetters("auth", ["authUser"])
    },
    methods: {
        autoSwitch() {
            this.auto_switch = !this.auto_switch;
        },
        rememberChange(param) {
            this.remember_option = param;
        },
        openDialog(mode) {
            this.mode = mode;
            this.dialog = true;
        },
        closeDialog() {
            this.dialog = false;
            this.goalCompleteOpen = this.isAuto !== 0 ? true : false;
            this.comment = '';
        },
        selectColor(param) {
            this.blue_stick = param == 'blue' && true;
            this.yellow_stick = param == 'yellow' && true;
            this.red_stick = param == 'red' && true;
        },
        getPercentValue(param) {
            this.percentValue = param;
            this.changed = true;
        },
        saveProgress() {
            let status = '';
            if (this.blue_stick) {
                status = 0;
            }
            if (this.yellow_stick) {
                status = 1;
            }
            if (this.red_stick) {
                status = 2;
            }

            let progress_obj = {
                pr_parent: '',
                pr_creator: this.authUser.id,
                pr_parent_type: this.mode == 'kr_mode' ? 1 : 0,
                pr_percent: !this.auto_switch ? this.percentValue : this.autoPercent,
                pr_status: status,
                pr_description: this.comment
            }
            this.$emit('savePercentValue', progress_obj);
            this.$emit('saveProgressOption', !this.auto_switch ? 0 : this.remember_option);
            this.dialog = false;
            this.comment = '';
        }
    }
}
</script>

<style>
.cursor-pointer {
    cursor: pointer;
}

.title {
    font-size: 18px !important;
    font-weight: bold !important;
    line-height: 28px !important;
    color: rgb(20, 28, 40);
}

.save {
    min-width: 90px;
    height: 36px;
    padding: 0px 18px;
    font-size: 14px;
    font-weight: 400;
    background: rgb(40, 121, 255);
    color: rgb(255, 255, 255) !important;
}

.first-line {}

.first-line .left {
    width: 50%;
}

.first-line .right {
    width: 50%;
}

.progress-hint {
    font-size: 13px;
    color: #a4acb9;
}

.second-line {}

.second-line .left {
    max-width: 75px;
    padding-right: 20px;
}

.second-line .right {}

.second-line .right a {
    color: rgb(63, 71, 85);
}

.blue-circle {
    border: 2px solid rgb(40, 121, 255);
    border-radius: 50%;
    color: rgb(40, 121, 255);
    width: 16px;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.blue-circle .inner-circle {
    width: 8px;
    height: 8px;
    background-color: rgb(40, 121, 255);
    border-radius: 50%;
}

.yellow-circle {
    border: 2px solid rgb(246, 189, 22);
    border-radius: 50%;
    color: rgb(246, 189, 22);
    width: 16px;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.right .yellow-circle .inner-circle {
    width: 8px;
    height: 8px;
    background-color: rgb(246, 189, 22);
    border-radius: 50%;
}

.red-circle {
    border: 2px solid rgb(240, 94, 94);
    border-radius: 50%;
    color: rgb(240, 94, 94);
    width: 16px;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.right .red-circle .inner-circle {
    width: 8px;
    height: 8px;
    background-color: rgb(240, 94, 94);
    border-radius: 50%;
}

.third-line {}

.third-line .left {
    max-width: 75px;
    padding-right: 20px;
}

.third-line textarea {
    width: 100%;
    box-sizing: border-box;
    position: relative;
    min-height: 70px;
    background: rgb(255, 255, 255);
    cursor: text;
    border: 1px solid rgb(233, 236, 240);
    border-radius: 4px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding: 7px 7px;
    transition: border 0.2s ease 0.2s, box-shadow 0.2s ease 0.2s;
    color: #3f4755 !important;
}

.third-line textarea:focus {
    outline: none;
    border: 1px solid rgb(40, 121, 255);
    box-shadow: rgb(40 121 255 / 30%) 0px 0px 6px 0px inset;
}

.goal-complete {
    color: #2879ff;
}

.goal-complete a .v-icon {
    color: #2879ff;
}

.goal-complete .remember-description {
    color: #3f4755;
}

.goal-complete .remember {
    color: #3f4755;
}

.goal-complete .remember .v-input__control {
    display: flex;
    align-items: center;
}

.goal-complete .remember .v-input__control .v-input__slot {
    margin-bottom: 0;
}

.goal-complete .remember .v-input__control .v-messages {
    display: none;
}

.goal-complete .blue-stick {
    display: inline-block;
    width: 4px;
    height: 15px;
    border-radius: 2px;
    background: linear-gradient(90deg, #4e90ff, #2879ff);
}
</style>
