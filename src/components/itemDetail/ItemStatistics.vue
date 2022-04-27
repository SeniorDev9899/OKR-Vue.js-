<template>
  	<div class="py-4">
		<div class="chart-title"><strong>统计 </strong>截止于{{currentDate}}</div>
		<div class="taskchart">
			<div class="chart-container mt-8">
				<vc-donut v-bind="props">
					<small>
						<strong>任务进展情况总览</strong>
						<br>
						（完成率 {{itemCompletePercent}}%）
					</small>
				</vc-donut>
			</div>
			<div class="chart-text">
				<div class="chart-info-text d-flex justify-space-between mt-16">
					<span>任务总数</span>
					<span class="number-info">{{allTaskCnt}}</span>
				</div>
				<div class="chart-info-text d-flex justify-space-between mt-4">
					<span>未完成</span>
					<span class="number-info">{{inCompleteTaskCnt}}</span>
				</div>
				<div class="chart-info-text d-flex justify-space-between mt-4">
					<span>已完成</span>
					<span class="number-info">{{completeTaskCnt}}</span>
				</div>
			</div>
		</div>
		<div class="taskchart1 text-center">
			<div class="mt-4">按负责人统计任务进展状况</div>
			<div class="label-container d-flex justify-end align-center mt-4 mb-4">
				<div class="mr-4">
					<span class="green-rect mr-1"></span>
					<span>已完成</span>
				</div>
				<div class="mr-4">
					<span class="grey-rect mr-1"></span>
					<span>未完成</span>
				</div>
				<div class="mr-16">柱状图后的数字:（完成数/总数）</div>
			</div>
			<div class="chart-container mt-8">
				<div class="progress-bar d-flex justify-start align-center">
					<div class="left">张天哲</div>
					<div class="middle"></div>
					<div class="right d-flex justify-start align-center">
						<div class="right-clip"></div>
						<div class="right-clip"></div>
					</div>
					<div class="last ml-4">(0/2)</div>
				</div>
				<div class="progress-bar d-flex justify-start align-center">
					<div class="left">会计主管</div>
					<div class="middle"></div>
					<div class="right d-flex justify-start align-center">
						<div class="right-clip--active"></div>
						<div class="right-clip"></div>
						<div class="right-clip"></div>
					</div>
					<div class="last ml-4">(1/3)</div>
				</div>
			</div>
		</div>
		<div class="milestones-container px-6 py-4">
			<div class="d-flex justify-space-between align-center py-2">
				<div>新手项目使用教程</div>
				<div class="tooltip-container" @mouseover="helpText = true" @mouseleave="helpText = false">
					<v-icon style="font-size: 18px;">mdi-help-circle</v-icon>
					<span class="ml-1">图例说明</span>
					<div class="help-text" v-if="helpText">
						<div class="help-text-item d-flex justify-space-between align-center">
							<div class="border-box"><div style="background: #F77;"></div></div>
							<div>未完成-延期</div>
						</div>
						<div class="help-text-item d-flex justify-space-between align-center">
							<div class="border-box"><div style="background: #99C8F2;"></div></div>
							<div>未完成-当前</div>
						</div>
						<div class="help-text-item d-flex justify-space-between align-center">
							<div class="border-box"><div style="background: #58C583;"></div></div>
							<div>已完成-按期</div>
						</div>
						<div class="help-text-item d-flex justify-space-between align-center">
							<div class="border-box"><div style="background: #FF9662;"></div></div>
							<div>已完成-延期</div>
						</div>
						<div class="help-text-item d-flex justify-space-between align-center">
							<div class="border-box"><div style="background: #DDD;"></div></div>
							<div>未开始</div>
						</div>
					</div>
				</div>
			</div>
			<hr />
			<div class="milestone-list mt-4 px-4 d-flex justify-start align-center">
				<div v-for="ms in milestones" :key="ms.ms_name">
					<MilestoneComponent :isShowAll="isShowAll" :ms="ms" />
				</div>
			</div>
			<div class="text-right mt-8 cursor-pointer">
				<div style="color: #005999;" @click="isShowAll = !isShowAll">
					<span>收起详情</span>
					<span>
						<v-icon style="font-size: 18px;color: #005999;" v-if="!isShowAll">mdi-chevron-down</v-icon>
						<v-icon style="font-size: 18px;color: #005999;" v-if="isShowAll">mdi-chevron-up</v-icon>
					</span>
				</div>
			</div>
		</div>
		<div class="table-data">
			<v-simple-table>
				<template v-slot:default>
					<thead>
						<tr>
							<th class="text-left">
								人员
							</th>
							<th class="text-left">
								负责总数
							</th>
							<th class="text-left">
								已完成
							</th>
							<th class="text-left">
								完成率
							</th>
							<th class="text-left">
								评分
								<v-icon style="font-size:18px;">mdi-help-circle</v-icon>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="user in userResult" :key="user.userName + user.allCnt">
							<td>{{user.userName}}</td>
							<td>{{user.allCnt}}</td>
							<td>{{user.complete}}</td>
							<td class="">
								<span style="width:80%;display:inline-block;">
									<v-progress-linear :value="((user.complete/user.allCnt).toFixed(2))*100" height="10" :rounded="true"></v-progress-linear>
								</span>
								<span class="text-right" style="width:20%;display:inline-block;">{{((user.complete/user.allCnt).toFixed(1))*100}}%</span>
							</td>
							<td></td>
						</tr>
					</tbody>
				</template>
			</v-simple-table>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import MilestoneComponent from '@/components/itemDetail/shared/MilestoneComponent.vue';

