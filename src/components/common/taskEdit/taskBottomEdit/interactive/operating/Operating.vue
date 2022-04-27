<template>
    <v-flex class="limitOperators" >
        <v-sheet @click="displayLimitedOperators" class = "cursorPointer">
          <span class="listItems">全部操作 {{ operatorArray.length }}</span>
          <v-icon class="icon_down" :class="limitOperators ? 'icon_down_rotate' : ''">
            mdi-chevron-up
          </v-icon>
        </v-sheet>
        <v-sheet class="loading-spinner" v-if="loading">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>          
        </v-sheet>
        <v-sheet v-if="!operatorExist" style="height: 60px;display: flex;align-items: center;justify-content: center;border: 1px dashed rgb(196 202 210);margin-top:10px;">
          <span style="color:#9aa6b2;">经营不存在</span>
        </v-sheet>
        <v-timeline v-else dense >
          <OperatingItem 
            v-for = "(op, index) in operatorArray"
            :key = "op.op_id"
            :progress_value = "op.op_description"
            :color="index + 1 == operatorArray.length ? 'green lighten-1' : 'cyan lighten-1'"
            :timestamp = "op.created_at"
            :userName = "op.op_operator_name"
          />
        </v-timeline>
    </v-flex>
</template>

<script>
import OperatingItem from './OperatingItem.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['task_id'],
    components: {
        OperatingItem
    },
    data() {
        return {
            userName: "",
            limitOperators: true,
            operatorArray: [],
            loading: true,
            operatorExist: Boolean,
        }
    },
    created() {
        let userName = this.authUser.employeeName.split("_");
        userName.forEach((name, index) => {
          this.userName = name.slice(0, 2).toUpperCase();
        });
        if(this.task_id) {
          this.getOps({mode: "task", id: this.task_id}).then((res) => {
            if(res == "success") {
              if(this.taskOperators.length > 1)
              {
                this.operatorArray = this.taskOperators.slice(0, 1);
              } else {
                this.operatorArray = this.taskOperators;
              }
              if(this.operatorArray.length != 0)
              {
                this.operatorExist = true;
                this.loading = false;
              } else {
                this.operatorExist = false;
                this.loading = false;
              }
            }
          })
        }
    },
    watch: {
      task_id(v) {
        this.getOps({mode: "task", id: v}).then((res) => {
          if(res == "success") {
            if(this.taskOperators.length > 1)
            {
              this.operatorArray = this.taskOperators.slice(0, 1);
            } else {
              this.operatorArray = this.taskOperators;
            }
            if(this.operatorArray.length != 0)
            {
              this.operatorExist = true;
              this.loading = false;
            } else {
              this.operatorExist = false;
              this.loading = false;
            }
          }
        });
      }
    },
    computed: {
       ...mapGetters('auth', ['authUser']),
       ...mapGetters('operating', ['taskOperators']),
    },
    methods: {
        ...mapActions('operating', ['getOperators']),
        displayLimitedOperators() {
          this.limitOperators = !this.limitOperators;
          if(this.limitOperators == true)
          {
            if(this.taskOperators.length > 1) 
            {
              this.operatorArray = this.taskOperators.slice(0, 1);
            } else {
              this.operatorArray = this.taskOperators;
            }
          } else {
            this.operatorArray = this.taskOperators;
          }
        },
        async getOps(prop) {
          let allOperators;
          if(prop.mode == "task")
          {
            allOperators = {
              "op_parent_type" : 2,
              "op_parent" : prop.id
            }
          }
          const res = await this.getOperators(allOperators);
          return res;
        },
    },
}
</script>

<style>
.limitOperators {
  width: 100%;
  margin-bottom: 20px;
}
.listItems {
  font-size: 12px;
  color: grey;
}
.limitOperators:hover .listItems {
  color: blue !important;
}
.limitOperators:hover .icon_down {
  color: blue !important;
}
.icon_down {
  font-size: 13px !important;
  transition: all .5s ease;
}
.icon_down_rotate {
  transform: rotate(180deg);
}
.listTime_day {
  color: rgb(153, 163, 173);
  font-size: 12px;
  margin-right: 25px;
}
.listTime_time {
  color: rgb(58, 66, 71);
  font-size: 12px;
}
.listTime {
  font-size: 14px;
}
.card_text_pre {
  padding: 3px !important;
}
.loading-spinner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty_operating {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgb(196 202 210);
}
</style>