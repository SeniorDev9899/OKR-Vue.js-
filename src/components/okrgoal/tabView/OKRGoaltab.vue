<template>
  <v-container class="popup-button-modals">
    <v-row>
      <v-tabs v-model="tab">
        <v-tab>
          OKR
        </v-tab>
        <v-tab>
          E执行
        </v-tab>
      </v-tabs>
      <v-expansion-panels multiple>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-chip class="ma-2" filter v-for="(item, i) in list" :key="i">
                  KR{{ i + 1 }}
                </v-chip>

                <v-menu bottom offset-y> </v-menu>
              </v-tab-item>
            </v-tabs-items>
          </v-expansion-panel-header>
          <v-container>
            <v-row>
              <v-col></v-col>
              <v-spacer></v-spacer>
              <v-col cols="auto" class="d-flex">
                <v-expansion-panel-content>
                  <v-menu bottom offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="ma-2"
                        v-bind="attrs"
                        v-on="on"
                        color="primary"
                      >
                        执行任务
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item-content>
                        <v-list-item>
                          <v-list-item-title>
                            <v-menu bottom offset-y>
                              <template v-slot:activator="{ on, attrs }">
                                <v-dialog v-model="dialog" width="900">
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-bind="attrs" v-on="on">
                                      创建任务
                                    </v-btn>
                                  </template>
                                  <v-card>
                                    <RichText />
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                      <v-spacer></v-spacer>
                                    </v-card-actions>
                                  </v-card>
                                </v-dialog>
                              </template>
                            </v-menu>
                          </v-list-item-title>
                        </v-list-item>

                        <v-list-item @click="() => {}">
                          <v-list-item-title>
                            <v-menu bottom offset-y>
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn v-bind="attrs" v-on="on">
                                  创建任务
                                </v-btn>
                              </template>
                              <v-list>
                                <v-list-item @click="() => {}">
                                  <v-list-item-title>
                                    This is..
                                  </v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </v-list-item-title>
                        </v-list-item>
                      </v-list-item-content>
                    </v-list>
                  </v-menu>
                </v-expansion-panel-content>
                <v-expansion-panel-content>
                  <v-menu bottom offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="ma-2"
                        v-bind="attrs"
                        v-on="on"
                        color="primary"
                      >
                        项目执行
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item-content>
                        <v-list-item>
                          <v-list-item-title>
                            <v-menu bottom offset-y>
                              <template v-slot:activator="{ on, attrs }">
                                <v-dialog v-model="dialog" width="900">
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-bind="attrs" v-on="on">
                                      创建任务
                                    </v-btn>
                                  </template>
                                  <v-card>
                                    <Popup />
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                      <v-spacer></v-spacer>
                                    </v-card-actions>
                                  </v-card>
                                </v-dialog>
                              </template>
                            </v-menu>
                          </v-list-item-title>
                        </v-list-item>

                        <v-list-item @click="() => {}">
                          <v-list-item-title>
                            <v-menu bottom offset-y>
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn v-bind="attrs" v-on="on">
                                  创建任务
                                </v-btn>
                              </template>
                              <v-list>
                                <v-list-item @click="() => {}">
                                  <v-list-item-title>
                                    This is..
                                  </v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </v-list-item-title>
                        </v-list-item>
                      </v-list-item-content>
                    </v-list>
                  </v-menu>
                </v-expansion-panel-content>
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel>
      </v-expansion-panels>
      <!-- This is OKR List -->
      <v-list-item class="global-items justify-start">
        <div class="left-field d-flex">
          <v-chip class="" fliter v-for="(item, i) in list" :key="i">
            KR{{ i + 1 }}
          </v-chip>
          <v-avatar class="okr-avatar" color="teal" size="30">
            <span class="white--text text-p">J</span>
          </v-avatar>
          <span class="okr-project-title">
            成立影视文化传媒公司，在公司运营机制上建立专业的影视制作团队地方
          </span>
          <v-menu bottom offset-y :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <div class="pencil-icon">
                <v-icon class="" v-bind="attrs" v-on="on">
                  mdi-pencil-outline
                </v-icon>
              </div>
            </template>

            <v-list>
              <v-list-item>
                <v-list-item-title
                  >This is item
                  <v-text-field name="name" label="label" id="id"></v-text-field
                ></v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <div class="right-progress-field d-flex">
          <div>This is right field</div>
          <div>
            <div>over</div>
            <div>over</div>
          </div>
        </div>
      </v-list-item>
    </v-row>
  </v-container>
</template>

<script>
import RichText from "@/components/okrgoal/tabView/RichText.vue";
import Popup from "@/components/okrgoal/tabView/Popup.vue";

export default {
  components: {
    RichText,
    Popup,
  },
  data() {
    return {
      tab: null,
      list: [{}],
      text: "",
    };
  },
  methods: {
    onUpdate(text) {
      this.text = text;
    },
  },
};
</script>

<style scoped>
.DialogRich {
  display: block !important;
}
.right-progress-field {
  margin-left: auto;
}
.global-items {
  color: rgb(52, 67, 78);
}
.popup-button-modals .v-chip.v-size--default {
  border-radius: 16px;
  font-size: 12px;
  height: 19px;
  background: rgba(29, 134, 240, 0.15);
  color: rgb(29, 134, 240);
  margin: 0px 5px 0px 5px;
}
.left-field {
  align-items: center;
}
.popup-button-modals .v-application .text-h5 {
  font-size: 14px !important;
}
.okr-project-title {
  font-size: 14px;
  margin: 0px 5px 0px 5px;
}
.okr-avatar {
  margin: 0px 5px 0px 5px;
}
.popup-button-modals .v-icon.v-icon {
  font-size: 14px;
}
.pencil-icon {
  opacity: 0;
}
.pencil-icon:hover {
  display: block;
  opacity: 1;
}
.popup-button-modals .v-list {
  padding: 0px;
}
.popup-button-modals .v-list-item {
  padding: 0px;
}
</style>
