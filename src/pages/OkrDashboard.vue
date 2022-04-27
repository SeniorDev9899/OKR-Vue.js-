<template>
<v-container class="grey lighten-4 px-4" fluid>
  <v-card elevation="0" class="pa-2 mb-4">
    <v-container fluid>
      <v-row>
        <span class="text-h5 font-weight-bold ma-1">OKR 仪表盘</span>
        <v-spacer></v-spacer>
        <div class="mt-5 mx-3">
          <Calendar @pick="cycleHandle" :isWhole="true"/>
        </div>
        <v-menu 
          v-model="menu" 
          left 
          offset-y
          :close-on-content-click="false"
        >
          <template v-slot:activator="{on, attrs}">
            <v-btn color="#2879ff" class="mt-5 mx-3 pa-1" v-bind="attrs" v-on="on" outlined>
              {{ currentDepartment | department }}
              <v-spacer></v-spacer>
              <v-icon small>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <DepartmentGroupPicker @pick="pickDepartment"/>
        </v-menu>        
      </v-row>
      <!-- tabs -->
      <v-row>
        <v-tabs color="#1565C0" slider-size="4" v-model="tab">
          <v-tabs-slider width="100"></v-tabs-slider>
          <v-tab class="text-body-1 font-weight-black">
            OKR设定
          </v-tab>
          <v-tab class="text-body-1 font-weight-black">
            OKR追踪
          </v-tab>
          <v-tab class="text-body-1 font-weight-black">
            OKR结果分析
          </v-tab>
        </v-tabs>
      </v-row>
    </v-container>
  </v-card>
  <!-- tab items -->
  <v-tabs-items tag="div" class="grey lighten-4" v-model="tab">
    <!-- Okr setting tab -->
    <v-tab-item transition="scroll-y-transition">
      <v-container fluid>
        <!-- rate cards -->
        <v-row>
          <RateCards v-if="dashSetting" :data="dashSetting.settingRate" />
        </v-row>
        <!-- employee chart, kr chart -->
        <v-row>
          <RateCircleChart v-if="dashSetting" :data2="dashSetting.settingObjectKr" :data1="dashSetting.settingUserObject" />
        </v-row>
        <!-- okr alignment, kr progress -->
        <v-row>
          <RateBar v-if="dashSetting" :data1="dashSetting.SettingObjectParent" :data2="dashSetting.SettingKrDissolve"/>
        </v-row>
      </v-container>
    </v-tab-item>
    <!-- Okr track tab -->
    <v-tab-item transition="scroll-y-transition">
      <v-container fluid>
        <!-- Track cards -->
        <v-row>
          <TrackCards v-if="dashTrack" :dashTrack="dashTrack" />
        </v-row>
        <v-row>
          <OkrTrendChart v-if="trackProgress" :data="trackProgress" />
        </v-row>
      </v-container>
    </v-tab-item>
    <!-- Okr result analysis tab -->
    <v-tab-item transition="scroll-y-transition">
      <v-container fluid>
        <v-row>
          <OverallAverage v-if="dashAnalyze" :average="dashAnalyze.OKRAverageProgress" :departAverage="dashAnalyze.OKRDepartmentProgress"/>
        </v-row>
        <v-row>
          <OkrScore v-if="dashAnalyze" :scoreCounts="dashAnalyze.OKRScoreCounts"/>
        </v-row>
      </v-container>
    </v-tab-item>
  </v-tabs-items>

