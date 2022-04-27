<template>
<v-dialog
    v-model = "dialog"
    width="589px"
    style = "height: 488px;"
    overlay-opacity = "0"
    overlay-color = "white"
    persistent
>
    <v-card
        style = "height: 100%;"
    >
            <v-card-title
                class = "title_enth_modal"
            >
                    <v-system-bar
                        class = "header_enth"
                    >
                        <v-container
                        align-center
                        justify-start
                        >
                        <v-layout
                            align-center
                            justify-start
                            row
                        >
                            <v-flex grow>
                            <span class = "fontWhite">对齐目标</span>
                            </v-flex>
                            <v-flex 
                               shrink
                               @click = "dialog = false"
                               class= "alignTarget-circle"
                            >
                            <v-icon class = "fontWhite">
                                mdi-close
                            </v-icon>
                            </v-flex>
                        </v-layout>
                        </v-container>
                    </v-system-bar>
            </v-card-title>

            <v-card-text
                class = "text_enth_modal"
            >
            <v-system-bar
              class = "backgroundWhite"
            >
                <v-container
                   align-center
                   justify-start
                >
                <v-layout
                    align-center
                    justify-start
                    row
                >
                    <v-flex>
                    <v-menu 
                        offset-y
                    >
                        <template
                        v-slot:activator = "{ on, attrs }"
                        >
                        <v-sheet
                            v-bind="attrs"
                            v-on = "on"
                            @click = "ageIcon = !ageIcon"
                        >
                            <span class = "ageTitle">年份</span>
                            <v-icon
                            class = "age_icon"
                            :class = "ageIcon ? '' : 'age_icon_rotate'"
                            >
                            mdi-menu-down
                            </v-icon>
                        </v-sheet>
                        </template>
                        <v-list
                        class = "ageList"
                        >
                        <v-list-item
                            v-for = "(item, index) in yearFilterList"
                            :key = "index"
                            class = "gapOfItems"
                        >
                            <v-list-item-title
                               class= "listItem"
                               @click = "setYear(item)"
                            >
                               {{ item.title }}
                            </v-list-item-title>
                        </v-list-item>
                        </v-list>
                    </v-menu>
                    </v-flex>

                    <v-flex>
                    <v-menu offset-y>
                        <template
                        v-slot:activator = "{ on, attrs }"
                        >
                        <v-sheet
                            v-bind="attrs"
                            v-on = "on"
                            @click = "cycleIcon = !cycleIcon"
                        >
                            <span class = "cycleTitle">周期</span>
                            <v-icon
                            class = "cycle_icon"
                            :class = "cycleIcon ? '' : 'cycle_icon_rotate'"
                            >
                            mdi-menu-down
                            </v-icon>
                        </v-sheet>
                        </template>
                        <v-list
                        class = "cycleList"
                        >
                        <v-list-item
                            v-for = "(item, index) in cycleFilterList"
                            :key = "index"
                            class = "gapOfItems"
                        >
                            <v-list-item-title
                               class= "listItem"
                               @click = "setCycle(item)"
                            >
                               {{ item.title }}
                            </v-list-item-title>
                        </v-list-item>
                        </v-list>
                    </v-menu>
                    </v-flex>

                    <v-flex>
                    <v-menu offset-y>
                        <template
                        v-slot:activator = "{ on, attrs }"
                        >
                        <v-sheet
                            v-bind="attrs"
                            v-on = "on"
                            @click = "statusIcon = !statusIcon"
                        >
                            <span class = "statusTitle">状态</span>
                            <v-icon
                            class = "status_icon"
                            :class = "statusIcon ? '' : 'status_icon_rotate'"
                            >
                            mdi-menu-down
                            </v-icon>
                        </v-sheet>
                        </template>
                        <v-list
                        class = "statusList"
                        >
                        <v-list-item
                            v-for = "(item, index) in statusFilterList"
                            :key = "index"
                            class = "gapOfItems"
                        >
                            <v-list-item-title
                                class= "listItem"
                                @click = "setGoalStatus(item)"
                            >
                              {{ item.title }}
                            </v-list-item-title>
                        </v-list-item>
                        </v-list>
                    </v-menu>
                    </v-flex>

                    <v-flex>
                    <v-menu offset-y>
                        <template
                        v-slot:activator = "{ on, attrs }"
                        >
                            <v-sheet
                                v-bind="attrs"
                                v-on = "on"
                                @click = "majorIcon = !majorIcon"
                            >
                                <span class = "majorTitle">负责人</span>
                                <v-icon
                                    class = "major_icon"
                                    :class = "majorIcon ? '' : 'major_icon_rotate'"
                                >
                                mdi-menu-down
                                </v-icon>
                            </v-sheet>
                        </template>
                        <v-list
                            class = "majorList"
                        >
                            <UserPicker @pick="(param) => pickUser(param)" />
                        </v-list>
                    </v-menu>
                    </v-flex>

                    <v-flex>
                    <v-text-field
                        hide-details="auto"
                        append-icon="mdi-magnify"
                        label="请输入关键字"
                        style = "padding: 0px;"
                        @input="keywordSearch"
                    >
                    </v-text-field>
                    </v-flex>

                </v-layout>
                </v-container>
            </v-system-bar>

            <v-container
                align-center
                justify-start
                d-flex
                style = "height: 50px;"
                class = "transitionStatus"
            >
            <v-layout
                align-center
                justify-start
                row
                style = "height: 100%;"
            >
                <v-flex
                    shrink 
                    class = "displayFlex"
                    style = "width: 100%;"
                >
                    <v-layout
                       align-center
                       justify-start
                       row
                       style = "width: 100%;"
                    >
                        <v-flex 
                            shrink
                            v-if = "isYearFilter"
                            class = "marginRight5 font12"
                        >
                            <span>
                                年份
                            </span>
                        </v-flex>
                        <v-flex
                            shrink
                            v-if = "isYearFilter"
                            class = "marginRight10 font12"
                        >
                            <span>
                                {{ year }}
                                <v-icon
                                    class = "close_status"
                                    @click = "hideExist('year')"
                                >
                                    mdi-close-circle  
                                </v-icon>
                            </span>
                        </v-flex>

                        <v-flex 
                            shrink
                            v-if = "isCycleFilter"
                            class = "marginRight5 font12"
                        >
                            <span>
                                周期
                            </span>
                        </v-flex>
                        <v-flex
                            shrink
                            v-if = "isCycleFilter"
                            class = "marginRight10 font12"
                        >
                            <span>
                                {{ cycle }}
                                <v-icon
                                    class = "close_status"
                                    @click = "hideExist('cycle')"
                                >
                                    mdi-close-circle  
                                </v-icon>
                            </span>
                        </v-flex>

                        <v-flex 
                            shrink
                            v-if = "isStatusFilter"
                            class = "marginRight5 font12"
                        >
                            <span>
                                状态
                            </span>
                        </v-flex>
                        <v-flex
                            shrink
                            v-if = "isStatusFilter"
                            class = "marginRight10 font12"
                        >
                            <span>
                                {{ status }}
                                <v-icon
                                    class = "close_status"
                                    @click = "hideExist('status')"
                                >
                                    mdi-close-circle  
                                </v-icon>
                            </span>
                        </v-flex>

                        <v-flex 
                            shrink
                            v-if = "isUserFilter"
                            class = "marginRight5 font12"
                        >
                            <span>
                                负责人
                            </span>
                        </v-flex>
                        <v-flex
                            shrink
                            v-if = "isUserFilter"
                            class = "marginRight10 font12"
                        >
                            <span>
                                {{ user }}
                                <v-icon
                                    class = "close_status"
                                    @click = "hideExist('user')"
                                >
                                    mdi-close-circle  
                                </v-icon>
                            </span>
                        </v-flex>

                        <v-flex grow class = "displayFlex-close-remember">
                            <v-sheet
                                class = "cleaer displayFlex"
                                style = "cursor: pointer;"
                            >   
                                <v-btn
                                  title = "清除此选择"
                                  class = "editBtn font12"
                                  @click = "clearFilter"
                                >
                                    <span class = "clearSelected">
                                        清空所选
                                    </span> 
                                </v-btn>
                            </v-sheet>
                    
                            <v-sheet
                                class = "cleaer displayFlex"
                                style = "cursor: pointer;"
                            >
                                <v-btn
                                   title = "不显示上述通知"
                                   class = "editBtn font12"
                                >
                                    <span class = "unremember">
                                        取消记住
                                    </span>
                                </v-btn>
                            </v-sheet>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
            </v-container>

            <v-list
                style = "height: 325px; padding: 0px; overflow-y: auto;"
            >
                <v-list-item
                v-for = "item in modListItems"
                :key = "item.ob_id"
                style = "height: 50px; padding: 0px; "
                >
                <v-list-item-content
                    style = "height: 100%; padding: 0px;"
                >
                    <v-list-item-title
                    style = "height: 100%;"
                    >
                    <v-container
                        align-center
                        justify-start
                        style = "display: flex; height: 100%;"
                    >
                        <v-layout
                        align-center
                        justify-start
                        column
                        >
                        <v-flex
                            style = "width: 100%;"
                        >
                            <v-container
                                align-center
                                justify-start
                                d-flex
                                style = "height: 100%;"
                            >
                            <v-layout
                                align-center
                                justify-start
                                row
                            >
                                <v-flex
                                    shrink
                                    class = "alignTarget-circle" 
                                    @click = "selectAlignTarget(item)"
                                >
                                    <a
                                       class = "circle_check"
                                       :class = "alignItem == item.ob_id ? 'circle_check_first' : ''"
                                    >
                                      <span 
                                        :class = "alignItem == item.ob_id ? 'circle_check_select' : ''"
                                      ></span>
                                    </a>
                                </v-flex>
                                <v-flex
                                shrink
                                class = "involTitle"
                                >
                                <span
                                    style = "font-size: 14px !important;"
                                >{{ item.cycle }}</span>
                                </v-flex>
                                <v-flex
                                grow
                                >
                                <span
                                    style = "font-size: 14px !important;"
                                >{{ item.ob_name }}</span>
                                </v-flex>
                            </v-layout>
                            </v-container>
                        </v-flex>
                        <v-flex
                            style = "width: 100%;"
                        >
                            <v-container
                            align-center
                            justify-start
                            d-flex
                            style = "height: 100%;"
                            >
                            <v-layout
                            align-center
                            justify-start
                            row
                            >
                            <v-spacer></v-spacer>
                            <v-flex
                                shrink
                                class = "bot_cot_mod"
                            >
                                {{item.ob_owners.employeeName}}
                            </v-flex>
                            <v-flex
                                shrink
                                class = "bot_cot_mod"
                            >
                                <span>{{ item.ob_start_date }} - {{item.ob_end_date}}</span>
                            </v-flex>
                            <v-flex
                                shrink
                                class = "bot_cot_mod"
                            >
                                {{ item.status }}
                            </v-flex>
                            <v-spacer></v-spacer>
                            </v-layout>
                            </v-container>
                        </v-flex>
                        </v-layout>
                    </v-container>
                    </v-list-item-title>
                </v-list-item-content>
                </v-list-item>
                <v-list-item
                class = "bottom_list_item"
                >
                没有更多了～
                </v-list-item>
            </v-list>
            </v-card-text>
            <v-card-actions
            class = "mod_card_actions"
            >
            <v-btn @click="dialog = false">
                取消
            </v-btn>
            <v-btn
                color = "primary"
                :disabled = "!selectedAlignTarget"
                @click = "setPersonalGoal"
            >
                确定
            </v-btn>
            </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script>
