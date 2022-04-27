<template>
	<div class="interactive mt-8">
		<div>
			<span>全部操作</span>
			<span class="ml-1">3</span>
			<v-icon style="font-size: 18px;">mdi-chevron-down</v-icon>
		</div>
		<div>
			<v-timeline dense>
				<v-timeline-item
					v-for="(progress, i) in operatinglist"
					:key="i"
					:color="progress.color"
					small
				>
					<template v-slot:opposite>
						<span
						:class="`${progress.color}--text`"
						v-text="progress.date"
						></span>
					</template>
					<div class="py-4">
						<span :class="`mr-4 ${progress.color}--text`">{{progress.date}}</span>
						<span :class="`mb-4 ${progress.color}--text`">
							{{progress.text}}
						</span>
					</div>
				</v-timeline-item>
			</v-timeline>
		</div>
		<div class="d-flex justify-space-between align-center my-4">
        	<div class="time-fb">
				
			</div>
			<div class="feed-action-tag d-flex justify-end align-center">
				<div class="action-tag">
					<v-icon style="font-size:18px;">mdi-message-text-outline</v-icon>
					<span>回复</span>
				</div>
				<div class="mx-1">|</div>
				<div class="action-tag">
					<v-icon style="font-size:18px;">mdi-thumb-up-outline</v-icon>
					<span>点赞</span>
				</div>
			</div>
		</div>
		<v-form class="w100 mt-8">
			<v-flex class="progress_bottom">
				<v-textarea 
					filled
					auto-grow
					hide-details
					v-model = "ic_desc"
					@input = "inputIcDescription"
				>
				</v-textarea>
			</v-flex>

			<v-flex class="progress_bottom">
				<v-layout align-center justify-start row class="w100 progress_bottom-layout m_0">
				<v-flex class="btn_2 ic_bottomBtn displayFlex_Interactive_Bottom">
					<span class="btn_2_b icons" @click="uploadFiles">
						<v-icon class="btn_2-icons">mdi-paperclip</v-icon>
						<span>附件</span>
					</span>
				</v-flex>
				<v-flex class="btn_2 ic_bottomBtn displayFlex_Interactive_Bottom">
					<v-menu offset-y>
						<template v-slot:activator="{ on, attrs }">
						<span v-bind="attrs" v-on="on" class="btn_2_b icons">
							<span>@ 同事</span>
						</span>
						</template>
						<v-card>
						<UserPicker @pick="pickUser" />
						</v-card>
					</v-menu>
				</v-flex>
				<v-flex class="btn_2 ic_bottomBtn displayFlex_Interactive_Bottom">
					<span class="btn_2_b icons" @click="allMembers">
						<span>@ 所有同事</span>
					</span>
				</v-flex>
				<v-flex class="btn_2 ic_bottomBtn displayFlex_Interactive_Bottom">
					<span class="btn_2_b icons">
						<v-icon class="btn_2-icons">mdi-sticker-emoji</v-icon>
						<span>表情</span>
					</span>
				</v-flex>
				<v-flex class="btn_2 ic_bottomBtn displayFlex_Interactive_Bottom ">
					<span class="btn_2_b icons">
						<v-checkbox class="sms" v-model="sms" label="短信通知" hide-details></v-checkbox>
					</span>
				</v-flex>
				<v-flex class = "btn ic_bottomBtn displayFlex_Interactive_Bottom ml_5">
					<v-btn 
						color = "primary" 
						:disabled="enableIcSubmitBtn"
						@click = "submitIcDescription"
					>回复</v-btn>
				</v-flex>
				</v-layout>
			</v-flex>
		</v-form>
	</div>
</template>
<script>
import UserPicker from '@/components/common/UserPicker.vue';
import { mapGetters, mapActions } from 'vuex';
import { getUser } from '@/utils/authUser.service';

export default {
  	name: 'ItemInteractive',
	components: {
		UserPicker
	},
	props: ['item'],
  	data() {
		return {
			progresses: [
				{
					color: 'green',
					date: '06/01 14:53',
					text: 'Tita小助手 代 Tita小助手 发起了任务，负责人是 Tita小助手'
				},
				{
					color: 'green',
					date: '07/20 00:44',
					text: '会计主管 将进度修改为100%'
				},
				{
					color: 'pink',
					date: '00:44',
					text: '会计主管 完成了任务'
				}
			],
			sms: false,
			ic_desc: "",
		}
	},
	computed: {
		...mapGetters('operating', ['itemOperators']),
		operatinglist: function() {
			let tmp = [];
			this.itemOperators.map(i => {
				let date = new Date(i.created_at);
				date = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
				tmp.push({
					color: 'green',
					date: date,
					text: i.op_description
				})
			})
			return tmp;
		},
		enableIcSubmitBtn: function() {
			return this.ic_desc == '' ? true : false
		}
	},
	mounted() {
		this.getOperators({op_parent_type: 3, op_parent: this.item.item_id});
	},
	methods: {
		...mapActions('operating', ['getOperators']),
		...mapActions('intercom', ['addIntercom']),
		submitIcDescription() {
			let ic_add = {
                "ic_sender": getUser().id,
                "ic_receiver": null,
                "ic_description": this.ic_desc,
                "ic_parent_type": 3,
                "ic_parent": this.item.item_id,
                "ic_reply_ic": null,
                "ic_thumbup": null,
            }
			this.addIntercom(ic_add)
			this.ic_desc = '';
		},
		allMembers() {
          
        },
		pickUser(param) {
          
        },
		uploadFiles() {

        },
		inputIcDescription(e) {
            
        },
	}
}
</script>