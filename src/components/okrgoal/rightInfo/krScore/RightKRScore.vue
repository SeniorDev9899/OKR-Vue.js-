<template>
<v-container align-center justify-start d-flex class="right_score_info">
  <v-layout align-center justify-start column>
    <v-flex class="right_userInfo_flex">
      <v-layout align-center justify-start class="right_userInfo_laypadding">
        <v-flex shrink class="right_userInfo_layflex">
          <v-icon class="r_icon">mdi-scoreboard-outline</v-icon>
          <span class="r_name">KR评分</span>
        </v-flex>
        <v-flex grow class="displayFlex" style="position:relative;">
          <span class="r_score_value">{{ kr_score }}</span>
          <span class="r_score" v-if="kr_score != '评分'">
            分
          </span>

          <ToolTipComponent tooltipText="编辑" direction="top">
            <v-sheet class="edit displayFlex" @click="displayKRScoreModal">
              <v-icon class="pencil">
                mdi-grease-pencil
              </v-icon>
              <!-- <div class="edit_arrow"></div>
              <span class="editTooltip">编辑</span> -->
            </v-sheet>
          </ToolTipComponent>

          <KRScoreModal ref="krScore" @changeKrScore = "handle_changeKrScore" @KrScoreUpdate = "handle_krScoreUpdate" @krScoreUserUpdate = "handle_krScoreUserUpdate"/>

        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex class="right_userInfo_flex">
      <v-layout align-center justify-start class="right_userInfo_laypadding">
        <v-flex shrink class="right_userInfo_layflex" style="padding-right:45px;">
          <v-icon class="r_icon">mdi-file-document-outline</v-icon>
          <span class="r_name">评分说明</span>
        </v-flex>
        <v-flex grow class="displayFlex  "  style="position:relative;">
          <span class="r_name" >{{ !kr_score_description || kr_score_description==""?'暂无评分说明':kr_score_description }}</span>

          <ToolTipComponent tooltipText="编辑" direction="top">
            <v-sheet class="edit displayFlex" @click="displayKRScoreDescModal">
              <v-icon class="pencil">
                mdi-grease-pencil
              </v-icon>
              <!-- <div class="edit_arrow"></div>
              <span class="editTooltip">编辑</span> -->
            </v-sheet>
          </ToolTipComponent>

          <KRScoreModal ref="krScore" @KrScoreUpdate = "handle_krScoreUpdate" @krScoreUserUpdate = "handle_krScoreUserUpdate"/>

        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import KRScoreModal from '@/components/okrgoal/rightInfo/krScore/krScoreModal/KRScoreModal.vue';
import ToolTipComponent from "@/components/okrgoal/shared/ToolTipComponent.vue";

export default {
  props: ['kr_score', 'kr_score_description', 'kr_ta'],
  components: {
    KRScoreModal,
    ToolTipComponent
  },
  data() {
    return {
      dialog_score: false,
      dialog_description: false,
      score: Boolean,
      description: Boolean,
    }
  },
  created() {
    this.score = "score";
    this.description = "description";
  },
  methods: {
    displayKRScoreModal() {
      this.$refs.krScore.openDialog({
        typeModal: this.score,
        krScore: this.kr_score,
        krScoreDescription: this.kr_score_description,
        krTa: this.kr_ta,
      });
    },
    displayKRScoreDescModal() {
      this.$refs.krScore.openDialog({
        typeModal: this.description,
        krScore: this.kr_score,
        krScoreDescription: this.kr_score_description,
        krTa: this.kr_ta,
      });
    },
    handle_changeKrScore(prop) {
      this.$emit("changeKrScore", prop);
    },
    handle_changeKrScoreDescription(prop) {
      this.$emit("changeKrScoreDescription", prop);
    },
    handle_krScoreUpdate(prop) {
      this.$emit("KrScoreUpdate", prop);
    },
    handle_krScoreUserUpdate(prop) {
      this.$emit("krScoreUserUpdate", prop);
    }
  }
}
</script>

<style>
.right_score_info {
  background-color: white;
  margin-top: 20px;
}

.right_userInfo_flex {
  width: 100%;
}

.right_userInfo_laypadding {
  padding: 10px;
  width: 100%;
}

.right_userInfo_layflex {
  padding-right: 50px;
  align-items: top;
  cursor: pointer !important;
}

.r_icon {
  color: #9aa6b2;
  margin-right: 3px;
  font-size: 13px;
}

.r_name {
  white-space: pre-line;
  color: #9aa6b2 !important;
  font-size: 12px !important;
  font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei;
}

.r_score_value {
  color: rgb(12, 201, 145);
  font-size: 12px;
}

.r_score {
  color: #9aa6b2;
  font-size: 12px;
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

.right_userInfo_laypadding:hover .pencil {
  opacity: 1 !important;
}

.krScoreDialog {
  position: absolute;
  right: 50px;
  top: 300px;
  margin: 0px;
  width: 395px !important;
}

.krDescriptionDialog {
  height: 390px;
  position: absolute;
  right: 50px;
  top: 300px;
  margin: 0px;
  width: 395px !important;
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
  display: flex;
  align-items: top;
}
</style>