export default {
	name: 'ItemStatistics',
	components: {
		MilestoneComponent
	},
	props: ['item'],
	data() {
		return {
			helpText: false,
			isShowAll: true
		}
	},
	computed: {
		...mapGetters('dashboard', ['itemStatistics']),
		currentDate() {
			let today = new Date();
			return today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
		},
		statistics() {
			let obj = Object.assign({}, this.itemStatistics)
			return obj;
		},
		allTaskCnt() {
			return this.statistics.selectItemTaskResult[0]
		},
		completeTaskCnt() {
			return this.statistics.selectItemTaskResult[1]
		},
		pendingCompleteTaskCnt() {
			return this.statistics.selectItemTaskResult[3]
		},
		alreadyCompleteTaskCnt() {
			return this.statistics.selectItemTaskResult[2]
		},
		inCompleteTaskCnt() {
			return this.statistics.selectItemTaskResult[4]
		},
		pendingInCompleteTaskCnt() {
			return this.statistics.selectItemTaskResult[6]
		},
		alreadyInCompleteTaskCnt() {
			return this.statistics.selectItemTaskResult[5]
		},
		itemCompletePercent() {
			if(this.allTaskCnt != 0) {
				return ((this.alreadyCompleteTaskCnt / this.allTaskCnt).toFixed(2))*100;
			}else{
				return 0;
			}
		},
		itemPendingCompletePercent() {
			if(this.allTaskCnt != 0) {
				return ((this.pendingCompleteTaskCnt / this.allTaskCnt).toFixed(2))*100;
			}else{
				return 0;
			}
		},
		itemInCompletePercent() {
			if(this.allTaskCnt != 0) {
				return ((this.alreadyInCompleteTaskCnt / this.allTaskCnt).toFixed(2))*100;
			}else{
				return 0;
			}
		},
		itemPendingInCompletePercent() {
			if(this.allTaskCnt != 0) {
				return ((this.pendingInCompleteTaskCnt / this.allTaskCnt).toFixed(2))*100;
			}else{
				return 0;
			}
		},
		props() {
			return {
				size: 180,
				sections: [
					{ value: this.itemCompletePercent, label: '已完成（延期）'+this.itemCompletePercent+'%', color: '#f5b070' },
					{ value: this.itemPendingInCompletePercent, label: '未完成（当前）'+this.itemPendingInCompletePercent+'%', color: '#9bcfff' },
					{ value: this.itemInCompletePercent, label: '未完成（延期）'+this.itemInCompletePercent+'%', color: '#ed80a0' },
					{ value: this.itemPendingCompletePercent, label: '已完成（按期）'+this.itemPendingCompletePercent+'%', color: '#97cba6' }
				],
				thickness: 30,
				hasLegend: true,
			}
		},
		milestones() {
			let tmp = [];
			this.statistics.selectItemMsResult.map(m => {
				let start = new Date(m.ms_start_date + ' 00:00:00')
				let end = new Date(m.ms_end_date + ' 00:00:00')
				let cycle = (start.getMonth()+1) + '/' + start.getDate() + '-' + (end.getMonth()+1) + '/' + end.getDate();
				let chart_value, chart_color, header_color;
				let complete_percent = m.resAll != 0 ? ((m.resComplete /  m.resAll).toFixed(2)) * 100 : 0;
				let expiredcomplete_percent = m.resAll != 0 ? ((m.res21 /  m.resAll).toFixed(2)) * 100 : 0;
				let pendingcomplete_percent = m.resAll != 0 ? ((m.res20 /  m.resAll).toFixed(2)) * 100 : 0;
				let incomplete_percent = m.resAll != 0 ? ((m.resNotcomplete /  m.resAll).toFixed(2)) * 100 : 0;
				let expiredIncomplete_percent = m.resAll != 0 ? ((m.res11 /  m.resAll).toFixed(2)) * 100 : 0;
				let pendingIncomplete_percent = m.resAll != 0 ? ((m.res10 /  m.resAll).toFixed(2)) * 100 : 0;

				if(m.res20 != 0) {
					chart_value = pendingcomplete_percent;
					chart_color = '#97cba6'
				}else if(m.res21 != 0) {
					chart_value = expiredcomplete_percent;
					chart_color = '#f5b070'
				}else if(m.res10 != 0) {
					chart_value = pendingIncomplete_percent;
					chart_color = '#9bcfff'
				}else if(m.res11 != 0) {
					chart_value = expiredIncomplete_percent;
					chart_color = '#ed80a0'
				}else{
					chart_value = 0
					chart_color = '#ddd'
				}

				if(expiredcomplete_percent == 100) {
					header_color = 4
				}
				if(pendingcomplete_percent == 100) {
					header_color = 3
				}
				if(expiredIncomplete_percent == 100) {
					header_color = 2
				}
				if(pendingIncomplete_percent == 100) {
					header_color = 1
				}
				if(m.resAll == 0) {
					header_color = 5
				}
				
				let obj = {
					milestone_name: m.ms_name,
					header_color: header_color,
					cycle: cycle,
					averageValue: m.resAvg,
					complete: m.resComplete,
					expiredComplete: m.res21,
					pendingComplete: m.res20,
					incomplete: m.resNotcomplete,
					expiredInComplete: m.res11,
					pendingInComplete: m.res10,
					all_task_cnt: m.resAll,
					complete_percent: complete_percent,
					expiredcomplete_percent: expiredcomplete_percent,
					pendingcomplete_percent: pendingcomplete_percent,
					incomplete_percent: incomplete_percent,
					expiredIncomplete_percent: expiredIncomplete_percent,
					pendingIncomplete_percent: pendingIncomplete_percent,
					chart_value: chart_value,
					chart_color: chart_color
				}
				tmp.push(obj)
			});
			return tmp;
		},
		userResult() {
			let tmp = [];
			this.statistics.selectItemOwnerResult.map(u => {
				let obj = {
					userName: u.formatSet,
					allCnt: u.res1,
					complete: u.res2,
					incomplete: u.res3
				}
				tmp.push(obj);
			});
			return tmp;
		},

	}, 
	mounted() {
		
	},
	methods: {
		
	}
}
</script>

