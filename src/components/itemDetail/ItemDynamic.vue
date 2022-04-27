<template>
	<div>
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
						:disabled = "enableIcSubmitBtn ? false : true"
						@click = "submitIcDescription"
					>回复</v-btn>
				</v-flex>
				</v-layout>
			</v-flex>
		</v-form>
		<TaskComponent />
		<TaskComponent />
		<ProjectComponent />
	</div>
</template>

<script>
import UserPicker from '@/components/common/UserPicker.vue';
import TaskComponent from '@/components/itemDetail/shared/TaskComponent.vue';
import ProjectComponent from '@/components/itemDetail/shared/ProjectComponent.vue';

export default {
	name: 'ItemDynamic',
	components: {
		UserPicker,
		TaskComponent,
		ProjectComponent
	},
	data() {
		return {
			enableIcSubmitBtn : false,
			sms: false,
			ic_desc: "",
		}
	},
	methods: {
		submitIcDescription() {

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