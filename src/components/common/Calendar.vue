<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="borderColor d-flex justify-space-between px-2"
        outlined
        v-bind="attrs"
        v-on="on"
      >
        <v-flex grow>
          <span>
            <span class="mr-1">{{ yearArray[selectedYear] }}</span>
            {{ quaterArray[active].text }}
          </span>
        </v-flex>
        <v-flex shrink>
          <v-icon right dark color="black">mdi-menu-down</v-icon>
        </v-flex>
      </v-btn>
    </template>

    <v-list class="calendar-content" width="210px">
      <v-list-item>
        <v-container fluid class="year-container">
          <v-layout d-flex justify-between align-center>
            <v-flex text-center>
              <a @click="yearLeft">
                <v-icon>mdi-chevron-left</v-icon>
              </a>
            </v-flex>
            <v-flex text-center>
              {{ yearArray[selectedYear] }}
            </v-flex>
            <v-flex text-center>
              <a @click="yearRight">
                <v-icon>mdi-chevron-right</v-icon>
              </a>
            </v-flex>
          </v-layout>
        </v-container>
      </v-list-item>
      <v-list-item>
        <v-container fluid class="options-container">
          <v-row v-if="filterSetting.enterprise.goal.periodYear">
            <v-col
              :class="active == i ? 'active' : ''"
              class="py-2"
              cols="6"
              :key="i"
              v-for="i in [0, 1]"
            >
              <span v-if="!isWhole && i == 0"></span>
              <span @click="select_quater(i)" class="item-cursor" v-else>
                {{ quaterArray[i].text }}
              </span>
            </v-col>
          </v-row>
          <v-row v-if="filterSetting.enterprise.goal.periodQuater">
            <v-col
              :class="active == i ? 'active' : ''"
              class="py-2"
              cols="6"
              :key="i"
              v-for="i in [2, 3, 4, 5]"
            >
              <span v-if="!isWhole && i == 0"></span>
              <span @click="select_quater(i)" class="item-cursor" v-else>
                {{ quaterArray[i].text }}
              </span>
            </v-col>
          </v-row>
          <v-row class="month-container" v-if="filterSetting.enterprise.goal.periodMonth">
            <v-col
              :class="active == i ? 'active' : ''"
              class="py-2"
              cols="4"
              :key="i"
              v-for="i in [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]"
            >
              <span @click="select_quater(i)" class="item-cursor">
                {{ quaterArray[i].text }}
              </span>
            </v-col>
          </v-row>
        </v-container>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { constant } from "@/constants/constant.js";

export default {
  props: ['isWhole'],
  data() {
    return {
      yearArray: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
      quaterArray: [
        { text: "全部周期", value: "/1000" },
        { text: "年度", value: "/0" },
        { text: "第一季度", value: "/1" },
        { text: "第二季度", value: "/2" },
        { text: "第三季度", value: "/3" },
        { text: "第四季度", value: "/4" },
        { text: "1月", value: "-1" },
        { text: "2月", value: "-2" },
        { text: "3月", value: "-3" },
        { text: "4月", value: "-4" },
        { text: "5月", value: "-5" },
        { text: "6月", value: "-6" },
        { text: "7月", value: "-7" },
        { text: "8月", value: "-8" },
        { text: "9月", value: "-9" },
        { text: "10月", value: "-10" },
        { text: "11月", value: "-11" },
        { text: "12月", value: "-12" }
      ],
      selectedYear: 1,
      showOptions: false,
      active: 1,
      menu: false
    };
  },
  computed: {
    ...mapGetters('app', ['filterSetting'])
  },
  mounted: function() {
    this.currentYear();
    // Get current date, quater and set it in period calendar
    // 获取当前日期、季度并将其设置在周期日历中
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let start, end;
    if(month >= 1 && month <= 3) {
      month = '/1';
      start = year + '/01/01';
      end = year + '/03/31';
      this.cycle = year + month;
    }
    if(month >= 4 && month <= 6) {
      month = '/2';
      start = year + '/04/01';
      end = year + '/06/30';
      this.cycle = year + month;
    }
    if(month >= 7 && month <= 9) {
      month = '/3';
      start = year + '/07/01';
      end = year + '/09/30';
      this.cycle = year + month;
    }
    if(month >= 10 && month <= 12) {
      month = '/4';
      start = year + '/10/01';
      end = year + '/12/31';
      this.cycle = year + month;
    }
    constant.cycleItems.map((q, i) => {
      if(q.dbformat == month) {
        this.active = i;
      }
    });
  },
  methods: {
    stopEvent(ev) {
      ev.stopPropagation();
    },
    currentYear: function() {
      let today = new Date();
      let year = today.getFullYear();
      let currentYearIndex = this.yearArray.indexOf(year);

      this.selectedYear = currentYearIndex;
    },
    toggle_options() {
      this.showOptions = !this.showOptions;
    },
    close_options() {
      this.showOptions = false;
    },
    select_quater(index) {
      this.active = index;
      let cycle;
      if (this.quaterArray[index].value == "all") {
        cycle = "";
      } else {
        cycle = `${this.yearArray[this.selectedYear]}${
          this.quaterArray[index].value
        }`;
      }
      this.$emit("pick", { cycle: cycle });
      this.menu = false;
    },
    yearLeft() {
      if (this.selectedYear > 0) {
        this.selectedYear -= 1;
      }
    },
    yearRight() {
      if (this.selectedYear < this.yearArray.length - 1) {
        this.selectedYear += 1;
      }
    },
  },
};
</script>

<style>
.calendar-content {
  font-size: 14px;
}

.item-cursor {
  cursor: pointer;
}

.month-container .col:nth-child(even) {
  text-align: center;
}

.month-container .col:nth-child(odd) {
  text-align: center;
}

.month-container .col span {
  color: rgb(111, 120, 134);
}

.year-container {
  padding: 6px 6px;
}

.year-container .layout {
  background: rgb(247, 248, 250);
  padding: 0px;
}
.borderColor {
  border: 1px solid #2879ff !important;
  color: #2879ff !important;
  width: 150px;
}
.plr-10 {
  padding: 0px;
}

.options-container .col:hover {
  color: rgb(40, 121, 255);
  background: rgba(240, 242, 245, 0.3);
}
</style>
