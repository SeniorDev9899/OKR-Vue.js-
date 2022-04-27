<template>
<v-sheet class = "width100">
    <UpdateCompletion v-if="objectProgress.length == 0" @updateCompletion="handle_updateCompletion" />
    <v-layout v-else class = "pt_5" d-flex align-center justify-start column>
        <v-flex class = "width100" d-flex align-center justify-start>
            <v-layout class = "width100 m_0" d-flex align-center justify-start row>
                <v-flex grow><span class = "goalProgress fontFamily">目标的进展</span></v-flex>
                <v-flex shrink class = "cursorPointer-repeat" @click = "displayPercentDialog"><v-icon class = "repeatIcon">mdi-repeat</v-icon><span class = "updateCompletion fontFamily">更新完成度</span></v-flex>
            </v-layout>
        </v-flex>
        <GoalProgressItem 
            v-for="(progress, index) in progressList"
            :key="progress.pr_id"
            :pr_id="progress.pr_id"
            :object_id="objectId"
            :status="progress.pr_status" 
            :percent="progress.pr_percent"
            :changedValue="progress.changedValue"
            :beforePercent="index + 1 == progressList.length ? 0 : progressList[index + 1].pr_percent" 
            :description="progress.pr_description" 
            :timestamp="progress.created_at"
            @editDescription = "handle_editDescription"
        />
        <v-flex><span class = "progressToggle" @click = "progressToggle"><span v-if = "down" class = "toggleText">查看全部进展</span><span v-if = "up" class = "toggleText">收起进展</span><v-icon class="toggleIcon" :class="up ? 'toggleUp' : ''">mdi-chevron-down</v-icon></span></v-flex>
        <EditObjectProgress ref="editObjectProgress" @updateProgress="handle_updateProgress" />
    </v-layout>
    <PercentDialogComponent
        ref="percent"
        :percent="percent"
        :isAuto="0"
        v-on:savePercentValue="(param) => getPercentValue(param)"
    />
</v-sheet>
</template>

<script>
import UpdateCompletion from '@/components/okrgoal/okrDetail/Progress/components/UpdateCompletion.vue';
import GoalProgressItem from '@/components/okrgoal/okrDetail/Progress/components/GoalProgressItem.vue';
import EditObjectProgress from '@/components/okrgoal/shared/EditObjectProgress.vue';
import PercentDialogComponent from '@/components/okrgoal/shared/PercentDialogComponent.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['objectId'],
    components: {
        UpdateCompletion,
        PercentDialogComponent,
        GoalProgressItem,
        EditObjectProgress,
    },
    data() {
        return {
            percent: "",
            down: true,
            up: false,
            progressList: [],
        }
    },
    created() {
        this.getPrg(this.objectId).then((res) => {
            if(res == "success") {
                this.progressList = this.objectProgress.slice(0, 1);
                if(this.objectProgress.length >= 2)
                {
                    const changedValue = this.objectProgress[0].pr_percent - this.objectProgress[1].pr_percent;
                    this.progressList[0].changedValue = changedValue;
                }
                if(this.objectProgress.length != 0)
                {
                    this.percent = this.objectProgress[0].pr_percent;
                } else {
                    this.percent = 0;
                }
            }
        })
    },
    watch: {
      objectId(v) {
          this.getPrg(v).then((res) => {
            if(res == "success") {
                this.progressList = this.objectProgress.slice(0, 1);
                if(this.objectProgress.length >= 2)
                {
                    const changedValue = this.objectProgress[0].pr_percent - this.objectProgress[1].pr_percent;
                    this.progressList[0].changedValue = changedValue;
                }
                if(this.objectProgress.length != 0)
                {
                    this.percent = this.objectProgress[0].pr_percent;
                } else {
                    this.percent = 0;
                }
            }
        });
      }  
    },
    computed: {
        ...mapGetters('progress', ['objectProgress']),
    },
    methods: {
        ...mapActions('progress', ['getProgress', 'addProgress', 'updateProgress']),
        handle_updateCompletion() {
            this.$refs.percent.openDialog();
        },
        displayPercentDialog() {
           this.$refs.percent.openDialog();
        },
        handle_editDescription(prop) {
            let info = {
                object_id: this.object_id,
                pr_id: this.pr_id,
                percent: this.percent,
                status: this.status,
                description: prop
            }
            this.$refs.editObjectProgress.openEditDescriptionModal(info);
        },
        async getPercentValue(prop) {
            let addNewProgress = {
                "pr_creator" : 1,
                "pr_parent" : this.objectId,
                "pr_parent_type" : 0,
                "pr_percent" : prop.pr_percent,
                "pr_status" : prop.pr_status,
                "pr_description" : prop.pr_description
            }
            const res = await this.addProgress(addNewProgress);
            if(!!res) {
                this.progressList = this.objectProgress;
            }
            this.up = true;
            this.down = false;
        },
        // progressToggle() {
        //     this.up = !this.up;
        //     this.down = !this.down;
        //     this.$emit("toggleProgressList", {
        //         showMore: this.up,
        //     });
        // },
        progressToggle(prop) {
            this.up = !this.up;
            this.down = !this.down;
            if(this.up == true)
            {
                this.progressList = this.objectProgress;
                if(this.objectProgress.length >= 2)
                {
                    const changedValue = this.objectProgress[0].pr_percent - this.objectProgress[1].pr_percent;
                    this.progressList[0].changedValue = changedValue;
                }
            } else if(this.up == false)
            {
                this.progressList = this.objectProgress.slice(0, 1);
                if(this.objectProgress.length >= 2)
                {
                    const changedValue = this.objectProgress[0].pr_percent - this.objectProgress[1].pr_percent;
                    this.progressList[0].changedValue = changedValue;
                }
            }
        },
        handle_editDescription(prop) {
            this.$refs.editObjectProgress.openEditDescriptionModal(prop);
        },
        handle_updateProgress(prop) {
            this.updateProgress(prop);
            this.progressList.map((item) => {
                if(item.pr_id == prop.pr_id) {
                    item.pr_description = prop.pr_description;
                }
            });
        },
        async getPrg(objectId) {
          let prgBody = {
            "pr_parent": objectId,
            "pr_parent_type": 0,
          }
          const res = await this.getProgress(prgBody);
          return res;
        },
    }
}
</script>

