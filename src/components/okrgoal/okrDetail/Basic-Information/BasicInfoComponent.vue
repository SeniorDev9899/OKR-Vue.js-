<template>
<div>
    <v-layout>
        <v-flex class="info-container">
            <div>周期</div>
            <div class="cycle-container obj-cycle mt-2 ml-2 d-flex justify-start align-center" @click="openCycleDatePicker">
                <span>{{cycle}} <span class="ml-1">({{start}}~{{end}})</span></span>
                <div class="cyclePicker" v-if="showCycleDatePicker">
                    <Calendar @pick="handle_getTimePeriod" :isWhole="false"/>
                    <v-divider class="my-2"></v-divider>
                    <date-range-picker
                        ref="picker"
                        opens="center"
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
                    <div class="mt-4 d-flex justify-end align-center">
                        <v-spacer></v-spacer>
                        <v-btn class="close mr-4" text @click="closeCyclePicker" dense depressed>取消</v-btn>
                        <v-btn class="save" text @click="updateCycle" dense depressed>确定</v-btn>
                    </div>
                </div>
            </div>
        </v-flex>
        <v-flex class="info-container">
            <div>负责人</div>
            <div>
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <span
                            v-bind="attrs"
                            v-on="on"
                            class="d-flex justify-start align-center"
                        >
                            <UserAvatar :name="employeeName.substring(0, 1)" width='30px' height = '30px' />
                            <span class="ml-2">{{employeeName}}</span>
                        </span>
                    </template>
                    <v-list class="py-0">
                        <v-list-item class="px-0">
                        <UserPicker @pick="param => pickUser(param)" />
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </v-flex>
        <v-flex class="info-container ">
            <!-- <div>可见范围
                <ToolTipComponent tooltipText="tool tip text" direction="top"> 
                    <v-icon>mdi-help-circle</v-icon>
                </ToolTipComponent>
            </div>
            <v-select :value="align_target" :items="alignTargetArr" placeholder="" outlined dense @input="openVisibility"></v-select>
            <div class="visibleShow">{{visbleShow}}</div> -->
            <div class="label">可见范围</div>
            <div class="visible-text d-flex align-center justify-space-between" @click="showVisibleSelectBox">
                <div class="selected-visible">{{selectedVisible}}</div>
                <v-icon class="mr-2" style="font-size: 22px;color:#000;">mdi-menu-down</v-icon>
                <div class="visible-select-box" v-if="isShowVisible" v-click-outside="hideVisibleSelectBox">
                    <div class="py-1 px-3 f-14" @click="selectVisible('全公司')">
                        全公司
                    </div>
                    <div class="py-1 px-3 f-14" @click="selectVisible('仅相关成员')">
                        仅相关成员
                    </div>
                    <div class="py-1 px-3 f-14" @click="selectVisible('仅直接下属')">
                        仅直接下属
                    </div>
                    <div class="py-1 px-3 f-14" @click="selectVisible('指定范围')">
                        指定范围
                    </div>
                </div>
            </div>
        </v-flex>
    </v-layout>
    <div class="thickness my-4"></div>
    <div>
        <div>参与人</div>
        <div class="d-flex justify-start flex-wrap align-center">
            <span class="d-flex justify-start">
                <span class="d-flex align-center mr-2" v-for="user in selectedParticipants">
                    <UserAvatar :name="user.employeeName.substring(0, 1)" width='30px' height = '30px' :isRemove="true" @picked="removeParticipant(user)" />
                </span>
            </span>
            <span class="d-flex align-center mr-2" v-for="user in participants">
                <UserAvatar :name="user.employeeName.substring(0, 1)" width='30px' height = '30px' :isRemove="true" @picked="removeParticipant(user)" />
            </span>
            <v-icon class="mr-4"  @click="participantOpen">mdi-plus</v-icon>
        </div>
    </div>
    <div class="mt-4">
        <div>关注人</div>
        <div class="d-flex justify-start flex-wrap align-center">
            <span class="d-flex justify-start">
                <span class="d-flex align-center mr-2" v-for="user in selectedFollowers">
                    <UserAvatar :name="user.employeeName.substring(0, 1)" width='30px' height = '30px' :isRemove="true" @picked="removeFollower(user)" />
                </span>
            </span>
            <span class="d-flex align-center mr-2" v-for="user in followers">
                <UserAvatar :name="user.employeeName.substring(0, 1)" width='30px' height = '30px' :isRemove="true" @picked="removeFollower(user)" />
            </span>
            <v-icon class="mr-4"  @click="followerOpen">mdi-plus</v-icon>
        </div>
    </div>
    <UserDepartmentTeamPicker ref="participant" @selected="participantSave" />
    <UserDepartmentTeamPicker ref="follower" @selected="followerSave" />
    <UserDepartmentTeamPicker ref="visibility" @selected="visibilitySelect" :visibleRange="currentVisibleRange" />
