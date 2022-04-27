<template>
<v-sheet class = "width100">
    <v-flex class = "width100 mt_10" d-flex align-center justify-start>
        <v-icon v-if="status == 0" class = "status colorNormal">mdi-circle-slice-8</v-icon>
        <v-icon v-if="status == 1" class = "status colorDelay">mdi-circle-slice-8</v-icon>
        <v-icon v-if="status == 2" class = "status colorRisk">mdi-circle-slice-8</v-icon>
        <v-icon v-if="status == 3" class = "status colorEnd">mdi-circle-slice-8</v-icon>
        <span class = "percentValue">{{ percent }}%</span>
        <span v-if = "changedValue">
            <span class = "changedPercent">
                <span v-if = "up" class = "upValue"><v-icon class = "up">mdi-arrow-up</v-icon>{{ changed }}%</span>
                <span v-if = "down" class = "downValue"><v-icon class = "down">mdi-arrow-down</v-icon>{{ changed }}%</span>
            </span>
        </span>
        <span v-else>
            <span v-if = "beforePercent != 0" class = "changedPercent">
                <span v-if = "up" class = "upValue"><v-icon class = "up">mdi-arrow-up</v-icon>{{ changed }}%</span>
                <span v-if = "down" class = "downValue"><v-icon class = "down">mdi-arrow-down</v-icon>{{ changed }}%</span>
            </span>
        </span>
    </v-flex class = "width100 mt_10">
    <v-flex class = "width100" d-flex align-center justify-start>
            <v-layout class = "width100 m_0" d-flex align-start justify-start row>
               <v-flex grow class = "ml_9" style="height:50px;"> 
                   <v-layout class = "width100 m_0 edit description" d-flex align-start justify-start row style="height:100%;">
                       <v-flex shrink d-flex align-start justify-center style = "position: relative; bottom: 18px;" class="op_0">
                           <v-icon class = "quoteIcon">mdi-format-quote-open</v-icon>
                       </v-flex>
                       <v-flex grow>
                           <v-layout d-flex align-center justify-start column>
                               <v-flex class = "width100"><span class = "desc">{{ description }}</span></v-flex>
                               <v-flex class = "width100">
                                   <v-layout class = "width100 m_0" d-flex align-center justify-start row>
                                        <v-flex grow>
                                            <span class = "createdTime">{{ parseInt(month) }}月{{ parseInt(day) }}日</span><span class = "createdTime">{{ hr }}:{{ min }}</span>
                                        </v-flex>
                                        <v-flex shrink class = "hidden_edit" @click = "editDescription(description)">  
                                            <v-icon class = "editPencil">mdi-lead-pencil</v-icon>
                                            <span class = "editProgressDescription fontFamily">编辑</span>
                                        </v-flex>
                                   </v-layout>
                                </v-flex>
                           </v-layout>
                       </v-flex>
                   </v-layout>
               </v-flex>
               <v-flex shrink d-flex align-start justify-center class="op_0">
                   <v-icon class = "quoteIcon">mdi-format-quote-close</v-icon>
               </v-flex>
            </v-layout>
    </v-flex>
</v-sheet>
</template>

<script>
import PercentDialogComponent from '@/components/okrgoal/shared/PercentDialogComponent.vue';

export default {
    props: ['percent', 'description', 'beforePercent', 'pr_id', 'object_id', 'changedValue', 'status', 'timestamp'],
    components: {
        PercentDialogComponent,
    },
    data() {
        return {
            year: null,
            month: null,
            day: null,
            hr: null,
            min: null,
            changed: null,
            up: false,
            down: false,
        }
    },
    created() {
        const time = new Date(this.timestamp);
        this.year = time.getFullYear();
        this.month = time.getMonth() + 1;
        if(this.month < 10)
        {
            this.month = "0" + this.month.toString();
        }
        this.day = time.getDate();
        if(this.day < 10)
        {
            this.day = "0" + this.day.toString();
        }
        this.hr = time.getHours();
        if(this.hr < 10)
        {
            this.hr = "0" + this.hr.toString();
        }
        this.min = time.getMinutes();
        if(this.min < 10)
        {
            this.min = "0" + this.min.toString();
        }
        if(this.beforePercent != 0)
        {
            this.changed = this.percent - this.beforePercent;
            if(this.changed > 0)
            {
                this.up = true;
            } else if(this.changed < 0) {
                this.down = true;
                this.changed = this.changed - 2*this.changed;
            } else {
                this.up = false;
                this.down = false;
            }
        }
        if(this.changedValue)
        {
            this.changed = this.changedValue;
            if(this.changedValue > 0)
            {
                this.up = true;
            } else if(this.changedValue < 0)
            {
                this.down = true;
                this.changed = this.changedValue - 2*this.changedValue;
            } else {
                this.up = false;
                this.down = false;
            }
        }
    },
    methods: {
        editDescription(prop) {
            let info = {
                object_id: this.object_id,
                pr_id: this.pr_id,
                percent: this.percent,
                status: this.status,
                description: prop
            }
            this.$emit("editDescription", info);
        }
    }
}
</script>

<style>
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
    color: rgb(233 241 244) !important;
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
    font-size: 14px !important;
    color: #a4acb9;
}
.editProgressDescription {
    font-size: 12px !important;
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
.changedPercent {
    font-size: 12px !important;
    font-weight: 600;
    line-height: 20px;
    margin-left: 4px;
}
.fontFamily {
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei;
}
.up {
    color: #5ad8a6 !important;
    font-size: 17px !important;
    position: relative;
    bottom: 1px;
}
.down {
    color: #f05e5e !important;
    font-size: 17px !important;
}
.upValue {
    color: #5ad8a6 !important;    
}
.downValue {
    color: #f05e5e !important;
}
.colorNormal {
    color: blue !important;
}
.colorDelay {
    color: yellow !important;
}
.colorRisk {
    color: red !important;
}
.colorEnd {
    color: rgb(100, 100, 100) !important;
}
.status {
    font-size: 12px !important;
    margin-right: 5px;
}
.op_0 {
    opacity: 0;
}
</style>