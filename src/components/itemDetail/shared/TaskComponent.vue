<template>
<div>
    <div class="task-item px-4 py-4">
        <div class="d-flex justify-space-between align-top">
            <div class="avatar d-flex align-top justify-center mr-4">
                <UserAvatar name="会计主" width='50px' height = '50px' />
            </div>
            <div class="task-main-content mt-2">
                <div><strong>Tita小助手</strong>发起的任务</div>
                <div class="task-content mt-4 px-2 py-2">
                    <div class="task-description py-2 px-2 d-flex justify-start">
                        <div style="width: 120px;">
                            <div class="mb-2 blue--text"><strong>任务</strong></div>
                            <div>
                                <v-icon class="blue--text">mdi-view-list-outline</v-icon>
                                <span>新手项目</span>
                            </div>
                        </div>
                        <div class="ml-2 w-100">
                            <div class="mb-2 w-100 d-flex justify-space-between">
                                <span>进入项目进度页签，将项目进度更改为50%</span>
                                <span class="mr-16">负责人:Tita小助手</span>
                            </div>
                            <div>暂无描述</div>
                        </div>
                    </div>
                    <div class="task-progress py-2 px-2">
                        <div>
                            <span>全部操作</span>
                            <span class="ml-1">3</span>
                            <v-icon style="font-size: 18px;">mdi-chevron-down</v-icon>
                        </div>
                        <div>
                            <v-timeline dense>
                                <v-timeline-item
                                    v-for="(progress, i) in progresses"
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
                    </div>
                    <div class="status-badge"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="d-flex justify-space-between align-center my-4">
        <div class="time-fb">
            7月16日 20:47
        </div>
        <div class="feed-action-tag d-flex justify-end align-center">
            <div class="action-tag">
                <v-icon style="font-size:18px;">mdi-tag-outline</v-icon>
                <span>标签</span>
            </div>
            <div class="mx-1">|</div>
            <div class="action-tag">
                <v-icon style="font-size:18px;">mdi-currency-usd</v-icon>
                <span>打赏</span>
            </div>
            <div class="mx-1">|</div>
            <div class="action-tag">
                <v-icon style="font-size:18px;">mdi-heart-outline</v-icon>
                <span>收藏</span>
            </div>
            <div class="mx-1">|</div>
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
</div>
</template>

<script>
import UserAvatar from '@/components/common/UserAvatar.vue';

export default {
    name: 'TaskComponent',
    components: {
        UserAvatar
    },
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
        }
    },
    methods: {

    }
}
</script>

<style scoped>
.task-item {
	font-size: 14px;
	border-bottom: 1px solid #e6e6e6;
}

.task-item .avatar {
	max-width: 100px;
}

.task-main-content {
	width: 100%;
}

.task-content {
	background-color: #f4faff;
	position: relative;
}

.task-description {
	border-bottom: 1px solid #e6e6e6;
}

.task-progress {

}

.blue--text {
	color: #2d83cf;
}

.status-badge {
	position: absolute;
	right: 0;
	top: 15px;
	background-color: #58C583;
	height: 25px;
	width: 75px;
	box-shadow: 1px 1px 10px #ddd;
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
}

.w-100 {
    width: 100%;
}

.time-fb {
    line-height: 16px;
    color: #ccc;
    font-size: 12px;
}
</style>