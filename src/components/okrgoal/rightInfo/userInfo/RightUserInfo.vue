<template>
<v-container align-center justify-start d-flex class="right_user_info mt_10">
  <v-layout align-center justify-start column>
    <v-flex class="right_userInfo_flex">
      <v-layout align-center justify-start class="right_userInfo_laypadding">
        <v-flex shrink class="right_userInfo_layflex" >
          <v-icon class="r_icon">mdi-account</v-icon>
          <span class="r_name">负责人</span>
        </v-flex>

        <v-flex grow class="displayFlex">

          <span class="r_name">
            <ToolTipComponent
              :content="krOwnerName"
              :tooltipText="krOwnerName"
              direction="top"
            />
          </span>

          <!-- <span class="" v-if="krNameEdit">
            <input
              type="text"
              class="kr_name_edit"
              :value="kr_name"
              @input="changeKrName"
              v-on:keyup.enter="closeKrNameEdit"
            />
          </span> -->

          <v-sheet v-if="objectStatus == 0" class="edit displayFlex">            
            <v-menu max-width="300" :close-on-content-click="true" offset-y>
              <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on" style="display:flex;">
                    <ToolTipComponent tooltipText="编辑" direction="top">
                      <v-icon class="pencil cursorPointer">
                        mdi-grease-pencil
                      </v-icon>
                    </ToolTipComponent>
                    <!-- <div class="edit_arrow"></div>
                    <span class="editTooltip">编辑</span> -->
                  </span>
              </template>
              <v-sheet>
                <UserPicker @pick="pickUser" />
              </v-sheet>
            </v-menu>
          </v-sheet>          

        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex class="right_userInfo_flex">
      <v-layout align-center justify-start class="right_userInfo_laypadding">
        <v-flex shrink class="right_userInfo_layflex" style="padding-right:35px;">
          <v-icon class="r_icon">mdi-progress-clock</v-icon>
          <span class="r_name">KR完成度</span>
        </v-flex>
        <v-flex grow>
          <v-layout align-center justify-start>
            <v-flex class="right_progress">
              <v-progress-linear :value="kr_percent"></v-progress-linear>

            </v-flex>

            <v-flex class="displayFlex">
              <span class="right_progress_value">{{ kr_percent }}%</span>
              <ToolTipComponent tooltipText="编辑" direction="top">  
                <v-sheet v-if="objectStatus == 0" class="edit displayFlex">
                  <v-icon class="pencil" @click = "openDialog">
                    mdi-grease-pencil
                  </v-icon>
                  <!-- <div class="edit_arrow"></div>
                  <span class="editTooltip">编辑</span> -->
                </v-sheet>
              </ToolTipComponent>
            </v-flex>

          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex class="right_userInfo_flex">
      <v-layout align-center justify-start class="right_userInfo_laypadding">
        <v-flex shrink class="right_userInfo_layflex">
          <v-icon class="r_icon">mdi-cards-heart</v-icon>
          <span class="r_name">信心指数</span>
        </v-flex>
        <v-flex grow class="displayFlex">
          <v-layout align-center justify-start row>
            <v-flex class="rightRating" style = "font-size: 13px;">
              <!-- <v-rating background-color="grey lighten-2" empty-icon="mdi-heart-outline" full-icon="mdi-cards-heart" half-icon="mdi-cards-heart" color="warning" length="5" size="25" :value="rateValue" class="rating"></v-rating> -->
              <v-icon aria-hidden="false" class="mr-1 rating" style="font-size: 18px; color: #FFCA2A;">
                mdi-heart
              </v-icon>
              <span class="mr-1">{{kr_confidence}}</span>
              <span>
                分
              </span>
              <RatingPopupComponent v-if="objectStatus == 0" :selected="kr_confidence" v-on:selectRating="param => selectRating(param)">
                <ToolTipComponent tooltipText="编辑" direction="top">
                  <div class="edit displayFlex">
                    <v-icon class="pencil">
                        mdi-grease-pencil
                    </v-icon>
                    <!-- <div class="edit_arrow"></div>
                    <span class="editTooltip">编辑</span> -->
                  </div>
                </ToolTipComponent>
              </RatingPopupComponent>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex class="right_userInfo_flex">
      <v-layout align-center justify-start class="right_userInfo_laypadding_clock">
        <v-flex shrink class="right_userInfo_layflex_clock">
          <v-icon class="r_icon">mdi-clock-outline</v-icon>
          <span class="r_name">起止时间</span>
        </v-flex>
        <v-sheet class="edit displayFlex">
          <span v-if="objectStatus == 0" class="right pt-2 pl-7" style = "font-size: 13px;padding-top: 3px !important;">
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
                  v-model ="dateRange"
                  :ranges="false"
                  class="kr_user_startEnd"
              >
                  <template v-slot:input="picker" style="min-width: 350px;">
                    {{ picker.startDate | formatDate }} - {{ picker.endDate | formatDate }}
                  </template>
              </date-range-picker>
          </span>
          <span v-else style="margin-right: 20px;font-size: 15px;color: rgb(150 154 154);"><span>{{ dateRange.startDate }}</span><span>~</span><span>{{ dateRange.endDate }}</span></span>
          <span class="pt-1" style="font-size: 12px;color: #9aa6b2 !important;">剩余<span style="color: rgb(18 186 224) !important;font-size: 14px !important;">{{ timePeriod }}</span>天</span>
        </v-sheet>
      </v-layout>
    </v-flex>
  </v-layout>
  <PercentDialogComponent
      ref="percent"
      :percent="kr_percent"
      :isAuto="0"
      v-on:savePercentValue="(param) => getPercentValue(param)"
  />