</div>
</template>

<script>
import UserAvatar from '@/components/common/UserAvatar.vue';
import ToolTipComponent from '@/components/okrgoal/shared/ToolTipComponent.vue';
import UserPicker from '@/components/common/UserPicker.vue';
import DateRangePicker from 'vue2-daterange-picker';
import Calendar from '@/components/common/Calendar.vue';
import UserDepartmentTeamPicker from '@/components/common/UserDepartmentTeamPicker.vue';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import { mapGetters, mapActions } from 'vuex';
import { constant } from '@/constants/constant.js';
import { converter } from '@/utils/converter.js';

export default {
    name: 'BasicInfoComponent',
    components: {
        UserAvatar,
        ToolTipComponent,
        UserPicker,
        DateRangePicker,
        Calendar,
        UserDepartmentTeamPicker
    },
    props: ['object_id'],
    data() {
        return {
            selectedObj: Object,
            nameStr: '',
            // dateRange: {
            //     startDate: '2021-07-06',
            //     endDate: '2021-07-12'
            // },
            minDate: '2018-01-01',
            maxDate: '2050-12-31',
            alignTargetArr: ['全公司', '仅相关成员', '仅直接下属', '指定范围'],
            showCycleDatePicker: false,
            selected_year: '',
            selected_quarter: '',
            startDateSave: '',
            endDateSave: '',
            saveCycle: '',
            visibleType: '',
            participants: [],
            followers: [],
            visbleShow:'',
            selectedVisible: '全公司',
            isShowVisible: false,
            currentVisibleRange: null
        }
    },
    mounted() {
    },
    computed: {
        ...mapGetters('okr', ['okrObj']),
        ...mapGetters("user", ["users"]),
        // selectedParticipants: function() {
        //     if(this.currentOkr.ob_participants != null) {
        //         let result = this.currentOkr.ob_participants;
        //         return result;
        //     }else{
        //         return [];
        //     }
        // },
        selectedParticipants: {
            get: function() {
                if(this.currentOkr.ob_participants != null) {
                    let result = this.currentOkr.ob_participants;
                    return result;
                }else{
                    return [];
                }
            },
            set: function(param) {
                
            }
        },
        selectedFollowers: function() {
            if(this.currentOkr.ob_attentions != null) {
                let result = this.currentOkr.ob_attentions;
                return result;
            }else{
                return [];
            }
        },
        currentOkr: function () {
            const index = this.okrObj.findIndex(item => item.ob_id == this.object_id)
            this.currentVisibleRange = this.okrObj[index].ob_visible_range;
            let users = this.okrObj[index].ob_visibility_user_names != null ? this.okrObj[index].ob_visibility_user_names : ''
            let dps = this.okrObj[index].ob_visibility_dp_names != null ? this.okrObj[index].ob_visibility_dp_names : ''
            if(users != '' && dps != '') {
                let userArr = users.split(',');
                if(userArr[userArr.length - 1] == '') {
                    this.selectedVisible = users + dps;
                }else{
                    this.selectedVisible = users + ',  ' + dps;
                }
            }else if(users == '' && dps != '') {
                this.selectedVisible = dps;
            }else if(users != '' && dps == ''){
                this.selectedVisible = users;
            }else if(this.okrObj[index].ob_visible_type != 3){
                this.selectedVisible = this.okrObj[index].ob_visible_range;
            }else{}
            return this.okrObj[index]
        }, 
        align_target: {
            get: function() {
                const index = this.okrObj.findIndex(item => item.ob_id == this.object_id)
                const okr = this.okrObj[index];
                if(okr.ob_visible_type == 3) {
                    return constant.visibilityTypeArr[3];
                }else{
                    return okr.ob_visible_range;
                }
            },
            set: function(newValue) {
                const index = this.okrObj.findIndex(item => item.ob_id == this.object_id)
                const okr = this.okrObj[index];
                okr.ob_visible_range = newValue;
            }            
        },
        dateRange: function() {
            let start = this.currentOkr.ob_start_date;
            let end = this.currentOkr.ob_end_date;
            return {
                startDate: start + ' 00:00:00',
                endDate: end + ' 00:00:00'
            }
        },
        start: function() {
            let start = this.currentOkr.ob_start_date;
            start = start.split('-');
            return start[1] + '/' + start[2];
        },
        end: function() {
            let end = this.currentOkr.ob_end_date;
            end = end.split('-');
            return end[1] + '/' + end[2];
        },
        object_name: function() {
            if(this.okrObj.length !== 0) {
                const selectedObj = this.okrObj.filter(obj => obj.ob_id == this.object_id);
                this.selectedObj = selectedObj[0];
                return selectedObj[0].ob_name;
            }else{
                return {};
            }
        },
        employeeName: function() {
            if(this.okrObj.length !== 0) {
                const selectedObj = this.okrObj.filter(obj => obj.ob_id == this.object_id);
                return selectedObj[0].ob_owners.employeeName;
            }else{
                return '';
            }
        },
        startDate: function() {
            let start = this.currentOkr.ob_start_date;
            let startDate = new Date(start);
            let month = startDate.getMonth() + 1;
            let day = startDate.getDay();
            return month + '/' + day;
        },
        endDate: function() {
            let end = this.currentOkr.ob_end_date;
            let endDate = new Date(end);
            let month = endDate.getMonth() + 1;
            let day = endDate.getDay();
            return month + '/' + day;
        },
        cycle: function() {
            let cycle = this.currentOkr.ob_cycle;
            if(cycle != undefined) {
                cycle += '';
                let tmp = cycle.split('/');
                if(tmp.length == 2) {
                    let year = tmp[0];
                    let quater = '/' + tmp[1];
                    let result = constant.cycleItems.filter(c => c.dbformat == quater);
                    return year + '年' + result[0].title;
                }else{
                    tmp = cycle.split('-');
                    let year = tmp[0];
                    let month = '-' + tmp[1];
                    let result = constant.cycleItems.filter(c => c.dbformat == month);
                    return year + '年' + result[0].title;
                }
            }
        },  
    },
    methods: {
        ...mapActions("okr", ["updateOkr", "createKeyResult"]),
        removeParticipant(user) {
            let allPs = this.participants.concat(this.selectedParticipants);
            let index = allPs.indexOf(user);
            if (index > -1) {
                allPs.splice(index, 1);
            }
            let participant = '';
            allPs.map(p => {
                participant += p.id + ','
            });
            let obj = {
                ob_id: this.currentOkr.ob_id,
                ob_participant: participant
            }
            this.updateOkr(obj);
            
            index = this.selectedParticipants.indexOf(user);
            if (index > -1) {
                this.selectedParticipants.splice(index, 1);
            }

            index = this.participants.indexOf(user);
            if (index > -1) {
                this.participants.splice(index, 1);
            }
        },
        removeFollower(user) {
            let allPs = this.followers.concat(this.selectedFollowers);
            let index = allPs.indexOf(user);
            if (index > -1) {
                allPs.splice(index, 1);
            }
            let follower = '';
            allPs.map(f => {
                follower += f.id + ','
            });
            let obj = {
                ob_id: this.currentOkr.ob_id,
                ob_attention: follower
            }
            this.updateOkr(obj);
            
            index = this.selectedFollowers.indexOf(user);
            if (index > -1) {
                this.selectedFollowers.splice(index, 1);
            }

            index = this.followers.indexOf(user);
            if (index > -1) {
                this.followers.splice(index, 1);
            }
        },
        datePicker(param) {
            let start = param.startDate;
            let end = param.endDate;
            start = new Date(start);
            end = new Date(end);
            start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
            end = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
            this.startDateSave = start;
            this.endDateSave = end;
        },
        updateCycle(ev) {
            let obj = {
                ob_id: this.object_id,
                ob_cycle: this.saveCycle,
                ob_start_date: this.startDateSave,
                ob_end_date: this.endDateSave
            }
            if(obj.ob_cycle == '' || obj.ob_start_date == '' || obj.ob_end_date == '') {

            }else{
                this.updateOkr(obj);
            }
            ev.stopPropagation();
            this.showCycleDatePicker = false;
        },
        closeCyclePicker(ev) {
            ev.stopPropagation();
            this.showCycleDatePicker = false;
        },
        openCycleDatePicker() {
            this.showCycleDatePicker = true;
        }, 
        pickUser(param) {
            let obj = {
                ob_id: this.currentOkr.ob_id,
                ob_owner: param.user.id
            }
            this.updateOkr(obj);
            this.currentOkr.ob_owners.employeeName = param.user.employeeName;
        },
        handle_getTimePeriod(data) {
            this.saveCycle = data.cycle;
        },
        // openVisibility(ev) {
        //     let visibleType = constant.visibilityTypeArr.filter(v => v.title == ev);
        //     if(ev == '指定范围') {
        //         this.$refs.visibility.openDialog();
        //         this.visibleType = visibleType[0].dbformat;
        //     }else{
        //         let obj = {
        //             ob_id : this.currentOkr.ob_id,
        //             ob_visible_type: visibleType[0].dbformat,
        //             ob_visible_range: visibleType[0].title
        //         }
        //         this.updateOkr(obj);
        //     }
        //     this.align_target = ev;
        //     this.selectedVisible = '';
        // },
        participantOpen() {
            this.$refs.participant.openDialog();
        },
        followerOpen() {
            this.$refs.follower.openDialog();
        },
        userData(data) {
            let param = data
            const flatten = (dp_departments, extractChildren) => Array.prototype.concat.apply(
                dp_departments, 
                dp_departments.map(x => flatten(extractChildren(x) || [], extractChildren))
            );
            const extractChildren = x => x.dp_departments;
            if(!!param.id) {
                let temp = this.users.filter(user => user.deptId === param.id)
                if(!!param.dp_departments){
                const flat = flatten(extractChildren(param), extractChildren).map(x => delete x.children && x);
                flat.map(item => {
                    temp = temp.concat(this.users.filter(user => user.deptId === item.id))
                })
                }
                return temp.filter(user => user.status != 0);
            } else {
                return this.users.filter(user => user.status != 0)
            }
        },
        participantSave(data) {            
            // get users by department
            let result = []
            if(data.depart.length != 0) {
                data.depart.map(depart => {
                    result = result.concat(this.userData(depart))
                });
            }
            result = result.concat(data.user)
            let participant = '';            
            // remove duplicates
            let array = this.selectedParticipants.concat(result);
            array = array.concat(this.participants)
            const keys = ['id']
            let filtered = array.filter(
                (s => o => 
                    (k => !s.has(k) && s.add(k))
                    (keys.map(k => o[k]).join('|'))
                )
                (new Set)
            );
            // add user's id to participant
            filtered.map(p => {
                participant += p.id + ',';                
            });
            // compare and remove duplicates in 2 arrays
            filtered = filtered.filter(f => !this.selectedParticipants.includes(f));
            this.participants = [];
            filtered.map(p => {
                this.participants.push(p)    
            });
            let obj = {
                ob_id: this.currentOkr.ob_id,
                ob_participant: participant
            }
            if(result.length != 0) {
                this.updateOkr(obj);
            }
        },
        followerSave(data) {
            // get users by department
            let result = []
            if(data.depart.length != 0) {
                data.depart.map(depart => {
                    result = result.concat(this.userData(depart))
                });
            }
            result = result.concat(data.user)
            let follower = '';            
            // remove duplicates
            let array = this.selectedFollowers.concat(result);
            array = array.concat(this.followers)
            const keys = ['id']
            let filtered = array.filter(
                (s => o => 
                    (k => !s.has(k) && s.add(k))
                    (keys.map(k => o[k]).join('|'))
                )
                (new Set)
            );
            // add user's id to participant
            filtered.map(p => {
                follower += p.id + ',';                
            });
            // compare and remove duplicates in 2 arrays
            filtered = filtered.filter(f => !this.selectedFollowers.includes(f));
            this.followers = [];
            filtered.map(p => {
                this.followers.push(p)    
            });
            let obj = {
                ob_id: this.currentOkr.ob_id,
                ob_attention: follower
            }
            if(result.length != 0) {
                this.updateOkr(obj);
            }
        },
        visibilitySelect(param) {
            const index = this.okrObj.findIndex(item => item.ob_id == this.object_id)
            let visible = '';
            let vshow1 = '', vshow2 = '';
            param.user.map(u => {
                visible += 'u' + u.id + ','
                vshow1 += u.employeeName + ','
            });
            param.depart.map(d => {
                visible += 'd' + d.id + ','
                vshow2 += d.departmentOaName + ','
            });
            this.okrObj[index].ob_visibility_user_names = vshow1;
            this.okrObj[index].ob_visibility_dp_names = vshow2;
            this.selectedVisible = vshow1 + vshow2;
            let obj = {
                ob_id : this.currentOkr.ob_id,
                ob_visible_type: this.visibleType,
                ob_visible_range: visible
            }
            this.updateOkr(obj);
        },
        selectVisible(param) {
            let visibleType = constant.visibilityTypeArr.filter(v => v.title == param);
            if(param == '指定范围') {
                this.$refs.visibility.openDialog();
                this.visibleType = visibleType[0].dbformat;
            }else{
                let obj = {
                    ob_id : this.currentOkr.ob_id,
                    ob_visible_type: visibleType[0].dbformat,
                    ob_visible_range: visibleType[0].title
                }
                this.updateOkr(obj);
                this.selectedVisible = param;
            }
            // this.align_target = param;
            setTimeout(() => {
                this.isShowVisible = false;
            }, 100);
        },
        hideVisibleSelectBox() {
            this.isShowVisible = false;
        },
        showVisibleSelectBox() {
            this.isShowVisible = true;
        },
    }
}
</script>

