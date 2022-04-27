<template>
	<div class="tasklist">
		<div class="create-task my-4">
			<v-btn color="rgb(40, 121, 255)" class="white--text mx-2" @click="openCreateTask()">创建任务</v-btn>
		</div>
		<div class="action-container d-flex justify-space-between align-center">
			<div class="filters d-flex justify-start align-center">
				<div class="mr-4">
					<v-menu offset-y>
						<template v-slot:activator="{ on, attrs }">
							<span v-bind="attrs" v-on="on">
								状态<v-icon style="font-size: 18px;">mdi-menu-down</v-icon>
							</span>
						</template>
						<v-list>
							<v-list-item class="status-container">
								<div class="status-item">
									<v-checkbox @click="stopEvent" @change="ev => statusFilterChange(ev, 0)" v-model="statusAllCheck" label="全部状态"></v-checkbox>
								</div>
								<div class="status-item pl-4">
									<v-checkbox @click="stopEvent" @change="ev => statusFilterChange(ev, 1)" v-model="statusNotStarted" label="未开始"></v-checkbox>
								</div>
								<div class="status-item pl-4">
									<v-checkbox @click="stopEvent" @change="ev => statusFilterChange(ev, 2)" v-model="statusProcessing" label="进行中"></v-checkbox>
								</div>
								<div class="status-item pl-4">
									<v-checkbox @click="stopEvent" @change="ev => statusFilterChange(ev, 3)" v-model="statusCompleted" label="已完成"></v-checkbox>
								</div>
								<div class="status-item pl-4">
									<v-checkbox @click="stopEvent" @change="ev => statusFilterChange(ev, 4)" v-model="statusDelayed" label="已延迟"></v-checkbox>
								</div>
								<div class="status-item pl-4">
									<v-checkbox @click="stopEvent" @change="ev => statusFilterChange(ev, 5)" v-model="statusCancelled" label="已取消"></v-checkbox>
								</div>
								<div class="status-item pl-4">
									<v-checkbox @click="stopEvent" @change="ev => statusFilterChange(ev, 6)" v-model="statusPaused" label="暂停中"></v-checkbox>
								</div>
							</v-list-item>
							<v-list-item class="mt-4">
								<v-btn color="#1B6CF1" class="white--text" @click="setStatusFilter">确定</v-btn>
							</v-list-item>
						</v-list>
					</v-menu>
				</div>
				<div class="mr-4">
					<v-menu offset-y>
						<template v-slot:activator="{ on, attrs }">
							<span v-bind="attrs" v-on="on">
								范围<v-icon style="font-size: 18px;">mdi-menu-down</v-icon>
							</span>
						</template>
						<v-list>
							<v-list-item class="status-container">
								<UserPicker @pick="pickUser" />
							</v-list-item>
						</v-list>
					</v-menu>
				</div>
				<div>
					<v-menu offset-y>
						<template v-slot:activator="{ on, attrs }">
							<span v-bind="attrs" v-on="on">
								系统默认排序<v-icon style="font-size: 18px;">mdi-menu-down</v-icon>
							</span>
						</template>
						<v-list>
							<v-list-item class="status-container">
								<div class="status-item" @click="sortTasksBy('default')" :class="sortBy.default == 1 ? 'blue--text' : ''">
									系统默认排序
								</div>
								<div class="status-item my-2 d-flex justify-start" @click="sortTasksBy('startDate')">
									<span :class="sortBy.startDate != 0 ? 'blue--text' : ''">开始时间</span>
									<span style="display: block;" class="ml-4">
										<v-icon style="display: block;font-size: 14px;margin-top:1px;" :class="sortBy.startDate == 1 ? 'blue--text' : ''">mdi-chevron-up</v-icon>
										<v-icon style="display: block;font-size: 14px; margin-top: -5px;":class="sortBy.startDate == 2 ? 'blue--text' : ''">mdi-chevron-down</v-icon>
									</span>
								</div>
								<div class="status-item my-2 d-flex justify-start" @click="sortTasksBy('endDate')">
									<span :class="sortBy.endDate != 0 ? 'blue--text' : ''">结束时间</span>
									<span style="display: block;" class="ml-4">
										<v-icon style="display: block;font-size: 14px;margin-top:1px;" :class="sortBy.endDate == 1 ? 'blue--text' : ''">mdi-chevron-up</v-icon>
										<v-icon style="display: block;font-size: 14px; margin-top: -5px;" :class="sortBy.endDate == 2 ? 'blue--text' : ''">mdi-chevron-down</v-icon>
									</span>
								</div>
								<div class="status-item my-2 d-flex justify-start" @click="sortTasksBy('created')">
									<span :class="sortBy.created != 0 ? 'blue--text' : ''">创建时间</span>
									<span style="display: block;" class="ml-4">
										<v-icon style="display: block;font-size: 14px;margin-top:1px;" :class="sortBy.created == 1 ? 'blue--text' : ''" >mdi-chevron-up</v-icon>
										<v-icon style="display: block;font-size: 14px; margin-top: -5px;" :class="sortBy.created == 2 ? 'blue--text' : ''">mdi-chevron-down</v-icon>
									</span>
								</div>
								<div class="status-item my-2 d-flex justify-start" @click="sortTasksBy('priority')" :class="sortBy.priority != 0 ? 'blue--text' : ''">
									按优先级排序
								</div>
							</v-list-item>
						</v-list>
					</v-menu>
				</div>
			</div>
			<v-spacer></v-spacer>
		</div>
		<div class="past-task-list py-6">
            <div class="task-item"  v-for="task_item in pastTaskList" :key="task_item.task_id">
                <TaskComponent :task_item="task_item" />
            </div>
        </div>
		<div class="current-task-list py-6">
            <div class="task-item"  v-for="task_item in currentTaskList" :key="task_item.task_id">
                <TaskComponent :task_item="task_item" />
            </div>
        </div>
		<CreateTask ref="createTask" @save="createTask" />
	</div>
