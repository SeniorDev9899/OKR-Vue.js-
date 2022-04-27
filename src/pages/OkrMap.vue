<template>
<v-container fluid>
  <RightObjectEditor ref="rightObjectEditor" />
  <RightEditor ref="rightKrEditor" />
  <v-row class="d-flex ma-1 justify-end">
    <span class="blue--text ml-6" style="font-size:20px;">目标地图</span>
    <v-spacer></v-spacer>
    <Calendar @pick="filterHandle" :isWhole="true" />
  </v-row>
  <v-row class="d-flex mt-1 mx-6">
    <!-- filter, 筛选-->
    <v-menu offset-y>
      <template v-slot:activator="{on, attrs}">
        <v-btn tile color="white" elevation="0" v-bind="attrs" v-on="on">
          {{filterTypes[filter]}}
          <v-icon class="ml-3" small>mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="i in [0,1,2]" :key="i">
          <v-list-item-title>
            <v-btn tile color="white" elevation="0" small @click="setStatusFilter(i)">{{ filterTypes[i]}}</v-btn>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-spacer></v-spacer>
    <!-- filter -->
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn plain v-bind="attrs" v-on="on">
          展示更多
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title class="ma-1 pa-1">
            <v-switch dense v-model="showKr">
              <template v-slot:label>
                <span class="text-caption">展示 KR</span>
              </template>
            </v-switch>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <span v-bind="attrs" v-on="on" @click="changeCase" class="expansion-toggle">
          <v-icon :class="isHorizontal ? 'horizontal-button' : 'vertical-button'">
            mdi-lan
          </v-icon>
        </span>  
      </template>
      <span>{{ isHorizontal ? '切换纵向查看' : '切换横向查看'}}</span>
    </v-tooltip>
    
  </v-row>
  <v-row>
    <div class="filter-section">
      <!-- filter by department -->
      <v-menu v-if="filter==1" offset-y>
        <template v-slot:activator="{on, attrs}">
          <v-btn color="#E0E0E0" elevation="0" v-bind="attrs" v-on="on">
            {{ filterDepartment | department }}
            <v-icon class="ml-3" small>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <DepartmentPicker @pick="filterByDepartment"/>
      </v-menu>
      <!-- filte by user -->
      <v-menu v-if="filter==2" offset-y>
        <template v-slot:activator="{on, attrs}">
          <v-btn color="#E0E0E0" elevation="0" v-bind="attrs" v-on="on">
            <span v-if="filterUser">{{ filterUser.employeeName }}</span>
            <v-icon class="ml-3" small>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-card>
          <UserPicker @pick="filterByUser" />
        </v-card>
      </v-menu>
    </div>
    <Chart v-if="chartData.length>1" ref="chart" :isHorizontal="isHorizontal" @pick="selectNode" :data="chartData" />
    <div v-else class="grey lighten-2 blank" ></div>
  </v-row>