<style scoped>
.info-container {
    width: 33%;
}

.cycle-container {
    position: relative;
}

.cycle-container:hover {
    cursor: pointer;
}

.cyclePicker {
    position: absolute;
    top: 30px;
    left: 0;
    border: 1px solid #aaa;
    padding: 10px 30px;
    border-radius: 5px;
    background-color: #fff;
    z-index: 12;
}

.object-name input {
    box-sizing: border-box;
    position: relative;
    background: rgb(255, 255, 255);
    cursor: text;
    border: 1px solid rgb(233, 236, 240);
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 7px 7px;
    transition: border 0.2s ease 0.2s, box-shadow 0.2s ease 0.2s;
    color: #3f4755 !important;
}

.object-name input:focus {
    outline: none;
    border: 1px solid rgb(40, 121, 255);
    box-shadow: rgb(40 121 255 / 30%) 0px 0px 6px 0px inset;
}

.input-container {
    width: 100%;
}

.input-container input {
    width: 100%;
}

.object-name .v-icon {
    cursor: pointer;
}


.obj-editable {
    width: 100%;
}

.obj-cycle {
  word-break: break-all;
  white-space: nowrap;
  font-family: -apple-system,Arial,Verdana,Helvetica Neue,Helvetica,sans-serif;
  color: #89919f;
  font-size: 12px;
  line-height: 18px;
}

