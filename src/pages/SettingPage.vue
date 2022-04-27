<template>
    <v-sheet class="setting-container">
        <v-tabs v-model="tab" icons-and-text height="48">
            <v-tabs-slider width="124"></v-tabs-slider>
            <v-tab href="#tab-1">
                团队管理规定
            </v-tab>
            <v-tab href="#tab-2">
                部门管理规定
            </v-tab>
            <v-tab href="#tab-3">
                企业管理规定
            </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
            <v-tab-item id="tab-1">
                
            </v-tab-item>
            <v-tab-item id="tab-2">
                
            </v-tab-item>
            <v-tab-item id="tab-3">
                <EnterpriseManagement />
            </v-tab-item>
        </v-tabs-items>
    </v-sheet>
</template>

<script>
import EnterpriseManagement from '@/components/setting/EnterpriseManagement.vue';

export default {
    name: 'SettingPage',
    components: {
        EnterpriseManagement
    },
    data() {
        return {
            tab: null
        }
    }
}
</script>

<style scoped>
    .setting-container {
        padding: 10px 20px;
    }
</style>