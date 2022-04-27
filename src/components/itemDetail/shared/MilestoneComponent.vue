<template>
    <div class="milestone-item">
        <div class="milestone-header">
            <div class="header-text">{{ms.milestone_name}}</div>
            <div class="header-info d-flex justify-space-between align-center" :class="header_color[ms.header_color - 1]">
                <div>完成率:{{ms.complete_percent}}%</div>
                <div>{{ms.cycle}}</div>
            </div>
        </div>
        <div class="milestone-body" v-if="isShowAll">
            <div class="milestone-chart">
                <vc-donut v-bind="props1">
                    <h1>
                        <strong :style="{color:ms.chart_color}">{{ms.chart_value}}%</strong>
                    </h1>
                </vc-donut>
            </div>
            <div class="chart-data-list mt-6">
                <div class="chart-data" v-if="ms.incomplete != 0">
                    <div class="data-value">
                        <span class="count">{{ms.incomplete}}</span> (<span class="delay-color">{{ms.expiredInComplete}}</span>/{{ms.pendingInComplete}})
                    </div>
                    <div class="data-label">
                        未完成(延期/按期)
                    </div>
                </div>
                <div class="chart-data" v-if="ms.complete != 0">
                    <div class="data-value">
                        <span class="count">{{ms.complete}}</span> (<span class="delay-color">{{ms.expiredComplete}}</span>/{{ms.pendingComplete}})
                    </div>
                    <div class="data-label">
                        已完成(延期/按期)
                    </div>
                </div>
                <div class="chart-data">
                    <div class="data-value">
                        <!-- <span class="count">1</span> (<span class="delay-color">1</span>/0) -->
                        <span class="count">{{ms.averageValue}}</span> ({{ms.averageValue}}%)
                    </div>
                    <div class="data-label">
                        质量均分
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MilestoneComponent',
    props: ['isShowAll', 'ms'],
    data() {
        return {
            props1: {
				size: 100,
				sections: [
                    { value: this.ms.expiredcomplete_percent, label: '已完成（延期）'+this.ms.expiredcomplete_percent+'%', color: '#f5b070' },
					{ value: this.ms.pendingIncomplete_percent, label: '未完成（当前）'+this.ms.pendingIncomplete_percent+'%', color: '#9bcfff' },
					{ value: this.ms.expiredIncomplete_percent, label: '未完成（延期）'+this.ms.expiredIncomplete_percent+'%', color: '#ed80a0' },
					{ value: this.ms.pendingcomplete_percent, label: '已完成（按期）'+this.ms.pendingcomplete_percent+'%', color: '#97cba6' }
				],
				thickness: 35, // set this to 100 to render it as a pie chart instead
				hasLegend: false,
			},
            header_color: ['header-bg-1', 'header-bg-2', 'header-bg-3', 'header-bg-4', 'header-bg-5']
        }
    }
}
</script>

<style scoped>
.delay-color {
	color: #F77;
}
.data-value {
	font-size: 18px;
    line-height: 24px;
}
.chart-data {
	padding: 10px 0 4px 4px;
    margin-bottom: 10px;
    border-bottom: 1px solid #EEE;
    color: #555;
}
.chart-data-list {
	margin: 0 auto;
	width: 180px;
}
.milestone-chart {
	width: 100px;
    height: 100px;
    padding: 10px 20px;
    margin: 0 auto;
}
.milestone-body {
	height: 350px;
}
.milestone-item {
	width: 268px;
	display: inline-block;
    padding: 10px 0 0;
    margin: 0 2px;
    background-color: #F6F8F9;
}
.header-text {
	padding-left: 8px;
    text-overflow: ellipsis;
    height: 26px;
    word-break: break-all;
    white-space: nowrap;
    overflow: hidden;
    font-size: 14px;
    line-height: 26px;    
    font-weight: 700;
    color: #555;
}
.header-info {
	display: block;
    height: 40px;
    line-height: 40px;
    color: #fff;
    padding: 0px 8px;
    margin-bottom: 11px;
}
.header-bg-1 {
	background: #F77;
}
.header-bg-2 {
	background: #99C8F2;
}
.header-bg-3 {
	background: #58C583;
}
.header-bg-4 {
	background: #FF9662;
}
.header-bg-5 {
	background: #DDD;
}
</style>