import { constant } from "@/constants/constant.js";
import { mapGetters, mapActions } from "vuex";
import UserPicker from "@/components/common/UserPicker.vue";

export default {
    components: {
        UserPicker
    },
    data() {
        return {
            dialog: false,
            ageIcon : true,
            cycleIcon : true,
            statusIcon : true,
            majorIcon : true,
            yearFilterList: [],
            cycleFilterList: [],
            statusFilterList: [],
            selectedAlignTarget : false,
            alignItem: null,
            goalStatus : null,
            selectedItem : Object,
            status: null,
            year: null,
            cycle: null,
            user: null,
            status: constant.statusItems[0].title,
            isYearFilter: false,
            isCycleFilter: false,
            isStatusFilter: true,
            isUserFilter: false,
            filters: {
                year: '',
                cycle: '',
                status: '',
                user: ''
            },
            keyword: ''
        }
    },
    mounted() {
        this.yearFilterList = constant.yearList;
        this.cycleFilterList = constant.cycleItems;
        this.cycleFilterList.push({ title : "自定义" });
        this.statusFilterList = constant.statusItems;
    },
    computed: {
        ...mapGetters('okr', ['OkrObjForAddsort']),
        modListItems:  function() {
            let that  = this;
            let tmp = [];
            this.OkrObjForAddsort.map(obj => {
                // match ob_cycle text according to the constant cycle items format
                let year = obj.ob_cycle.split('/');
                if(year.length == 1) {
                    year = obj.ob_cycle.split('-');
                }
                let filteredCycleObj = constant.cycleItems.filter(cycle => year[0] + cycle.dbformat === obj.ob_cycle);
                obj.cycle = filteredCycleObj[0].title;
                // match ob_status
                let filteredStatusObj = constant.statusItems.filter(status => status.dbformat === obj.ob_status);
                obj.status = filteredStatusObj[0].title;
                // filter done
                let filterYear = false;
                let filterCycle = false;
                let filterStatus = false;
                let filterUser = false;
                Object.keys(that.filters).map(function(key, index) {
                    if(that.filters[key] !== '') {
                        if(key == 'year') {
                            filterYear = obj.ob_cycle.includes(that.filters[key]+'');
                            if(that.filters[key] == 'all') {
                                filterYear = true;
                            }
                        }
                        if(key == 'cycle') {
                            filterCycle = obj.ob_cycle.includes(that.filters[key]+'');
                            if(that.filters[key] == '/1000') {
                                filterCycle = true;
                            }
                        }
                        if(key == 'status') {
                            if(obj.ob_status === that.filters[key]) {
                                filterStatus = true;
                            }
                        }
                        if(key == 'user') {
                            if(obj.ob_owner === that.filters[key]) {
                                filterUser = true;
                            }
                        }
                    }else{
                        if(key == 'status' && that.status == constant.statusItems[0].title) {
                            filterStatus = true;
                        }
                    }
                });
                if(
                    (!(that.isYearFilter && !filterYear) || (!that.isYearFilter && filterYear)) &&
                    (!(that.isCycleFilter && !filterCycle) || (!that.isCycleFilter && filterCycle)) &&
                    (!(that.isStatusFilter && !filterStatus) || (!that.isStatusFilter && filterStatus)) &&
                    (!(that.isUserFilter && !filterUser) || (!that.isUserFilter && filterUser)) 
                ){
                    tmp.push(obj)
                }
            });
            if(tmp.length == 0 && (!this.isYearFilter && !this.isCycleFilter && !this.isStatusFilter)) {
                tmp = this.OkrObjForAddsort;
            }
            if(this.keyword != '') {
                let searched = [];
                tmp.map(obj => {
                    if(obj.ob_name.includes(that.keyword)) {
                        searched.push(obj);
                    }
                });
                return searched;
            }else{
                return tmp;
            }
        }
    },
    methods: {
        openDialog() {
            this.dialog = true;
        },
        selectAlignTarget(prop) {
            this.selectedAlignTarget = true;
            this.alignItem = prop.ob_id;
            this.selectedItem = prop;
        },
        hideExist(prop) {
            if(prop == 'year') {
                this.isYearFilter = false;
            }
            if(prop == 'cycle') {
                this.isCycleFilter = false;
            }
            if(prop == 'status') {
                this.isStatusFilter = false;
            }
            if(prop == 'user') {
                this.isUserFilter = false;
            }
        },
        setYear(param) {
            this.filters = Object.assign(this.filters, { year: param.dbformat });
            this.isYearFilter = true;
            this.year = param.title;
        },
        setCycle(param) {
            this.filters = Object.assign(this.filters, { cycle: param.dbformat });
            this.isCycleFilter = true;
            this.cycle = param.title;
        },
        setGoalStatus(param) {
            this.filters = Object.assign(this.filters, { status: param.dbformat });
            this.isStatusFilter = true;
            this.status = param.title;
        },
        setPersonalGoal() {
            this.dialog = false;
            this.$emit("setPersonalGoal", this.selectedItem);
        },
        clearFilter() {
            this.isYearFilter = false;
            this.isCycleFilter = false;
            this.isStatusFilter = false;
            this.isUserFilter = false;
            this.keyword = '';
        },
        pickUser(param) {
            this.isUserFilter = true;
            this.user = param.user.employeeName;
            this.filters = Object.assign(this.filters, { user: param.user.id });
        },
        keywordSearch(ev) {
            this.keyword = ev;
        }
    }
}
</script>

