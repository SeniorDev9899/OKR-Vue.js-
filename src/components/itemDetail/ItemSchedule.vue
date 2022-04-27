<template>
<div>
	<div class="mt-4">
		<v-dialog
			v-model="dialog"
			width="500"
		>
			<template v-slot:activator="{ on, attrs }">
				<v-btn class="white--text" dense color="#2879FF" v-bind="attrs" v-on="on">更新项目进度</v-btn>
			</template>
			<v-card>
				<v-card-title>
					<span class="text-h5">更新项目进度</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-row>
							<v-col cols="12">
								推荐进度 28%（根据任务完成度自动计算）
							</v-col>
							<v-col cols="12">
								<v-text-field
								label="进度*"
								required
								v-model="percent"
								></v-text-field>
							</v-col>
							<v-col cols="12">
								<v-text-field
								label="进度描述"
								v-model="description"
								></v-text-field>
							</v-col>
						</v-row>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						color="blue darken-1"
						text
						@click="dialog = false"
					>
						Close
					</v-btn>
					<v-btn
						color="blue darken-1"
						text
						@click="saveProgress"
					>
						Save
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
	<div class="mt-4">
		<v-timeline align-top dense>
			<v-timeline-item color="green" small v-for="p in progresslist">
				<v-row class="pt-1">
					<v-col cols="1">
						<strong>{{p.date}}</strong>
					</v-col>
					<v-col>
						<div :class="p.color == 'green' ? 'project-progress' : 'project-progress-past'">
							<div class="percent">{{p.percent}}%</div>
							<div class="mt-2">{{p.text}}</div>
						</div>
					</v-col>
				</v-row>
			</v-timeline-item>
		</v-timeline>
	</div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	name: 'ItemSchedule',
	props: ['item'],
	data() {
		return {
			dialog: false,
			percent: 0,
			description: ''
		}
	},
	computed: {
		...mapGetters('progress', ['itemProgress']),
		progresslist: function() {
			let tmp = [];
			let len = this.itemProgress.length;
			this.itemProgress.map((p, i) => {
				let date = new Date(p.created_at);
				date = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
				tmp.push({
					color: i == 0 ? 'green' : 'grey',
					percent: p.pr_percent,
					text: p.pr_description,
					date: date
				})
			});
			return tmp;
		}
	},
	mounted() {
		this.getProgress({pr_parent: this.item.item_id, pr_parent_type: 3});
	},
	methods: {
		...mapActions('item', ['updateItemByField']),
		...mapActions('progress', ['addProgress', 'getProgress']),
		saveProgress() {
			let payload = {
				item_id: this.item.item_id,
				item_progress: this.percent
			}
			this.updateItemByField(payload);
			// add progress
			payload = {
				pr_parent: this.item.item_id,
				pr_parent_type: 3,
				pr_percent: this.percent,
				pr_description: this.description
			}
			this.addProgress(payload);
			this.percent = '';
			this.description = '';
			this.dialog = false;
			this.getProgress({pr_parent: this.item.item_id, pr_parent_type: 3});
		}
	}
}
</script>

<style scoped>
.project-progress {
	padding: 20px;
	background-color: #6FD9C7;
	color: #fff;
	text-align: center;
	border-radius: 10px;
}

.project-progress-past {
	padding: 10px;
	background-color: #F5F8FA;
	color: #70818C;
	border-radius: 10px;
	text-align: center;
}

.percent {
	width: 70px;
	height: 70px;
	background: rgba(256, 256, 256, 0.1);
	margin: 0 auto;
	border-radius: 50%;
	padding-top: 22px;
	text-align: center;
	font-size: 20px;
	font-weight: bold;
}
</style>