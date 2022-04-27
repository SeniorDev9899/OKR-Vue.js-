<template>
  <v-card class="create-goal">
    <a
      v-if="!isAddGoal"
      class="d-flex justify-start align-center"
      @click="showAddGoal"
    >
      <span class="rect mr-2 d-flex align-center">
        <span>
          +
        </span>
      </span>
      <span>
        创建目标 O
      </span>
    </a>
    <span
      v-if="isAddGoal"
      class="d-flex justify-space-between align-center input-container"
    >
      <span class="left">
        <v-icon>mdi-account-outline</v-icon>
      </span>
      <span class="right" v-click-outside="saveObj">
        <input
          type="text"
          style="width: 100%"
          @input="objNameChange"
          v-on:keyup.enter="saveObj"
        />
      </span>
      <span class="user-avatar">
        <span>J</span>
      </span>
      <span class="quick-add">
        <a @click="openQuickAdding">
          更多信息
          <v-icon>
            mdi-loupe
          </v-icon>
        </a>
      </span>
    </span>
    <CreateGoal
      text=""
      :textHide="true"
      ref="quickAdd"
      v-on:save="(param) => saveGoalData(param)"
    />
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "GoalAddComponent",
  components: {
    CreateGoal: () => import("@/components/okrgoal/CreateGoal.vue"),
  },
  data() {
    return {
      isAddGoal: false,
      objName: "",
      cycle: null,
      ob_start_date: '',
      ob_end_date: ''
    };
  },
  mounted() {
    this.getCurrentCycle();
  },
  computed: {
    ...mapGetters("auth", ["authUser"]),
  },
  methods: {
    ...mapActions("okr", ["addOkr"]),
    showAddGoal() {
      // this.isAddGoal = true;
      this.$refs.quickAdd.openDialog();
    },
    openQuickAdding() {
      this.$refs.quickAdd.openDialog();
    },
    getCurrentCycle() {
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
        this.ob_start_date = start;
        this.ob_end_date = end;
        this.cycle = year + month;
      }
      if(month >= 4 && month <= 6) {
        month = '/2';
        start = year + '/04/01';
        end = year + '/06/30';
        this.ob_start_date = start;
        this.ob_end_date = end;
        this.cycle = year + month;
      }
      if(month >= 7 && month <= 9) {
        month = '/3';
        start = year + '/07/01';
        end = year + '/09/30';
        this.ob_start_date = start;
        this.ob_end_date = end;
        this.cycle = year + month;
      }
      if(month >= 10 && month <= 12) {
        month = '/4';
        start = year + '/10/01';
        end = year + '/12/31';
        this.ob_start_date = start;
        this.ob_end_date = end;
        this.cycle = year + month;
      }
    },
    saveObj() {
      if (this.objName !== "") {
        let ob_results_tmp = [];
        let okrObj = {
          object: {
            ob_name: this.objName,
            ob_owner: this.authUser.id,
            ob_creater: this.authUser.id,
            ob_company_id : this.authUser.user_company_id,
            ob_start_date: this.ob_start_date,
            ob_end_date: this.ob_end_date,
            ob_parent_object: 0,
            ob_cycle: this.cycle,
            ob_visible_range: "全公司",
            ob_visible_type: 0,
            ob_results: ob_results_tmp,
          }
        };
        this.addOkr(okrObj.object);
      }
      this.isAddGoal = false;
      this.objName = "";
    },
    saveGoalData(param) {
      // this.addOkr(param);
    },
    objNameChange(ev) {
      this.objName = ev.target.value;
    },
  },
};
</script>

<style scoped>
.create-goal {
  padding: 30px 22px;
  box-shadow: none !important;
}

.create-goal span {
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: rgb(137, 145, 159);
  line-height: 22px;
  transition: all 0.3s ease-in 0s;
}
.create-goal .rect {
  border: 1px solid rgb(137, 145, 159);
  padding: 0px 3px;
  height: 16px;
  margin-right: 10px;
}

.create-goal .input-container {
  width: 100%;
}

.create-goal .input-container .user-avatar {
  margin-right: auto;
}

.create-goal .input-container .user-avatar span {
  display: block;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  text-align: center;
  line-height: 28px;
  background-color: rgb(196, 161, 238);
  color: rgb(255, 255, 255);
}

.quick-add a {
  font-size: 14px;
  color: #89919f;
}

.quick-add a .v-icon {
  font-size: 12px;
}

.create-goal .input-container .left {
  width: 30px;
}

.create-goal .input-container .right {
  width: 80%;
  margin-right: auto;
}

.create-goal .key-result-close a span {
  color: #fff;
}
</style>
