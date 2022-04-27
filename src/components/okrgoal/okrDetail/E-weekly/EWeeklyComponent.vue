<template>
    <span>
        <div class="d-flex justify-space-between align-center mb-4">
            <div>列表</div>
            <div>
                <date-range-picker
                    ref="picker"
                    opens="left"
                    :locale-data="{ 
                        firstDay: 1, 
                        format: 'yyyy-mm-dd',
                        applyLabel: '确定',
                        cancelLabel: '取消',
                        daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                        monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                    }"
                    :minDate="minDate" :maxDate="maxDate"
                    :dateRange="dateRange"
                    :ranges="false"
                >
                    <template v-slot:input="picker" style="min-width: 350px;">
                        <v-icon style="font-size: 18px;">mdi-calendar</v-icon>
                        <span>时间筛选</span>
                        <!-- {{ picker.startDate | formatDate }} - {{ picker.endDate | formatDate }} -->
                    </template>
                </date-range-picker>
            </div>
        </div>
        <div class="d-flex justify-space-between align-center mt-4" v-for="r in reports" :key="r.id">
            <v-icon style="font-size: 18px;">mdi-file-chart</v-icon>
            <div>({{r.start}}-{{r.end}})</div>
            <v-spacer></v-spacer>
            <a>
                <v-icon style="font-size: 18px;">mdi-file-multiple-outline</v-icon>
                <span>分享</span>
            </a>
            <a class="ml-4">
                <span>查看详情</span>
                <v-icon style="font-size: 18px;">mdi-chevron-right-circle-outline</v-icon>
            </a>
        </div>
        <div class="text-center mt-8">
            <div class="empty py-8">
                <div>
                    没有找到你想要的
                </div>
                <a>
                    <v-icon>mdi-hand-pointing-right</v-icon>
                    <span>了解E-周报</span>
                </a>
            </div>
        </div>
    </span>
</template>

<script>
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';

export default {
    name: 'EWeeklyComponent',
    components: {
        DateRangePicker
    },
    props: [],
    data() {
        return {
            reports: [
                {
                    id: 1,
                    start: '2021/06/28',
                    end: '2021/06/28'
                },
                {
                    id: 2,
                    start: '2021/06/28',
                    end: '2021/06/28'
                },
                {
                    id: 3,
                    start: '2021/06/28',
                    end: '2021/06/28'
                }
            ],
            dateRange: {
                startDate: '2021-07-06',
                endDate: '2021-07-12'
            },
            minDate: '2018-01-01',
            maxDate: '2050-12-31',
        }
    },
}
</script>

<style scoped>
    .empty {
        min-height: 50px;
        width: 80%;
        border: 1px dotted #777;
        margin: 0 auto;
    }
</style>