</v-container>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
import Calendar from '@/components/common/Calendar.vue'
export default {
  components: {
    Chart: () => import('@/components/common/Chart.vue'),
    RightObjectEditor: () => import('@/components/okrmap/RightObjectEditor.vue'),
    Calendar,
    RightEditor: () => import('@/components/okrgoal/rightInfo/RightEditor.vue'),
    UserPicker: () => import('@/components/common/UserPicker.vue'),
    DepartmentPicker: () => import('@/components/common/DepartmentPicker.vue'),
  },
  computed: {
    ...mapGetters("okr", ["okrObj"]),
    ...mapGetters("user", ["users"]),
    ...mapGetters("auth", ["authUser"]),
    ...mapGetters("department", ["departments"]),
    ...mapGetters("app", ["okrFilter"]),
    chartData: function () {
      const userRoot = {
        "nodeId": "id-00",
        "parentNodeId": null,
        "width": 350,
        "height": 100,
        "borderWidth": 1,
        "borderRadius": 25,
        "borderColor": {
          "red": 15,
          "green": 140,
          "blue": 121,
          "alpha": 0.5
        },
        "backgroundColor": {
          "red": 0,
          "green": 81,
          "blue": 90,
          "alpha": 0.5
        },
        "template": "<div class=\"rootDom\"><span class=\"chart-avatar rounded-circle text-h4 orange mx-4 darken-3\">" + this.getOwner(this.authUser.id).charAt(0) + "</span><span class=\"text-h4\">"+ this.getFilterUser() +"</span></div>",
        "expanded": false,
        "added": false,
        "removed": false
      }
      const departmentRoot = {
        "nodeId": "id-00",
        "parentNodeId": null,
        "width": 600,
        "height": 200,
        "borderWidth": 1,
        "borderRadius": 25,
        "borderColor": {
          "red": 15,
          "green": 140,
          "blue": 121,
          "alpha": 0.5
        },
        "backgroundColor": {
          "red": 0,
          "green": 81,
          "blue": 90,
          "alpha": 0.5
        },
        "template": "<div class=\"rootDom\"><span class=\"chart-avatar rounded-circle text-h4 blue mx-4 darken-3\">" + this.getDepartmentName(this.filterDepartment).charAt(0) + "</span><span class=\"text-h4\">"+ this.getDepartmentName(this.filterDepartment) +"</span></div>",
        "expanded": false,
        "added": false,
        "removed": false
      }
      const companyRoot = {
        "nodeId": "id-00",
        "parentNodeId": null,
        "width": 600,
        "height": 200,
        "borderWidth": 1,
        "borderRadius": 25,
        "borderColor": {
          "red": 15,
          "green": 140,
          "blue": 121,
          "alpha": 0.5
        },
        "backgroundColor": {
          "red": 0,
          "green": 81,
          "blue": 90,
          "alpha": 0.5
        },
        "template": "<div class=\"rootDom\"><span class=\"chart-avatar rounded-circle text-h4 blue mx-4 darken-3\">C</span><span class=\"text-h4\">"+ this.getDepartmentName(this.authUser.user_company_id) +"</span></div>",
        "expanded": false,
        "added": false,
        "removed": false
      }
      let root = {}
      if(this.filter == 0) {
        root = companyRoot
      } else if ( this.filter == 1) {
        root = departmentRoot
      } else {
        root = userRoot
      }
      const nodeData = [root]
      this.okrObj.map(item => {
        nodeData.push({
          "nodeId": `id-${item.ob_id}`,
          "parentNodeId": this.makeId(item),
          "width": 400,
          "height": 300,
          "borderWidth": 8,
          "borderRadius": 25,
          "borderColor": {
            "red": 15,
            "green": 0,
            "blue": 121,
            "alpha": 0.5
          },
          "backgroundColor": {
            "red": 0,
            "green": 0,
            "blue": 0,
            "alpha": 0.5
          },
          "template": "<div class=\"domStyle\"><span class=\"chart-title text-h4\">" + this.sliceName(item.ob_name) + " </span><div class=\"chart-progress blue lighten-4 text-h4 \">" + item.ob_progress + "%</div><div class=\"chart-user\"><span class=\"chart-avatar rounded-circle text-h4 light-green darken-3\">" + this.getOwner(item.ob_owner).charAt(0) + "</span><span class=\"chart-user-name text-h4\">" + this.getOwner(item.ob_owner) + "</span><span class=\"text-h5 ml-12 label-cycle\">"+ this.getCycleText(item.ob_cycle) +"</span></div></div>",
          "expanded": true,
          "added": false,
          "removed": false,
        })
        if (this.showKr) {
          item.ob_results.map(kr => {
            nodeData.push({
              "nodeId": `id-${kr.kr_parent_object}_${kr.kr_id}`,
              "parentNodeId": `id-${kr.kr_parent_object}`,
              "width": 400,
              "height": 280,
              "borderWidth": 5,
              "borderRadius": 25,
              "borderColor": {
                "red": 15,
                "green": 0,
                "blue": 121,
                "alpha": 0.5
              },
              "backgroundColor": {
                "red": 0,
                "green": 0,
                "blue": 0,
                "alpha": 0.5
              },
              "template": "<div class=\"domKrStyle\"><span class=\"chart-title green--text text-h4\">kr" + kr.kr_order + "<span class=\"text-h4 black--text\"> " + this.sliceName(kr.kr_name) + "</span> </span><span></span><div class=\"chart-progress text-h4 blue lighten-4 \">" + kr.kr_completion + "%</div><div class=\"chart-user\"><span class=\"chart-avatar rounded-circle light-green text-h4 darken-3\">" + this.getOwner(kr.kr_owner).charAt(0) + "</span><span class=\"chart-user-name text-h4\">" + this.getOwner(kr.kr_owner) + "</span></div></div>",
              "expanded": true,
              "added": false,
              "removed": false,
            })
          })
        }
      })
      return nodeData
    }
  },
  data() {
    return {
      isHorizontal: true,
      showKr: false,
      filter: 2,
      filterTypes: [
        '公司目标',
        '按部门查看',
        '按成员查看'
      ],
      filterUser: null,
      filterDepartment: null,
      cycle: null
    }
  },
  methods: {
    ...mapActions("okr", ["getOkrs"]),
    ...mapActions("user", ["getUsers"]),
    ...mapActions("department", ["getAllDepartments"]),
    ...mapActions("app", ['setFilter', 'formatFilter']),
    sliceName(text) {
      if(text.length>15) {
        return `${text.slice(0, 14)}...`
      }
      return text
    },
    getFilterUser() {
      return this.filterUser ? this.filterUser.employeeName : ''
    },
    getOwner(id) {
      const index = this.users.findIndex((item) => item.id === id)
      return this.users[index] ? !!this.users[index].employeeName ? this.users[index].employeeName : this.users[index].loginName : ""
    },
    getDepartmentName(id) {
      const index = this.departments.findIndex(item => item.id == id)
      return index !== -1 ? this.departments[index].departmentOaName : ''
    },
    changeCase() {
      this.isHorizontal = !this.isHorizontal
      if (this.isHorizontal) {
        this.$refs.chart.transformLayout("left-to-right")
      } else {
        this.$refs.chart.transformLayout("top-to-bottom")
      }
    },
    selectNode(id) {
      this.$refs.rightKrEditor.close()
      this.$refs.rightObjectEditor.close()
      if(id != "00") {
        if (id.includes("_")) {
          const ids = id.split("_")
          const obIndex = this.okrObj.findIndex(item => item.ob_id == ids[0])
          const krIndex = this.okrObj[obIndex].ob_results.findIndex(item => item.kr_id == ids[1])
          this.$refs.rightKrEditor.open({
            obId: this.okrObj[obIndex].ob_id,
            krObj: this.okrObj[obIndex].ob_results[krIndex],
            obStatus: this.okrObj[obIndex].ob_status
          })
        } else {
          const index = this.okrObj.findIndex(item => item.ob_id == id)
          this.$refs.rightObjectEditor.open(this.okrObj[index])
        }
      }      
    },
    getOkrsByFilter() {
      this.getOkrs({})
      this.isHorizontal = true;
      // this.getOkrs({});
    },
    filterHandle(e) {
      if(e.cycle.includes('/1000')) {
        let filter = this.okrFilter;
        Object.assign(filter, {ob_cycle: null});
        this.cycle = null;
        this.setFilter(filter)
        this.getOkrsByFilter();
      }else{
        this.filter = Object.assign(this.filter, {ob_cycle: e.cycle});
        this.cycle = e.cycle;
        let filter = this.okrFilter;
        Object.assign(filter, {ob_cycle: e.cycle});
        this.setFilter(filter)
        this.getOkrsByFilter();
      }
    },
    makeId(item) {
      if (!!item.ob_parent_objects) {
        for (let i = 0; i < this.okrObj.length; i++) {
          if (item.ob_parent_object == this.okrObj[i].ob_id) {
            return `id-${item.ob_parent_object}`
          }
        }
        return "id-00"
      }
      return "id-00";
    },
    filterByUser(e) {
      this.filterUser = e.user
      this.formatFilter()
      if(e.user.id != this.authUser.id) {
        this.setFilter({ob_cycle: this.cycle, ob_owner: this.filterUser.id})
      } else {
        this.setFilter({ob_cycle: this.cycle, ob_owner: this.authUser.id})
      }
      this.getOkrsByFilter();
    },
    filterByDepartment(e) {
      this.filterDepartment = e.data.id
      this.formatFilter()
      this.setFilter({ob_cycle: this.cycle, ob_operator: `dp${e.data.dp_serial_id}.${e.data.id}`})
      this.getOkrsByFilter();
    },
    setStatusFilter(index) {
      this.filter = index
      if(index == 0) {
        this.formatFilter()
        this.setFilter({ob_cycle: this.cycle})
      } else if (index == 1) {
        this.formatFilter()
        const index = this.departments.findIndex(department => department.id == this.filterDepartment)
        this.setFilter({ob_operator: `dp${this.departments[index].dp_serial_id}.${this.departments[index].id}`,ob_cycle: this.cycle})
      } else {
        this.formatFilter()
        if(this.filterUser.id != this.authUser.id) {
          this.setFilter({ob_cycle: this.cycle, ob_owner: this.filterUser.id})
        } else {
          this.setFilter({ob_cycle: this.cycle, ob_owner: this.authUser.id})
        }
      }
      this.getOkrsByFilter();
    },
    getCycleText(text) {
      let temp = ''
      if(text.includes('/')) {
        const cycle = text.split('/')
        temp = `第${cycle[1]}季度`
      }
      if(text.includes('-')) {
        const cycle = text.split('-')
        temp = `第${cycle[1]}月`
      }
      return temp;
    },
    getCurrentCycleNumber() {
      // Get current date, quater and filter okr objects
      // 获取当前日期、季度和过滤 okr 对象
      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1;
      let start, end, cycle;
      if(month >= 1 && month <= 3) {
        month = '/1';
        start = year + '/01/01';
        end = year + '/03/31';
        cycle = year + month;
      }
      if(month >= 4 && month <= 6) {
        month = '/2';
        start = year + '/04/01';
        end = year + '/06/30';
        cycle = year + month;
      }
      if(month >= 7 && month <= 9) {
        month = '/3';
        start = year + '/07/01';
        end = year + '/09/30';
        cycle = year + month;
      }
      if(month >= 10 && month <= 12) {
        month = '/4';
        start = year + '/10/01';
        end = year + '/12/31';
        cycle = year + month;
      }
      this.cycle = cycle;
    },
  },
  mounted() {
    // this.getOkrs({})
    this.getUsers()
    this.getAllDepartments()
    this.filterUser = this.authUser
    this.filterDepartment = this.authUser.deptId
    this.getCurrentCycleNumber();
    this.formatFilter()
    this.setFilter({ob_cycle: this.cycle, ob_owner: this.authUser.id});  
    this.getOkrsByFilter();  
  }
}
</script>

<style scoped>
.expansion-toggle {
  border: 1px solid #e6eaef;
  border-radius: 3px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  color: #3f4755;
  cursor: pointer;
}
.vertical-button {
  transform: rotate(-90deg);
}
.expansion-toggle .v-icon {
  font-size: 20px;
}
.horizontal-button {
  transform: rotate(0deg);
}
.expansion-toggle:hover {
  border-color: #2879ff;
  cursor: pointer;
}
.expansion-toggle:hover .v-icon {
  color: #2879ff;
}
.filter-section {
  position: absolute;
  left: 40px;
  top: 120px;
}
.blank {
  width:100%;
  height:800px;
  margin: 10px;
}
</style>
