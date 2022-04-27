<template>
<v-container d-flex class="width100">
    <v-layout align-center justify-center class="width100 m_0">
        <v-flex class="limitOperators" >
            <v-sheet @click="displayLimitedOperators" class = "cursorPointer">
                <span class="listItems">全部操作 {{ reportOperators.length }}</span>
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
            <v-timeline v-else dense  >
                <OperatingItem 
                  v-for = "(op, index) in operatorArray"
                  :key = "op.op_id"
                  :progress_value = "op.op_description"
                  :color="index + 1 == operatorArray.length ? 'green lighten-1' : 'cyan lighten-1'"
                  :timestamp = "op.created_at"
                  :userName = "userName"
                />
            </v-timeline>
        </v-flex>
    </v-layout>
</v-container>
</template>

<script>
import OperatingItem from './OperatingItem.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['info', 'type'],
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
        if(!!this.info)
        {
          this.getOps({mode: "rp", id: this.info.rp_id}).then((res) => {
            if(res == "success") {
              if(this.reportOperators.length > 1)
              {
                this.operatorArray = this.reportOperators.slice(0, 1);
              } else {
                this.operatorArray = this.reportOperators;
              }
              if(this.reportOperators.length != 0)
              {
                this.operatorExist = true;
                this.loading = false;
              } else if(this.reportOperators.length == 0) {
                this.operatorExist = false;
                this.loading = false;
              }
            }
          })
        }
    },
    watch: {
      info(v) {
        this.getOps({mode: "rp", id: v.rp_id}).then((res) => {
          if(res == "success") {
            if(this.reportOperators.length > 1)
            {
              this.operatorArray = this.reportOperators.slice(0, 1);
            } else {
              this.operatorArray = this.reportOperators;
            }
            if(this.reportOperators.length != 0)
            {
              this.operatorExist = true;
              this.loading = false;
            } else if(this.reportOperators.length == 0) {
              this.operatorExist = false;
              this.loading = false;
            }
          }
        })
      }
    },
    computed: {
       ...mapGetters('auth', ['authUser']),
       ...mapGetters('operating', ['reportOperators']),
    },
    methods: {
        ...mapActions('operating', ['getOperators']),
        displayLimitedOperators() {
          this.limitOperators = !this.limitOperators;
          if(this.limitOperators == true)
          {
            if(this.reportOperators.length > 1) 
            {
              this.operatorArray = this.reportOperators.slice(0, 1);
            } else {
              this.operatorArray = this.reportOperators;
            }
          } else {
            this.operatorArray = this.reportOperators;
          }
        },
        async getOps(prop) {
          let allOperators;
          if(prop.mode == "rp")
          {
            allOperators = {
              "op_parent_type" : 4,
              "op_parent" : prop.id
            };
          }
          const res = await this.getOperators(allOperators);
          return res;
        },
    },
}
</script>

<style>
.width100 {
    width: 100%;
}
.m_0 {
    margin: 0px;
}
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