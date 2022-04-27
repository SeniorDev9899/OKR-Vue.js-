<template>
<v-dialog v-model="dialog_score" width="400px" overlay-opacity="0" overlay-color="white" content-class="krScoreDialog" >
  <v-card class="krScoreCard">
    <v-system-bar height="32" class="krScoreModalSystembar">
      <v-container d-flex>
        <v-layout align-center justify-start row>
          <v-flex class="krScoreModalSystembar-header">
            <span>@ta查看，ta可以通过系统通知修改kr分数</span>
          </v-flex>
          <v-flex @click="dialog_score = false" class="krScoreModalSystembar-header-close">
            <v-icon class="krScoreModal-icon-close">
              mdi-close
            </v-icon>
          </v-flex>
        </v-layout>
      </v-container>
    </v-system-bar>
    <v-card-text class="krScoreModalSystembar-cardText">
      <v-container align-center justify-start d-flex class="krScoreModalSystembar-container">
        <v-layout align-center justify-start column class="score-layout">

        <v-form class="w100" ref="scoreForm">

          <v-flex align-bottom class="score">
            <span id="scoreName" class="pt-2">评分</span>
            <v-text-field 
              placeholder="请输入0-1间的数字，支持小数点后两位" 
              class="score_input"
              outlined 
              required
              dense
              :rules = "[v => (/^(\d|\.)+$/.test(v) && v>=0 && v<=1 ) || '请输入0-1间的数字，支持小数点后两位']"
              v-model="krScoreValue"
            ></v-text-field>
          </v-flex>
          
          <v-flex class="score_description">
            <span id="descriptionName" class="pt-2">说明</span>
            <v-textarea 
              placeholder="请输入评分说明" 
              class="description_Input"
              height="100"
              outlined 
              v-model="krScoreDesc"
            ></v-textarea>
          </v-flex>
          
          <v-flex class="view">
            <span class="ta_view">@ta查看</span>
            <span v-if="!!krTa" class="score_ta">{{ krTa | surename }}<v-icon size="11" class="remove_score_ta" @click="removeScoreTa">mdi-close-circle</v-icon></span>
            <v-menu max-width="300" :close-on-content-click="true" offset-y>            
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">
                  <v-icon id="view_plus">
                    mdi-plus-circle-outline
                  </v-icon>
                </span>
              </template>
              <v-sheet>
                <UserPicker @pick="pickUser" />
              </v-sheet>
            </v-menu>
          </v-flex>

          <v-flex d-flex align-center justify-end class="krScoreModal_btnGroup">
            <v-btn @click="dialog_score = false" class="krScoreModal_Cancel">
              取消
            </v-btn>
            <v-btn @click="updateKrScore" color="primary">
              确定
            </v-btn>
          </v-flex>

        </v-form>

        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</v-dialog>
</template>

<script>
import UserPicker from '@/components/common/UserPicker.vue'
import { validationMixin } from 'vuelidate';
import { required, maxLength } from 'vuelidate/lib/validators';

export default {
  // props: ["typeModal", "kr_score", "kr_score_description", "kr_ta"],
  components: {
    UserPicker
  },
  data() {
    return {
      dialog_score: false,
      typeModal: null,
      krScoreValue : null,
      krScoreDesc : null,
      krTa: null,
    }
  },
  computed: {
    
  },
  methods: {
    openDialog(prop) {
      this.typeModal = prop.typeModal;
        this.krScoreValue = prop.krScore;
        this.krScoreDesc = prop.krScoreDescription;
      this.krTa = prop.krTa;
      this.dialog_score = true;
    },
    updateKrScore() {
      if (this.$refs.scoreForm.validate()){   
        // this.$v.$touch();
        this.krScoreValue = this.krScoreValue; //parseFloat(this.krScoreValue).toFixed(2);
        let KR_Info = {
          kr_score : this.krScoreValue,
          kr_desc : this.krScoreDesc,
        }
        this.$emit("KrScoreUpdate", KR_Info);
        // this.$v.$reset();
      
        this.dialog_score = false;
      }else{

      }
    },
    pickUser(e) {
      this.krTa = e.user.id;
      this.$emit("krScoreUserUpdate", e.user.id);
    },
    removeScoreTa() {
      this.krTa = 0;
      this.$emit("krScoreUserUpdate", this.krTa);
    }
  }
}
</script>

<style>
/* .krScoreCard {
  height: 100%;
} */
.krScoreModalSystembar {
  background-image: linear-gradient(90deg, rgb(29, 134, 240) 6%, rgb(92, 173, 255) 94%);
}
.krScoreModalSystembar-header {
  padding-left: 10px;
  color: white;
}
.krScoreModalSystembar-header-close {
  display: flex;
  justify-content: flex-end;
  padding-right: 7px;
  cursor: pointer;
}
.krScoreModal-icon-close {
  color: white !important;
}
.krScoreModalSystembar-cardText {
  padding: 0px !important;
  height: 350px;
}
.score {
  /* height: 50px; */
  display: flex;
  align-items: flex-start;
  justify-content: center;
  /* margin-bottom: 33px; */
  width: 100%;
}
.score-layout {
  padding: 10px;
}
#scoreName {
  margin-right: 10px;
}
.score_input {
  /* height: 100% !important; */
}
.score_description {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
}
#descriptionName {
  margin-right: 10px;
}
.description_Input {
}
.krScoreModalSystembar-container {
  height: 100%;
}
.view {
  margin-bottom: 10px;
  background-color: rgb(241 241 241);
  padding: 5px 7px;
  width: 100%;
}
#view_plus {
  background: rgb(12, 201, 145);
  border-radius: 50%;
  color: white;
}
.krScoreModal_btnGroup {
  width: 100%;
}
.krScoreModal_Cancel {
  margin-right: 15px;
}
.ta_view {
  margin-right: 20px;
}
.warning_krScore {
  padding-left: 40px;
  font-size: 11px;
  color: #f40a0a;
}
.w100 {
  width: 100%;
}
.score_ta {
  position:relative;
  margin-right: 10px;
  padding: 3px 5px;
  background-color: rgb(41 216 212); 
  border-radius: 50%;
}
.remove_score_ta {
  position:absolute !important;
  cursor:pointer;
  opacity: 0;
  transition: all ease .5s;
}
.remove_score_ta:hover {
  color: rgb(220, 26, 26);
  opacity: 1;
}
</style>
