<template>
  <v-container class="RichText" style="font-size: 14px;">
    <div class="d-flex Firstfield">
      <v-text-field
        flat
        solo
        dense
        placeholder="请输入您要安排的工作任务名称"
        prepend-icon="mdi-checkbox-marked-outline"
        style="font-size:14px;"
        class="NameInput"
      ></v-text-field>
      <v-menu bottom offset-y :close-on-content-click="closeOnContentClick">
        <template v-slot:activator="{ on, attrs }">
          <div class="OkrName" v-bind="attrs" v-on="on">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">JiangWang负责</span>
              </template>
              <span>JiangWang负责</span>
            </v-tooltip>
          </div>
        </template>
        <SearchItem />
      </v-menu>
      <v-menu offset-y :close-on-content-click="closeOnContentClick">
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on" class="OkrDaterange">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on"
                  ><v-text-field
                    v-model="dateRangeText"
                    label="Date range"
                    prepend-icon="mdi-calendar"
                    readonly
                    flat
                    solo
                    style="font-size:14px;"
                  ></v-text-field
                ></span>
              </template>
              <span>{{ dates }}</span>
            </v-tooltip>
          </div>
        </template>
        <v-list>
          <v-list-item>
            <v-date-picker v-model="dates" flat solo range></v-date-picker>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <span v-bind="attrs" v-on="on">
            <v-select
              v-model="select"
              :hint="`${select.state}, ${select.abbr}`"
              :items="items"
              item-text="state"
              item-value="abbr"
              label="Select"
              persistent-hint
              return-object
              single-line
              dense
              full-width
              style="width: 45px;font-size: 14px;
              "
            ></v-select>
          </span>
        </template>
        <span>{{ select.state }}</span>
      </v-tooltip>
    </div>
    <v-expansion-panels
      style="border: 1px solid #848181;border-radius: 0px;border-top: none;"
    >
      <v-expansion-panel>
        <div
          class="d-flex justify-space-between SecondField"
          :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'"
          flat
          tile
        >
          <div>
            <v-text class="RequestName">任务要求</v-text>
          </div>
          <div class="RequestField">
            <v-list-item>
              <v-list-item-text>
                <v-text>目标值：</v-text>
              </v-list-item-text>
              <v-list-item-content style="padding:0px !important;">
                <v-text-field
                  placeholder="请输入数字"
                  dense
                  text-field-outlined-legend-line-height
                  style="font-size:14px"
                ></v-text-field>
              </v-list-item-content>
              <v-menu offset-y :close-on-content-click="closeOnContentClick">
                <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on">
                    <p style="margin: auto;">
                      ({{ radios || "元" }})
                      <span>
                        <v-icon style="font-size:16px;">
                          mdi-chevron-down-circle
                        </v-icon>
                      </span>
                    </p>
                  </div>
                </template>
                <v-list>
                  <v-list-item>
                    <v-radio-group v-model="radios" mandatory>
                      <v-radio label="元" value="元"></v-radio>
                      <v-radio label="个" value="个"></v-radio>
                    </v-radio-group>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item>
          </div>
          <div>
            <div class="SettingTime">
              <v-menu offset-y :close-on-content-click="closeOnContentClick">
                <template v-slot:activator="{ on, attrs }">
                  <div
                    v-bind="attrs"
                    v-on="on">
                      <v-text>
                        进展反馈： <span style="color: #b4b7b9;">设置反馈时间</span>
                      </v-text>
                  </div>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>
                      <TimeSetting />
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>             
            </div>
          </div>
          <div class="SecondManage">
            <v-text> <span>管控审批人： </span> <span>无</span> </v-text>
          </div>
          <div class="d-flex justify-end">
            <v-expansion-panel-header class="SecondMoreSetting">
              更多属性
            </v-expansion-panel-header>
          </div>
        </div>

        <v-expansion-panel-content style="padding: 0px;border: 1px solid rgb(132, 129, 129);border-radius: 0px;border-bottom: none;border-right: none;border-left: none;">
          <div class="d-flex justify-start ThirdField">
            <div class="ChipName">任务属性</div>
            <div class="ThirdGuanlian">
              <v-menu
                bottom
                :close-on-content-click="closeOnContentClick">
                <template v-slot:activator="{ on, attrs }">
                  <div
                    v-bind="attrs"
                    v-on="on"
                    class="ThirdOption"
                  >
                  任务关联
                    <span>
                    <v-icon style="font-size:12px;">
                      mdi-chevron-down-circle
                    </v-icon>
                  </span>
                  </div>
                </template>

                <v-list>
                  <v-list-item>
                    <v-list-item-title> <ProjectRelation /></v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div class="ThirdYugu"> 预估工时:</div>
            <div>
              <v-text-field
                placeholder="请输入数字"
                style="font-size:14px;padding: 0px;"  
                hide-details
              ></v-text-field>
            </div>
            </v-text>
          </div>
          <div class="d-flex justify-start FourthField">
            <div class="ChipName">任务成员</div>
            <div class="">
              <v-menu
                bottom
                :close-on-content-click="closeOnContentClick">
                <template v-slot:activator="{ on, attrs }">
                  <div
                    v-bind="attrs"
                    v-on="on"
                    class="FourthPlusPerson"
                  >
                  参与人
                    <span>
                    <v-icon style="">
                      mdi-plus-circle-outline
                    </v-icon>
                  </span>
                  </div>
                </template>

                <v-list>
                  <v-list-item>
                    <v-list-item-title><SearchItem /></v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            </v-text>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <rich-text-editor
        @update="onUpdate"
        style="width: 875px !important; margin: auto;"
      />
      <div class="d-flex FooterField">
          <div>
            <span>
              <v-icon style="transform: rotate(90deg);">
                mdi-attachment
              </v-icon>
            </span>
            附件
          </div>
          <div class="fabu" style="margin-left: auto!important;">发布</div>
          
      </div>
  </v-container>