</template>

<script>
import TaskComponent from '@/components/schedule/shared/TaskComponent.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
	name: 'ItemPlan',
	components: {
		TaskComponent,
		CreateTask: () => import('@/components/common/CreateTask.vue'),
		UserPicker: () => import('@/components/common/UserPicker.vue')
	},
	props: ['item'],
	data() {
		return {
			statusAllCheck: false,
            statusNotStarted: true,
            statusProcessing: false,
            statusCompleted: false,
            statusDelayed: false,
            statusCancelled: false,
            statusPaused: false,
            task_status: "",
			sortBy: {
                default: 0,
                startDate: 0,
                endDate: 0,
                created: 0,
                priority: 0
            },
			filter: {},
		}
	},
	computed: {
		...mapGetters('task', ['tasks']),
		pastTaskList: function() {
			if(this.tasks.length != 0) {
                let tmp = [];
                this.tasks.map(t => {
                    let today = new Date();
                    let end_date = new Date(t.task_end_date);
                    if(today.getTime() > end_date.getTime() && t.task_end_date != null) {
                        Object.assign(t, {isExpired: true});
                        tmp.push(t)
                    }
                });
                return tmp;
            }else{
                return [];
            }
		},
		currentTaskList: function() {
            if(this.tasks.length != 0) {
                let tmp = [];
                this.tasks.map(t => {
                    let today = new Date();
                    let end_date = new Date(t.task_end_date);
                    if(today.getTime() <= end_date.getTime()) {
                        tmp.push(t)
                    }
                });
                return tmp;
            }else{
                return [];
            }
        }
	},
	mounted() {
		Object.assign(this.filter, {task_parent_item: this.item.item_id}, {task_status: '1,'});
		this.getTasksByFilter();
	},
	methods: {
		...mapActions('task', ['getTasks', 'addTask']),
		openCreateTask() { 
            this.$refs.createTask.open();
        },
		stopEvent: function(ev) {
            ev.stopPropagation();
        },
		createTask(e) {
            this.newTask = e
            this.taskMenu = false
            this.addTask(this.newTask)
        },
		statusFilterChange: function(ev, param) {
            if(param == 0) {
                if(ev) {
                    this.statusAllCheck = true;
                    this.statusNotStarted = true;
                    this.statusProcessing = true;
                    this.statusCompleted = true;
                    this.statusDelayed = true;
                    this.statusCancelled = true;
                    this.statusPaused = true;
                    this.task_status = "1,2,3,4,5,6,";
                }else{
                    this.statusAllCheck = false;
                    this.statusNotStarted = false;
                    this.statusProcessing = false;
                    this.statusCompleted = false;
                    this.statusDelayed = false;
                    this.statusCancelled = false;
                    this.statusPaused = false;
                    this.task_status = "";
                }
            }
            if(param == 1) {
                this.statusAllCheck = this.statusNotStarted && this.statusProcessing && this.statusCompleted && this.statusDelayed && this.statusCancelled && this.statusPaused;
                if(!this.task_status.includes('1') && ev) {
                    this.task_status += '1,'
                }
                if(this.task_status.includes('1') && !ev) {
                    this.task_status = this.task_status.replace('1,','');
                }
            }
            if(param == 2) {
                this.statusAllCheck = this.statusNotStarted && this.statusProcessing && this.statusCompleted && this.statusDelayed && this.statusCancelled && this.statusPaused;
                if(!this.task_status.includes('2') && ev) {
                    this.task_status += '2,'
                }
                if(this.task_status.includes('2') && !ev) {
                    this.task_status = this.task_status.replace('2,','');
                }
            }
            if(param == 3) {
                this.statusAllCheck = this.statusNotStarted && this.statusProcessing && this.statusCompleted && this.statusDelayed && this.statusCancelled && this.statusPaused;
                if(!this.task_status.includes('3') && ev) {
                    this.task_status += '3,'
                }
                if(this.task_status.includes('3') && !ev) {
                    this.task_status = this.task_status.replace('3,','');
                }
            }
            if(param == 4) {
                this.statusAllCheck = this.statusNotStarted && this.statusProcessing && this.statusCompleted && this.statusDelayed && this.statusCancelled && this.statusPaused;
                if(!this.task_status.includes('4') && ev) {
                    this.task_status += '4,'
                }
                if(this.task_status.includes('4') && !ev) {
                    this.task_status = this.task_status.replace('4,','');
                }
            }
            if(param == 5) {
                this.statusAllCheck = this.statusNotStarted && this.statusProcessing && this.statusCompleted && this.statusDelayed && this.statusCancelled && this.statusPaused;
                if(!this.task_status.includes('5') && ev) {
                    this.task_status += '5,'
                }
                if(this.task_status.includes('5') && !ev) {
                    this.task_status = this.task_status.replace('5,','');
                }
            }
            if(param == 6) {
                this.statusAllCheck = this.statusNotStarted && this.statusProcessing && this.statusCompleted && this.statusDelayed && this.statusCancelled && this.statusPaused;
                if(!this.task_status.includes('6') && ev) {
                    this.task_status += '6,'
                }
                if(this.task_status.includes('6') && !ev) {
                    this.task_status = this.task_status.replace('6,','');
                }
            }
        },
		sortTasksBy(param) {            
            if(param == 'default') {
                Object.assign(this.sortBy, { endDate: 0 }, { created: 0 }, { priority: 0 });
                Object.assign(this.sortBy, { default: this.sortBy.default == 0 ? 1 : 0 });
                delete this.filter.task_sortby;
            }
            if(param == 'startDate') {
                if(this.sortBy.startDate == 0) {
                    Object.assign(this.sortBy, { default: 0 }, { endDate: 0 }, { created: 0 }, { priority: 0 });
                    Object.assign(this.sortBy, { startDate: 1 });
                    Object.assign(this.filter, { task_sortby: 'task_start_date ASC' })
                }else{
                    Object.assign(this.sortBy, { default: 0 }, { endDate: 0 }, { created: 0 }, { priority: 0 });
                    Object.assign(this.sortBy, { startDate: this.sortBy.startDate == 1 ? 2 : 1 });
                    Object.assign(this.filter, { task_sortby: 'task_start_date DESC' })
                }
            }
            if(param == 'endDate') {
                if(this.sortBy.endDate == 0) {
                    Object.assign(this.sortBy, { endDate: 1 });
                    Object.assign(this.sortBy, { default: 0 }, { startDate: 0 }, { created: 0 }, { priority: 0 });
                    Object.assign(this.filter, { task_sortby: 'task_end_date ASC' })
                }else{
                    Object.assign(this.sortBy, { default: 0 }, { startDate: 0 }, { created: 0 }, { priority: 0 });
                    Object.assign(this.sortBy, { endDate: this.sortBy.endDate == 1 ? 2 : 1 });
                    Object.assign(this.filter, { task_sortby: 'task_end_date DESC' })
                }
            }
            if(param == 'created') {
                if(this.sortBy.created == 0) {
                    Object.assign(this.sortBy, { default: 0 }, { startDate: 0 }, { endDate: 0 }, { priority: 0 });
                    Object.assign(this.sortBy, { created: 1 });
                    Object.assign(this.filter, { task_sortby: 'created_at ASC' })
                }else{
                    Object.assign(this.sortBy, { default: 0 }, { startDate: 0 }, { endDate: 0 }, { priority: 0 });
                    Object.assign(this.sortBy, { created: this.sortBy.created == 1 ? 2 : 1 });
                    Object.assign(this.filter, { task_sortby: 'created_at DESC' })
                }    
            }
            if(param == 'priority') {
                Object.assign(this.sortBy, { default: 0 }, { startDate: 0 }, { endDate: 0 }, { created: 0 });
                Object.assign(this.sortBy, { priority: this.sortBy.priority == 0 ? 1 : 0 });
                Object.assign(this.filter, { task_sortby: 'priority DESC' })
            }
            this.getTasksByFilter();
        },
		setStatusFilter: function(ev) {
            // ev.stopPropagation()
            Object.assign(this.filter, {task_status : ''+this.task_status+''});
            this.getTasksByFilter();
        },
		getTasksByFilter() {
            this.getTasks(this.filter);
        },
		pickUser(e) {
			Object.assign(this.filter, { task_owner: e.user.id });
			this.getTasksByFilter();
		}
	}
}
</script>