<style scoped>
.goalProgress {
    font-size: 14px;
    font-family: -apple-system,Arial,Verdana,Helvetica Neue,Helvetica,sans-serif;
    font-weight: 600;
    color: #141c28;
    line-height: 22px;
    margin-bottom: 6px;
    margin-left: 8px;
}
.updateCompletion {
    font-size: 13px;
    color: #2879ff;
    margin-left: 3px;
}
.repeatIcon {
    font-size: 15px;
    color: #2879ff;
    top: 1px;
}
.cursorPointer-repeat {
    cursor: pointer;
}
.cursorPointer-repeat:hover .repeatIcon {
    color: #7da8f0;
}
.cursorPointer-repeat:hover .updateCompletion {
    color: #7da8f0;
}
.width100 {
    width: 100%;
}
.pt_5 {
    padding-top: 5px;
}
.m_0 {
    margin: 0px !important;
}
.mt_10 {
    margin-top: 10px;
}
.mt_8 {
    margin-top: 8px;
}
.ml_6 {
    margin-left: 6px;
}
.ml_9 {
    margin-left: 9px;
}
.mr_10 {
    margin-right: 10px;
}
.percentValue {
    font-size: 16px;
    font-weight: 600;
    color: #3f4755;
    line-height: 24px
}
.desc {
    font-size: 14px;
    color: #3f4755;
    line-height: 22px;
}
.createdTime {
    font-size: 12px;
    color: #a4acb9;
    line-height: 18px;
    margin-top: 6px;
    margin-right: 12px;
}
.quoteIcon {
    color: rgb(233 241 244);
    position:relative;
    top: 10px;
}
.edit {
    height: 25px;
    /* padding-top: 8px;
    padding-bottom: 10px;
    padding-left: 3px;
    padding-right: 8px; */
    border-radius: 5px;
}
.description:hover{
    background-color: rgb(247 249 250);
}
.editPencil {
    font-size: 12px;
    color: #a4acb9;
}
.editProgressDescription {
    font-size: 12px;
    color: #a4acb9;
    margin-left: 4px;
}
.hidden_edit {
    transition: all .5s ease;
    cursor: pointer;
    opacity: 0;
}
.hidden_edit:hover .editPencil {
    color: rgb(79 137 226) !important;
}
.hidden_edit:hover .editProgressDescription {
    color: rgb(79 137 226) !important;
}
.description:hover .hidden_edit {
    opacity: 1;
}
.progressToggle {
    user-select: none;
    font-size: 13px;
    font-family: -apple-system,Arial,Verdana,Helvetica Neue,Helvetica,sans-serif;
    line-height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 4px;
    color: #2879ff;
    cursor: pointer;
}
.toggleIcon {
    transition: all .5s ease;
    color: #2879ff;
    font-size: 19px !important;
}
.toggleUp {
    transform: rotate(180deg);
}
.toggleText {
    color: #2879ff;
}
.progressToggle:hover .toggleText {
    color: #7a9edb;
}
.progressToggle:hover .toggleIcon {
    color: #7a9edb;
}
.fontFamily {
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei;
}
</style>