</template>

<script>
import SearchItem from "@/components/common/UserPicker.vue";
import ProjectRelation from "@/components/okrgoal/tabView/ProjectRelation.vue";
import TimeSetting from "@/components/okrgoal/tabView/TimeSetting.vue"

export default {
  components: { 
    SearchItem,
    ProjectRelation,
    TimeSetting
  },
  data() {
    return {
      range: {},
      inputProps: { solo: true, style: { width: "240px" } },
      dates: ["2019-09-10", "2019-09-20"],
      select: { state: "1  最高", abbr: "1" },
      items: [
        { state: "1  最高", abbr: "1" },
        { state: "2  高", abbr: "2" },
        { state: "3  中", abbr: "3" },
        { state: "4  低", abbr: "4" },
        { state: "5  非常低", abbr: "5" },
      ],
      radios: null,
      closeOnContentClick: false,
    };
  },
  computed: {
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
  },
};
</script>
<style>
.RichText .v-text-field__details {
  display: none;
}


.Firstfield {
  border: 1px solid #848181;
  margin: 0px !important;
}

.RequestName {
  margin: auto;
  color: #647481;
}
.OkrName {
  
  border-right: 1px dotted rgb(169, 184, 191);
  float: left;
  margin: 10px;
  padding-right: 11px;
  padding-top: 3px;
}
.OkrDaterange {
  
  border-right: 1px dotted rgb(169, 184, 191);
  float: left;
  padding-left: 9px;
  padding-right: 10px;
}
.NameInput {
  
  border-right: 1px dotted rgb(169, 184, 191);
  float: left;
  margin: auto !important;
}
.RichText .v-input__slot {
  margin-bottom: 0px !important;
}
.SettingTime {
  margin: auto;
  color: #647481;
  padding-right: 6px;
  border-right: 1px dotted rgb(169, 184, 191);
  float: left;
}
.RequestField {
  margin-left: -11px;
}
.SecondField{
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
}
.SecondManage {
  color: #647481;
  border-right: 1px dotted rgb(169, 184, 191);
  float: left;
  padding-right: 8px;
}
.SecondMoreSetting { 
  color: #1587d9;
}
.ThirdField{
  padding:0px !important;
  align-items: center;
}
.ThirdYugu{
  color: #647481;
  padding-left: 19px;
}
.RichText .v-expansion-panel-content__wrap{
  padding:0px !important;
}
.ChipName{
  color: #647481;
  background: #efefef;
  padding: 6px;
  margin: 4px;
}
.ThirdOption{
  color: #647481;
  border-right: 1px dotted rgb(169, 184, 191);
  padding-right: 145px;
  padding-left: 27px;
}

.FourthField{
  border-top: 1px solid rgb(132, 129, 129);
  padding:0px !important;
  align-items: center;
}
.FourthPlusPerson{
  color: #647481;
  padding-right: 145px;
  padding-left: 27px;
}
#RTE__edition__field{
  border: 1px solid;
  padding: 5px;
  min-height: 200px !important;
  border-color: rgba(0, 0, 0, 0.5);
}
#RTE__footer__actions{
  display: none !important;
}
.FooterField{
  margin: 0px !important;
  background: whitesmoke;
  padding: 9px;
}
.fabu{
  margin-left: auto !important;
  background: #dad8d8;
  padding: 4px;
  border-radius: 3px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
