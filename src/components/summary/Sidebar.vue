<template>
    <div class="sidebar-container py-4">
        <div class="d-flex align-center justify-center mb-3">
            <UserAvatar name="会计主" width='50px' height = '50px' />
        </div>
        <div class="">
            <span>会计主管</span>
        </div>
        <div class="">
            <v-menu offset-y class="select-year">
                <template v-slot:activator="{ on, attrs }">
                    <span
                        color="primary"
                        dark
                        v-bind="attrs"
                        v-on="on"
                    >
                        {{yearValue}}<v-icon class="ml-2" style="font-size: 14px;">mdi-arrow-down-drop-circle</v-icon>
                    </span>
                </template>
                <v-list>
                    <v-list-item v-for="year in yearsList" :key="year" @click="setYear(year)">
                        {{year}}
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <div class="division mt-6">
            <div class="division-item my-2" @click="selectDivision(-1)" :class="selectedDivision == -1 ? 'focus' : ''">今日工作</div>
            <div class="division-item my-2" @click="selectDivision(0)" :class="selectedDivision == 0 ? 'focus' : ''">年/季</div>
            <div class="division-item my-2" @click="selectDivision(1)" :class="selectedDivision == 1 ? 'focus' : ''">1月<span class="current-item" v-if="currentMonth == 1">本月</span></div>
            <div class="division-item my-2" @click="selectDivision(2)" :class="selectedDivision == 2 ? 'focus' : ''">2月<span class="current-item" v-if="currentMonth == 2">本月</span></div>
            <div class="division-item my-2" @click="selectDivision(3)" :class="selectedDivision == 3 ? 'focus' : ''">3月<span class="current-item" v-if="currentMonth == 3">本月</span></div>
            <div class="division-item my-2" @click="selectDivision(4)" :class="selectedDivision == 4 ? 'focus' : ''">4月<span class="current-item" v-if="currentMonth == 4">本月</span></div>
            <div class="division-item my-2" @click="selectDivision(5)" :class="selectedDivision == 5 ? 'focus' : ''">5月<span class="current-item" v-if="currentMonth == 5">本月</span></div>
            <div class="division-item my-2" @click="selectDivision(6)" :class="selectedDivision == 6 ? 'focus' : ''">6月<span class="current-item" v-if="currentMonth == 6">本月</span></div>
            <div class="division-item my-2" @click="selectDivision(7)" :class="selectedDivision == 7 ? 'focus' : ''">7月<span class="current-item" v-if="currentMonth == 7">本月</span></div>
            <div class="division-item my-2" @click="selectDivision(8)" :class="selectedDivision == 8 ? 'focus' : ''">8月<span class="current-item" v-if="currentMonth == 8">本月</span></div>
            <div class="division-item my-2" @click="selectDivision(9)" :class="selectedDivision == 9 ? 'focus' : ''">9月<span class="current-item" v-if="currentMonth == 9">本月</span></div>
            <div class="division-item my-2" @click="selectDivision(10)" :class="selectedDivision == 10 ? 'focus' : ''">10月<span class="current-item" v-if="currentMonth == 10">本月</span></div>
            <div class="division-item my-2" @click="selectDivision(11)" :class="selectedDivision == 11 ? 'focus' : ''">11月<span class="current-item" v-if="currentMonth == 11">本月</span></div>
            <div class="division-item my-2" @click="selectDivision(12)" :class="selectedDivision == 12 ? 'focus' : ''">12月<span class="current-item" v-if="currentMonth == 12">本月</span></div>
            <div class="division-item my-2" @click="selectDivision(13)" :class="selectedDivision == 13 ? 'focus' : ''">待定任务</div>
        </div>
    </div>
</template>

<script>
import UserAvatar from '@/components/common/UserAvatar.vue';
import { constant } from '@/constants/constant.js';

export default {
    name: 'SidebarComponent',
    components: {
        UserAvatar
    },
    props: [],
    data() {
        return {
            yearValue: 2013,
            selectedDivision: null,
        }
    },
    computed: {
        yearsList: function() {
            return constant.years;
        },
        currentMonth: function() {
            let today = new Date();
            let year = today.getFullYear();
            let month = today.getMonth() + 1;
            return month;
        }
    },
    methods: {
        setYear(prop) {
            this.yearValue = prop;
        },
        selectDivision(param) {
            this.selectedDivision = param;
            let info = {
                year: this.yearValue,
                month: param,
            }
            this.$emit('selectDivision', info)
        }
    }
}
</script>

<style scoped>
.sidebar-container {
    max-width: 180px;
    min-width: 180px;
    height: 100%;
    text-align: center;
    font-size: 14px;
    background-color: #F8F9FB;
    border-right: 1px solid #f8f9fb;
}

.v-list-item {
    font-size: 14px;
    min-height: 28px;
}

.v-list-item:hover {
    cursor: pointer;
    background-color: #eee;
}

.division-item {
    padding: 6px 42px;
    line-height: 20px;
    font-size: 14px;
    transition: color .3s ease-in;
    color: #565E66;
    border: 0;
    white-space: nowrap;
    position: relative;
}

.division-item:hover {
    font-weight: 700;
    color: #2879FF;
    cursor: pointer;
}

.focus {
    background: rgba(29,134,240,.1);    
}

.current-item {
    height: 17px;
    padding: 0 6px;
    line-height: 17px;
    font-size: 12px;
    font-weight: 400;
    border-radius: 10px;
    z-index: 10;
    color: #FFF;
    background: #F0B91D;
    position: absolute;
    right: 30px;
}
</style>