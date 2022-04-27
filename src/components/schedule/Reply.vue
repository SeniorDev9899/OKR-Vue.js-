<template>
    <div class="mt-8">
        <v-tabs v-model="tab2" icons-and-text height="36">
            <v-tabs-slider></v-tabs-slider>
            <v-tab href="#tab-1">
                <span>
                    <span>评价沟通</span>
                </span>
            </v-tab>
            <v-tab href="#tab-2">
                <span>
                    <span>工作总结</span>
                </span>
            </v-tab>
            <v-tab href="#tab-3">
                <span>
                    <span>操作历史</span>
                </span>
            </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab2" class="">
            <v-tab-item id="tab-1" class="pt-4">
                <v-text-field
                    placeholder=""
                    outlined
                    height="120"
                ></v-text-field>
                <div class="text-sub-options d-flex justify-space-between align-center">
                    <div class="mr-4 sub-option">
                        <v-icon style="font-size: 18px;">mdi-attachment</v-icon>
                        <span>附件</span>
                    </div>
                    <div class="mr-4 sub-option">
                        <v-icon style="font-size: 18px;">mdi-alpha-c-circle-outline</v-icon>
                        <span>同事</span>
                    </div>
                    <div class="mr-4 sub-option">
                        <v-icon style="font-size: 18px;">mdi-alpha-c-circle-outline</v-icon>
                        <span>所有同事</span>
                    </div>
                    <div class="mr-4 sub-option">
                        <v-icon style="font-size: 18px;">mdi-emoticon-happy-outline</v-icon>
                        <span>表情</span>
                    </div>

                    <v-spacer></v-spacer>

                    <div class="mr-4 d-flex justify-end align-center">
                        <v-checkbox v-model="checkbox1"></v-checkbox>
                        <span class="mr-4">短信通知</span>
                        <v-btn color="#2879FF" class="white--text">回复</v-btn>
                    </div>
                </div>
                <div class="d-flex justify-start align-center">
                    <span>共享给谁？</span>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn class="mx-2 white--text" fab dark small color="#2879FF" v-bind="attrs" v-on="on">
                                <v-icon dark style="font-size: 14px;">
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <UserPicker @pick="pickUser" />
                        </v-card>
                    </v-menu>
                </div>
            </v-tab-item>
            <v-tab-item id="tab-2" class="pt-4">
                <v-text-field
                    placeholder=""
                    outlined
                    height="120"
                ></v-text-field>
                <div class="text-sub-options d-flex justify-space-between align-center">
                    <div class="mr-4 sub-option">
                        <v-icon style="font-size: 18px;">mdi-attachment</v-icon>
                        <span>附件</span>
                    </div>
                    <div class="mr-4 sub-option">
                        <v-icon style="font-size: 18px;">mdi-alpha-c-circle-outline</v-icon>
                        <span>同事</span>
                    </div>
                    <div class="mr-4 sub-option">
                        <v-icon style="font-size: 18px;">mdi-alpha-c-circle-outline</v-icon>
                        <span>所有同事</span>
                    </div>
                    <div class="mr-4 sub-option">
                        <v-icon style="font-size: 18px;">mdi-emoticon-happy-outline</v-icon>
                        <span>表情</span>
                    </div>

                    <v-spacer></v-spacer>

                    <div class="mr-4 d-flex justify-end align-center">
                        <v-checkbox v-model="checkbox1"></v-checkbox>
                        <span class="mr-4">短信通知</span>
                        <v-btn color="#2879FF">回复</v-btn>
                    </div>
                </div>
                <div class="no-summary-list">
                    尚无最新总结
                </div>
                <div class="d-flex justify-start align-center">
                    <span>共享给谁？</span>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn class="mx-2" fab dark small color="#2879FF" v-bind="attrs" v-on="on">
                                <v-icon dark style="font-size: 14px;">
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <UserPicker @pick="pickUser" />
                        </v-card>
                    </v-menu>
                </div>
            </v-tab-item>
            <v-tab-item id="tab-3" class="pt-4">
                <div class="no-operation">
                    还没有任何计划表的操作记录
                </div>
                <div class="d-flex justify-start align-center">
                    <span>共享给谁？</span>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn class="mx-2" fab dark small color="#2879FF" v-bind="attrs" v-on="on">
                                <v-icon dark style="font-size: 14px;">
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <UserPicker @pick="pickUser" />
                        </v-card>
                    </v-menu>
                </div>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>
<script>
import UserPicker from '@/components/common/UserPicker.vue';

export default {
    name: 'Reply',
    components: {
        UserPicker
    },
    data() {
        return {
            tab2: null,
            checkbox1: false,
        }
    },
    methods: {
        pickUser() {
            
        }
    }
}
</script>

<style scoped>
.text-sub-options {
}

.sub-option {
    display: inline-block;
    padding: 10px;
}

.sub-option:hover {
    cursor: pointer;
    background-color: #ddd;
}

.no-summary-list {
    border: 1px dashed #ddd;
    padding: 40px 0px;
    text-align: center;
    color: #ddd;
    margin-bottom: 20px;
}

.no-operation {
    border: 1px dashed #ddd;
    padding: 40px 0px;
    text-align: center;
    color: #ddd;
    margin-bottom: 20px;
}
</style>