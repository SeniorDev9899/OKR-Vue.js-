<template>
	<div class="basic-information mt-8">
		<div class="d-flex justify-start align-center">
			<div class="mr-6 text-right left">名称</div>
			<div class="right name-edit" @click="isNameEdit = true" v-if="!isNameEdit">{{item.item_name}}</div>
			<div class="w-100" v-if="isNameEdit">
				<v-text-field class="w-100 pt-0" v-model="nameEdit" v-on:keyup.enter="saveItemName"></v-text-field>
			</div>
		</div>
		<div class="mt-4 d-flex justify-start align-center">
			<div class="mr-6 text-right left">起止时间</div>
			<div class="right">				
				<span>{{itemStart}} - {{itemEnd}}</span>
				<v-menu offset-y v-model="popupShow">
					<template v-slot:activator="{ on, attrs }">
						<span v-bind="attrs" v-on="on" class="ml-4">
							<v-icon style="font-size: 18px;">mdi-pencil</v-icon>
						</span>
					</template>
					<div class="popup px-4 py-4" @click="stopEvent">
						<div class="w-100 date-picker mt-8">
							<date-range-picker
								ref="picker"
								opens="right"
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
								@update="datePicker"
							>
								<template v-slot:input="picker" style="min-width: 350px;">
									{{ picker.startDate | formatDate }} - {{ picker.endDate | formatDate }}
								</template>
							</date-range-picker>
						</div>
						<div class="w-100 mt-8">
							<v-text-field class="w-100 pt-0" v-model="remarks" placeholder="请输入修改时间的备注信息"></v-text-field>
						</div>
						<div class="w-100 mt-4">
							<v-file-input truncate-length="15" placeholder="请上传不超过50MB大小的文件，最多可上传 9 个"></v-file-input>
						</div>
						<div class="actions mt-16 text-right">
							<v-btn class="mr-4" @click="cancelDateEdit">取消</v-btn>
							<v-btn color="primary" @click="saveDateInfo">确定</v-btn>
						</div>
					</div>
				</v-menu>
			</div>
		</div>
		<div class="mt-4 d-flex justify-start align-center">
			<div class="mr-6 text-right left">可见范围</div>
			<div class="right">
				<span>{{visibleRange}}</span>
				<v-menu offset-y>
					<template v-slot:activator="{ on, attrs }">
						<span v-bind="attrs" v-on="on" class="ml-4">
							<v-icon style="font-size: 18px;">mdi-pencil</v-icon>
						</span>
					</template>
					<v-list class="py-0">
						<v-list-item class="py-0" @click="updateVisible(visibleRangeValue1)">
							全公司
						</v-list-item>
						<v-list-item class="py-0" @click="updateVisible(visibleRangeValue2)">
							仅相关成员
						</v-list-item>
					</v-list>
				</v-menu>
			</div>
		</div>
		<div class="mt-4 d-flex justify-start align-center">
			<div class="mr-6 text-right left">项目描述</div>
			<v-text-field v-model="item.item_description" v-on:keyup.enter="saveItemDesc"></v-text-field>
		</div>
		<div class="mt-4 d-flex justify-start align-top">
			<div class="mr-6 text-right left">关联对象</div>
			<div class="right">
				<div class="obj-list">
					<div class="obj d-flex justify-start" >
						<span>
							<v-icon>mdi-target</v-icon>
						</span>
						<span>
							OKR for the test 4
						</span>
						<span class="ml-2">
							<v-icon style="font-size: 18px;">mdi-close-circle-outline</v-icon>
						</span>
					</div>
					<div class="obj d-flex justify-start my-2" >
						<span>
							<v-icon>mdi-target</v-icon>
						</span>
						<span>
							OKR for the test 3
						</span>
						<span class="ml-2">
							<v-icon style="font-size: 18px;">mdi-close-circle-outline</v-icon>
						</span>
						<v-menu offset-y v-model="targetParentMenu">
							<template v-slot:activator="{ on, attrs }">
								<span v-bind="attrs" v-on="on">
									<span class="ml-4">
										<v-icon style="font-size: 18px;">mdi-pencil</v-icon>
									</span>
								</span>
							</template>
							<div class="target-object text-right" @click="stopEvent">
								<v-tabs v-model="tab" icons-and-text height="36">
									<v-tabs-slider></v-tabs-slider>
									<v-tab href="#tab-1">
										<span>
											<span>目标</span>
										</span>
									</v-tab>
								</v-tabs>
								<v-tabs-items v-model="tab" class="">
									<v-tab-item id="tab-1" class="text-left">
										<v-text-field
											placeholder="Search Key"
											outlined
											dense
											class="mt-4"
										></v-text-field>
										<div class="parent-node" @click="showObj1">
											<span><v-icon style="font-size: 18px;">mdi-menu-right</v-icon></span>
											<span>我负责的</span>
										</div>
										<div :class="isShowObj1 ? 'child-accordian-open' : 'child-accordian-close'" >
											<div class="child-node ml-8 my-2" v-for="obj in objResponsibles" :key="obj.ob_id" @click="selectParentObj(obj)">
												<span><v-icon style="font-size: 18px;">mdi-target</v-icon></span>
												<span class="ml-2">{{obj.ob_name}}</span>
											</div>
										</div>    
										<div class="parent-node" @click="showObj2">
											<span><v-icon style="font-size: 18px;">mdi-menu-right</v-icon></span>
											<span>我参与的</span>
										</div>
										<div :class="isShowObj2 ? 'child-accordian-open' : 'child-accordian-close'">
											<div class="child-node ml-8 my-2" v-for="obj in objParticipants" :key="obj.ob_id" @click="selectParentObj(obj)">
												<span><v-icon style="font-size: 18px;">mdi-target</v-icon></span>
												<span class="ml-2">{{obj.ob_name}}</span>
											</div>
										</div>
									</v-tab-item>
								</v-tabs-items>
							</div>
						</v-menu>
					</div>
				</div>
			</div>
		</div>
		<div class="mt-4 d-flex justify-start align-center">
			<div class="mr-6 text-right left">附件</div>
			<div class="right">
				<a>点击上传</a>
				<span>（请上传不超过50MB大小的文件，最多可上传9个）</span>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import { getUser } from '@/utils/authUser.service';
