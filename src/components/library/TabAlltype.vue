<template>
  <v-flex lg12 class="mt-5 tab-type">
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex
          v-for="(lib, index) in okrLib"
          v-bind="{ lg6: true }"
          :key="lib.ob_id"
        >
          <v-card raised class="library-card">
            <v-container fill-height fluid pa-2>
              <v-flex class="px-0 py-0">
                <div
                  class="d-flex justify-space-between align-center px-5 pt-3"
                  :style="{ background: colors[index % 4].backgroundColor }"
                >
                  <div class="justify-start top-right">
                    <div class="library-title">
                      <div
                        style="font-size:14px"
                        :style="{ color: colors[index % 4].buttonColor }"
                      >
                        <div
                          v-for="(menu, index) in okrMenu"
                          :key="menu.ob_id"
                          style="opacity: 0.5;"
                          class="my-2"
                        >
                          {{
                            lib.ob_parent_object == menu.ob_id
                              ? menu.ob_name
                              : ""
                          }}
                        </div>
                        <p
                          style="font-size:16px;"
                          :style="{ color: colors[index % 4].buttonColor }"
                        >
                          {{ lib.ob_name }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex justify-end">
                    <v-dialog v-model="dialog" scrollable>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          v-if="create_goal == true"
                          class="taoyong animated animatedFadeInUp fadeInUp mr-2"
                          :color="colors[index % 4].buttonColor"
                          @click="handle_createGoalLibrary({ob_name: lib.ob_name, ob_results: lib.ob_results})"
                        >套用</v-btn>
                        <v-btn
                          v-else
                          class="taoyong animated animatedFadeInUp fadeInUp mr-2"
                          :color="colors[index % 4].buttonColor"
                        >
                          <libraryGoal
                            text="套用"
                            style=""
                            :object_name="lib.ob_name"
                            :object_results="lib.ob_results"
                            v-bind="attrs"
                            v-on="on"
                          />
                        </v-btn>
                      </template>
                      <v-card>
                        This is modal
                      </v-card>
                    </v-dialog>
                  </div>
                </div>
              </v-flex>
              <v-expansion-panels
                v-model="isExpansionToggleone"
                multiple
                style="z-index: auto;"
                v-for="(kr, i) in lib.ob_results"
                :key="kr.kr_id"
              >
                <v-expansion-panel>
                  <v-expansion-panel-header
                    expand-icon="mdi-menu-down"
                    class="justify-self-start krTitle"
                  >
                    <template v-slot:actions>
                      <v-icon
                        class="icon"
                        style="font-size:20px;    margin-top: -3px;"
                        >mdi-menu-down</v-icon
                      >
                      <span class="mr-3" style="color: #a4acb9;"
                        >KR{{ i + 1 }}</span
                      >
                      {{ kr.kr_name }}
                    </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="expansion-field">
                    <div>
                      <ul>
                        <li v-for="task in kr.kr_tasks" :key="task.task_id">
                          {{ task.task_name }}
                        </li>
                      </ul>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-container>
          </v-card>
        </v-flex>
        <!-- <v-flex v-bind="{ lg6: true }">
          <v-card class="pa-2 libaray-lock">
            <v-dialog transition="dialog-top-transition" max-width="600">
              <template v-slot:activator="{ on, attrs }">
                <div class="lock" v-bind="attrs" v-on="on">
                  <div class="lock-back py-10">
                    <v-icon style="">mdi-lock</v-icon>
                  </div>
                  <p style="">马上解锁千套案例库模板</p>
                </div>
              </template>
              <template v-slot:default="dialog">
                <v-card>
                  <v-toolbar color="primary" dark
                    >Opening from the top</v-toolbar
                  >
                  <v-card-text>
                    <div class="text-h2 pa-12">
                      Hello world!
                    </div>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn text @click="dialog.value = false">Close</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </v-card>
        </v-flex> -->
      </v-layout>
    </v-container>
  </v-flex>
</template>
<script>
import { constant } from "@/constants/constant.js";
import { mapGetters, mapActions } from "vuex";
import libraryGoal from "@/components/library/libraryGoal.vue";
export default {
  components: {
    libraryGoal,
  },
  props: ["menuId", "create_goal"],
  data() {
    return {
      panel: [],
      dialog: false,
      state: {},
      colors: [
        {
          buttonColor: "#4d90ff",
          backgroundColor: "#f4f8ff",
        },
        {
          buttonColor: "#78dfb7",
          backgroundColor: "#f2fcf8",
        },
        {
          buttonColor: "#f8c941",
          backgroundColor: "#fffaed",
        },
        {
          buttonColor: "#f37979",
          backgroundColor: "#fef6f6",
        },
      ],
    };
  },
  computed: {
    // ...mapGetters("okr", ["okrObj"]),
    ...mapGetters("okr", ["okrLib"]),
    ...mapGetters("app", ["isExpansionToggleone"]),
    ...mapGetters("okr", ["okrMenu"]),
    ...mapGetters("auth", ["authUser"]),
    isExpansionToggle: {
      get() {
        return this.$store.getters["app/isExpansionToggle"];
      },
      set(newValue) {
        // return this.setExpansionToggle();
      },
    },
  },
  mounted() {
    // this.getOkrs({});
    this.getLibrarycontent({
      ob_id: this.menuId == "1" ? null : this.menuId + "",
    });
    this.getLibrarymenu({});
  },
  methods: {
    // ...mapActions("okr", ["getOkrs"]),
    ...mapActions("okr", ["getLibrarycontent"]),
    ...mapActions("okr", ["getLibrarymenu"]),
    ...mapActions("app", ["setExpansionToggle"]),
    handle_createGoalLibrary(prop) {
      prop.ob_results.map((item) => {
        if(!item.kr_owner || item.kr_owner == "") {
          item.kr_owner = this.authUser.id;
        } 
      })
      this.$emit("createGoalLibrary", prop);
    }
  },
};
</script>
<style>
.tab-type .container.fill-height {
  align-items: inherit !important;
}
.library-card {
  box-shadow: 0 4px 12px 0 rgb(127 145 180 / 10%) !important;
  height: 100%;
}
.library-card:hover .taoyong {
  display: block !important;
}
.card-header {
  padding: 12px 22px 0px 22px;
}
.library-top .libaray-style {
  font-size: 14px;
  color: #2879ff;
  opacity: 0.6;
}

.taoyong {
  font-size: 14px !important;
  width: 67px !important;
  height: 24px !important;
  color: white !important;
  display: none !important;
  transition: all ease-out 1s;
  box-shadow: 0 4px 12px 0 rgb(127 145 180 / 10%) !important;
}

@keyframes fadeInUp {
  from {
    transform: translate3d(0, 40px, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

.animated {
  animation-duration: 0.5s;
  animation-fill-mode: both;
  -webkit-animation-duration: 0.5s;
  -webkit-animation-fill-mode: both;
}

.animatedFadeInUp {
  opacity: 0;
}

.fadeInUp {
  opacity: 0;
  animation-name: fadeInUp;
  -webkit-animation-name: fadeInUp;
}
.theme--light.v-expansion-panels .v-expansion-panel:not(:first-child)::after {
  border-color: white;
}

.lock {
  text-align: center;
}
.libaray-lock {
  box-shadow: 0 4px 12px 0 rgb(127 145 180 / 10%) !important;
}
.lock-back {
  background: #f0f2f5;
}
.lock-back .v-icon {
  color: #c8c8c8;
  font-size: 51px;
}
.lock p {
  color: #2879ff;
  font-size: 14px;
  padding-top: 5px;
}

.v-application--is-ltr .v-expansion-panel-header__icon {
  margin-left: 0px !important;
}
.krTitle {
  font-size: 14px;
}
.tab-type .v-expansion-panel-header {
  min-height: 36px !important;
  padding: 6px 14px !important;
}
</style>
