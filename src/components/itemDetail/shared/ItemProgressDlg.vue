<template>
<v-dialog width="650" v-model="dialog">
  <v-card height="300">
    <v-toolbar dark dense color="primary">
      <v-container class="d-flex px-2">
        <span>更新项目进度</span>
        <v-spacer></v-spacer>
        <v-icon @click="dialog=false" small>mdi-close</v-icon>
      </v-container>             
    </v-toolbar>
    <v-container>
    <!-- progress of item -->
      <v-row class="align-center">
        <v-col class="d-flex justify-end" cols="2">
          <span>进度</span>
        </v-col>
        <v-col>
          <v-text-field v-model="newProgress.pr_percent">
            <template v-slot:append="">
                <span>%</span>
            </template>
          </v-text-field>
        </v-col>        
      </v-row>
      <!-- progress description -->
      <v-row class="align-center">
        <v-col class="d-flex justify-end" cols="2">
          <span>进度描述</span>
        </v-col>
        <v-col>
          <v-text-field v-model="newProgress.pr_description" placeholder="输入项目进展情况，例如：项目阶段性成果、项目总结、当前阶段障碍点"></v-text-field>
        </v-col>        
      </v-row>
      <v-row class="justify-end px-5">
        <v-btn @click="dialog=false" class="mx-1" small>取消</v-btn>
        <v-btn @click="addProgress" dark class="mx-1" small color="blue">确定</v-btn>
      </v-row>
    </v-container>
  </v-card>
</v-dialog>
</template>
<script>
export default {
  name: 'ItemProgressDlg',
  props: ['newProgress'],
  data() {
    return {
      dialog: false,
    }
  },
  methods: {
    open() {
      this.dialog = true;
    },
    addProgress () {
      this.$emit('save')
      this.dialog = false;
    }
  }
}
</script>