<style scoped>
.add_enthu {
  background-color: white !important;
  box-shadow: none;
}

.v-overlay__scrim {
  opacity: 0 !important;
  background-color: white !important;
}

.title_enth_modal {
  padding : 0px !important;
}
.header_enth {
  width: 100%;
  height: 40px !important;
  background-image: linear-gradient(90deg, rgb(29, 134, 240) 1%, rgb(92, 173, 255) 100%);
}
.ageTitle {
  font-size: 14px;
}
.cycleTitle {
  font-size: 14px;
}
.statusTitle {
  font-size: 14px;
}
.majorTitle {
  font-size: 14px;
}
.age_icon {
  transition: all ease 0.3s;
}
.cycle_icon {
  transition: all ease 0.3s;
}
.status_icon {
  transition: all ease 0.3s;
}
.age_icon_rotate {
  transform : rotate(180deg);
}
.cycle_icon_rotate {
  transform : rotate(180deg);
}
.status_icon_rotate {
  transform : rotate(180deg);
}
.major_icon_rotate {
  transform : rotate(180deg);
} 
.text_enth_modal {
  padding-top: 20px !important;
  height: 450px !important;
}
.ageList {
  overflow: auto;
  max-height: 280px;
}
.cycleList {
  overflow: auto;
  max-height: 280px;
}
.statusList {
  overflow: auto;
  max-height: 280px;
}
.majorList {
  width: 310px;
  padding: 10px;
}
.listItem {
  font-size: 12px;
  cursor : pointer;
}
.gapOfItems {
  min-height : 35px !important;
}
#imgSheet {
  width: 118px;
  height: 88px;
  position: relative;
  top: calc(100% - 200px);
  left: calc(100% - 200px) !important;
}
.icon_circle {
  font-size: 20px !important;
  margin-right: 10px !important;
  color: grey !important;
}
.title {
  font-size: 14px !important;
}
.involTitle {
  margin-right: 10px;
  background-color: #ecf4f3;
  padding: 6px;
  border-radius: 13px;
  color : blue;
}
.bot_cot_mod {
  margin-right: 20px;
  font-size: 13px;
  color: grey;
}
.bottom_list_item {
  display: flex; 
  align-items: center; 
  justify-content: center; 
  padding-top: 10px; 
  padding-bottom: 10px;
}
.mod_card_actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
#sub_logo {
  width: 56px;
  height: 56px;
  text-align: center;
  line-height: 56px;
  background-color: rgb(196, 161, 238);
  color: rgb(255, 255, 255);
  border-radius : 50%;
}
.alignTarget-circle{
    cursor : pointer;
}
.circle_check {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    height: 18px;
    width: 18px;
    border: 1px solid rgb(191, 195, 199);
    border-radius: 50%;
    margin-right: 5px;
}
.circle_check_first {
    border : 1px solid rgb(27 120 234) !important;
}
.circle_check_select {
    width: 8px;
    height: 8px;
    background-color: rgb(27 120 234);
    border-radius: 50%;
}
.close_status {
    font-size: 17px !important;
}
.close_status:hover {
    color: #f04d4d;
    cursor: pointer;
}
.transitionStatus {
    transition: all 1s ease;
    margin-top: 10px;
    padding: 12px 27px;
}
.hiddenStatus {
    display: none !important;
}
.displayFlex {
  display: flex !important;
  align-items: center;
}
.cleaer {
  display: inline;
  align-items: center;
  justify-content: center;
}
.clear_arrow {
    position: relative;
    bottom: 5px;
    right: 12px;
    width: 0px;
    height: 0px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid rgb(100, 100, 100);
    display: none;
    transition: all .3s ease;
}
.clearTooltip {
    display: none;
    position: relative;
    bottom: 32px;
    right: 53px;
    transition: all .1s ease;
    color : white;
}
.unrememberTooltip {
    display: none;
    position: relative;
    bottom: 32px;
    right: 53px;
    transition: all .1s ease;
    color : white;
}
.backgroundWhite {
    background-color : white !important;
}
.clearSelected {
   color: rgb(29, 134, 240); 
   margin-right: 10px;
   display: flex;
}
.unremember {
   color: rgb(29, 134, 240); 
   margin-right: 5px;
   display: flex;
}
.clearSelected:hover .clearTooltip {
    display: flex !important;
    background-color: rgb(100, 100, 100);
    padding: 3px;
    border-radius: 3px;
}
.clearSelected:hover .clear_arrow {
    display: flex !important;
}
.unremember:hover .clear_arrow {
    display: flex !important;
}
.unremember:hover .unrememberTooltip {
    display: flex !important;
    background-color: rgb(100, 100, 100);
    padding: 3px;
    border-radius: 3px;
}
.displayFlex-close-remember {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
.marginRight10 {
    margin-right: 10px;
}
.marginRight5 {
    margin-right: 5px;
}
.editBtn {
    box-shadow: none !important;
    background: white !important;
}
.editBtn:hover {
    background: white !important;
}
.font12 {
    font-size: 12px;
}
.fontWhite {
    color : white !important;
}
</style>