</v-container>
</template>

<script>
import PercentDialogComponent from '@/components/okrgoal/shared/PercentDialogComponent.vue';
import RatingPopupComponent from '@/components/okrgoal/shared/RatingPopupComponent.vue';
import DateRangePicker from 'vue2-daterange-picker';
import ToolTipComponent from "@/components/okrgoal/shared/ToolTipComponent.vue";
import UserPicker from '@/components/common/UserPicker.vue';
import { mapGetters, mapActions } from 'vuex';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

export default {
  props: ['ob_status', 'kr_id', 'kr_owner', 'kr_name', 'kr_percent', 'kr_confidence', 'kr_period', 'kr'],
  components: {
    PercentDialogComponent,
    RatingPopupComponent,
    DateRangePicker,
    ToolTipComponent,
    UserPicker,
  },
  data() {
    return {
      rateValue: 3,
      minDate: '2018-01-01',
      maxDate: '2050-12-31',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], 
      timePeriod: null,     
      objectStatus: null,
      krOwnerName: null,
    }
  },
  created() {
    if(!!this.kr_period) {
      var date1 = new Date(this.kr_period.start_date);
      var date2 = new Date(this.kr_period.end_date);
      var difference_in_time = date2.getTime() - date1.getTime();
      var difference_in_day = difference_in_time / (1000 * 3600 * 24);
      this.timePeriod = difference_in_day;
    }
    if(this.kr_owner != null) {
      this.krOwnerName = this.users.filter((u) => u.id == this.kr_owner)[0].employeeName;
    } else {
      this.krOwnerName = this.authUser.employeeName;
    }
    this.objectStatus = this.ob_status;
  },
  watch: {
    kr_period(v) {
      var date1 = new Date(v.start_date);
      var date2 = new Date(v.end_date);
      var difference_in_time = date2.getTime() - date1.getTime();
      var difference_in_day = difference_in_time / (1000 * 3600 * 24);
      this.timePeriod = difference_in_day;
    },
    ob_status(v) {
      this.objectStatus = v;
    },
    kr_owner(v) {
      if(v != null) {
        this.krOwnerName = this.users.filter((u) => u.id == v)[0].employeeName;
      } else {
        this.krOwnerName = this.authUser.employeeName;
      }
    }
  },
  computed: {
    ...mapGetters('user', ['users']),
    ...mapGetters('auth', ['authUser']),
    dateRange: {      
      get: function() {
        let dateRange = {
            startDate: "",
            endDate: "",
          }
        if(!!this.kr_period) {
          
          dateRange.startDate = this.kr_period.start_date;
          dateRange.endDate = this.kr_period.end_date;
        }
        return dateRange;
      },
      set: function(newValue) {
        const start = newValue.startDate.toString().split(' ');
        const end = newValue.endDate.toString().split(' ');
        let startMonth = this.months.findIndex((m) => m == start[1]) + 1;
        if(startMonth < 10)
        {
          startMonth = "0" + startMonth;
        }
        let endMonth = this.months.findIndex((m) => m == end[1]) + 1;
        if(endMonth < 10)
        {
          endMonth = "0" + endMonth;
        }
        let startDate = start[3] + "-" + startMonth + "-" + start[2];
        let endDate = end[3] + "-" + endMonth + "-" + end[2];
        let dateRange = {
          startDate: startDate,
          endDate: endDate,
        }
        this.$emit("krDateRangeEmit", dateRange);
      }
    },
  },
  methods: {
    ...mapActions('okr', ["updateKeyResult"]),
    openDialog() {
      this.$refs.percent.openDialog('kr_mode');
    },
    getPercentValue(param) {
      this.$emit("setPercentValue", param);
    },
    selectRating(param) {
        this.$emit("setConfidenceValue", param);
    },
    openCalendar() {
      this.$refs.calendar.open();
    },
    pickUser(e) {
      this.$emit("updateKeyresultOwner", e.user.id);
    }
  }
}
</script>