</v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  components: {
    Calendar: () => import('@/components/common/Calendar.vue'),
    RateCards: () => import('@/components/okrdashboard/RateCards.vue'),
    RateCircleChart: () => import('@/components/okrdashboard/RateCircleChart.vue'),
    RateBar: () => import('@/components/okrdashboard/RateBar.vue'),
    TrackCards: () => import('@/components/okrdashboard/TrackCards.vue'),
    OkrTrendChart: () => import('@/components/okrdashboard/OkrTrendChart.vue'),
    OverallAverage: () => import('@/components/okrdashboard/OverallAverage.vue'),
    OkrScore: () => import('@/components/okrdashboard/OkrScore.vue'),
    DepartmentGroupPicker: () => import('@/components/common/DepartmentGroupPicker.vue'),
  },
  computed: {
    ...mapGetters("auth", ["authUser"]),
    ...mapGetters("dashboard", ["dashSetting", "dashTrack", "dashAnalyze", "trackProgress"]),
  },
  data() {
    return {
      tab: null,
      fillRate: 71,
      alignmentRate: 18,
      executionRate: 7,
      cycle: null,
      dpSerialId: null,
      menu: false,
      currentDepartment: null
    }
  },
  methods: {
    ...mapActions("dashboard", ["getSetting", "getTrack", "getAnalyze", "getTrackProgress"]),
    ...mapActions('department', ['getAllDepartments']),
    getCurrentCycleNumber() {
      // Get current date, quater and filter okr objects
      // 获取当前日期、季度和过滤 okr 对象
      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1;
      let start, end, cycle;
      if (month >= 1 && month <= 3) {
        month = '/1';
        start = year + '/01/01';
        end = year + '/03/31';
        cycle = year + month;
      }
      if (month >= 4 && month <= 6) {
        month = '/2';
        start = year + '/04/01';
        end = year + '/06/30';
        cycle = year + month;
      }
      if (month >= 7 && month <= 9) {
        month = '/3';
        start = year + '/07/01';
        end = year + '/09/30';
        cycle = year + month;
      }
      if (month >= 10 && month <= 12) {
        month = '/4';
        start = year + '/10/01';
        end = year + '/12/31';
        cycle = year + month;
      }
      return cycle
    },
    cycleHandle(e) {
      if(e.cycle.includes('/1000')) {
        this.cycle = '%'
        this.getSetting({req_cycle: '%', req_dp_serial: this.dpSerialId})
        this.getTrack({req_cycle: '%', req_dp_serial: this.dpSerialId})
        this.getAnalyze({req_cycle: '%', req_dp_serial: this.dpSerialId})
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;
        this.getTrackProgress({req_cycle: this.cycle, req_dp_serial: this.dpSerialId, req_date: today})
      } else {
        this.cycle = e.cycle
        this.getSetting({req_cycle: this.cycle, req_dp_serial: this.dpSerialId})
        this.getTrack({req_cycle: this.cycle, req_dp_serial: this.dpSerialId})
        this.getAnalyze({req_cycle: this.cycle, req_dp_serial: this.dpSerialId})
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;
        this.getTrackProgress({req_cycle: this.cycle, req_dp_serial: this.dpSerialId, req_date: today})
      }
    },
    pickDepartment(e) {
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      let yyyy = today.getFullYear();
      today = yyyy + '-' + mm + '-' + dd;
      this.currentDepartment = e.id
      this.getSetting({req_cycle: this.cycle, req_dp_serial: `${e.dp_serial_id}.${e.id}`});
      this.getTrack({req_cycle: this.cycle, req_dp_serial: `${e.dp_serial_id}.${e.id}`})
      this.getAnalyze({req_cycle: this.cycle, req_dp_serial: `${e.dp_serial_id}.${e.id}`})
      this.getTrackProgress({req_cycle: this.cycle, req_dp_sercial: `${e.dp_serial_id}.${e.id}`, req_date: today})
    }
  },
  mounted() {
    this.getAllDepartments()
    this.cycle = this.getCurrentCycleNumber()
    this.dpSerialId = `.${this.authUser.user_company_id}`
    this.currentDepartment = this.authUser.user_company_id
    this.getSetting({req_cycle: this.cycle, req_dp_serial: this.dpSerialId})
    this.getTrack({req_cycle: this.cycle, req_dp_serial: this.dpSerialId})
    this.getAnalyze({req_cycle: this.cycle, req_dp_serial: this.dpSerialId})
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    this.getTrackProgress({req_cycle: this.cycle, req_dp_serial: this.dpSerialId, req_date: today})
  }
}
</script>

<style lang="css">

</style>