<style scoped>
.help-text {
	position: absolute;
	right: 0;
	top: 25px;
	min-width: 115px;
	box-shadow: 1px 1px 5px #ddd;
	padding: 10px;
	background: #fff;
}
.help-text-item {

}
.border-box {
	width: 10px;
    height: 10px;
    border: 1px solid #ccc;
    padding: 1px;
    margin-right: 7px;
    background: #fff;
    display: inline-block;
    line-height: 10px;
}
.border-box div {
	width: 100%;
	height: 100%;
}
.tooltip-container {
	position: relative;
}
.green-rect {
	display: inline-block;
	width: 12px;
	height: 12px;
	background: #97cba6;
}
.grey-rect {
	display: inline-block;
	width: 12px;
	height: 12px;
	background: #c9dbe9;
}
.progress-bar {
	height: 30px;
}
.progress-bar .left {
	width: 100px;
}
.progress-bar .middle {
	border-right: 4px solid #c5c5c5;
	height: 100%;
}
.progress-bar .right {
	
}
.progress-bar .right-clip {
	width: 150px;
	height: 20px;
	background: #c9dbe9;
}
.progress-bar .right-clip--active {
	width: 150px;
	height: 20px;
	background: #97cba6;
}
.chart-title {
	font-size: 14px;
}

.chart-title strong {
	color: #145c98;
    font-size: 18px;
    line-height: 20px;
}

.taskchart {
	position: relative;
    margin-top: 20px;
    color: #555;
    border: 1px solid #E3ECF1;
    border-radius: 5px;
	min-height: 300px;
	font-size: 14px;
}

.table-data {
	position: relative;
    margin-top: 20px;
    color: #555;
    border: 1px solid #E3ECF1;
    border-radius: 5px;
	min-height: 300px;
	font-size: 14px;
}

.taskchart1 {
	position: relative;
    margin-top: 20px;
    color: #555;
    border: 1px solid #E3ECF1;
    border-radius: 5px;
	min-height: 200px;
	font-size: 14px;
}

.milestones-container {
	position: relative;
    margin-top: 20px;
    color: #555;
    border: 1px solid #E3ECF1;
    border-radius: 5px;
	font-size: 14px;
	background: none;
}

.chart-text {
	position: absolute;
    right: 0;
    top: 0;
    width: 145px;
	height: 100%;
    background-color: #f7f7f7;
	padding: 20px;
}

.chart-info-text {
	border-bottom: 1px dashed #dbdbdb;
}

.number-info {
	color: #58c583;
    font-size: 20px;
    font-family: Arial;
    width: 10px;
    display: inline-block;
    margin-right: 10px;
}
</style>
<style>
.cursor-pointer {
	cursor:  pointer;
}
</style>