<style>
.right_user_info {
  background-color: white;
}

.right_userInfo_flex {
  width: 100%;
}

.right_progress_value {
  font-size: 14px;
  color: rgb(92, 173, 255);
}

.r_icon {
  color: #9aa6b2 !important;
  margin-right: 3px;
  font-size: 13px !important;
}

.r_name {
  color: #9aa6b2 !important;
  font-size: 12px !important;
}

.right_heart_one {
  color: rgb(246, 158, 23) !important;
}

.right_userInfo_laypadding_clock {
  padding: 10px;
}

.right_userInfo_layflex_clock {
  margin-right: 0px;
  /* padding-right: 40px; */
}

.r_name_number {
  color: rgb(92, 173, 255);
  font-size: 14px;
}

.right_userInfo_layflex {
  padding-right: 50px;
  cursor: pointer !important;
}

.right_userInfo_laypadding {
  padding: 10px;
  width: 100%;
}

.right_userInfo_laypadding:hover .pencil {
  display: flex !important;
}

.right_userInfo_laypadding_clock:hover .pencil {
  display: flex !important;
}

.pencil {
  font-size: 10px !important;
  margin-left: 5px;
  color: #aa9797;
  position: relative;
  opacity: 0;
  width: 23px;
  height: 23px;
  padding: 2px;
}

.pencil:hover {
  border-radius: 10px;
  background-color: #f2f6f6;
}

.right_progress {
  margin-right: 5px;
}

.rightRating {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.rating {
  padding: 0px !important;
}

.edit {
  display: inline;
  align-items: center;
  justify-content: center;
}

.edit_arrow {
  position: relative;
  bottom: 15px;
  right: 12px;
  width: 0px;
  height: 0px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid rgb(100, 100, 100);
  opacity: 0;
  transition: all .3s ease;
}

.editTooltip {
  opacity: 0;
  position: relative;
  bottom: 29px;
  right: 38px;
  transition: all .3s ease;
  padding: 0px 7px;
}

.edit:hover .editTooltip {
  opacity: 1;
  background-color: rgb(100, 100, 100);
  border-radius: 3px;
}

.edit:hover .edit_arrow {
  opacity: 1 !important;
}

.displayFlex {
  display: flex !important;
  align-items: center;
}

.right_userInfo_laypadding_clock:hover .pencil {
  opacity: 1 !important;
}

.pencil {
  font-size: 10px !important;
  margin-left: 5px;
  color: #aa9797;
  position: relative;
  opacity: 0;
  width: 23px;
  height: 23px;
  padding: 2px;
}

.pencil:hover {
  border-radius: 10px;
  background-color: #f2f6f6;
}

.kr_user_startEnd .daterangepicker.openscenter{
  left: -10% !important;
}
</style>