.object-name {
    color: #141c28;
    font-size: 20px;
    line-height: 24px;
    font-family: -apple-system,Arial,Verdana,Helvetica Neue,Helvetica,sans-serif;
    vertical-align: middle;
    word-break: break-all;
    font-weight: 600;
    margin-right: 8px;
    width: 100%;
}

.key-result-input input {
    box-sizing: border-box;
    position: relative;
    background: rgb(255, 255, 255);
    cursor: text;
    border: 1px solid rgb(233, 236, 240);
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 7px 7px;
    transition: border 0.2s ease 0.2s, box-shadow 0.2s ease 0.2s;
    color: #3f4755 !important;
}

.key-result-input input:focus {
    outline: none;
    border: 1px solid rgb(40, 121, 255);
    box-shadow: rgb(40 121 255 / 30%) 0px 0px 6px 0px inset;
}

.visibleShow {
    width: 100%;
    min-height: 40px;
    margin-top: -66px;
    border-radius: 5px;
    border: 1px solid #999;
    padding: 7px 10px;
}

.visible-text {
  position: relative;
  width: 100%;
  height: 40px;
  padding: 0px 10px;
  word-break: break-word;
  border: 1px solid #9e9e9e;
  border-radius: 5px;
  /* overflow: hidden; */
}

.visible-select-box {
  position: absolute;
  left: 0;
  top: 5px;
  border: 1px solid #fff;
  border-radius: 5px;
  background: #fff;
  box-shadow: 1px 1px 5px #ddd;
  width: 100%;
  font-size: 14px;
}

.visible-select-box div:hover {
  cursor: pointer;
  background:#eee;
}

.f-14 {
  font-size: 14px !important;
}

.label {
    width: 70px;
}
.selected-visible {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>

<style>
.form-control {
    border: none !important;
}
</style>