<style scoped>
.tasklist {
	width: 100%;
}

.cycle-item {
    color: #647481;
    display: block;
    min-width: 42px;
    text-align: center;
    background-color: #ddd;
    border-radius: 20px;
    margin-left: 8px;
    margin-right: 8px;
    padding: 5px 10px;
}

.cycle-item:hover {
    cursor: pointer;
}

.no-list {
    width: 100%;
    border: 1px dashed #ddd;
    text-align: center;
    padding: 30px 0px;
    font-size: 24px;
    color: #ddd;
}

.expired-icon {
    background-color: #f68a87;
    cursor: pointer;
    border-radius: 10px;
    padding: 0 21px;
    width: 92px;
    height: 21px;
    display: inline-block;
    color: #fff;
    font-size: 12px;
    line-height: 21px;
    margin: 0 auto;
}

.current-icon {
    background: #c5c5c5;
    cursor: pointer;
    border-radius: 10px;
    padding: 0 21px;
    width: 112px;
    height: 21px;
    display: inline-block;
    color: #fff;
    font-size: 12px;
    line-height: 21px;
    margin: 0 auto;
}

.expansion-hide {
    display: none;
}

.expansion-show {
    display: block;
}

.line {
    border-top:1px solid #e4ebf0;
    width: 100%;
    margin-bottom: -12px;
}

.active {
    background-color: #2879FF !important;
    color: #fff;
}

.status-container {
    display: block;
}

.status-item {
    max-height: 18px;
}

.release-btn {
    margin-left: -72px;
    margin-top: 1.5px;
    margin-right: 2px;
}

.status-item:hover {
    cursor: pointer;
}

.blue--text {
    color: rgb(40, 121, 255);
}
</style>