import { constant } from "@/constants/constant.js";

export default {
	name: 'ItemBasicInfo',
	components: {
		DateRangePicker,
	},
	props: ['item'],
	data() {
		return {
			tab: null,
			isNameEdit: false,
			nameEdit: this.item.item_name,
			minDate: '2018-01-01',
            maxDate: '2050-12-31',
			popupShow: false,
			remarks: '',
			isShowObj1: false,
			isShowObj2: false,
			targetParentMenu: false,
		}
	},
	computed: {
		...mapGetters('okr', ['filteredOkrObj']),
		dateRange: function() {
            let start = this.item.item_start_date;
            let end = this.item.item_end_date;
            return {
                startDate: start + ' 00:00:00',
                endDate: end + ' 00:00:00'
            }
        },
		itemStart: function() {
			return this.dateFormatter(new Date(this.item.item_start_date));
		},
		itemEnd: function() {
			return this.dateFormatter(new Date(this.item.item_end_date));
		},
		objResponsibles: function() {
            return this.filteredOkrObj.filter(obj => obj.ob_owner == getUser().id && this.item.item_parent_object != obj.ob_id);
        },
		objParticipants: function() {
            let tmp = [];
            this.filteredOkrObj.map(obj => {
                if(obj.ob_participant != null) {
                    let str = obj.ob_participant.split(',');
                    let len = str.filter(s => s == getUser().id);
                    if(len != 0 && this.item.item_parent_object != obj.ob_id) {
                        tmp.push(obj)
                    }
                }   
            });
            return tmp;
        },
		visibleRangeValue1: function() {
			// return constant.visibleRange[2].id;
			return 0;
		},
		visibleRangeValue2: function() {
			// return constant.visibleRange[1].id;
			return 1;
		},
		visibleRange: function() {
			let visible = constant.visibleRange.filter(v => v.id == this.item.item_visible_range)
			return visible[0].value;
		}
	},
	mounted() {
		this.getFilteredOkrs({filter: { ob_owner: getUser().id }});
	},
	methods: {
		...mapActions('item', ['updateItemByField']),
		...mapActions("okr", ["getFilteredOkrs"]),
		updateVisible(param) {
			let payload = {
				item_id: this.item.item_id,
				item_visible_range: param
			}
			this.updateItemByField(payload);
		},
		saveItemName(ev) {
			let payload = {
				item_id: this.item.item_id,
				item_name: this.nameEdit
			}
			this.updateItemByField(payload);
			this.isNameEdit = false;
		},
		dateFormatter(date) {
            return date.getFullYear() + '/' + (date.getMonth() < 9 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1) + '/' + date.getDate()
        },
		datePicker() {

		},
		stopEvent(ev) {
			ev.stopPropagation();
		},
		cancelDateEdit() {
			this.popupShow = false;
		},
		saveDateInfo() {

		},
		saveItemDesc() {
			let payload = {
				item_id: this.item.item_id,
				item_description: this.item.item_description
			}
			this.updateItemByField(payload);
		},
		showObj1() {
            this.isShowObj1 = !this.isShowObj1;
        },
		showObj2() {
            this.isShowObj2 = !this.isShowObj2;
        },
		selectParentObj(obj) {
            let payload = {
                item_id: this.item.item_id,
                item_parent_object: obj.ob_id                
            }
            this.updateItemByField(payload);
            this.targetParentMenu = false;
        }
	}
}
</script>

<style scoped>
	.basic-information {
		font-size: 14px;
	}

	.left {
		min-width: 100px;
	}

	.right {
		width: 90%;
	}	

	.name-edit {
		padding: 5px 0px;
	}

	.name-edit:hover {
		border-bottom: 1px solid #1565c0;
	}

	.date-picker {
		border-bottom: 1px solid #ddd;
	}

	.popup {
		background: #fff;
		min-width: 600px;
		min-height: 400px;
		z-index: 1000;
	}
</style>

<style>
.w-100 {
	width: 100%;
}
</style>